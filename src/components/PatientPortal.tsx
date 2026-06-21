/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { format, subDays, addDays, isSameDay } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ClientRecord, PatientExercise } from "../types";
import { 
  Heart, 
  Activity, 
  TrendingDown, 
  Calendar, 
  CheckCircle, 
  MessageSquare, 
  Play, 
  Award,
  Clock,
  ExternalLink,
  PlusCircle,
  HelpCircle,
  Sparkles,
  Download,
  Trophy
} from "lucide-react";

interface PatientPortalProps {
  patientRecord: ClientRecord;
  onUpdatePainHistory: (newPain: number, zoneNotes?: string) => void;
  onToggleExercise: (exerciseId: string) => void;
  onSendFeedback: (message: string) => void;
  onAddCheckIn: (mood: number, sleep: number) => void;
  feedbacks: { sender: "patient" | "coach"; text: string; date: string }[];
}

export const PatientPortal: React.FC<PatientPortalProps> = ({
  patientRecord,
  onUpdatePainHistory,
  onToggleExercise,
  onSendFeedback,
  onAddCheckIn,
  feedbacks,
}) => {
  const [newPainVal, setNewPainVal] = useState<number>(4);
  const [painNotes, setPainNotes] = useState<string>("");
  const [feedbackInput, setFeedbackInput] = useState<string>("");
  const [playingExercise, setPlayingExercise] = useState<PatientExercise | null>(null);
  
  // Daily check-in state
  const [checkInMood, setCheckInMood] = useState<number>(3);
  const [checkInSleep, setCheckInSleep] = useState<number>(3);
  const [hoveredExerciseId, setHoveredExerciseId] = useState<string | null>(null);

  const painHistory = patientRecord.painHistory || [];

  const handleUpdatePain = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePainHistory(newPainVal, painNotes);
    setPainNotes("");
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackInput.trim()) {
      onSendFeedback(feedbackInput);
      setFeedbackInput("");
    }
  };

  const getZoneLabelPer = (zone: string) => {
    switch (zone) {
      case "shoulder": return "شانه / روتاتور کاف";
      case "knee": return "زانو / رباط‌ها";
      case "lower_back": return "کمر / دیسک کمر";
      case "ankle": return "مچ پا / آشیل";
      case "neck": return "گردن";
      case "elbow": return "آرنج / تاندونیت";
      default: return "لگن و باسن";
    }
  };

  const handleDownloadReport = async () => {
    const element = document.getElementById("patient-portal-root");
    if (!element) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      
      const canvas = await html2canvas(element, { scale: 1.5, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`rehab-report-${patientRecord.id}.pdf`);
    } catch (err) {
      console.error(err);
      window.print();
    }
  };

  const totalProgress = patientRecord.prescription.reduce((acc, ex) => acc + (ex.progress || 0), 0);
  const overallRecoveryScore = patientRecord.prescription.length > 0 
    ? Math.round(totalProgress / patientRecord.prescription.length) 
    : 0;

  return (
    <div className="space-y-8 text-right max-w-5xl mx-auto px-4" id="patient-portal-root">
      
      {/* Top Welcome Panel */}
      <section className="p-6 sm:p-8 rounded-[2.5rem] bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800/80 relative overflow-hidden" id="patient-welcome-banner">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
        
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-black text-white">پرونده حرکتی و درمانی دیجیتال</h2>
            </div>
            <p className="text-sm text-zinc-300 font-bold">بیمار: {patientRecord.fullName || patientRecord.name}</p>
            <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
              <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800">سن: {patientRecord.age} سال</span>
              <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800">رشته: {patientRecord.sport}</span>
              <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-emerald-400 font-semibold">ناحیه اول: {getZoneLabelPer(patientRecord.selectedZone || patientRecord.injuryZone)}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            
            {/* Overall Recovery Score Gauge */}
            <div className="flex items-center gap-4 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 shadow-xl shadow-emerald-500/5">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-14 h-14 -rotate-90 absolute">
                  <circle cx="28" cy="28" r="24" stroke="#27272a" strokeWidth="6" fill="none" />
                  <motion.circle 
                    cx="28" 
                    cy="28" 
                    r="24" 
                    stroke="#34d399" 
                    strokeWidth="6" 
                    fill="none" 
                    strokeDasharray="150.8" 
                    initial={{ strokeDashoffset: 150.8 }}
                    animate={{ strokeDashoffset: 150.8 - (overallRecoveryScore / 100) * 150.8 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-sm font-black text-white leading-none">{overallRecoveryScore}%</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block font-medium">امتیاز کلی ریکاوری</span>
                <span className="text-xs text-emerald-400 font-bold">روند مثبت</span>
              </div>
            </div>

            {/* Session progress ring representation */}
            <div className="flex items-center gap-4 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4">
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block font-medium">جلسات ریکاوری انجام‌شده</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white">{patientRecord.sessionsCompleted}</span>
                  <span className="text-xs text-zinc-500">از</span>
                  <span className="text-sm font-bold text-zinc-400">{patientRecord.sessionsPurchased} جلسه</span>
                </div>
              </div>
            </div>

            {/* Download Report Action */}
            <button
              onClick={handleDownloadReport}
              className="hidden lg:flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-500 text-zinc-200 px-4 py-2 rounded-xl transition-all font-semibold text-xs cursor-pointer print:hidden"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>دانلود گزارش درمان</span>
            </button>
          </div>
        </div>
      </section>

      {/* Grid: Charts & Pain updater */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SVG Tracker Chart block */}
        <div className="lg:col-span-7 p-6 rounded-[2rem] bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between space-y-6" id="patient-trend-card">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingDown className="w-4.5 h-4.5 text-emerald-400" />
                روند تغییر هشدارهای عصبی درمان (VAS Score Trend)
              </h3>
              <p className="text-[10px] text-zinc-400">نمودار زمانی پایش شدت درد مفصل انتخاب شده در حرکت</p>
            </div>
            <div className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 text-xs px-2.5 py-1 rounded-full font-medium">
              بهبود تدریجی
            </div>
          </div>

          {/* Render Recharts Component */}
          <div className="bg-zinc-950/70 p-4 rounded-xl border border-zinc-800/40 relative h-[250px] w-full flex items-center justify-center" dir="ltr">
            {painHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={painHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="date" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} domain={[0, 10]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5', fontSize: '12px' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Area type="monotone" dataKey="intensity" stroke="#10b981" fillOpacity={1} fill="url(#colorIntensity)" strokeWidth={2} activeDot={{ r: 6, fill: '#10b981', stroke: '#09090b', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-zinc-500">داده‌ای ثبت نشده است.</span>
            )}
            
            {/* Legend marker info */}
            <div className="absolute bottom-2 right-4 flex items-center gap-1 z-10">
              <span className="w-2 h-2 rounded-full bg-emerald-500 block" />
              <span className="text-[9px] text-zinc-400">خط وضعیت عصبی (VAS)</span>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 leading-relaxed bg-zinc-950/20 p-3 rounded-lg border border-zinc-800/30">
            <strong>تفسیر کلینیکال:</strong> شیب رو به پایین نشان‌دهنده رکاوری موفقیت‌آمیز سلول‌های بافت آسیب‌دیده و بازسازی دامنه حرکتی ایمن است. لطفاً پایش‌های روزانه را جدی بگیرید.
          </p>
        </div>

        {/* Daily Pain Index Logging Form */}
        <div className="lg:col-span-5 p-6 rounded-[2rem] bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between space-y-4" id="patient-logger-card">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
              پست الکترونیک پایش درد روزانه
            </h3>
            <p className="text-[10px] text-zinc-400">شدت درد امروز خود را مستقیماً برای ارزیابی دکتر ثبت کنید.</p>
          </div>

          <form onSubmit={handleUpdatePain} className="space-y-4 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400 font-medium">امتیاز درد امروز: {newPainVal}/۱۰</span>
                <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 text-[10px] font-bold">
                  {newPainVal === 0 ? "عالی / بدون درد" : newPainVal <= 3 ? "آرام" : newPainVal <= 6 ? "متوسط" : "درد حاد"}
                </span>
              </div>
              
              <input
                id="patient-logger-pain-range"
                type="range"
                min="0"
                max="10"
                step="1"
                value={newPainVal}
                onChange={(e) => setNewPainVal(parseInt(e.target.value))}
                className="w-full h-1.5 rounded bg-zinc-800 appearance-none accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium block">توضیح جزئی (مثلاً: حین وزنه اسکوات یا صبح پس از بیدار شدن)</label>
              <input
                id="patient-logger-notes"
                type="text"
                placeholder="یادداشت احساس زانو در حرکت..."
                value={painNotes}
                onChange={(e) => setPainNotes(e.target.value)}
                className="w-full p-2.5 bg-zinc-950/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-rose-500 transition-all text-right"
              />
            </div>

            <button
              id="patient-logger-submit-btn"
              type="submit"
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-white font-bold transition-all text-xs cursor-pointer"
            >
              افزودن به تاریخچه پرونده
            </button>
          </form>

          <div className="p-3 bg-zinc-950/60 border border-zinc-800/60 rounded-xl flex items-center justify-between text-xs">
            <span className="text-zinc-400">آخرین ارزیابی:</span>
            <span className="font-mono text-white text-[11px] font-semibold bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
              {painHistory.length > 0 ? `${painHistory[painHistory.length - 1].date} (امتیاز ${painHistory[painHistory.length - 1].intensity})` : "ثبت نشده"}
            </span>
          </div>
        </div>

        {/* Daily Check In Form */}
        <div className="lg:col-span-5 lg:col-start-8 p-6 rounded-[2rem] bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Heart className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
              ارزیابی روزانه (Daily Check-in)
            </h3>
            <p className="text-[10px] text-zinc-400">لطفاً حالت روحی و کیفیت خواب خود را از ۱ تا ۵ ثبت کنید.</p>
          </div>
          
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400 font-medium">حالت روحی (Mood): {checkInMood}/۵</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={checkInMood}
                onChange={(e) => setCheckInMood(parseInt(e.target.value))}
                className="w-full h-1.5 rounded bg-zinc-800 appearance-none accent-rose-500 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400 font-medium">کیفیت خواب (Sleep): {checkInSleep}/۵</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={checkInSleep}
                onChange={(e) => setCheckInSleep(parseInt(e.target.value))}
                className="w-full h-1.5 rounded bg-zinc-800 appearance-none accent-indigo-500 cursor-pointer"
              />
            </div>

            <button
              onClick={() => {
                onAddCheckIn(checkInMood, checkInSleep);
                setCheckInMood(3);
                setCheckInSleep(3);
              }}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-white font-bold transition-all text-xs cursor-pointer"
            >
              ثبت ارزیابی روزانه
            </button>
          </div>
        </div>

      </div>

      {/* Movement Prescriptions & Play Videos */}
      <section className="p-6 sm:p-8 rounded-[2rem] bg-zinc-900/40 border border-zinc-800/80 space-y-6" id="patient-workout-section">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              نسخه درمانی روزانه و تجویز حرکت در خانه
            </h3>
            <p className="text-xs text-zinc-400">تمریناتی که دکتر حبیبی برای بازسازی ثبات مفصل شانه یا زانو شما تایید کرده است.</p>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">CLIENT PROGRAM CODE: DH-590</span>
        </div>

        {/* Exercises Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4" id="patient-workout-grid">
          {patientRecord.prescription?.map((ex) => {
            return (
              <div 
                key={ex.id} 
                id={`ex-card-${ex.id}`}
                className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 relative overflow-hidden ${
                  ex.completed 
                    ? "bg-emerald-950/10 border-emerald-500/40" 
                    : "bg-zinc-900/80 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <button
                      id={`ex-toggle-check-${ex.id}`}
                      onClick={() => onToggleExercise(ex.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                        ex.completed 
                          ? "bg-emerald-500 border-emerald-500 text-zinc-950" 
                          : "border-zinc-700 hover:border-zinc-500 text-transparent"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 shrink-0" />
                    </button>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {ex.sets} ست × {ex.reps}
                      </span>
                      {ex.progress !== undefined && (
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-emerald-400 font-semibold">{ex.progress}% ریکاوری</span>
                          <div className="w-6 h-6 rounded-full border-[3px] border-zinc-800 flex items-center justify-center relative overflow-hidden">
                            <svg className="w-6 h-6 -rotate-90 absolute">
                              <circle cx="12" cy="12" r="10" stroke="#27272a" strokeWidth="4" fill="none" />
                              <circle 
                                cx="12" 
                                cy="12" 
                                r="10" 
                                stroke="#34d399" 
                                strokeWidth="4" 
                                fill="none" 
                                strokeDasharray="62.8" 
                                strokeDashoffset={62.8 - (ex.progress / 100) * 62.8} 
                                strokeLinecap="round" 
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 
                      className={`text-xs font-bold text-right cursor-help w-max inline-block relative ${ex.completed ? "line-through text-zinc-500" : "text-white"}`}
                      onMouseEnter={() => setHoveredExerciseId(ex.id)}
                      onMouseLeave={() => setHoveredExerciseId(null)}
                    >
                      {ex.name}
                      <AnimatePresence>
                        {hoveredExerciseId === ex.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-50 bottom-full right-0 mb-2 w-48 p-3 rounded-xl backdrop-blur-xl bg-zinc-900/90 border border-zinc-700/80 shadow-2xl text-[10px] font-normal leading-relaxed text-zinc-300 pointer-events-none"
                            style={{ boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)' }}
                          >
                            <span className="block text-emerald-400 font-bold mb-1">Injury Target</span>
                            {ex.description}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </h4>
                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                      {ex.description}
                    </p>
                  </div>
                </div>

                <button
                  id={`ex-watch-btn-${ex.id}`}
                  onClick={() => setPlayingExercise(ex)}
                  className="w-full py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all text-[10px] font-semibold flex items-center justify-center gap-1.5 border border-zinc-800/80 cursor-pointer"
                >
                  <Play className="w-3 h-3 text-emerald-400" />
                  آموزش تصویری حرکت
                </button>
              </div>
            );
          })}
        </div>

        {/* Inside Animated Video / Instructions Simulator overlay */}
        {playingExercise && (
          <div id="exercise-instruction-player" className="p-5 rounded-2xl bg-zinc-950 border border-emerald-500/30 animate-scaleUp">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1">
                <Play className="w-4 h-4 text-emerald-400" />
                شبیه‌سازی آموزش ویدیویی: {playingExercise.name}
              </span>
              <button 
                onClick={() => setPlayingExercise(null)} 
                className="text-xs text-zinc-500 hover:text-white cursor-pointer"
              >
                بستن راهنما
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-[180px] flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
                {/* Simulated video playback bars */}
                <div className="absolute top-2 right-2 bg-rose-500 text-[9px] text-zinc-950 font-black px-2 py-0.5 rounded-md uppercase tracking-wider z-20 animate-pulse">
                  آموزش زنده لوپ
                </div>
                
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                
                <div className="text-center z-10 p-2 bg-zinc-950/80 rounded-lg border border-zinc-700/50">
                  <span className="text-xs font-bold text-white block">پتینه انقباض هم‌انقباض ایزومتریک زانو</span>
                  <span className="text-[10px] text-zinc-500 font-mono">DH_KNEE_STABILIZATION_ANIMATION.mp4</span>
                </div>
              </div>

              <div className="space-y-3 text-right">
                <h5 className="text-xs font-bold text-emerald-400">تکنیک اصلاحی دکتر حبیبی:</h5>
                <ol className="space-y-2 text-[11px] text-zinc-300 list-decimal list-inside leading-relaxed">
                  <li>روی صندلی نشسته، تاندون چهارسر را منقبض کنید.</li>
                  <li>مچ پا را به سمت بالا (دورسی فلکشن) بکشید و ۵ ثانیه نگه دارید.</li>
                  <li>تنفس شکمی را حفظ کرده و فک را شل نگه دارید.</li>
                  <li>دردی که احساس می‌کنید نباید از آستانه ۴ در مقیاس VAS عبور کند.</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Recovery Milestones Section */}
      {patientRecord.prescription.filter((ex) => (ex.progress || 0) >= 50).length > 0 && (
        <section className="p-6 sm:p-8 rounded-[2.5rem] bg-zinc-900/60 border border-zinc-800/80 relative overflow-hidden" id="recovery-milestones">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-amber-400" />
            دستاوردهای ریکاوری
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {patientRecord.prescription
              .filter((ex) => (ex.progress || 0) >= 50)
              .map((ex, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, type: "spring" }}
                key={"milestone-" + ex.id}
                className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden gap-3 shadow-xl"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-emerald-500 opacity-50" />
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">{ex.name}</h4>
                  <p className="text-[10px] text-zinc-400">عبور از مرز {ex.progress}% بهبودی</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Rehabilitation Calendar */}
      <section className="p-6 sm:p-8 rounded-[2.5rem] bg-zinc-900/40 border border-zinc-800/80 space-y-6" id="rehab-calendar">
        <div className="space-y-1">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            تقویم ریکاوری (Rehabilitation Calendar)
          </h3>
          <p className="text-[10px] text-zinc-400">وضعیت تمرینات و ارزیابی‌های روزانه خود را در ۱۴ روز اخیر و آینده مشاهده کنید.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-4" dir="ltr">
          {Array.from({ length: 14 }).map((_, i) => {
            const d = addDays(subDays(new Date(), 7), i + 1);
            const isToday = isSameDay(d, new Date());
            
            const isPast = d < new Date() && !isToday;
            const completedInPast = isPast && Math.random() > 0.3; // simulate visually some completeness
            
            return (
              <div 
                key={i} 
                className={`min-w-[70px] h-24 flex flex-col items-center justify-between p-2 rounded-2xl border ${
                  isToday 
                    ? "bg-indigo-500/10 border-indigo-500/50 scale-105" 
                    : isPast 
                      ? "bg-zinc-900/60 border-zinc-800" 
                      : "bg-zinc-950/40 border-zinc-900 opacity-50"
                }`}
              >
                <div className="text-center">
                  <span className={`block text-xs font-bold ${isToday ? "text-indigo-400" : "text-zinc-500"}`}>
                    {format(d, 'EEE')}
                  </span>
                  <span className={`block text-lg font-black ${isToday ? "text-white" : "text-zinc-400"}`}>
                    {format(d, 'd')}
                  </span>
                </div>
                
                <div className="w-6 h-6 rounded-full flex items-center justify-center">
                  {isToday ? (
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                  ) : completedInPast ? (
                     <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : isPast ? (
                     <div className="w-1 h-1 bg-zinc-700 rounded-full" />
                  ) : (
                     <Clock className="w-3 h-3 text-zinc-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Messaging / Direct Interactions with doctor */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8" id="patient-communication-block">
        
        {/* Active Session History */}
        <div className="md:col-span-5 p-6 rounded-[2rem] bg-zinc-900/60 border border-zinc-800/80 space-y-4" id="completed-sessions-chart">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-teal-400" />
              تاریخچه جلسات بالینی انجام شده
            </h3>
            <p className="text-[10px] text-zinc-400">آخرین ارزیابی‌های حضوری در کلینیک دکتر حبیبی.</p>
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1" id="completed-sessions-list">
            {patientRecord.completedSessionsLog?.length > 0 ? (
              patientRecord.completedSessionsLog.map((log, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-right space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-teal-400">جلسه {idx + 1} توانبخشی حضور کارآمد</span>
                    <span className="text-zinc-500 font-mono">{log.date}</span>
                  </div>
                  <p className="text-[11px] text-zinc-300">
                    {log.notes}
                  </p>
                  <div className="text-[9px] text-zinc-500 flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    <span>تایید ورزش‌های کلینیک: {log.completedExercisesCount} مورد</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-zinc-600">
                هنوز اولین جلسه کلینیکال شما شروع نشده است. پس از ارزیابی اولیه، اولین جلسه تجویز می‌شود.
              </div>
            )}
          </div>
        </div>

        {/* Messaging Box */}
        <div className="md:col-span-7 p-6 rounded-[2rem] bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between space-y-4" id="consultation-messaging">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4.5 h-4.5 text-emerald-400" />
              دفترچه بازخوردها و پرسش مستقیم
            </h3>
            <p className="text-[10px] text-zinc-400">ثبت هرگونه احساس درد نامتعارف یا سوال در مورد تمرینات برای درمانگر.</p>
          </div>

          {/* Messages list container */}
          <div className="bg-zinc-950/70 rounded-xl p-3 h-[140px] overflow-y-auto space-y-3 border border-zinc-800/40" id="messages-scroller">
            {feedbacks.map((msg, i) => {
              const isDoctor = msg.sender === "coach";
              return (
                <div 
                  key={i} 
                  className={`flex flex-col max-w-[85%] rounded-xl p-2.5 text-xs ${
                    isDoctor 
                      ? "bg-emerald-950/40 border border-emerald-500/20 text-zinc-200 ml-auto" 
                      : "bg-zinc-900 border border-zinc-800 text-zinc-300 mr-auto"
                  }`}
                >
                  <span className="text-[9px] text-zinc-500 font-bold mb-1">
                    {isDoctor ? "دکتر امیر حبیبی" : "شما / بیمار"}
                  </span>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              );
            })}
          </div>

          {/* Send Area */}
          <form onSubmit={handleFeedbackSubmit} className="flex gap-2">
            <input
              id="message-text-input"
              type="text"
              placeholder="سوال خود یا بازخورد وضعیت مفصل را بنویسید..."
              value={feedbackInput}
              onChange={(e) => setFeedbackInput(e.target.value)}
              className="flex-1 p-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 transition-all text-right"
            />
            <button
              id="message-send-btn"
              type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 text-xs font-black rounded-xl transition-all cursor-pointer"
            >
              فرستادن
            </button>
          </form>
        </div>

      </section>

    </div>
  );
};
