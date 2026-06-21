/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PainZone } from "../types";
import { 
  Activity, 
  HelpCircle, 
  AlertTriangle 
} from "lucide-react";

interface VASliderProps {
  intensity: number;
  onChange: (value: number) => void;
  selectedZone: PainZone;
  onZoneChange: (zone: PainZone) => void;
  showZoneSelector?: boolean;
}

export const VASlider: React.FC<VASliderProps> = ({
  intensity,
  onChange,
  selectedZone,
  onZoneChange,
  showZoneSelector = true,
}) => {
  // Return emoji & description based on VAS score (0-10)
  const getPainMetrics = (score: number) => {
    if (score === 0) return { label: "بدون درد", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", emoji: "😊", description: "هیچ دردی احساس نمی‌شود. کاملاً آماده برای فعالیت بدنی." };
    if (score <= 2) return { label: "درد بسیار خفیف", color: "text-green-400 bg-green-500/10 border-green-500/30", emoji: "🙂", description: "درد جزئی که در پس‌زمینه است اما مانع حرکت یا خواب نیست." };
    if (score <= 4) return { label: "درد ملایم", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30", emoji: "😐", description: "دردی که متوجه آن هستید؛ تا حدودی فعالیت ورزشی را تحت تاثیر قرار می‌دهد." };
    if (score <= 6) return { label: "درد متوسط - آزاردهنده", color: "text-orange-400 bg-orange-500/10 border-orange-500/30", emoji: "😟", description: "درد مشهود که بر کیفیت حرکت تاثیر منفی گذاشته و تمرکز شما را مختل می‌کند." };
    if (score <= 8) return { label: "درد شدید", color: "text-red-400 bg-red-500/10 border-red-500/30", emoji: "😰", description: "درد بسیار واضح که انجام حرکات عادی را دشوار ساخته و نیاز به احتیاط جدی دارد." };
    return { label: "درد غیرقابل تحمل", color: "text-rose-500 bg-rose-500/10 border-rose-500/40", emoji: "😭", description: "درد شدید و آزاردهنده که هرگونه فعالیت بدنی را ناممکن کرده و آزاردهنده است." };
  };

  const currentMetrics = getPainMetrics(intensity);

  const painZones: { id: PainZone; name: string }[] = [
    { id: "shoulder", name: "شانه / روتاتور کاف" },
    { id: "knee", name: "زانو / رباط‌ها" },
    { id: "lower_back", name: "کمر / دیسک کمر" },
    { id: "ankle", name: "مچ پا / آشیل" },
    { id: "neck", name: "گردن" },
    { id: "elbow", name: "آرنج / تاندونیت" },
    { id: "hip", name: "لگن و باسن" },
  ];

  // Helper for slider track color
  const getTrackColor = (val: number) => {
    if (val <= 2) return "from-emerald-500 to-green-500";
    if (val <= 5) return "from-green-500 to-yellow-500";
    if (val <= 8) return "from-yellow-500 to-red-500";
    return "from-red-500 to-rose-600";
  };

  return (
    <div className="space-y-6" id="vas-slider-wrapper">
      {/* Zone Selector */}
      {showZoneSelector && (
        <div className="space-y-3">
          <label className="text-zinc-300 font-medium text-sm block flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            ناحیه اصلی آسیب را انتخاب کنید:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" id="pain-zone-grid">
            {painZones.map((zone) => {
              const isActive = selectedZone === zone.id;
              return (
                <button
                  key={zone.id}
                  id={`zone-btn-${zone.id}`}
                  type="button"
                  onClick={() => onZoneChange(zone.id)}
                  className={`p-3 text-right rounded-xl border transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? "bg-emerald-500/10 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                      : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  <span className="text-sm font-medium block relative z-10">{zone.name}</span>
                  {isActive && (
                    <div className="absolute right-0 bottom-0 w-8 h-8 bg-emerald-500/10 rounded-full blur-md" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Visual Analogue Slider Block */}
      <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl relative" id="vas-analogue-slider">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-zinc-400 font-medium">شدت درد روی نمودار VAS</span>
          <div className={`px-3 py-1 rounded-full border text-xs font-semibold ${currentMetrics.color} transition-all duration-300 flex items-center gap-1.5`}>
            <span>{currentMetrics.emoji}</span>
            <span>{currentMetrics.label} ({intensity}/۱۰)</span>
          </div>
        </div>

        {/* Big visual number & smiley face container */}
        <div className="flex flex-col items-center justify-center py-6 space-y-3 transition-all duration-300">
          <span className="text-6xl font-extrabold tracking-tight select-none bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            {intensity}
          </span>
          <div className="text-4xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] transition-transform duration-300 transform hover:scale-110 select-none">
            {currentMetrics.emoji}
          </div>
          <p className="text-xs text-zinc-400 max-w-md text-center leading-relaxed">
            {currentMetrics.description}
          </p>
        </div>

        {/* The slider component */}
        <div className="relative pt-4 pb-2">
          <input
            id="vas-pain-input-range"
            type="range"
            min="0"
            max="10"
            step="1"
            value={intensity}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-2 rounded-lg bg-zinc-800 appearance-none cursor-pointer focus:outline-none accent-emerald-500 select-none"
            style={{
              background: `linear-gradient(to left, #e11d48, #eab308, #10b981)`
            }}
          />
          <div className="flex justify-between text-[11px] font-mono text-zinc-500 mt-2 px-1 select-none">
            <span>۰ (بدون درد)</span>
            <span>۲</span>
            <span>۴</span>
            <span>۶</span>
            <span>۸</span>
            <span>۱۰ (حداکثر درد)</span>
          </div>
        </div>

        {/* Interactive indicator scale */}
        <div className="flex justify-between gap-1 mt-4" id="slider-ticks-row">
          {Array.from({ length: 11 }).map((_, i) => {
            const isSelected = intensity === i;
            let bgColor = "bg-zinc-800";
            if (isSelected) {
              if (i <= 2) bgColor = "bg-emerald-500 ring-2 ring-emerald-500/20 scale-125";
              else if (i <= 5) bgColor = "bg-yellow-500 ring-2 ring-yellow-500/20 scale-125";
              else if (i <= 8) bgColor = "bg-orange-500 ring-2 ring-orange-500/20 scale-125";
              else bgColor = "bg-red-500 ring-2 ring-red-500/20 scale-125";
            }
            return (
              <button
                key={i}
                type="button"
                id={`tick-btn-${i}`}
                onClick={() => onChange(i)}
                className={`flex-1 py-1.5 rounded transition-all duration-300 text-[10px] font-semibold text-center ${
                  isSelected 
                    ? `${bgColor} text-zinc-950 font-bold`
                    : "bg-zinc-800/40 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                {i}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Advisory disclaimer box */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-orange-500/5 border border-orange-500/10 text-[11px] text-zinc-400 leading-relaxed">
        <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
        <p>
          <strong>اهمیت ارزیابی VAS:</strong> مقیاس دیداری درد به دکتر حبیبی کمک می‌کند تا برنامه فشار، تکرار و سرعت ریکاوری سلول‌ها را بر اساس آستانه تحمل واقعی سیستم عصبی شما طراحی کند. درد نشانه‌ی مراقبت است، نه ناتوانی.
        </p>
      </div>
    </div>
  );
};
