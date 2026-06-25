import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const DevRoleSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-zinc-900/90 border border-zinc-800/80 backdrop-blur-md p-2 rounded-2xl shadow-2xl flex flex-col gap-2 font-sans" style={{ direction: "rtl" }}>
      <div className="text-[10px] text-zinc-500 px-2 font-semibold text-center border-b border-zinc-800 pb-1">
        پنل توسعه‌دهنده (مسیرها)
      </div>
      <div className="flex flex-col gap-1">
        <button
          onClick={() => navigate('/')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all text-right ${
            location.pathname === '/' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          صفحه اصلی
        </button>
        <button
          onClick={() => navigate('/dashboard/patient')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all text-right ${
            location.pathname.includes('/dashboard/patient') ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          پورتال بیمار
        </button>
        <button
          onClick={() => navigate('/dashboard/coach')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all text-right ${
            location.pathname.includes('/dashboard/coach') ? 'bg-teal-500/10 text-teal-400' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          پورتال مربی
        </button>
      </div>
    </div>
  );
};
