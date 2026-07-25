import LeadForm from '@/components/LeadForm';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Sparkles, Shield, Zap, BarChart3, ArrowUpRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-600/15 via-purple-600/5 to-transparent blur-3xl pointer-events-none"></div>

      {/* Header / Navigation */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/30">
            L
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            LeadDesk <span className="text-indigo-400">Mini</span>
          </span>
        </div>

        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all shadow-sm"
        >
          <span>Admin Portal</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Benefit-driven Hero Copy */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Lead Intake System</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Turn high-intent visitors into <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">qualified clients</span>.
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Capture verified project requirements, budget ranges, and customer details with an intelligent lead workflow built for high-growth agencies & SaaS.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-900 text-left">
              <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800/80">
                <Zap className="w-5 h-5 text-indigo-400 mb-2" />
                <h4 className="text-xs font-semibold text-slate-200">Instant Qualify</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Automated budget tiering</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800/80">
                <BarChart3 className="w-5 h-5 text-indigo-400 mb-2" />
                <h4 className="text-xs font-semibold text-slate-200">Real-Time Sync</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Live status management</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800/80">
                <Shield className="w-5 h-5 text-indigo-400 mb-2" />
                <h4 className="text-xs font-semibold text-slate-200">Secure Intake</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Zod server-validated</p>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Form */}
          <div className="lg:col-span-6 w-full max-w-lg mx-auto lg:max-w-none">
            <LeadForm />
          </div>
        </div>
      </main>

      {/* Footer Credit Line */}
      <Footer />
    </div>
  );
}
