import React from 'react';
import { Quote, MapPin, Compass } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
      {/* Dr. Habibi Profile Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            دکتری تخصصی آسیب‌شناسی ورزشی
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            دکتر امیر حبیبی
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed text-justify">
            دکتر امیر حبیبی، متخصص آسیب‌شناسی ورزشی و حرکات اصلاحی، با سال‌ها تجربه در زمینه توانبخشی ورزشکاران حرفه‌ای و تیم‌های ملی، رویکردی نوین و مبتنی بر شواهد علمی را در درمان آسیب‌های ورزشی ارائه می‌دهد. تمرکز اصلی ایشان بر روی بازگشت ایمن و قدرتمند ورزشکاران به میادین رقابت و پیشگیری از بروز مجدد آسیب‌هاست.
          </p>
          <div className="space-y-4 pt-4 border-t border-zinc-800/60">
            <div className="space-y-2 text-right relative">
              <Quote className="absolute left-0 top-0 w-8 h-8 text-zinc-800/60 -z-10" />
              <p className="text-sm text-zinc-300 italic leading-relaxed">
                "درمان درست صرفاً تسکین درد نیست، بلکه بازنشانی کدهای عصبی عضلانی بدن و تبدیل آسیب به منبعی از آگاهی عضلانی است. ورزشکاری که خوب هدایت شود، پس از مصدومیت قوی‌تر از قبل به زمین بازمی‌گردد."
              </p>
              <h5 className="text-xs font-bold text-emerald-400">— دکتر امیر حبیبی</h5>
            </div>
          </div>
        </div>
        <div className="relative rounded-[2.5rem] overflow-hidden border border-zinc-800 shadow-2xl aspect-[4/5] sm:aspect-auto sm:h-[500px]">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLy_bGmWJwuJOH61GdlkzYy5wJQ4XN6AW1y7E6GsdMyCUXpO76k28PDnFUwWN3Uq1CdvGKi2NigxCOYL9ZsqqwDGyzn5luHngCcOsm--qSEPFtwPZMtOx3Y2hsGm2nCfnSdC3rdQ9Y7_VUvZRQw_qcoAP__BUSlbUPpYNPJyWfKvQXargZqC3fVqew8apYy2Hl_8OvpS1AD4WuhGbg177zd3ft-lC5Nkem7TQ-kclhwicnlxWquKvGOKJcpAssR15OP3ZoJ5WpynQ"
            alt="Amir Habibi Coach"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        </div>
      </section>

      {/* Clinical Environment Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative rounded-[2.5rem] overflow-hidden border border-zinc-800 aspect-[16/9] sm:h-[400px] order-2 md:order-1">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyUyloIR66gPkvC2vxE8q5WXlFXixNrzUQuQkF2e5ObkCiSTUFf5UY-0f59wQ3JHlLHe_bmbAq_FlWlSldQ56FSzH9pMTjIPY7WVdD2Z10_tjT_5kRo0KjltU55EPa1Fswtgj1NTFBOIvN8X12KQcgidkz92wuQ6tltlbqXokdsByjvPKVo4LlVzfY_2MyuCKQwflVPfZvQ3Pj_hflT-GoojDqfT51oOiW_lZTPD_bc0iFaSyWHJqh4DINJ_e-Mz79RMMKrTRF3DU"
            alt="Tehran Clinical Center"
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent" />
        </div>
        <div className="space-y-6 order-1 md:order-2">
          <h3 className="text-2xl sm:text-3xl font-black text-white">تجهیزات و محیط کلینیک حرکتی</h3>
          <p className="text-sm text-zinc-400 leading-relaxed text-justify">
            توانبخشی نوین نیازمند ابزار اندازه‌شناسی دقیق است. در کلینیک تهران، ما از صفحات مدرن تعادل، گام‌سنج‌های بیومکانیک و وسایل مخصوص تقویت سیستم اسکلتی-عضلانی برای نظارت دقیق بر درمان بهره می‌بریم. هدف ما فراهم کردن محیطی آرام، حرفه‌ای و مجهز برای تسریع روند بهبودی شماست.
          </p>
          <div className="space-y-4 text-sm text-zinc-300">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-emerald-400" />
              </div>
              <span>کلینیک مرزداران، خیابان البرز، مجتمع درمانی پارس</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
              <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5 text-teal-400" />
              </div>
              <span>نظارت همه‌جانبه آنلاین در دوران سفرهای ورزشی قهرمانان</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
