/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useStore } from "./store";
import { CheckCircle2 } from "lucide-react";

// Layouts
import { PublicLayout } from "./layouts/PublicLayout";
import { ProtectedLayout } from "./layouts/ProtectedLayout";

// Public Pages
import { Home } from "./pages/public/Home";
import { About } from "./pages/public/About";
import { Services } from "./pages/public/Services";
import { Blog } from "./pages/public/Blog";
import { Webinars } from "./pages/public/Webinars";
import { AssessmentForm } from "./pages/public/Assessment";

import { Success as PaymentSuccess } from './pages/public/payment/Success';
import { Failure as PaymentFailure } from './pages/public/payment/Failure';

// Protected Pages
import { PatientPortal } from "./pages/protected/PatientPortal";
import { CoachPortal } from "./pages/protected/CoachPortal";
import { AdminPortal } from "./pages/protected/AdminPortal";

// Dev Helper
import { DevRoleSwitcher } from "./components/DevRoleSwitcher";

export default function App() {
  const {
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
  const activeClientRecord = clients.find((c) => c.id === activeClientId) || clients[0];

  return (
    <>
      {/* Dynamic Success Glass Alert notification */}
      {alertConfig.show && (
        <div id="rehab-alert-notification" className="fixed bottom-6 left-6 right-6 sm:left-auto sm:max-w-md p-5 rounded-3xl bg-zinc-950/95 border border-emerald-500/40 text-right z-[9999] shadow-2xl backdrop-blur-xl animate-slideIn" style={{ direction: "rtl" }}>
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

      {/* Development Routing Helper */}
      <DevRoleSwitcher />

      {/* Main Content Router */}
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/webinars" element={<Webinars />} />
          <Route path="/assessment" element={
            <div className="py-8"><AssessmentForm onSubmit={assessmentSubmit} onCancel={() => window.history.back()} /></div>
          } />
        </Route>

          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failure" element={<PaymentFailure />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedLayout />}>
          <Route path="patient" element={
            <div className="py-8">
              <PatientPortal
                patientRecord={activeClientRecord}
                onUpdatePainHistory={updatePainHistory}
                onToggleExercise={toggleExercise}
                onSendFeedback={(text) => sendFeedback(activeClientId, text, "patient")}
                onAddCheckIn={addDailyCheckIn}
                feedbacks={activeClientFeedbacks}
              />
            </div>
          } />
          <Route path="coach" element={
            <div className="py-8">
              <CoachPortal
                clients={clients}
                activeClientId={activeClientId}
                onSelectClient={(id) => setActiveClientId(id)}
                onEndSession={endSession}
                onSendFeedback={(id, text) => sendFeedback(id, text, "coach")}
                feedbacks={activeClientFeedbacks}
                onAddClient={(newC) => addClient(newC)}
              />
            </div>
          } />
          <Route path="admin" element={
            <div className="py-8">
              <AdminPortal />
            </div>
          } />
        </Route>
      </Routes>
    </>
  );
}
