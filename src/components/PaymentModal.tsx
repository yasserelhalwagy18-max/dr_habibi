import React, { useState } from 'react';
import { X, CreditCard, Loader2 } from 'lucide-react';

interface PaymentModalProps {
  assessmentFormId?: string | null;
  isOpen: boolean;
  onClose: () => void;
  itemType: 'ASSESSMENT' | 'PACKAGE_12' | 'PACKAGE_24';
  title: string;
  price: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, itemType, title, price, assessmentFormId }) => {
  const [discountCode, setDiscountCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Remove invalid test-user-id to avoid FK constraint, handle assessment form id properly
          assessmentFormId: assessmentFormId || undefined,
          itemType,
          discountCode: discountCode || undefined
        })
      });

      const data = await response.json();
      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        setError(data.error || 'خطا در ارتباط با درگاه پرداخت');
      }
    } catch (err) {
      setError('خطا در برقراری ارتباط');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-scaleIn">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-black text-white">تایید نهایی پرداخت</h3>
            <p className="text-sm text-zinc-400">{title}</p>
          </div>

          <div className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400">مبلغ قابل پرداخت</span>
              <div className="text-left font-mono font-bold text-white">
                {price.toLocaleString()} <span className="text-xs text-zinc-500 font-sans">تومان</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-medium">کد تخفیف (اختیاری)</label>
            <input
              type="text"
              placeholder="اگر کد تخفیف دارید وارد کنید"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-all text-center uppercase tracking-widest font-mono"
              dir="ltr"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 text-center">
              {error}
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
            انتقال به درگاه پرداخت
          </button>
        </div>
      </div>
    </div>
  );
};
