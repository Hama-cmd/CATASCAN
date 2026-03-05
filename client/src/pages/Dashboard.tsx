import { Link } from "wouter";
import { Plus, Clock, ChevronRight, Activity, Info, Eye } from "lucide-react";
import { Layout } from "@/components/ui/Layout";
import { useScreenings } from "@/hooks/use-screenings";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: screenings, isLoading } = useScreenings();

  return (
    <Layout>
      <div className="space-y-8 pb-10">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              CataScan <span className="text-2xl">👁️</span>
            </h1>
            <p className="text-gray-500 mt-1">Screening Katarak Berbasis AI</p>
          </div>

          <Link href="/screen">
            <button className="w-full md:w-auto px-6 py-3 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              Screening Baru
            </button>
          </Link>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
          <Link href="/screen">
            <button className="w-full flex flex-col items-center gap-2 p-4 bg-white dark:bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-border">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Scan Baru</span>
            </button>
          </Link>

          <Link href="/history">
            <button className="w-full flex flex-col items-center gap-2 p-4 bg-white dark:bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-border">
              <div className="w-12 h-12 bg-secondary/10 dark:bg-secondary/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Riwayat</span>
            </button>
          </Link>

          <Link href="/info">
            <button className="w-full flex flex-col items-center gap-2 p-4 bg-white dark:bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-border">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Info className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Edukasi</span>
            </button>
          </Link>
        </div>

        {/* Stats / Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-primary/80 to-primary text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5 text-white/80" />
                <span className="font-medium text-white/90">Total Screening</span>
              </div>
              <h3 className="text-4xl font-bold">{screenings?.length || 0}</h3>
              <p className="text-white/70 text-sm mt-1">Pemeriksaan dilakukan</p>
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          </div>

          <div className="bg-white dark:bg-card border border-gray-100 dark:border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2 text-secondary">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Aktivitas Terakhir</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {screenings && screenings.length > 0
                ? format(new Date(screenings[0].createdAt || new Date()), "MMMM d, yyyy")
                : "Belum ada aktivitas"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {screenings && screenings.length > 0
                ? "Tanggal screening terakhir"
                : "Mulai screening pertama Anda"}
            </p>
          </div>
        </div>

        {/* Recent History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Screening Terakhir</h2>
            <Link href="/history" className="text-primary text-sm font-medium hover:underline">
              Lihat Semua
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-100 dark:bg-muted rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : !screenings || screenings.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-card rounded-2xl border border-dashed border-gray-200 dark:border-border">
              <div className="w-16 h-16 bg-gray-50 dark:bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada screening</p>
              <Link href="/screen" className="text-primary text-sm mt-2 block hover:underline">
                Mulai screening pertama
              </Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {screenings.slice(0, 3).map((screening) => {
                const analysis = screening.analysis as any;
                const isNormal = analysis.condition?.toLowerCase().includes("normal") ||
                  analysis.condition?.toLowerCase().includes("healthy");
                return (
                  <Link key={screening.id} href={`/result/${screening.id}`}>
                    <div className="bg-white dark:bg-card p-4 rounded-2xl border border-gray-100 dark:border-border shadow-sm hover:shadow-md hover:border-primary/20 dark:hover:border-primary/20 transition-all flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={screening.imageUrl}
                            alt="Eye"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                            {analysis.condition || "Screening"}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {format(new Date(screening.createdAt || new Date()), "MMM d, yyyy • h:mm a")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${isNormal ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'}`}>
                          {analysis.confidence || "N/A"}
                        </span>
                        <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
