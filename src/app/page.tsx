import LeadForm from '@/components/LeadForm';
import Footer from '@/components/Footer';
import Link from 'next/link';

const highlights = [
  'One form collects name, budget, and project context.',
  'Every inquiry lands in a single admin inbox.',
  'Update status as you reach out and close deals.',
];

function CheckIcon() {
  return (
    <svg className="w-4 h-4 shrink-0 text-[#2563EB]" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3.5 8.5L6.5 11.5L12.5 4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-grid-architectural flex flex-col">
      <header className="border-b border-zinc-200/80 bg-white/70 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white text-sm font-bold flex items-center justify-center">
              L
            </div>
            <span className="text-sm font-semibold tracking-tight text-zinc-950">
              LeadDesk Mini
            </span>
          </div>
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-950 transition-colors rounded-md px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
          >
            Team login
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="order-2 lg:order-1 lg:col-span-6 xl:col-span-7 space-y-8">
            <div className="space-y-4">
              <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950 leading-[1.12]">
                Tell us about your project. We&apos;ll handle the rest.
              </h1>
              <p className="text-base text-zinc-600 max-w-lg leading-relaxed">
                Share budget and context in a few minutes. Your team sees every inquiry in one admin inbox.
              </p>
            </div>

            <ul className="space-y-3 pt-2">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-zinc-700">
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

          </div>

          <div className="order-1 lg:order-2 lg:col-span-6 xl:col-span-5 w-full lg:sticky lg:top-20">
            <LeadForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
