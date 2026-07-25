export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200/80 bg-white py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
        <span className="font-medium text-zinc-700">LeadDesk Mini</span>
        <p className="text-xs text-zinc-500 text-center sm:text-right">
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2563EB] hover:text-blue-700 font-medium underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 rounded-sm"
          >
            Built for Digital Heroes Training Task
          </a>
        </p>
      </div>
    </footer>
  );
}
