import React from 'react';
import { AparatEmbed } from '../../components/ui/AparatEmbed';
import { Calendar, Clock, Users } from 'lucide-react';

const MOCK_WEBINARS = [
  {
    id: '1',
    title: 'اصول بازتوانی زانو پس از جراحی منیسک',
    videoId: 'c50117b43a6d47b0a73d32d0f074ed2225330364', // Dummy hash for visual, Aparat uses hashes
    date: '۱۵ اسفند ۱۴۰۲',
    duration: '۹۰ دقیقه',
    status: 'recorded' as const,
    description: 'در این وبینار به بررسی پروتکل‌های جدید بازتوانی و تمرینات ایزومتریک ایمن برای ماه‌های اول پس از جراحی منیسک می‌پردازیم.'
  },
  {
    id: '2',
    title: 'وبینار لایو: مدیریت دردهای مزمن شانه در ورزشکاران پرتابی',
    videoId: 'none',
    date: '۲۰ اردیبهشت ۱۴۰۳',
    duration: '۱۲۰ دقیقه',
    status: 'upcoming' as const,
    description: 'بررسی بیومکانیک مفصل شانه و ارائه راهکارهای عملی برای پیشگیری از سندرم گیرافتادگی (Impingement Syndrome).'
  }
];

export const Webinars: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="space-y-4">
        <h2 className="text-3xl sm:text-4xl font-black text-white">وبینارها و رویدادهای آموزشی</h2>
        <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
          دسترسی به آرشیو وبینارهای تخصصی گذشته و ثبت‌نام در رویدادهای آنلاین پیش‌رو. یادگیری مستمر، کلید درمان موثر است.
        </p>
      </div>

      <div className="space-y-12">
        {MOCK_WEBINARS.map((webinar) => (
          <div key={webinar.id} className="bg-zinc-900/40 border border-zinc-800/60 rounded-[2rem] overflow-hidden flex flex-col md:flex-row gap-0 md:gap-8">
            {/* Media Section */}
            <div className="w-full md:w-5/12 shrink-0 bg-zinc-950 p-4 md:p-6 border-b md:border-b-0 md:border-l border-zinc-800/60 flex items-center justify-center">
              {webinar.status === 'recorded' ? (
                <AparatEmbed videoId={webinar.videoId} title={webinar.title} className="w-full shadow-lg" />
              ) : (
                <div className="w-full aspect-video rounded-2xl bg-zinc-900 border border-zinc-800/80 border-dashed flex flex-col items-center justify-center space-y-4 p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-white font-bold text-sm">وبینار آنلاین پیش‌رو</h5>
                    <p className="text-xs text-zinc-500">لینک ورود یک ساعت قبل از شروع پیامک می‌شود.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-8 flex flex-col justify-center space-y-6 flex-grow">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  webinar.status === 'recorded' ? 'bg-zinc-800 text-zinc-300' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {webinar.status === 'recorded' ? 'نسخه ضبط شده' : 'ثبت‌نام باز است'}
                </span>
                <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{webinar.date}</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{webinar.duration}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  {webinar.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed text-justify">
                  {webinar.description}
                </p>
              </div>

              <div className="pt-2">
                {webinar.status === 'recorded' ? (
                  <button className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors text-xs font-bold">
                    مشاهده جزئیات بیشتر
                  </button>
                ) : (
                  <button className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-colors text-xs font-black shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    ثبت‌نام در وبینار
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
