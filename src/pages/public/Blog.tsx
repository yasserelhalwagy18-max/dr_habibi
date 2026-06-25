import React from 'react';
import { ChevronLeft, Calendar } from 'lucide-react';

const MOCK_BLOG_POSTS = [
  {
    id: '1',
    title: 'نقش تغذیه در ریکاوری پس از جراحی رباط صلیبی (ACL)',
    excerpt: 'تغذیه مناسب می‌تواند سرعت ترمیم بافت‌های آسیب‌دیده را تا ۳۰ درصد افزایش دهد. در این مقاله به بررسی مکمل‌ها و مواد غذایی ضروری می‌پردازیم.',
    date: '۲۴ مهر ۱۴۰۲',
    category: 'تغذیه ورزشی'
  },
  {
    id: '2',
    title: 'چگونه از بازگشت درد کمر پیشگیری کنیم؟',
    excerpt: 'درد کمر یکی از شایع‌ترین مشکلات ورزشکاران است. با اصلاح الگوهای حرکتی و تقویت عضلات مرکزی (Core)، می‌توان از عود مجدد آن جلوگیری کرد.',
    date: '۱۲ آبان ۱۴۰۲',
    category: 'پیشگیری از آسیب'
  },
  {
    id: '3',
    title: 'اهمیت خواب عمیق در بازسازی عصبی-عضلانی',
    excerpt: 'در طول خواب عمیق، بدن هورمون رشد ترشح می‌کند که برای ترمیم ریزآسیب‌های عضلانی پس از تمرینات سنگین حیاتی است.',
    date: '۵ آذر ۱۴۰۲',
    category: 'ریکاوری'
  },
  {
    id: '4',
    title: 'تفاوت دردهای عضلانی طبیعی (DOMS) با دردهای آسیب‌دیدگی',
    excerpt: 'بسیاری از ورزشکاران مرز بین درد ناشی از پیشرفت تمرین و درد ناشی از آسیب را نمی‌شناسند. یادگیری این تفاوت کلید سلامت طولانی‌مدت است.',
    date: '۲۰ دی ۱۴۰۲',
    category: 'دانش تمرین'
  }
];

export const Blog: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="space-y-4">
        <h2 className="text-3xl sm:text-4xl font-black text-white">مقالات و دانش‌نامه</h2>
        <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
          جدیدترین مقالات علمی در زمینه آسیب‌شناسی ورزشی، ریکاوری و بهینه‌سازی عملکرد فیزیکی.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {MOCK_BLOG_POSTS.map((post) => (
          <article key={post.id} className="group p-8 rounded-[2rem] bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-zinc-800/80 text-zinc-400 rounded-full text-[10px] font-semibold">
                  {post.category}
                </span>
                <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{post.date}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug">
                {post.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed text-justify">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-800/60">
              <button className="inline-flex items-center gap-2 text-xs font-bold text-zinc-300 group-hover:text-emerald-400 transition-colors">
                <span>مطالعه کامل</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
