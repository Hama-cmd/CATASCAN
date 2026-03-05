import os
import io
import base64
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS

try:
    import tflite_runtime.interpreter as tflite
except ImportError:
    import tensorflow.lite as tflite

app = Flask(__name__)
CORS(app)

# Load model (path relative to root in Vercel)
MODEL_PATH = os.path.join(os.getcwd(), 'model.tflite')
interpreter = None

def get_interpreter():
    global interpreter
    if interpreter is None:
        print(f"Loading model from {MODEL_PATH}...")
        interpreter = tflite.Interpreter(model_path=MODEL_PATH)
        interpreter.allocate_tensors()
    return interpreter

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img).astype(np.float32)
    # MobileNetV2 expects [-1, 1] range: (img / 127.5) - 1
    img_array = (img_array / 127.5) - 1.0
    return np.expand_dims(img_array, axis=0)

def build_result(prediction):
    prob = float(prediction[0][0])
    is_cataract = prob > 0.5
    
    # Scale score to 1-100%
    score = prob * 100 if is_cataract else (1 - prob) * 100
    condition = "Cataract Detected" if is_cataract else "Normal (No Cataract)"
    
    if is_cataract:
        if prob < 0.6:
            severity = "Mild / Ringan"
            rec = "Tahap awal katarak terdeteksi. Disarankan konsultasi rutin dan menjaga asupan nutrisi mata."
        elif prob < 0.85:
            severity = "Moderate / Sedang"
            rec = "Katarak sudah mulai mengganggu penglihatan. Segera jadwalkan konsultasi dengan spesialis mata."
        else:
            severity = "Severe / Berat"
            rec = "Katarak tahap lanjut. Disarankan pemeriksaan mendalam untuk kemungkinan tindakan operasi."
    else:
        severity = "Normal"
        rec = "Mata Anda tampak normal. Tetap jaga kesehatan mata dengan istirahat cukup dan nutrisi seimbang."

    return {
        "condition": condition,
        "confidence": f"{score:.1f}%",
        "confidence_score": prob,
        "severity": severity,
        "recommendation": rec,
        "disclaimer": "Hasil ini adalah screening awal AI dan bukan diagnosis medis final."
    }

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({"error": "No image data provided"}), 400

        # Handle base64
        image_data = data['image']
        if "data:image" in image_data:
            image_data = image_data.split(",")[1]
        
        image_bytes = base64.b64decode(image_data)
        processed_image = preprocess_image(image_bytes)
        
        # Inference
        interp = get_interpreter()
        input_details = interp.get_input_details()
        output_details = interp.get_output_details()
        
        interp.set_tensor(input_details[0]['index'], processed_image)
        interp.invoke()
        prediction = interp.get_tensor(output_details[0]['index'])
        
        result = build_result(prediction)
        return jsonify(result)

    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({"error": str(e)}), 500

# For Vercel
def handler(request):
    return app(request)
