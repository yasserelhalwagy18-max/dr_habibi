import React from 'react';
import { PaymentModal } from '../../components/PaymentModal';
import { useState } from 'react';

import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Services: React.FC = () => {
  const [paymentModal, setPaymentModal] = useState<{isOpen: boolean, type: 'PACKAGE_12' | 'PACKAGE_24', title: string, price: number}>({
    isOpen: false,
    type: 'PACKAGE_12',
    title: '',
    price: 0
  });

  const openPayment = (type: 'PACKAGE_12' | 'PACKAGE_24', title: string, price: number) => {
    setPaymentModal({ isOpen: true, type, title, price });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-black text-white">پکیج‌های درمانی و ریکاوری پیشرفته</h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          هر پکیج شامل ارزیابی کینزیولوژیک اختصاصی، پرونده‌سازی دیجیتال و پایش روزانه درد است. مسیر درمان شما با دقت و برنامه‌ریزی علمی طراحی می‌شود.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Package 1 */}
        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-zinc-900/60 hover:bg-zinc-900/80 transition-all duration-300 border border-zinc-800 flex flex-col justify-between space-y-8 relative group">
          <div className="space-y-6">
            <span className="px-4 py-1.5 bg-zinc-800 text-zinc-400 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block">ریکاوری میان مدت</span>
            <h4 className="text-2xl font-black text-white block">پکیج ۱۲ جلسه‌ای</h4>
            <p className="text-sm text-zinc-400 leading-relaxed text-justify">
              ویژه توانبخشی مصدومیت‌های خفیف، بازسازی الگوهای پایه راه رفتن، اصلاح افتادگی و تقویت ثبات عضلانی مفاصل پس از گچ‌گیری.
            </p>
            <div className="h-px bg-zinc-800/80 w-full" />
            <ul className="space-y-4 text-sm text-zinc-300">
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-tight">ارزیابی ابتدایی حرکت و تعیین شاخص درد VAS</span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-tight">۱۲ جلسه کارگاه اختصاصی دستی و فیزیکی</span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-tight">برنامه حرکتی اختصاصی منزل</span>
              </li>
            </ul>
          </div>
          <div className="space-y-6 pt-6">
            <div className="flex justify-between items-baseline border-t border-zinc-800/60 pt-6">
              <span className="text-sm font-semibold text-zinc-400">هزینه دوره کامل</span>
              <div className="text-right">
                <span className="text-3xl font-black text-white">۱۴,۵۰۰,۰۰۰</span>
                <span className="text-xs text-zinc-400 mr-2">تومان</span>
              </div>
            </div>
            <button onClick={() => openPayment('PACKAGE_12', 'پکیج ۱۲ جلسه‌ای', 1200000)} className="flex items-center justify-center w-full py-4 rounded-2xl bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-300 transition-all duration-300 text-sm font-black group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              خرید پکیج
            </button>
          </div>
        </div>

        {/* Package 2 */}
        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-zinc-900/60 hover:bg-zinc-900/80 transition-all duration-300 border-2 border-emerald-500/40 hover:border-emerald-400 flex flex-col justify-between space-y-8 relative overflow-hidden shadow-[0_15px_30px_rgba(16,185,129,0.05)] group">
          {/* Popular stamp */}
          <div className="absolute top-0 left-0 bg-emerald-500 text-zinc-950 text-[10px] font-black px-5 py-2 rounded-br-3xl shadow-lg">
            پیشنهاد تیم ملی
          </div>

          <div className="space-y-6">
            <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block mt-2">جامع‌ترین پکیج ریکاوری</span>
            <h4 className="text-2xl font-black text-white block">پکیج ۲۴ جلسه‌ای</h4>
            <p className="text-sm text-zinc-400 leading-relaxed text-justify">
              کامل‌ترین دوره بازیابی حرکتی برای مصدومیت‌های عمیق (جراحی رباط صلیبی ACL، دیسکوپاتی حاد، روتاتور کاف شانه). بازیابی ایمپالس عصبی عضلانی.
            </p>
            <div className="h-px bg-zinc-800/80 w-full" />
            <ul className="space-y-4 text-sm text-zinc-300">
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-tight">ارزیابی ابتدایی سه‌بعدی و پرونده حرکتی کامل</span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-tight">۲۴ جلسه درمانی کلینیکال و شبیه‌سازی فشار ورزشی</span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-tight">پشتیبانی VIP و مشاوره تغذیه ضدالتهاب</span>
              </li>
            </ul>
          </div>
          <div className="space-y-6 pt-6">
            <div className="flex justify-between items-baseline border-t border-zinc-800/60 pt-6">
              <span className="text-sm font-semibold text-zinc-400">هزینه دوره کامل</span>
              <div className="text-right">
                <span className="text-3xl font-black text-emerald-400">۲۷,۰۰۰,۰۰۰</span>
                <span className="text-xs text-zinc-400 mr-2">تومان</span>
              </div>
            </div>
            <button onClick={() => openPayment('PACKAGE_24', 'پکیج ۲۴ جلسه‌ای', 2200000)} className="flex items-center justify-center w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black transition-all duration-300 text-sm shadow-lg hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]">
              خرید پکیج ویژه
            </button>
          </div>
        </div>
      </div>

      {/* Premium Disclaimer Block */}
      <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-[2rem] bg-zinc-900/80 border border-zinc-800/80 relative overflow-hidden text-right shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-orange-400 to-rose-500" />
        <p className="text-sm font-medium text-zinc-300 leading-relaxed text-justify pr-4">
          این خدمات برای افرادی طراحی شده که روند درمان را جدی دنبال میکنند. اجرای دقیق برنامه، پیگیری منظم و همکاری دوطرفه، بخش مهمی از رسیدن به نتیجه پایدار است. تعهد شما به تمرینات خانگی به اندازه جلسات کلینیک حائز اهمیت است.
        </p>
      </div>
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ ...paymentModal, isOpen: false })}
        itemType={paymentModal.type}
        title={paymentModal.title}
        price={paymentModal.price}
      />
    </div>
  );
};
