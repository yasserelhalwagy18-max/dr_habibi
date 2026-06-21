/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Award, 
  ShieldCheck, 
  ChevronLeft, 
  Users, 
  Heart, 
  Compass, 
  Zap, 
  MapPin, 
  Star,
  Quote,
  Flame,
  Dumbbell
} from "lucide-react";

interface LandingPageProps {
  onStartAssessment: () => void;
  onSelectRole: (role: "patient" | "coach") => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAssessment,
  onSelectRole,
}) => {
  return (
    <div className="text-zinc-100 min-h-screen relative overflow-hidden" id="landing-page-root">
      
      {/* Cinematic Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 space-y-16 lg:space-y-24">
        
        {/* Navigation / Header */}
        <header className="flex justify-between items-center pb-6 border-b border-zinc-800/60" id="landing-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Dumbbell className="w-5 h-5 text-zinc-950" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white block">درمان درست</h1>
              <span className="text-[10px] text-zinc-400 block font-mono">DR. AMIR HABIBI | REHAB</span>
            </div>
          </div>
          <div className="flex items-center gap-3" id="header-auth-buttons">
            <button
              id="goto-patient-portal-btn"
              onClick={() => onSelectRole("patient")}
              className="py-2 px-4 rounded-xl text-xs font-semibold bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition-all cursor-pointer"
            >
              پرتال بیمار
            </button>
            <button
              id="goto-coach-portal-btn"
              onClick={() => onSelectRole("coach")}
              className="py-2 px-4 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-zinc-950 transition-all font-medium shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer"
            >
              پرتال ناظر / پزشک
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="hero-section">
          {/* Hero Left: Portrait Showcase */}
          <div className="lg:col-span-5 order-first lg:order-last flex justify-center relative">
            <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-[2.5rem] overflow-hidden border-2 border-zinc-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-zinc-900">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8QrkE0f2QdAd42iOgJdDTNtSPYjOowIVu2KzVsnLirao2x--WEAYGByXSCQOz4vt6C7SAW9g7g4ip8t3xx9v6UmoOHFIOyadp0XNYFALYfOH3y-MeIE9Dt57SAh_O51NA9ID4Yj5Xkh1keZzUOG8I2xWz10ynk62sXE7Io9rl1ct6Mk2fL5c4Dj5q17EJW8XQjvazfvQRVTJj4VvcFCLzRAIIjZidqdXF2szU9zxhra7Mg008_wK6wVrSnXvbIKb-Pz4r6HBspV0"
                alt="Dr. Amir Habibi"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out transform hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
              
              {/* Overlapping Badge: PhD Card */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Award className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">دکتر امیر حبیبی</h4>
                    <p className="text-[10px] text-zinc-400">آسیب‌شناسی ورزشی دانشگاه تهران</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Visual background rings */}
            <div className="absolute -inset-4 border border-emerald-500/10 rounded-[3rem] -z-10 pointer-events-none" />
            <div className="absolute -inset-10 border border-zinc-800/30 rounded-[3.5rem] -z-10 pointer-events-none" />
          </div>

          {/* Hero Right: Headlines */}
          <div className="lg:col-span-7 space-y-6 text-right">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/80 border border-zinc-800 rounded-full text-xs text-emerald-400">
              <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
              <span>کلینیک تخصصی توانبخشی حاد و مزمن</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-tight lg:leading-snug text-white">
              تشخیص درست | درمان اصولی | حرکت پایدار
            </h2>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
              ترکیب دانش دانشگاهی، تجربه ورزشی و درمان مبتنی بر شواهد برای بازسازی پایدار حرکت. 
              اینجا مسیر بازگشت شما به اوج ورزش قهرمانی و زندگی بدون درد آکادمیک و ایمن ترسیم می‌شود.
            </p>

            {/* Trust Bar (Required String) */}
            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md">
              <p className="text-xs font-semibold text-emerald-300 leading-relaxed flex items-center gap-2 justify-start">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>دکتری آسیبشناسی ورزشی دانشگاه تهران | قهرمان بوکس | متخصص حرکات اصلاحی</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                id="cta-reserve-assessment-btn"
                onClick={onStartAssessment}
                className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 font-black text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(16,185,129,0.3)] hover:shadow-[0_12px_40px_rgb(16,185,129,0.4)] cursor-pointer"
              >
                <span>رزرو ارزیابی تخصصی</span>
                <ChevronLeft className="w-4 h-4 shrink-0" />
              </button>
              <button
                id="cta-learn-more-btn"
                onClick={() => {
                  const elem = document.getElementById("philosophy-section");
                  elem?.scrollIntoView({ behavior: "smooth" });
                }}
                className="py-3.5 px-6 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                فلسفه کار ما
              </button>
            </div>
          </div>
        </section>

        {/* Credentials / About Dr. Amir Habibi Grid */}
        <section className="p-8 sm:p-12 rounded-[2rem] bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-xl relative space-y-10" id="philosophy-section">
          <div className="max-w-3xl space-y-3">
            <h3 className="text-xl sm:text-2xl font-black text-white">درباره درمانگر و مربی شما</h3>
            <p className="text-xs text-zinc-400">تعهد علمی همگام با تجربه میدان نبرد ورزشی</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/60 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-orange-400/10 flex items-center justify-center text-orange-400">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">تحصیلات آکادمیک تراز اول</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  دارای مدرک دکتری آسیب‌شناسی ورزشی از دانشگاه تهران. تخصص در بیومکانیک، درمان دستی و بازتوانی آسیب‌های پیچیده مفصلی.
                </p>
              </div>
              <span className="text-[10px] text-zinc-600 font-mono">UNIVERSITY OF TEHRAN</span>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/60 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center text-emerald-400">
                  <Flame className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">قهرمانی بوکس و رزم‌آوری</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  تجربه سال‌ها حضور در رینگ مسابقات به عنوان مبارز ملی و مدال‌آور؛ درک عمیق از فشارهای فیزیکی و روانشناسی بهبود بیومکانیک.
                </p>
              </div>
              <span className="text-[10px] text-zinc-600 font-mono">ELITE ATHLETIC MINDSET</span>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/60 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-teal-400/10 flex items-center justify-center text-teal-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">متدی مبتنی بر شواهد علمی</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  ما صرفاً ماساژ یا آب‌درمانی نمی‌کنیم. برنامه‌های ریکاوری و تقویت با الگوهای علمی پایش و ریتم پایداری پیگیری می‌شوند.
                </p>
              </div>
              <span className="text-[10px] text-zinc-600 font-mono">EVIDENCE-BASED REHAB</span>
            </div>
          </div>

          {/* Side quote from Dr. Amir Habibi */}
          <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-zinc-700 shadow-lg">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLy_bGmWJwuJOH61GdlkzYy5wJQ4XN6AW1y7E6GsdMyCUXpO76k28PDnFUwWN3Uq1CdvGKi2NigxCOYL9ZsqqwDGyzn5luHngCcOsm--qSEPFtwPZMtOx3Y2hsGm2nCfnSdC3rdQ9Y7_VUvZRQw_qcoAP__BUSlbUPpYNPJyWfKvQXargZqC3fVqew8apYy2Hl_8OvpS1AD4WuhGbg177zd3ft-lC5Nkem7TQ-kclhwicnlxWquKvGOKJcpAssR15OP3ZoJ5WpynQ"
                alt="Amir Habibi Coach"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-2 text-right relative">
              <Quote className="absolute left-0 top-0 w-8 h-8 text-zinc-800/60 -z-10" />
              <p className="text-xs text-zinc-300 italic leading-relaxed">
                "درمان درست صرفاً تسکین درد نیست، بلکه بازنشانی کدهای عصبی عضلانی بدن و تبدیل آسیب به منبعی از آگاهی عضلانی است. ورزشکاری که خوب هدایت شود، پس از مصدومیت قوی‌تر از قبل به زمین بازمی‌گردد."
              </p>
              <h5 className="text-xs font-bold text-emerald-400">— دکتر امیر حبیبی</h5>
            </div>
          </div>
        </section>

        {/* Pricing / Sessions Packages Showcase */}
        <section className="space-y-10" id="pricing-packages-section">
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-black text-white">پکیج‌های درمانی و ریکاوری پیشرفته</h3>
            <p className="text-xs text-zinc-400 max-w-lg mx-auto">
              هر پکیج شامل ارزیابی کینزیولوژیک اختصاصی، پرونده‌سازی دیجیتال و پایش روزانه درد است.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Package 1 */}
            <div className="p-8 rounded-[2rem] bg-zinc-900/60 hover:bg-zinc-900/80 transition-all duration-300 border border-zinc-800 flex flex-col justify-between space-y-8 relative">
              <div className="space-y-6">
                <span className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full text-[10px] font-semibold uppercase tracking-wider">ریکاوری میان مدت</span>
                <h4 className="text-xl font-black text-white block">پکیج ۱۲ جلسه‌ای</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  ویژه توانبخشی مصدومیت‌های خفیف، بازسازی الگوهای پایه راه رفتن، اصلاح افتادگی و تقویت ثبات عضلانی مفاصل پس از گچ‌گیری.
                </p>
                <div className="h-px bg-zinc-800" />
                <ul className="space-y-3 text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>ارزیابی ابتدایی حرکت و تعیین شاخص درد VAS</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>۱۲ جلسه کارگاه اختصاصی دستی و فیزیکی</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>برنامه حرکتی اختصاصی منزل</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-zinc-400">هزینه دوره کامل</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white">۱۴,۵۰۰,۰۰۰</span>
                    <span className="text-[10px] text-zinc-400 mr-1.5">تومان</span>
                  </div>
                </div>
                <button
                  onClick={onStartAssessment}
                  className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-300 transition-all duration-300 text-xs font-black cursor-pointer"
                >
                  درخواست پذیرش و ارزیابی
                </button>
              </div>
            </div>

            {/* Package 2 */}
            <div className="p-8 rounded-[2rem] bg-zinc-900/60 hover:bg-zinc-900/80 transition-all duration-300 border-2 border-emerald-500/40 hover:border-emerald-400 flex flex-col justify-between space-y-8 relative overflow-hidden shadow-[0_15px_30px_rgba(16,185,129,0.05)]">
              {/* Popular stamp */}
              <div className="absolute top-0 left-0 bg-emerald-500 text-zinc-950 text-[10px] font-black px-4 py-1.5 rounded-br-2xl">
                پیشنهاد تیم ملی
              </div>

              <div className="space-y-6">
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-300 rounded-full text-[10px] font-semibold uppercase tracking-wider">جامع‌ترین پکیج ریکاوری</span>
                <h4 className="text-xl font-black text-white block">پکیج ۲۴ جلسه‌ای</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  کامل‌ترین دوره بازیابی حرکتی برای مصدومیت‌های عمیق (جراحی رباط صلیبی ACL، دیسکوپاتی حاد، روتاتور کاف شانه). بازیابی ایمپالس عصبی عضلانی.
                </p>
                <div className="h-px bg-zinc-800" />
                <ul className="space-y-3 text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>ارزیابی ابتدایی سه‌بعدی و پرونده حرکتی کامل</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>۲۴ جلسه درمانی کلینیکال و شبیه‌سازی فشار ورزشی</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>پشتیبانی VIP و مشاوره تغذیه ضدالتهاب</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-zinc-400">هزینه دوره کامل</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-400">۲۷,۰۰۰,۰۰۰</span>
                    <span className="text-[10px] text-zinc-400 mr-1.5">تومان</span>
                  </div>
                </div>
                <button
                  onClick={onStartAssessment}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black transition-all duration-300 text-xs shadow-lg cursor-pointer"
                >
                  شروع درمان و ارزیابی کینزیولوژی
                </button>
              </div>
            </div>
          </div>

          {/* Premium Disclaimer Block (Required String) */}
          <div className="max-w-4xl mx-auto p-5 sm:p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-md relative overflow-hidden text-right">
            <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-orange-400 to-rose-500" />
            <p className="text-xs font-semibold text-zinc-300 leading-relaxed">
              این خدمات برای افرادی طراحی شده که روند درمان را جدی دنبال میکنند. اجرای دقیق برنامه، پیگیری منظم و همکاری دوطرفه، بخش مهمی از رسیدن به نتیجه پایدار است.
            </p>
          </div>
        </section>

        {/* Clinical Environment section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-8">
          <div className="space-y-5">
            <h3 className="text-xl sm:text-2xl font-black text-white">تجهیزات و محیط کلینیک حرکتی</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              توانبخشی نوین نیازمند ابزار اندازه‌شناسی دقیق است. در کلینیک تهران، ما از صفحات مدرن تعادل، گام‌سنج‌های بیومکانیک و وسایل مخصوص تقویت سیستم اسکلتی-عضلانی برای نظارت دقیق بر درمان بهره می‌بریم.
            </p>
            <div className="space-y-3 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>کلینیک مرزداران، خیابان البرز، مجتمع درمانی پارس</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>نظارت همه‌جانبه آنلاین در دوران سفرهای ورزشی قهرمانان</span>
              </div>
            </div>
          </div>
          <div className="relative rounded-[2rem] overflow-hidden border border-zinc-800 h-[220px] sm:h-[280px]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyUyloIR66gPkvC2vxE8q5WXlFXixNrzUQuQkF2e5ObkCiSTUFf5UY-0f59wQ3JHlLHe_bmbAq_FlWlSldQ56FSzH9pMTjIPY7WVdD2Z10_tjT_5kRo0KjltU55EPa1Fswtgj1NTFBOIvN8X12KQcgidkz92wuQ6tltlbqXokdsByjvPKVo4LlVzfY_2MyuCKQwflVPfZvQ3Pj_hflT-GoojDqfT51oOiW_lZTPD_bc0iFaSyWHJqh4DINJ_e-Mz79RMMKrTRF3DU"
              alt="Tehran Clinical Center"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent" />
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-12 border-t border-zinc-900 text-[11px] text-zinc-500 space-y-2">
          <p>© {new Date().getFullYear()} درمان درست — کلینیک بازتوانی و بازسازی حرکتی امیر حبیبی. کلیه حقوق محفوظ است.</p>
          <p className="font-mono">DR. AMIR HABIBI SPORTS PATHOLOGY LAB • TOKYO / TEHRAN PREPARATION STANDARD</p>
        </footer>
      </div>
    </div>
  );
};
