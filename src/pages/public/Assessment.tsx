/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { VASlider } from "../../components/ui/VASlider";
import { PainZone, AssessmentSubmission } from "../../types";
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Calendar,
  Sparkles,
  Award,
  Zap,
  Activity,
  User,
  Heart,
  Phone,
  UploadCloud,
  X
} from "lucide-react";

interface AssessmentFormProps {
  onSubmit: (data: AssessmentSubmission) => void;
  onCancel: () => void;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<AssessmentSubmission>({
    fullName: "",
    phone: "",
    age: 26,
    sport: "",
    selectedZone: "knee",
    painIntensity: 4,
    history: "",
    goals: "",
    mediaFiles: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "نام و نام خانوادگی الزامی است";
      if (!formData.phone.trim()) {
        newErrors.phone = "تلفن همراه الزامی است";
      } else if (!/^[0-9+-\s]{9,15}$/.test(formData.phone.trim())) {
        newErrors.phone = "شماره تلفن همراه معتبر نیست";
      }
      if (!formData.sport.trim()) newErrors.sport = "رشته ورزشی الزامی است";
    }
    if (step === 3) {
      if (!formData.goals.trim()) newErrors.goals = "اهداف حرکتی و ورزشی شما الزامی است";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("fullName", formData.fullName);
      payload.append("phone", formData.phone);
      payload.append("age", formData.age.toString());
      payload.append("sport", formData.sport);
      payload.append("selectedZone", formData.selectedZone);
      payload.append("painIntensity", formData.painIntensity.toString());
      payload.append("history", formData.history);
      payload.append("goals", formData.goals);

      if (formData.mediaFiles) {
        formData.mediaFiles.forEach((file) => {
          payload.append("mediaFiles", file);
        });
      }

      const res = await fetch("http://localhost:5000/api/assessments", {
        method: "POST",
        body: payload,
      });

      if (!res.ok) {
        throw new Error("Failed to submit assessment");
      }

      const result = await res.json();

      // Still call onSubmit to sync with global store if needed
      // Note: we can remove it if we fully rely on DB now,
      // but for UI consistency (showing success alert in App.tsx), we keep it.
      onSubmit(formData);

    } catch (err) {
      console.error(err);
      setErrors({ submit: "ارسال فرم با خطا مواجه شد. لطفاً دوباره تلاش کنید." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        mediaFiles: [...(prev.mediaFiles || []), ...newFiles]
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFormData(prev => ({
        ...prev,
        mediaFiles: [...(prev.mediaFiles || []), ...newFiles]
      }));
      e.dataTransfer.clearData();
    }
  };

  const removeFile = (idxToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      mediaFiles: (prev.mediaFiles || []).filter((_, idx) => idx !== idxToRemove)
    }));
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 relative text-right" id="assessment-form-root">
      {/* Background glow */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="mb-8 space-y-3">
        <button
          onClick={onCancel}
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-all self-start ml-auto cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
          بازگشت به صفحه اصلی
        </button>
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white">درخواست ارزیابی عملکردی و حرکتی</h2>
          <p className="text-xs text-zinc-400">
            لطفاً اطلاعات زیر را با دقت تکمیل کنید تا مبنای طراحی پرونده پزشکی شما در کلینیک دکتر حبیبی قرار گیرد.
          </p>
        </div>
      </div>

      {/* Progress indicators */}
      <div className="flex items-center justify-between mb-8" id="step-indicators">
        {[
          { step: 1, label: "اطلاعات پایه" },
          { step: 2, label: "پایش درد VAS" },
          { step: 3, label: "تاریخچه و اهداف" },
        ].map((item, idx) => {
          const isActive = currentStep === item.step;
          const isCompleted = currentStep > item.step;
          return (
            <React.Fragment key={item.step}>
              <div className="flex flex-col items-center space-y-1.5 relative z-10">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-emerald-500 text-zinc-950 ring-4 ring-emerald-500/25"
                      : isCompleted
                      ? "bg-zinc-800 text-emerald-400 border border-emerald-500/40"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-500"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : item.step}
                </div>
                <span className={`text-[11px] font-medium ${isActive ? "text-white" : isCompleted ? "text-emerald-400" : "text-zinc-500"}`}>
                  {item.label}
                </span>
              </div>
              {idx < 2 && (
                <div className={`flex-1 h-0.5 mx-2 ${currentStep > idx + 1 ? "bg-emerald-500/60" : "bg-zinc-800"}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-[2rem] bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl space-y-6">
        
        {/* STEP 1: Basic Bio */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fadeIn" id="step-1-fields">
            <h3 className="text-sm font-semibold text-zinc-300 border-r-2 border-emerald-500 pr-2">۱. بیوگرافی و مشخصات ورزشی</h3>

            <div className="space-y-1.5 text-right">
              <label className="text-xs text-zinc-400 font-medium">نام و نام خانوادگی بیمار</label>
              <div className="relative">
                <input
                  id="assessment-input-name"
                  type="text"
                  placeholder="مثال: رضا محمدی"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-all text-right pr-9"
                />
                <User className="w-4 h-4 text-zinc-500 absolute top-3.5 right-3" />
              </div>
              {errors.fullName && <p className="text-[10px] text-red-400 mt-1">{errors.fullName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium">سن (سال)</label>
                <div className="relative">
                  <input
                    id="assessment-input-age"
                    type="number"
                    min="10"
                    max="100"
                    placeholder="26"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 26 })}
                    className="w-full p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 transition-all text-right"
                  />
                  <Calendar className="w-4 h-4 text-zinc-500 absolute top-3.5 left-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium">رشته ورزشی اصلی</label>
                <div className="relative">
                  <input
                    id="assessment-input-sport"
                    type="text"
                    placeholder="مثال: فوتسال، ژیمناستیک"
                    value={formData.sport}
                    onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                    className="w-full p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-all text-right pr-9"
                  />
                  <Activity className="w-4 h-4 text-zinc-500 absolute top-3.5 right-3 pointer-events-none" />
                </div>
                {errors.sport && <p className="text-[10px] text-red-400 mt-1">{errors.sport}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">شماره تماس (پرتال و ثبت پرونده)</label>
              <div className="relative">
                <input
                  id="assessment-input-phone"
                  type="tel"
                  placeholder="مثال: 09123456789"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-all text-right pr-9 font-mono"
                />
                <Phone className="w-4 h-4 text-zinc-500 absolute top-3.5 right-3 pointer-events-none" />
              </div>
              {errors.phone && <p className="text-[10px] text-red-400 mt-1">{errors.phone}</p>}
            </div>
          </div>
        )}

        {/* STEP 2: Pain assessment details */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fadeIn" id="step-2-fields">
            <h3 className="text-sm font-semibold text-zinc-300 border-r-2 border-emerald-500 pr-2">۲. ارزیابی ناحیه و شاخص درد (Visual Analog Scale)</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              با استفاده از ابزار زیر، محل تقریبی آسیب و شدت حدودی درد را در حین انجام الگوهای حرکتی مشخص نمایید.
            </p>
            <VASlider
              intensity={formData.painIntensity}
              onChange={(value) => setFormData({ ...formData, painIntensity: value })}
              selectedZone={formData.selectedZone}
              onZoneChange={(zone) => setFormData({ ...formData, selectedZone: zone })}
              showZoneSelector={true}
            />
          </div>
        )}

        {/* STEP 3: Medical History & Goals */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fadeIn" id="step-3-fields">
            <h3 className="text-sm font-semibold text-zinc-300 border-r-2 border-emerald-500 pr-2">۳. تاریخچه بالینی و هدف توانبخشی</h3>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">شرح سابقه مصدومیت یا علائم احساسی شما</label>
              <textarea
                id="assessment-input-history"
                placeholder="توضیحاتی مانند طول زمان درد، درمان‌های ناموفق قبلی یا اگر تصویر MRI گرفتید بنویسید..."
                value={formData.history}
                onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                rows={4}
                className="w-full p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-all text-right leading-relaxed resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">برگشت به چه عملکرد یا هدف ورزشی مد نظرتان است؟</label>
              <textarea
                id="assessment-input-goals"
                placeholder="مثال: بتوانم بدون درد وزنه اسکوات بزنم، یا به تمرینات رینگ بوکس و دوی ماراتن برگردم..."
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                rows={3}
                className="w-full p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-all text-right leading-relaxed resize-none"
              />
              {errors.goals && <p className="text-[10px] text-red-400 mt-1">{errors.goals}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium">آپلود مدارک (MRI، ویدیوی حرکت، تصاویر)</label>
              <div
                className="border-2 border-dashed border-zinc-700/50 hover:border-emerald-500/50 rounded-xl p-6 text-center cursor-pointer transition-colors bg-zinc-950/30 relative"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
                <UploadCloud className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                <p className="text-xs text-zinc-400">برای انتخاب فایل‌ها کلیک کنید یا اینجا رها کنید</p>
              </div>

              {formData.mediaFiles && formData.mediaFiles.length > 0 && (
                <div className="flex flex-col gap-2 mt-3">
                  {formData.mediaFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                      <span className="text-[11px] text-zinc-300 truncate max-w-[80%]">{f.name}</span>
                      <button type="button" onClick={() => removeFile(i)} className="text-zinc-500 hover:text-red-400 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-2.5 text-right">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                با ارسال نهایی، الگوریتم کلینیکال و هوش مصنوعی ما به همراه پنل پزشکی دکتر حبیبی، برآوردی از آسیب‌پذیری مفاصل شما ایجاد کرده و نسخه توانبخشی دیجیتال اولیه شما را فعال می‌کند.
              </p>
            </div>
          </div>
        )}

        {/* Buttons / Controls footer */}
        <div className="flex justify-between items-center pt-4 border-t border-zinc-800/60" id="form-controls">
          {currentStep > 1 ? (
            <button
              id="assessment-prev-step-btn"
              type="button"
              onClick={handlePrev}
              className="py-2.5 px-4 rounded-xl border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 shrink-0" />
              مرحله قبل
            </button>
          ) : (
            <button
              id="assessment-cancel-btn"
              type="button"
              onClick={onCancel}
              className="py-2.5 px-4 rounded-xl border border-transparent text-zinc-500 hover:text-zinc-300 transition-all text-xs cursor-pointer"
            >
              انصراف
            </button>
          )}

          {currentStep < 3 ? (
            <button
              id="assessment-next-step-btn"
              type="button"
              onClick={handleNext}
              className="py-2.5 px-5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              مرحله بعد
              <ChevronLeft className="w-4 h-4 shrink-0" />
            </button>
          ) : (
            <button
              id="assessment-final-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className={`py-2.5 px-6 rounded-xl font-black transition-all text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.2)] cursor-pointer ${
                isSubmitting
                  ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950'
              }`}
            >
              {isSubmitting ? 'در حال ارسال...' : 'تایید و ثبت پرونده نهایی'}
            </button>
          )}
        </div>

        {errors.submit && (
          <p className="text-xs text-red-400 text-center mt-2">{errors.submit}</p>
        )}

      </form>
    </div>
  );
};
