/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ClientRecord, PatientExercise } from "../../types";
import { 
  Users, 
  Activity, 
  HelpCircle, 
  PlusCircle, 
  CheckCircle, 
  AlertCircle,
  Brain,
  Award,
  Zap,
  CheckCircle2,
  ListTodo,
  FileText,
  TrendingDown,
  Sparkles,
  RefreshCw,
  Search
} from "lucide-react";

interface CoachPortalProps {
  clients: ClientRecord[];
  activeClientId: string;
  onSelectClient: (clientId: string) => void;
  onEndSession: (clientId: string, sessionNotes: string, completedCount: number) => void;
  onSendFeedback: (clientId: string, text: string) => void;
  feedbacks: { sender: "patient" | "coach"; text: string; date: string }[];
  onAddClient: (newClient: ClientRecord) => void;
}

export const CoachPortal: React.FC<CoachPortalProps> = ({
  clients: mockClients,
  activeClientId,
  onSelectClient,
  onEndSession,
  onSendFeedback,
  feedbacks,
  onAddClient,
}) => {
  const [sessionNotes, setSessionNotes] = useState<string>("بیمار انقباض عملکردی زانو را با درد آستانه تحمل مناسب اجرا نمود. هیچ‌گونه خالی کردن مفصل زانو در حین فعالیت گزارش نشد.");
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [apiClients, setApiClients] = useState<ClientRecord[]>([]);
  const [finances, setFinances] = useState<{totalIncome: number, transactions: any[]}>({ totalIncome: 0, transactions: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCoachData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) return;

        const [patientsRes, financesRes] = await Promise.all([
          fetch('http://localhost:5000/api/coach/patients', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/coach/finances', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        const patientsData = await patientsRes.json();
        const financesData = await financesRes.json();

        if (patientsData.success) {
          // Map backend patient profiles to frontend ClientRecord
          const mappedClients: ClientRecord[] = patientsData.data.map((p: any) => {
            const activePackage = p.patientPackages?.[0];
            return {
              id: p.id,
              userId: p.userId, // keep track of userId for chat
              name: p.user.name,
              fullName: p.user.name,
              phone: "09121111111", // mock
              email: p.user.email,
              age: 30, // mock or calculate from dob
              sport: p.notes || "ورزشکار", // mock
              injury: p.medicalHistory || "آسیب نامشخص",
              injuryZone: "knee", // mock
              joinDate: new Date(p.createdAt).toLocaleDateString("fa-IR"),
              sessionsPurchased: activePackage?.package?.numberOfSessions || 0,
              sessionsCompleted: activePackage ? (activePackage.package.numberOfSessions - activePackage.remainingSessions) : 0,
              initialPainLevel: 5,
              currentPainLevel: p.painLogs?.[0]?.painLevel || 0,
              painHistory: p.painLogs?.map((log: any) => ({
                date: new Date(log.createdAt).toLocaleDateString("fa-IR"),
                intensity: log.painLevel
              })) || [],
              prescription: p.prescriptions?.map((pres: any) => ({
                id: pres.id,
                name: pres.exercise?.title || "تمرین",
                reps: pres.reps,
                sets: pres.sets,
                completed: pres.submissions && pres.submissions.length > 0,
                description: pres.instructions || pres.exercise?.description || "",
                videoUrl: pres.submissions && pres.submissions.length > 0 ? pres.submissions[0].videoUrl : undefined,
              })) || [],
              notes: p.notes || "",
              completedSessionsLog: activePackage?.sessions?.filter((s: any) => s.status === 'COMPLETED' && s.report).map((s: any) => ({
                date: new Date(s.report.date).toLocaleDateString("fa-IR"),
                completedExercisesCount: 0, // This data is abstract in the new DB model, set to 0 or derive from elsewhere
                notes: s.report.clinicalNotes || ""
              })) || []
            };
          });
          setApiClients(mappedClients);
          if (mappedClients.length > 0 && !activeClientId) {
            onSelectClient(mappedClients[0].id);
          }
        }

        if (financesData.success) {
          setFinances(financesData.data);
        }
      } catch (err) {
        console.error('Error fetching coach data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoachData();
  }, []);

  const clients = apiClients.length > 0 ? apiClients : mockClients;

  
  // AI assistant state
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // New Client Form
  const [showAddNew, setShowAddNew] = useState<boolean>(false);
  const [newClientData, setNewClientData] = useState({
    name: "",
    age: 28,
    sport: "وزنه‌برداری",
    injury: "پارگی جزئی رباط ACL درجه یک",
    injuryZone: "knee" as any,
    phone: "09121111111",
    notes: "نیاز مبرم به ثبات عصبی حرکتی همسترینگ و تقویت عضلات چهارسر.",
  });

  const activeClient = clients.find((c) => c.id === activeClientId) || clients[0];

  // Local checklist for active exercise execution tracker
  const [exerciseChecklist, setExerciseChecklist] = useState<Record<string, boolean>>({
    "ex-1": true,
    "ex-2": true,
    "ex-3": false,
    "ex-4": false,
  });

  const handleToggleCheck = (id: string) => {
    setExerciseChecklist(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const [patientFeedbackNotes, setPatientFeedbackNotes] = useState<string>("");
  const [nextStepsNotes, setNextStepsNotes] = useState<string>("");

  const handleEndSessionClick = async () => {
    if (!activeClient) return;
    const completedCount = Object.values(exerciseChecklist).filter(Boolean).length;

    try {
      const token = localStorage.getItem('token');
      if (token && apiClients.length > 0) {
        // Need to create a mock session first to test the endpoint, or assume the backend has a session ready
        const mockSessionRes = await fetch('http://localhost:5000/api/coach/mock-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ patientProfileId: activeClient.id })
        });
        const sessionData = await mockSessionRes.json();

        if (sessionData.success && sessionData.data) {
           await fetch(`http://localhost:5000/api/coach/sessions/${sessionData.data.id}/report`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({
                  clinicalNotes: sessionNotes,
                  patientFeedback: patientFeedbackNotes || "ثبت نشده",
                  nextSteps: nextStepsNotes || "ثبت نشده"
              })
           });
        }
      }
    } catch(err) {
       console.error("Error submitting session report to API", err);
    }

    onEndSession(activeClient.id, sessionNotes, completedCount);
    // Reset checklists
    setExerciseChecklist({
      "ex-1": false,
      "ex-2": false,
      "ex-3": false,
      "ex-4": false,
    });
  };

  const handleSendFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackText.trim() && activeClient) {
      onSendFeedback(activeClient.id, feedbackText);
      setFeedbackText("");
    }
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientData.name.trim()) return;

    const testPrescription: PatientExercise[] = [
      { id: "ex-new-1", name: "تقویت ایزومتریک زانو", reps: "۱۲ بار نگه داشتن ۵ ثانیه‌ای", sets: 3, completed: false, description: "نیروی ثابت به کاندیل" },
      { id: "ex-new-2", name: "پل باسن تک پا", reps: "۱۰ تکرار", sets: 3, completed: false, description: "بازنشانی ثبات زنجیره خلفی" },
      { id: "ex-new-3", name: "کاف رایز روی پله", reps: "۱۵ تکرار", sets: 3, completed: false, description: "اصلاح امتداد تاندون آشیل" }
    ];

    const clientObj: ClientRecord = {
      id: "client_" + Date.now(),
      name: newClientData.name,
      fullName: newClientData.name,
      phone: newClientData.phone,
      email: newClientData.name.toLowerCase().replace(/\s+/g, "") + "@example.com",
      age: newClientData.age,
      sport: newClientData.sport,
      injury: newClientData.injury,
      injuryZone: newClientData.injuryZone,
      joinDate: new Date().toLocaleDateString("fa-IR"),
      sessionsPurchased: 12,
      sessionsCompleted: 0,
      initialPainLevel: 7,
      currentPainLevel: 7,
      painHistory: [
        { date: "۱۴۰۶/۰۳/۰۱", intensity: 7 }
      ],
      prescription: testPrescription,
      notes: newClientData.notes,
      completedSessionsLog: []
    };

    onAddClient(clientObj);
    setShowAddNew(false);
    // Clear
    setNewClientData({
      name: "",
      age: 28,
      sport: "وزنه‌برداری",
      injury: "پارگی جزئی رباط ACL درجه یک",
      injuryZone: "knee",
      phone: "09121111111",
      notes: "نیاز مبرم به ثبات عصبی حرکتی همسترینگ و تقویت عضلات چهارسر.",
    });
  };

  // Simulated AI Doctor Assistant (PhD level)
  const askAIAssistant = () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setTimeout(() => {
      let reply = "";
      const p = aiPrompt.toLowerCase();
      if (p.includes("زانو") || p.includes("acl")) {
        reply = `بر اساس ارزیابی کینزیولوژیک دکتر حبیبی و تحلیل آسیبشناسی زانو:
۱. هم‌انقباضی کوآدریسپس و همسترینگ در زنجیره حرکتی بسته (Closed Kinetic Chain) از اولویت‌های حیاتی است.
۲. ست‌های با تکرار بالا ولی ایزومتریک ترجیح داده می‌شوند تا فشار بر پیوند مفاصل و پاتلا وارد نشود.
۳. در مقیاس درد VAS بیمار نباید بالای امتیاز ۴ تمرین کند. در صورت صعود به امتیاز ۵، تمرین را با انقباض‌های دورسی فلکشن مچ پا ایزوله تعویض کنید.`;
      } else if (p.includes("شانه") || p.includes("شانه")) {
        reply = `توصیه هوشمند آسیب‌شناسی برای عضله روتاتور کاف و شانه:
۱. از اورهد پرس‌های سنگین فعلاً اجتناب و به اکسترنال روتیشن با تراباند کششی روی بیاورید.
۲. جهت ثبات اسکاپولا، تمرینات وای-تو-دبلیو (Y-to-W) به میزان ۳ ست ۱۵ تکراری با تعهد انقباضی مناسب تجویز گردد.
۳. درد مجاز برای بیمار حداکثر ۳ روی مقیاس VAS است.`;
      } else {
        reply = `پاسخ مشاور آسیب‌شناسی ورزشی دکتر حبیبی:
برای پرونده فعلی بیمار "${activeClient?.name}"، پایش مداوم درد در زوایای انتهایی حرکت توصیه می‌شود. 
اصلاح دامنه حرکتی ایمن (Safe ROM) همواره پیش‌نیاز اعمال بارهای فشاری پیشرونده است. برنامه‌ریزی جلسات را بر اساس نوار تغییرات VAS تنظیم کنید.`;
      }
      setAiResponse(reply);
      setAiLoading(false);
    }, 1200);
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.injury.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.sport.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-right max-w-6xl mx-auto px-4" id="coach-portal-root">
      
      {/* Sidebar: Client Directory (Left-ish in RTL / Col 4) */}
      <div className="lg:col-span-4 space-y-6" id="coach-sidebar">
        
        {/* Clinician Profile */}
        <div className="p-4 rounded-3xl bg-zinc-900/80 border border-zinc-800 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLy_bGmWJwuJOH61GdlkzYy5wJQ4XN6AW1y7E6GsdMyCUXpO76k28PDnFUwWN3Uq1CdvGKi2NigxCOYL9ZsqqwDGyzn5luHngCcOsm--qSEPFtwPZMtOx3Y2hsGm2nCfnSdC3rdQ9Y7_VUvZRQw_qcoAP__BUSlbUPpYNPJyWfKvQXargZqC3fVqew8apYy2Hl_8OvpS1AD4WuhGbg177zd3ft-lC5Nkem7TQ-kclhwicnlxWquKvGOKJcpAssR15OP3ZoJ5WpynQ"
                alt="Dr. Amir Habibi"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">دکتر امیر حبیبی (مدیر کلینیک)</h3>
              <span className="text-[10px] text-zinc-500 block font-mono">CHIEF REHABILITATION DIRECTOR</span>
            </div>
          </div>
          {apiClients.length > 0 && (
            <div className="pt-3 border-t border-zinc-800 flex justify-between items-center text-xs">
              <span className="text-zinc-400">درآمد (پورسانت ۶۰٪):</span>
              <span className="font-bold text-emerald-400 font-mono">{finances.totalIncome.toLocaleString()} تومان</span>
            </div>
          )}
        </div>

        {/* Client Manager List */}
        <div className="p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" />
              فهرست ورزشکاران تحت درمان ({clients.length})
            </span>
            <button
              id="coach-show-add-client-btn"
              onClick={() => setShowAddNew(!showAddNew)}
              className="p-1 px-2.5 rounded-lg bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-[10px] font-bold text-zinc-300 transition-all flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              ثبت پرونده جدید
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <input
              id="coach-client-search"
              type="text"
              placeholder="جستجو بر اساس نام، آسیب یا ورزش..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 placeholder-zinc-700 pr-8 text-right focus:outline-none"
            />
            <Search className="w-4 h-4 text-zinc-600 absolute top-2.5 right-2.5 pointer-events-none" />
          </div>

          {/* Directory Box */}
          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1" id="clients-roster">
            {filteredClients.map((client) => {
              const isSelected = client.id === activeClientId;
              return (
                <button
                  key={client.id}
                  id={`directory-user-btn-${client.id}`}
                  onClick={() => onSelectClient(client.id)}
                  className={`w-full p-3 rounded-xl border text-right transition-all flex flex-col space-y-1.5 ${
                    isSelected
                      ? "bg-emerald-500/10 border-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.1)]"
                      : "bg-zinc-950/60 border-zinc-900/80 hover:border-zinc-800 hover:bg-zinc-950 text-zinc-400"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-black text-white">{client.name}</span>
                    <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                      جلسه {client.sessionsCompleted}/{client.sessionsPurchased}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span className="truncate max-w-[150px]">{client.injury}</span>
                    <span className="text-zinc-400 font-bold">{client.sport}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Add New Client Modal/Card wrapper overlay */}
        {showAddNew && (
          <form onSubmit={handleCreateClient} className="p-5 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4 animate-scaleUp">
            <h4 className="text-xs font-black text-white border-r-2 border-emerald-500 pr-2">افزودن پرونده توانبخشی جدید</h4>
            
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500">نام و نام خانوادگی ورزشکار</label>
              <input
                id="newclient-name"
                type="text"
                required
                placeholder="مثال: سهراب مرادی"
                value={newClientData.name}
                onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
                className="w-full p-2 bg-zinc-900 border border-zinc-850 rounded-lg text-xs text-white text-right"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500">رشته ورزشی</label>
                <input
                  id="newclient-sport"
                  type="text"
                  placeholder="کشتی"
                  value={newClientData.sport}
                  onChange={(e) => setNewClientData({ ...newClientData, sport: e.target.value })}
                  className="w-full p-2 bg-zinc-900 border border-zinc-850 rounded-lg text-xs text-white text-right"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500">سن</label>
                <input
                  id="newclient-age"
                  type="number"
                  placeholder="28"
                  value={newClientData.age}
                  onChange={(e) => setNewClientData({ ...newClientData, age: parseInt(e.target.value) || 28 })}
                  className="w-full p-2 bg-zinc-900 border border-zinc-850 rounded-lg text-xs text-white text-right"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500">محل آسیب برای پایش VAS</label>
              <select
                id="newclient-zone"
                value={newClientData.injuryZone}
                onChange={(e) => setNewClientData({ ...newClientData, injuryZone: e.target.value as any })}
                className="w-full p-2 bg-zinc-900 border border-zinc-850 rounded-lg text-xs text-zinc-300 text-right"
              >
                <option value="knee">زانو / غضروف</option>
                <option value="shoulder">شانه / لابروم</option>
                <option value="lower_back">کمر / دیسک حاد</option>
                <option value="ankle">مچ پا / رباط آشیل</option>
                <option value="neck">گردن</option>
                <option value="elbow">آرنج</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500">تشخیص مصدومیت فیزیکی</label>
              <input
                id="newclient-injury"
                type="text"
                placeholder="مثال: پارگی مینیسک خارجی زانو"
                value={newClientData.injury}
                onChange={(e) => setNewClientData({ ...newClientData, injury: e.target.value })}
                className="w-full p-2 bg-zinc-900 border border-zinc-850 rounded-lg text-xs text-white text-right"
              />
            </div>

            <button
              id="newclient-submit-btn"
              type="submit"
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs rounded-xl"
            >
              افزودن و فعال کردن پرونده دیجیتال
            </button>
          </form>
        )}

      </div>

      {/* Main Panel: Active Clinical Session Tracker */}
      <div className="lg:col-span-8 space-y-6" id="coach-main-panel">
        
        {activeClient ? (
          <>
            {/* Active Patient Title Grid */}
            <section className="p-6 rounded-[2rem] bg-gradient-to-l from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">پرونده فعال کلینیک</span>
                <h2 className="text-lg font-black text-white mt-2 block">
                  رصد بالینی: {activeClient.name}
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  آسیب: <strong className="text-zinc-200">{activeClient.injury}</strong> — رشته قهرمانی: <strong className="text-zinc-200">{activeClient.sport}</strong>
                </p>
              </div>

              {/* Status pain points */}
              <div className="flex gap-4">
                <div className="px-3 py-2 bg-zinc-950/70 border border-zinc-800 rounded-xl text-center">
                  <span className="text-[9px] text-zinc-500 block">شدت درد اولیه (VAS)</span>
                  <span className="text-sm font-mono font-black text-red-500">{activeClient.initialPainLevel}/۱۰</span>
                </div>
                <div className="px-3 py-2 bg-zinc-950/70 border border-zinc-800 rounded-xl text-center">
                  <span className="text-[9px] text-zinc-500 block">شدت درد کنونی</span>
                  <span className="text-sm font-mono font-black text-emerald-400">{activeClient.currentPainLevel}/۱۰</span>
                </div>
              </div>
            </section>

            {/* Active Session Controller Block */}
            <section className="p-6 sm:p-8 rounded-[2rem] bg-zinc-900/40 border border-zinc-800/80 space-y-6" id="active-session-controller">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    <ListTodo className="w-4.5 h-4.5 text-emerald-400 animate-pulse" />
                    کنترلر فعال جلسه شماره {activeClient.sessionsCompleted + 1} توانبخشی
                  </h3>
                  <p className="text-[10px] text-zinc-500">لیست حرکات کینزیولوژیک جهت تایید اجرا در کلینیک</p>
                </div>
                <span className="text-xs text-emerald-400 font-mono">ACTIVE APP_REHAB LIVE</span>
              </div>

              {/* Checklist details */}
              <div className="space-y-3">
                <span className="text-xs text-zinc-400 font-bold block">ورزش‌های تجویز شده برای بررسی:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="coach-checklist-grid">
                  {activeClient.prescription?.map((ex, idx) => {
                    const isChecked = !!exerciseChecklist[ex.id];
                    return (
                      <button
                        key={ex.id}
                        type="button"
                        id={`ex-complete-toggle-${ex.id}`}
                        onClick={() => handleToggleCheck(ex.id)}
                        className={`p-3.5 rounded-xl border text-right transition-all flex items-start gap-3 cursor-pointer ${
                          isChecked 
                            ? "bg-emerald-950/20 border-emerald-500 text-white" 
                            : "bg-zinc-950/60 border-zinc-900 text-zinc-400 hover:border-zinc-800"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-lg shrink-0 flex items-center justify-center border ${isChecked ? "bg-emerald-500 text-zinc-950 border-emerald-500" : "border-zinc-800"}`}>
                          {isChecked && <CheckCircle className="w-3.5 h-3.5 shrink-0" />}
                        </div>
                        <div>
                          <h5 id={`checklist-item-title-${ex.id}`} className="text-xs font-semibold">{ex.name}</h5>
                          <span className="text-[10px] text-zinc-500 block font-mono mt-0.5">{ex.sets} ست × {ex.reps}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Patient Submission Videos */}
              {activeClient.prescription.filter(ex => ex.videoUrl).length > 0 && (
                <div className="space-y-3 pt-4 border-t border-zinc-800">
                  <span className="text-xs text-zinc-400 font-bold block flex items-center gap-1.5">
                    <Play className="w-4 h-4 text-emerald-400" />
                    ویدیوهای ارسالی بیمار جهت بررسی:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     {activeClient.prescription.filter(ex => ex.videoUrl).map(ex => (
                        <div key={`video-${ex.id}`} className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-3 flex justify-between items-center">
                           <span className="text-xs text-white">{ex.name}</span>
                           <a href={ex.videoUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors">
                              مشاهده ویدیو
                           </a>
                        </div>
                     ))}
                  </div>
                </div>
              )}

              {/* Patient Progress Logs (History) */}
              <div className="space-y-3 pt-4 border-t border-zinc-800">
                <span className="text-xs text-zinc-400 font-bold block flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-teal-400" />
                  سابقه جلسات و گزارش‌های قبلی
                </span>
                <div className="max-h-[150px] overflow-y-auto space-y-2 pr-1">
                   {activeClient.completedSessionsLog.length > 0 ? activeClient.completedSessionsLog.map((log, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-right space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-teal-400">جلسه تایید شده</span>
                          <span className="text-zinc-500 font-mono">{log.date}</span>
                        </div>
                        <p className="text-[11px] text-zinc-300">
                          {log.notes}
                        </p>
                      </div>
                   )) : (
                     <div className="text-xs text-zinc-500 text-center py-4">گزارش جلسه‌ای ثبت نشده است.</div>
                   )}
                </div>
              </div>

              {/* Notes & Diagnostics input for this session */}
              <div className="space-y-3 pt-4 border-t border-zinc-800">
                <label className="text-xs text-zinc-300 font-bold block flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-zinc-400" />
                  فرم گزارش جلسه {activeClient.sessionsCompleted + 1}:
                </label>
                <div className="space-y-2">
                  <textarea
                    id="clinical-session-notes-textarea"
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    rows={2}
                    className="w-full p-3 bg-zinc-950/80 border border-zinc-850 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 transition-all text-right leading-relaxed resize-none"
                    placeholder="یادداشت‌های بالینی..."
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <textarea
                      value={patientFeedbackNotes}
                      onChange={(e) => setPatientFeedbackNotes(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 bg-zinc-950/80 border border-zinc-850 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 transition-all text-right leading-relaxed resize-none"
                      placeholder="بازخورد بیمار (مثلا: احساس درد حین حرکت)..."
                    />
                    <textarea
                      value={nextStepsNotes}
                      onChange={(e) => setNextStepsNotes(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 bg-zinc-950/80 border border-zinc-850 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 transition-all text-right leading-relaxed resize-none"
                      placeholder="گام‌های بعدی پیشرفت..."
                    />
                  </div>
                </div>
              </div>

              {/* MASSIVE ACTION END SESSION CTA BUTTON */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-right space-y-1">
                  <span className="text-[10px] text-zinc-500 font-medium block">ثبت پرونده و کسر جلسه</span>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    با کلیک، کارهای تاییدشده تیک خورده در پایگاه داده ثبت و به بیمار ایمیل می‌شود.
                  </p>
                </div>

                {/* Massive CTA: Action_EndSession */}
                <button
                  id="action-end-session-huge-btn"
                  onClick={handleEndSessionClick}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black text-xs transition-all duration-300 flex items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.3)] shrink-0 cursor-pointer"
                >
                  <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-zinc-950" />
                  <span>تایید و پایان جلسه</span>
                </button>
              </div>

            </section>

            {/* AI Assistant Doctor Copilot using Gemini API instructions */}
            <section className="p-6 rounded-[2rem] bg-zinc-900/60 border border-zinc-800/80 space-y-4" id="ai-doctor-co-pilot">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Brain className="w-4.5 h-4.5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white">دستیار هوشمند آسیب‌شناسی (PhD Co-Pilot)</h3>
                    <p className="text-[9px] text-zinc-500">پشتیبانی توانبخشی با الهام از تخصص ورزشی و کینزیولوژی</p>
                  </div>
                </div>
                <span className="text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                  GEMINI AGENT ACTIVED
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    id="ai-rehab-prompt"
                    type="text"
                    placeholder="مثال: تمرین مناسب برای پارگی گرید ۱ رباط ACL یا اصلاح شانه یخ‌زده چیست؟"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="flex-1 p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-zinc-300 text-right focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") askAIAssistant();
                    }}
                  />
                  <button
                    id="ai-submit-prompt-btn"
                    onClick={askAIAssistant}
                    className="p-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 text-xs font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                  >
                    {aiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>تحلیل</span>
                  </button>
                </div>

                {/* AI generated reply box */}
                {aiResponse && (
                  <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/15 text-xs text-zinc-300 leading-relaxed font-sans text-right space-y-2 whitespace-pre-line">
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mb-1">
                      <Sparkles className="w-3 h-3" />
                      <span>پیشنهاد کینزیولوژیک هوشمند:</span>
                    </div>
                    {aiResponse}
                  </div>
                )}
              </div>
            </section>

            {/* Direct Feedback Chat Sender directly to client */}
            <section className="p-6 rounded-[2rem] bg-zinc-900/60 border border-zinc-800/80 space-y-4" id="coach-direct-sender">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                مکالمه مستقیم و ارسال یادداشت برای {activeClient.name}
              </h3>

              <div className="bg-zinc-950/50 rounded-xl p-3 h-[110px] overflow-y-auto space-y-2.5 border border-zinc-850" id="coach-messages-scroller">
                {feedbacks.length > 0 ? (
                  feedbacks.map((msg, i) => {
                    const isDoctor = msg.sender === "coach";
                    return (
                      <div 
                        key={i} 
                        className={`flex flex-col max-w-[80%] rounded-xl p-2.5 text-xs ${
                          isDoctor 
                            ? "bg-emerald-950/35 border border-emerald-500/20 text-zinc-200 mr-auto" 
                            : "bg-zinc-900 border border-zinc-800 text-zinc-300 ml-auto"
                        }`}
                      >
                        <span className="text-[9px] text-zinc-600 font-bold mb-1">
                          {isDoctor ? "یادداشت شما" : "بیمار"}
                        </span>
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-6 text-center text-xs text-zinc-600">مکالمه‌ای ثبت نشده است.</div>
                )}
              </div>

              <form onSubmit={handleSendFeedbackSubmit} className="flex gap-2">
                <input
                  id="doctor-message-input"
                  type="text"
                  placeholder="بازخورد جدید یا تمرین را برای بیمار بنویسید..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="flex-1 p-2.5 bg-zinc-950/80 border border-zinc-850 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 space-y-1"
                />
                <button
                  id="doctor-message-send-btn"
                  type="submit"
                  className="p-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  ارسال پیام
                </button>
              </form>
            </section>
          </>
        ) : (
          <div className="py-24 text-center text-zinc-500 text-xs">
            هیچ ورزشکاری در این لیست فعال نیست. لطفاً پرونده‌ای ثبت کنید.
          </div>
        )}

      </div>

    </div>
  );
};
