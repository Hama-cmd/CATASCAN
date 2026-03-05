import { useScreening } from "@/hooks/use-screenings";
import { Link, useRoute } from "wouter";
import { Layout } from "@/components/ui/Layout";
import { Loader2, AlertCircle, CheckCircle2, AlertTriangle, ChevronLeft, Eye, Activity } from "lucide-react";

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
          <p className="text-red-500">Gagal memuat hasil.</p>
          <Link href="/" className="text-primary hover:underline mt-4 block">Kembali ke Dashboard</Link>
        </div>
      </Layout>
    );
  }

  const result = screening.analysis as any;
  const isHealthy = result.condition?.toLowerCase().includes("normal") ||
    result.condition?.toLowerCase().includes("healthy") ||
    result.condition?.toLowerCase().includes("non_cataract");
  const confidenceScore = result.confidence_score ?? 0;
  const confidencePct = Math.round(confidenceScore * 100);

  return (
    <Layout>
      <div className="space-y-6 pb-20">
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Kembali ke Dashboard
        </Link>

        {/* Status Header */}
        <div className={`p-6 rounded-3xl text-center ${isHealthy ? 'bg-green-50 dark:bg-green-500/10' : 'bg-amber-50 dark:bg-amber-500/10'} animate-in slide-in-from-top-4 fade-in duration-500`}>
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${isHealthy ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'}`}>
            {isHealthy ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
          </div>
          <h1 className={`text-2xl font-bold ${isHealthy ? 'text-green-900 dark:text-green-300' : 'text-amber-900 dark:text-amber-300'}`}>
            {result.condition}
          </h1>
          <p className={`mt-2 font-medium ${isHealthy ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>
            Tingkat Keyakinan: {result.confidence} ({result.confidence_level})
          </p>
        </div>

        {/* Confidence Bar */}
        <div className="bg-white dark:bg-card p-6 rounded-3xl border border-gray-100 dark:border-border shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-gray-900 dark:text-gray-100">Detail Probabilitas</h3>
          </div>

          {/* Cataract Probability */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Katarak</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{((result.cataract_probability ?? 0) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-muted rounded-full h-3">
              <div
                className="bg-amber-500 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(result.cataract_probability ?? 0) * 100}%` }}
              />
            </div>
          </div>

          {/* Normal Probability */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Normal</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{((result.non_cataract_probability ?? 0) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-muted rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(result.non_cataract_probability ?? 0) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="rounded-3xl overflow-hidden shadow-md border border-gray-100 dark:border-border">
            <img
              src={screening.imageUrl}
              alt="Screening"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-card p-6 rounded-3xl border border-gray-100 dark:border-border shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-lg flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Deskripsi Analisis
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {result.description}
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-500/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-500/20">
              <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-3 text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Rekomendasi
              </h3>
              <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                {result.recommendation}
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-muted border border-gray-200 dark:border-border rounded-xl text-xs text-gray-500 dark:text-gray-400 text-center">
          <p>
            <strong>DISCLAIMER:</strong> {result.disclaimer || "Ini adalah alat screening berbasis AI dan BUKAN pengganti diagnosis medis profesional. Selalu konsultasikan dengan dokter spesialis mata untuk pemeriksaan dan penanganan yang tepat."}
          </p>
        </div>
      </div>
    </Layout>
  );
}
