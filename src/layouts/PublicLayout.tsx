import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-emerald-500 selection:text-zinc-950 relative text-right flex flex-col" style={{ direction: "rtl" }}>
      {/* Absolute top glowing bar */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-rose-500 z-50 relative shrink-0" />

      {/* Sticky Navbar */}
      <header className="bg-zinc-900/80 border-b border-zinc-800/80 sticky top-0 z-40 backdrop-blur-md px-4 py-4 shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Logo Brand Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all">
              <Dumbbell className="w-5 h-5 text-zinc-950" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white block">درمان درست</h1>
              <span className="text-[10px] text-zinc-400 block font-mono">DR. AMIR HABIBI | REHAB</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6 text-sm font-semibold">
            <Link to="/" className="text-zinc-400 hover:text-white transition-colors">خانه</Link>
            <Link to="/about" className="text-zinc-400 hover:text-white transition-colors">درباره ما</Link>
            <Link to="/services" className="text-zinc-400 hover:text-white transition-colors">خدمات</Link>
            <Link to="/blog" className="text-zinc-400 hover:text-white transition-colors">مقالات</Link>
            <Link to="/webinars" className="text-zinc-400 hover:text-white transition-colors">وبینارها</Link>
          </nav>

          <div className="hidden sm:flex">
             <Link to="/assessment" className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-300 transition-all duration-300 text-xs font-black">
                درخواست پذیرش
             </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full">
        <Outlet />
      </main>

      {/* Minimal Footer */}
      <footer className="shrink-0 text-center py-8 mt-12 border-t border-zinc-900 text-[11px] text-zinc-500 space-y-2 bg-zinc-950 relative z-10">
        <p>© {new Date().getFullYear()} درمان درست — کلینیک بازتوانی و بازسازی حرکتی امیر حبیبی. کلیه حقوق محفوظ است.</p>
        <p className="font-mono">DR. AMIR HABIBI SPORTS PATHOLOGY LAB • TOKYO / TEHRAN PREPARATION STANDARD</p>
      </footer>
    </div>
  );
};
