import { ReactNode } from 'react';

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Datasphere TDD Generator</h1>
          <p className="mt-2 text-slate-600">Enterprise pipeline for CSN → normalized metadata → Excel TDD generation.</p>
        </header>
        {children}
      </div>
    </div>
  );
}
