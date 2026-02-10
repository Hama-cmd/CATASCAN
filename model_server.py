"""
Cataract Screening Model Server
Flask API that serves the MobileNetV2-based cataract detection model.
"""

import os
import io
import base64
import logging
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
# Suppress TensorFlow warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
import tensorflow as tf

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ─── Model Configuration ─────────────────────────────────────────────
MODEL_PATH = "best_model_mobilenetv2_katarak.h5"  # Relative path for simplicity
IMG_SIZE = (224, 224)  # MobileNetV2 input size
CLASS_NAMES = ["cataract", "non_cataract"]

# ─── Custom Layer Workaround ─────────────────────────────────────────
# Fix for "Unrecognized keyword arguments passed to DepthwiseConv2D: {'groups': 1}"
# This happens when loading newer/older Keras models
class CustomDepthwiseConv2D(tf.keras.layers.DepthwiseConv2D):
    def __init__(self, **kwargs):
        if 'groups' in kwargs:
            del kwargs['groups']
        super().__init__(**kwargs)

# ─── Load Model ──────────────────────────────────────────────────────
logger.info(f"Loading model from: {MODEL_PATH}")
try:
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

    model = tf.keras.models.load_model(
        MODEL_PATH, 
        custom_objects={'DepthwiseConv2D': CustomDepthwiseConv2D}
    )
    logger.info("✅ Model loaded successfully!")
    logger.info(f"   Input shape: {model.input_shape}")
    logger.info(f"   Output shape: {model.output_shape}")
except Exception as e:
    logger.error(f"❌ Failed to load model: {e}")
    # Attempt to load without custom objects if that failed, or just fail
    model = None


def preprocess_image(image_data: str) -> np.ndarray:
    """
    Decode base64 image, resize to model input size, and normalize for MobileNetV2.
    """
    # Remove data URI prefix if present
    if "," in image_data:
        image_data = image_data.split(",", 1)[1]

    # Decode base64 to bytes
    image_bytes = base64.b64decode(image_data)
    
    # Open image and convert to RGB
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    
    # Resize to model input size
    img = img.resize(IMG_SIZE, Image.Resampling.LANCZOS)
    
    # Convert to numpy array
    img_array = np.array(img, dtype=np.float32)
    
    # Normalize to [-1, 1] for MobileNetV2
    img_array = (img_array / 127.5) - 1.0
    
    # Add batch dimension: (1, 224, 224, 3)
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array


def build_result(prediction: np.ndarray) -> dict:
    """
    Convert model prediction to structured result with severity levels.
    """
    prediction = prediction[0]  # Remove batch dimension
    
    if len(prediction) == 1:
        # Sigmoid output: single value 0-1
        # Assume: close to 1 = cataract, close to 0 = non_cataract
        cataract_prob = float(prediction[0])
        non_cataract_prob = 1.0 - cataract_prob
    else:
        # Softmax output: [cataract_prob, non_cataract_prob]
        cataract_prob = float(prediction[0])
        non_cataract_prob = float(prediction[1])
    
    confidence_score = cataract_prob
    confidence_pct = f"{confidence_score * 100:.1f}%"
    
    # Determine Severity and Recommendations
    if confidence_score < 0.30:
        condition = "Normal (No Cataract)"
        severity = "Normal"
        description = (
            "Mata Anda terlihat sehat dan normal. Tidak terdeteksi adanya tanda-tanda katarak "
            "yang signifikan berdasarkan analisis AI."
        )
        recommendation = (
            "Pertahankan kesehatan mata Anda dengan pola makan sehat, gunakan kacamata anti-UV "
            "saat beraktivitas di luar ruangan, dan lakukan pemeriksaan rutin tahunan."
        )
    elif confidence_score < 0.60:
        condition = "Suspect / Early Signs"
        severity = "Mild (Ringan)"
        description = (
            "Terdeteksi tanda-tanda awal atau kekeruhan ringan pada lensa mata. "
            "Ini mungkin merupakan tahap awal katarak atau gangguan ringan lainnya."
        )
        recommendation = (
            "Disarankan untuk mulai memantau penglihatan Anda. Lindungi mata dari sinar matahari langsung "
            "dan kurangi faktor risiko seperti merokok. Jadwalkan pemeriksaan dengan dokter mata untuk baseline."
        )
    elif confidence_score < 0.85:
        condition = "Cataract Detected"
        severity = "Moderate (Sedang)"
        description = (
            "Analisis menunjukkan indikasi katarak tingkat sedang. Kekeruhan pada lensa "
            "mungkin mulai mengganggu penglihatan Anda (buram, silau)."
        )
        recommendation = (
            "Sebaiknya konsul asikan dengan dokter spesialis mata dalam waktu dekat. "
            "Dokter akan mengevaluasi apakah kondisi ini memerlukan tindakan medis atau pemantauan lebih ketat."
        )
    else:
        condition = "Cataract Detected"
        severity = "Severe (Berat)"
        description = (
            "Terdeteksi indikasi katarak tingkat lanjut dengan probabilitas tinggi. "
            "Kemungkinan besar penglihatan Anda sudah terganggu secara signifikan."
        )
        recommendation = (
            "Sangat disarankan untuk SEGERA menemui dokter spesialis mata (Oftalmologis). "
            "Kondisi ini mungkin memerlukan intervensi bedah katarak untuk mengembalikan penglihatan yang jernih."
        )

    # UI expects 'condition' to determine color/icon.
    if confidence_score > 0.5:
        final_condition = "Cataract Detected" # Keeps UI red/warning
    else:
        final_condition = "Normal (No Cataract)" # Keeps UI green/safe

    return {
        "condition": final_condition,
        "severity": severity,
        "confidence": confidence_pct,
        "confidence_level": severity, 
        "confidence_score": round(confidence_score, 4),
        "cataract_probability": round(cataract_prob, 4),
        "non_cataract_probability": round(non_cataract_prob, 4),
        "description": description,
        "recommendation": recommendation,
        "disclaimer": (
            "DISCLAIMER: Analisis AI ini hanya untuk screening awal. "
            "Hasil bervariasi tergantung kualitas cahaya dan kamera. "
            "Diagnosis pasti hanya dapat dilakukan oleh dokter mata profesional."
        )
    }


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy" if model is not None else "unhealthy",
        "model": "MobileNetV2",
        "version": "v2.0"
    })


@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded. Check server logs."}), 503
    
    data = request.get_json()
    if not data or "image" not in data:
        return jsonify({"error": "No image data"}), 400
    
    try:
        img_array = preprocess_image(data["image"])
        prediction = model.predict(img_array, verbose=0)
        result = build_result(prediction)
        logger.info(f"Prediction: {result['condition']} - Score: {result['confidence']}")
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("MODEL_PORT", 5001))
    logger.info(f"Starting MobileNetV2 Server on port {port}")
    app.run(host="0.0.0.0", port=port)
