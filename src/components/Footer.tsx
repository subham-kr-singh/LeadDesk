import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950/80 backdrop-blur-md py-6 px-4 text-center text-sm text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">LeadDesk Mini</span>
          <span className="text-slate-600">•</span>
          <span className="text-xs text-slate-500">Lead Capture Platform</span>
        </div>
        <p className="text-xs text-slate-400">
          Built for Digital Heroes Training Task{' '}
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4 transition-colors"
          >
            https://digitalheroesco.com
          </a>
        </p>
      </div>
    </footer>
  );
}
