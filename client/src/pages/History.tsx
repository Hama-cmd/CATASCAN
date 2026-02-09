import { Layout } from "@/components/ui/Layout";
import { useScreenings } from "@/hooks/use-screenings";
import { Link } from "wouter";
import { format } from "date-fns";
import { ChevronRight, Calendar, Search } from "lucide-react";
import { useState } from "react";

export default function History() {
  const { data: screenings, isLoading } = useScreenings();
  const [search, setSearch] = useState("");

  const filteredScreenings = screenings?.filter(s => {
    const condition = (s.analysis as any).condition?.toLowerCase() || "";
    return condition.includes(search.toLowerCase());
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Screening History</h1>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search history..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : !filteredScreenings || filteredScreenings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No screenings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredScreenings.map((screening) => (
              <Link key={screening.id} href={`/result/${screening.id}`}>
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group cursor-pointer animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                        <img 
                          src={screening.imageUrl} 
                          alt="Eye thumbnail" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 text-lg">
                            {(screening.analysis as any).condition || "Analysis Result"}
                          </h3>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${(screening.analysis as any).condition?.toLowerCase().includes('healthy') ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {(screening.analysis as any).confidence}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(new Date(screening.createdAt || new Date()), "MMMM d, yyyy • h:mm a")}
                        </div>
                      </div>
                    </div>

                    <div className="p-2 text-gray-300 group-hover:text-primary group-hover:bg-primary/5 rounded-full transition-all">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
