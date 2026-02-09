import { Link } from "wouter";
import { ArrowRight, Activity, ShieldCheck, Zap } from "lucide-react";
import { Layout } from "@/components/ui/Layout";

export default function Landing() {
  return (
    <Layout showNav={false}>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12">
        
        {/* Hero Section */}
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium animate-in slide-in-from-bottom-4 fade-in duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            AI-Powered Health Technology
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] animate-in slide-in-from-bottom-8 fade-in duration-700 delay-100">
            Professional Eye Screening <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              In Your Pocket
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto leading-relaxed animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200">
            Detect potential eye conditions early with our advanced AI analysis tool. Fast, secure, and easy to use from any device.
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom-8 fade-in duration-700 delay-300">
            <a 
              href="/api/login"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-primary rounded-2xl shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Start Free Screening
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            
            <button className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-700 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
              Learn How It Works
            </button>
          </div>
        </div>

        {/* Unsplash Image with Overlay */}
        <div className="relative w-full max-w-4xl mx-auto mt-8 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-1000 delay-500 group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
          {/* Medical eye examination image */}
          <img 
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=600&fit=crop" 
            alt="Eye Examination" 
            className="w-full h-[300px] md:h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute bottom-6 left-6 z-20 text-left">
            <p className="text-white font-bold text-lg">Trusted Analysis</p>
            <p className="text-white/80 text-sm">Powered by advanced machine learning models</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto py-12 text-left">
          <FeatureCard 
            icon={Zap}
            title="Instant Results"
            description="Get a preliminary analysis in seconds using our cloud-based AI engine."
          />
          <FeatureCard 
            icon={ShieldCheck}
            title="Secure & Private"
            description="Your medical data is encrypted and stored securely following privacy standards."
          />
          <FeatureCard 
            icon={Activity}
            title="History Tracking"
            description="Monitor changes over time with a complete history of your screenings."
          />
        </div>
      </div>
    </Layout>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
