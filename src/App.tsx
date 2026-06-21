/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { useStore } from "./store";
import { LandingPage } from "./components/LandingPage";
import { AssessmentForm } from "./components/AssessmentForm";
import { PatientPortal } from "./components/PatientPortal";
import { CoachPortal } from "./components/CoachPortal";
import { 
  Dumbbell, 
  Users, 
  User, 
  Activity, 
  CheckCircle2, 
  Award, 
  Home, 
  LogOut,
  Sparkles,
  Flame,
  Brain,
  AlertTriangle
} from "lucide-react";

export default function App() {
  const {
    role,
    setRole,
    showAssessment,
    setShowAssessment,
    alertConfig,
    dismissAlert,
    clients,
    activeClientId,
    setActiveClientId,
    feedbacks,
    updatePainHistory,
    addDailyCheckIn,
    toggleExercise,
    sendFeedback,
    assessmentSubmit,
    endSession,
    addClient,
  } = useStore();

  // Automatically dismiss alerts after some seconds
  useEffect(() => {
    if (alertConfig.show) {
      const timer = setTimeout(() => {
        dismissAlert();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertConfig.show, dismissAlert]);

  const activeClientFeedbacks = feedbacks[activeClientId] || [];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-emerald-500 selection:text-zinc-950 pb-20 relative text-right" id="app-container" style={{ direction: "rtl" }}>
      
      {/* Absolute top glowing bar */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-rose-500 z-50 relative" />

      {/* Glassmorphic Environment Quick Switch Panel */}
      <div className="bg-zinc-900/90 border-b border-zinc-800/80 sticky top-0 z-40 backdrop-blur-md px-4 py-3" id="global-role-switcher">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          
          {/* Logo Brand Title */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setRole("guest"); setShowAssessment(false); }}>
            <Dumbbell className="w-5 h-5 text-emerald-400" />
            <h1 className="text-sm font-black tracking-tight text-white">درمان درست <span className="text-zinc-500 text-[10px] font-normal">| دکتری آسیب‌شناسی ورزشی</span></h1>
          </div>

          {/* Quick toggle list */}
          <div className="flex items-center gap-2 bg-zinc-950/80 p-1.5 rounded-xl border border-zinc-800/60" id="role-switches">
            <span className="text-[10px] text-zinc-500 px-2 font-semibold">شبیه‌ساز نقش‌ها:</span>
            
            <button
              id="switch-guest-role"
              onClick={() => { setRole("guest"); setShowAssessment(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                role === "guest" && !showAssessment
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              صفحه اصلی (عمومی)
            </button>

            <button
              id="switch-assessment-role"
              onClick={() => { setShowAssessment(true); setRole("guest"); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                showAssessment
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              فرم ارزیابی (نوبت‌دهی)
            </button>

            <button
              id="switch-patient-role"
              onClick={() => { setRole("patient"); setShowAssessment(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                role === "patient"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              پرونده ورزشکار
            </button>

            <button
              id="switch-coach-role"
              onClick={() => { setRole("coach"); setShowAssessment(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                role === "coach"
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/30 font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              پنل دکتر حبیبی
            </button>
          </div>

        </div>
      </div>

      {/* Dynamic Success Glass Alert notification */}
      {alertConfig.show && (
        <div id="rehab-alert-notification" className="fixed bottom-6 left-6 right-6 sm:left-auto sm:max-w-md p-5 rounded-3xl bg-zinc-950/95 border border-emerald-500/40 text-right z-50 shadow-2xl backdrop-blur-xl animate-slideIn">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-xs font-black text-white">{alertConfig.title}</h4>
              <p className="text-[11px] text-zinc-300 leading-relaxed">{alertConfig.msg}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Router */}
      <main className="py-8" id="primary-app-main-content">
        {showAssessment ? (
          <AssessmentForm
            onSubmit={assessmentSubmit}
            onCancel={() => setShowAssessment(false)}
          />
        ) : role === "guest" ? (
          <LandingPage
            onStartAssessment={() => setShowAssessment(true)}
            onSelectRole={(selectedRole) => {
              setRole(selectedRole);
              setShowAssessment(false);
            }}
          />
        ) : role === "patient" ? (
          <PatientPortal
            patientRecord={clients.find((c) => c.id === activeClientId) || clients[0]}
            onUpdatePainHistory={updatePainHistory}
            onToggleExercise={toggleExercise}
            onSendFeedback={(text) => sendFeedback(activeClientId, text, "patient")}
            onAddCheckIn={addDailyCheckIn}
            feedbacks={activeClientFeedbacks}
          />
        ) : (
          <CoachPortal
            clients={clients}
            activeClientId={activeClientId}
            onSelectClient={(id) => setActiveClientId(id)}
            onEndSession={endSession}
            onSendFeedback={(id, text) => sendFeedback(id, text, "coach")}
            feedbacks={activeClientFeedbacks}
            onAddClient={(newC) => {
              addClient(newC);
            }}
          />
        )}
      </main>

      {/* Fixed quick information footer inside frame */}
      <div className="mt-12 text-center text-zinc-600 text-[10px] space-y-1">
        <p>پلتفرم کلینیکال و آسیب‌شناسی ورزشی دکتر امیر حبیبی — دانشگاه تهران</p>
        <p className="font-mono text-[9px]">UTC CLOCK PREVIEW • STABLE APP BUILD • COMPILE VERIFIED</p>
      </div>

    </div>
  );
}
