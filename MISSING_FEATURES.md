# ویژگی‌های مفقود شده و نیازمندی‌های توسعه (علاج‌گر)

با بررسی کد فعلی (که در حال حاضر با نام "درمان درست" و با یک قالب تاریک طراحی شده است) و مقایسه آن با نیازمندی‌های کامل اپلیکیشن "علاج‌گر"، موارد زیر در کد فعلی وجود ندارند و باید توسعه داده شوند:

## ۱. ثبت‌نام و پروفایل کاربری (مراحل ۱ و ۲)
* **احراز هویت واقعی:** ورود با شماره موبایل و دریافت کد تایید (OTP) وجود ندارد. در حال حاضر فقط یک شبیه‌ساز تغییر نقش وجود دارد.
* **تکمیل اطلاعات پروفایل:** دریافت اطلاعات کامل مانند جنسیت، قد، وزن، سطح فعالیت، شغل، بیماری‌های زمینه‌ای و داروهای مصرفی پیاده‌سازی نشده است.

## ۲. ثبت محل درد و پرسشنامه هوشمند (مراحل ۳ و ۴)
* **مدل تعاملی بدن:** عدم وجود مدل بدن انسان (نمای جلو و پشت) برای کلیک روی نواحی درد و انتخاب همزمان چند ناحیه.
* **جزئیات درد:** امکان تعیین نوع درد (تیر کشنده، سوزشی، مبهم، گرفتگی، التهاب) وجود ندارد.
* **پرسشنامه جامع:** سوالات مربوط به سابقه آسیب، سابقه جراحی، کیفیت خواب، میزان استرس، ساعات نشستن و دفعات ورزش وجود ندارد.

## ۳. تحلیل، ارزیابی و برنامه تمرینی (مراحل ۵ و ۶)
* **سیستم تحلیل هوشمند:** هشدارهای پزشکی و تحلیل دقیق بر اساس نواحی آسیب‌پذیر نمایش داده نمی‌شود.
* **محتوای چندرسانه‌ای تمرینات:** تصاویر یا ویدئوهای آموزشی برای تمرینات پیاده‌سازی نشده‌اند.
* **دسته‌بندی تمرینات:** دسته‌بندی‌هایی مانند آب‌درمانی و تمرینات کششی/تقویتی مشخص نیستند.

## ۴. تغذیه، کالری‌شمار و آب مصرفی (مراحل ۷، ۸ و ۹)
* **برنامه غذایی و رژیم:** هیچ سیستمی برای دریافت هدف (کاهش/افزایش وزن)، محاسبه درشت‌مغذی‌ها و پیشنهاد وعده‌های غذایی وجود ندارد.
* **کالری‌شمار:** امکان جستجو و ثبت غذاها و مشاهده کالری دریافتی روزانه وجود ندارد.
* **آب مصرفی:** سیستم ثبت آب مصرفی، محاسبه نیاز روزانه و یادآوری‌ها پیاده‌سازی نشده است.

## ۵. داشبورد، گزارش پیشرفت و امتیاز سلامت (مراحل ۱۰، ۱۱ و پیشنهاد ویژه)
* **داشبورد جامع:** داشبورد فعلی اطلاعاتی نظیر BMI، کالری، آب مصرفی و امتیاز سلامت را نمایش نمی‌دهد.
* **امتیاز سلامت (Health Score):** الگوریتم محاسبه امتیاز ۰ تا ۱۰۰ بر اساس فاکتورهای سلامتی و نمایش آن پیاده‌سازی نشده است.
* **گزارش پیشرفت (نمودارها):** نمودارهای حرفه‌ای برای پایش وزن، BMI، میزان خواب و مصرف آب وجود ندارند.

## ۶. آموزش و معرفی مجموعه‌ها (مرحله ۱۲ و پیشنهاد ویژه)
* **بخش آموزش:** هیچ محتوایی برای آب‌درمانی، تغذیه، اصلاح وضعیت بدن و سبک زندگی سالم وجود ندارد.
* **مجموعه‌های ورزشی:** بخش معرفی مجموعه‌های ورزشی و ارائه کدهای تخفیف به کاربران پیاده‌سازی نشده است.

## ۷. طراحی رابط کاربری (UI)
* **تغییر تم (Theme):** تم فعلی اپلیکیشن تاریک (Dark Mode) با رنگ‌های خاکستری و سبز است، در حالی که در نیازمندی‌ها "طراحی مدرن، مینیمال، رنگ اصلی آبی و رنگ مکمل سفید" درخواست شده است.

---

# Prompts for Future Development

Below are the carefully divided prompts in English. You can provide these to me one by one in future tasks to implement the missing features systematically without hallucination or overloading a single task.

### Prompt 1: Authentication and Extended User Profile
> "We are building the 'Alajgar' (علاج‌گر) application. Start by implementing the authentication and user profile completion. Create a login screen that simulates phone number and OTP verification. Then, build a complete user profile form that collects: First and Last Name, Age, Gender, Height, Weight, Activity Level, Job, Underlying Diseases, and Current Medications. Update the global state (`store.ts`) and types to save and manage this data."

### Prompt 2: Interactive Body Model and Smart Questionnaire
> "Next, enhance the pain assessment step. Implement an interactive UI representing the human body (front and back views) where users can click to select multiple pain zones. Allow them to set pain intensity (1-10) and choose the pain type (shooting, burning, dull, muscle cramp, inflammation). Following that, implement the 'Smart Questionnaire' step asking about pain duration, rest vs. activity effects, injury history, surgery history, sleep quality, stress level, sitting hours, and weekly exercise frequency. Update the data models and UI forms accordingly."

### Prompt 3: Diet, Calorie Counter, and Water Tracking
> "Implement the nutrition and hydration features. Create a new section in the app for Diet and Calorie Counting. Allow users to set a goal (weight loss, gain, maintain) and calculate their daily required calories, protein, fat, and carbs based on their profile. Include a feature to search and log food items for daily calorie tracking. Additionally, add a 'Water Tracker' feature to log daily water intake, calculate daily needs, and show daily progress. Add all necessary state management."

### Prompt 4: Health Score, Dashboard Redesign, and Charts
> "Redesign the main Patient Dashboard. Calculate and display a 'Health Score' (0-100) based on weight, BMI, sleep, physical activity, water intake, nutrition, and pain intensity. The dashboard should display BMI, current weight, daily calories, water intake, today's exercises, pain status, and the new Health Score. Also, add a 'Progress Report' section containing professional charts (e.g., using Recharts) to track weight, BMI, pain, physical activity, calories, and water over time."

### Prompt 5: Exercise Program Enhancements & Educational Content
> "Improve the Custom Exercise Program and add an Education section. For the exercises, add support for images/videos, specify the number of sets, reps, duration, and detailed descriptions. Categorize exercises into Stretching, Corrective, Strengthening, and Hydrotherapy. Based on the user's selected pain zones and questionnaire, simulate a 'Smart Analysis' that provides medical warnings and vulnerable zones. Finally, build an 'Education' tab containing articles/content on hydrotherapy, nutrition, posture correction, joint health, and healthy lifestyle."

### Prompt 6: Gym Discounts and UI Theme Overhaul
> "Implement the 'Sports Complexes & Discounts' feature, allowing users to browse partnered gyms and get discount codes. Finally, completely overhaul the application's UI/UX to match a 'modern and minimal' design suitable for international health apps. Change the primary color palette to Blue and the complementary color to White (Light Mode instead of the current Dark Mode), ensuring all charts and components look professional and clean."
