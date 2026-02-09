import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Layout } from "@/components/ui/Layout";
import { Camera, Upload, RotateCcw, ArrowRight, Loader2, Image as ImageIcon } from "lucide-react";
import { useAnalyzeScreening } from "@/hooks/use-screenings";
import { useLocation } from "wouter";

export default function Screening() {
  const [mode, setMode] = useState<"camera" | "upload" | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const analyzeMutation = useAnalyzeScreening();
  const [, setLocation] = useLocation();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) setImage(imageSrc);
  }, [webcamRef]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!image) return;
    try {
      const result = await analyzeMutation.mutateAsync({ image });
      setLocation(`/result/${result.id}`);
    } catch (error) {
      // Error handled in hook toast
    }
  };

  if (analyzeMutation.isPending) {
    return (
      <Layout showNav={false}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center px-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-gray-100 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analyzing Image</h2>
            <p className="text-gray-500 mt-2 max-w-xs mx-auto">
              Our AI is examining the image for potential conditions. This usually takes 5-10 seconds.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-900">New Screening</h1>
          <p className="text-gray-500 text-sm">Capture or upload a clear photo of the eye.</p>
        </div>

        {!mode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <button
              onClick={() => setMode("camera")}
              className="group p-8 bg-white border-2 border-dashed border-gray-200 rounded-3xl hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-4 min-h-[200px]"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-gray-900">Use Camera</h3>
                <p className="text-sm text-gray-500">Take a photo now</p>
              </div>
            </button>

            <button
              onClick={() => setMode("upload")}
              className="group p-8 bg-white border-2 border-dashed border-gray-200 rounded-3xl hover:border-secondary hover:bg-secondary/5 transition-all flex flex-col items-center justify-center gap-4 min-h-[200px]"
            >
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-secondary" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-gray-900">Upload Image</h3>
                <p className="text-sm text-gray-500">Choose from gallery</p>
              </div>
            </button>
          </div>
        )}

        {mode && !image && (
          <div className="bg-black rounded-3xl overflow-hidden shadow-2xl relative aspect-[3/4] md:aspect-video max-w-2xl mx-auto">
            {mode === "camera" ? (
              <>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                  videoConstraints={{ facingMode: "environment" }} // Use back camera on mobile
                />
                <button
                  onClick={capture}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-primary/50 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  <div className="w-12 h-12 bg-primary rounded-full"></div>
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Click to select image</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
              </div>
            )}
            
            <button 
              onClick={() => setMode(null)}
              className="absolute top-4 left-4 p-2 bg-black/50 text-white rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        )}

        {image && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-100">
              <img src={image} alt="Preview" className="w-full h-auto" />
              <button 
                onClick={() => setImage(null)}
                className="absolute top-4 right-4 p-2 bg-white/90 text-gray-900 rounded-full shadow-lg hover:bg-white transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-primary text-white text-lg font-bold rounded-2xl shadow-xl shadow-primary/25 hover:bg-primary/90 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              Run AI Analysis
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
