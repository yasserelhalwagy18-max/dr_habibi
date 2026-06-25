import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { XCircle, ArrowRight } from 'lucide-react';

export const Failure: React.FC = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-zinc-900/60 border border-zinc-800 rounded-[2rem] p-8 text-center space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-rose-500/10 blur-[50px] pointer-events-none" />

        <div className="space-y-6 relative z-10 animate-fadeIn">
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10 text-rose-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">پرداخت ناموفق</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {status === 'CANCELLED'
                ? 'شما از فرآیند پرداخت انصراف دادید.'
                : 'تراکنش با خطا مواجه شد. در صورت کسر وجه، مبلغ تا ۷۲ ساعت آینده به حساب شما باز خواهد گشت.'}
            </p>
          </div>

          <div className="pt-6 space-y-3">
            <Link to="/services" className="flex items-center justify-center w-full py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-black transition-all text-sm gap-2">
               تلاش مجدد
            </Link>
            <Link to="/" className="flex items-center justify-center w-full py-3.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-white font-semibold transition-all text-sm">
              <ArrowRight className="w-4 h-4 ml-2" />
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
