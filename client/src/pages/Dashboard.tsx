import { Link } from "wouter";
import { Plus, Clock, ChevronRight, Activity } from "lucide-react";
import { Layout } from "@/components/ui/Layout";
import { useAuth } from "@/hooks/use-auth";
import { useScreenings } from "@/hooks/use-screenings";
import { format } from "date-fns";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: screenings, isLoading } = useScreenings();

  const firstName = user?.firstName || "Guest";

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hello, {firstName} <span className="text-2xl">👋</span>
            </h1>
            <p className="text-gray-500 mt-1">Ready for your daily check-up?</p>
          </div>
          
          <Link href="/screen">
            <button className="w-full md:w-auto px-6 py-3 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              New Screening
            </button>
          </Link>
        </div>

        {/* Stats / Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-primary/80 to-primary text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5 text-white/80" />
                <span className="font-medium text-white/90">Total Screenings</span>
              </div>
              <h3 className="text-4xl font-bold">{screenings?.length || 0}</h3>
              <p className="text-white/70 text-sm mt-1">Lifetime check-ups</p>
            </div>
            {/* Abstract Background Decoration */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2 text-secondary">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Latest Activity</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {screenings && screenings.length > 0 
                ? format(new Date(screenings[0].createdAt || new Date()), "MMMM d, yyyy") 
                : "No activity yet"}
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              {screenings && screenings.length > 0 
                ? "Last screening date" 
                : "Start your first screening today"}
            </p>
          </div>
        </div>

        {/* Recent History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Screenings</h2>
            <Link href="/history" className="text-primary text-sm font-medium hover:underline">
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : !screenings || screenings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No screenings found</p>
              <Link href="/screen" className="text-primary text-sm mt-2 block hover:underline">
                Create your first one
              </Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {screenings.slice(0, 3).map((screening) => (
                <Link key={screening.id} href={`/result/${screening.id}`}>
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={screening.imageUrl} 
                          alt="Eye" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 line-clamp-1">
                          {(screening.analysis as any).condition || "Healthy Eyes"}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {format(new Date(screening.createdAt || new Date()), "MMM d, yyyy • h:mm a")}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${(screening.analysis as any).condition === 'Healthy' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {(screening.analysis as any).confidence || "90%"}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
