import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

export const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const authority = searchParams.get('trackId');
  const statusParam = searchParams.get('status');

  const [verifying, setVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; error?: string } | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!authority || statusParam !== 'OK') {
        setVerificationResult({ success: false, error: 'پارامترهای پرداخت نامعتبر است' });
        setVerifying(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ authority, status: statusParam })
        });

        const data = await response.json();
        setVerificationResult(data);
      } catch (error) {
        setVerificationResult({ success: false, error: 'خطا در ارتباط با سرور' });
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [authority, statusParam]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-zinc-900/60 border border-zinc-800 rounded-[2rem] p-8 text-center space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-emerald-500/10 blur-[50px] pointer-events-none" />

        {verifying ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-8 relative z-10">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
            <p className="text-zinc-400 font-medium">در حال تایید پرداخت...</p>
          </div>
        ) : verificationResult?.success ? (
          <div className="space-y-6 relative z-10 animate-fadeIn">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">پرداخت موفق</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                تراکنش شما با موفقیت ثبت شد و سرویس مورد نظر فعال گردید.
              </p>
            </div>

            <div className="pt-6">
              <Link to="/dashboard/patient" className="flex items-center justify-center w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black transition-all text-sm gap-2">
                <ArrowRight className="w-4 h-4" />
                ورود به پنل کاربری
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6 relative z-10 animate-fadeIn">
            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto">
              <div className="w-10 h-10 flex flex-col items-center justify-center text-rose-400 font-bold text-2xl">!</div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">مشکل در تایید پرداخت</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {verificationResult?.error || 'متاسفانه در تایید پرداخت شما مشکلی رخ داده است.'}
              </p>
            </div>

            <div className="pt-6">
              <Link to="/" className="flex items-center justify-center w-full py-3.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-white font-semibold transition-all text-sm">
                بازگشت به صفحه اصلی
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
