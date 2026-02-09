import { useScreening } from "@/hooks/use-screenings";
import { Link, useRoute } from "wouter";
import { Layout } from "@/components/ui/Layout";
import { Loader2, AlertCircle, CheckCircle2, AlertTriangle, ChevronLeft } from "lucide-react";

export default function Result() {
  const [, params] = useRoute("/result/:id");
  const id = parseInt(params?.id || "0");
  const { data: screening, isLoading, error } = useScreening(id);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error || !screening) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load result.</p>
          <Link href="/" className="text-primary hover:underline mt-4 block">Back to Dashboard</Link>
        </div>
      </Layout>
    );
  }

  const result = screening.analysis as any;
  const isHealthy = result.condition?.toLowerCase().includes("healthy");

  return (
    <Layout>
      <div className="space-y-6 pb-20">
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>

        {/* Status Header */}
        <div className={`p-6 rounded-3xl text-center ${isHealthy ? 'bg-green-50' : 'bg-amber-50'} animate-in slide-in-from-top-4 fade-in duration-500`}>
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${isHealthy ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
            {isHealthy ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
          </div>
          <h1 className={`text-2xl font-bold ${isHealthy ? 'text-green-900' : 'text-amber-900'}`}>
            {result.condition}
          </h1>
          <p className={`mt-2 font-medium ${isHealthy ? 'text-green-700' : 'text-amber-700'}`}>
            Confidence: {result.confidence}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="rounded-3xl overflow-hidden shadow-md border border-gray-100">
            <img 
              src={screening.imageUrl} 
              alt="Screening" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Analysis Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {result.description}
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
              <h3 className="font-bold text-blue-900 mb-3 text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Recommendation
              </h3>
              <p className="text-blue-800 leading-relaxed">
                {result.recommendation}
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500 text-center">
          <p>
            <strong>DISCLAIMER:</strong> This is an AI-powered screening tool and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
        </div>
      </div>
    </Layout>
  );
}
