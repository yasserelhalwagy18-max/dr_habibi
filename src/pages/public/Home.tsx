import React from "react";
import { Link } from "react-router-dom";
import {
  Award,
  ChevronLeft,
  Heart,
  Zap,
  Star
} from "lucide-react";

export const Home: React.FC = () => {
  return (
    <div className="text-zinc-100 relative overflow-hidden" id="landing-page-root">

      {/* Cinematic Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10 space-y-24">

        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-8 relative pt-10" id="hero-section">
          {/* Decorative clinical rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-zinc-800/30 rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-zinc-800/20 rounded-full pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-semibold text-zinc-300 relative z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            پلتفرم هوشمند توانبخشی و آسیب‌شناسی ورزشی
          </div>

          <div className="space-y-4 max-w-3xl relative z-10">
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
              بازگشت پرقدرت،
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">
                بدون بازگشت درد.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl mx-auto mt-6">
              یک پلتفرم کلینیکال برای ورزشکاران حرفه‌ای. ارزیابی بیومکانیک، مدیریت هوشمند برنامه‌های تمرینی و نظارت مستقیم دکتر امیر حبیبی بر روند ریکاوری شما.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 relative z-10">
            <Link
              to="/assessment"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] text-sm cursor-pointer"
            >
              شروع ارزیابی و درمان
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <Link
              to="/services"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold border border-zinc-800 transition-all duration-300 text-sm flex justify-center items-center cursor-pointer"
            >
               مشاهده پکیج‌های درمانی
            </Link>
          </div>

          {/* Social Proof / Stats */}
          <div className="flex flex-wrap justify-center items-center gap-8 pt-12 border-t border-zinc-800/60 w-full max-w-2xl relative z-10">
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-black text-white">۱۵+</span>
              <span className="text-[10px] text-zinc-500 font-semibold tracking-wider">سال تجربه بالینی</span>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-black text-white">۸۵۰+</span>
              <span className="text-[10px] text-zinc-500 font-semibold tracking-wider">ورزشکار درمان‌شده</span>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center text-emerald-400 gap-0.5">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="text-[10px] text-zinc-500 font-semibold tracking-wider">رضایت قهرمانان</span>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="p-6 rounded-[2rem] bg-zinc-900/40 border border-zinc-800/60 space-y-4 hover:bg-zinc-900/80 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center">
              <Heart className="w-6 h-6 text-rose-400" />
            </div>
            <h3 className="text-lg font-bold text-white">مدیریت درد (VAS)</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              ثبت روزانه شاخص درد در نواحی مختلف بدن و تحلیل هوشمند نمودار پیشرفت توسط تیم پزشکی.
            </p>
          </div>
          <div className="p-6 rounded-[2rem] bg-zinc-900/40 border border-zinc-800/60 space-y-4 hover:bg-zinc-900/80 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white">ریکاوری سریع‌</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              پروتکل‌های تمرینی ایزومتریک و ایزوتونیک اختصاصی برای کاهش التهاب و افزایش دامنه حرکتی.
            </p>
          </div>
          <div className="p-6 rounded-[2rem] bg-zinc-900/40 border border-zinc-800/60 space-y-4 hover:bg-zinc-900/80 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white">استاندارد قهرمانی</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              متدهای بازتوانی همگام با استانداردهای کمیته ملی المپیک برای بازگشت ایمن به مسابقات.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
