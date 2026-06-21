/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserRole, ClientRecord, PatientExercise, AssessmentSubmission, PainZone } from "./types";

interface AlertConfig {
  show: boolean;
  title: string;
  msg: string;
  type: "success" | "info" | "warning";
}

interface AppState {
  role: UserRole;
  theme: "dark" | "light";
  showAssessment: boolean;
  alertConfig: AlertConfig;
  clients: ClientRecord[];
  activeClientId: string;
  feedbacks: Record<string, { sender: "patient" | "coach"; text: string; date: string }[]>;

  // Actions
  setRole: (role: UserRole) => void;
  setTheme: (theme: "dark" | "light") => void;
  setShowAssessment: (show: boolean) => void;
  setActiveClientId: (id: string) => void;
  triggerAlert: (title: string, msg: string, type?: "success" | "info" | "warning") => void;
  dismissAlert: () => void;
  updatePainHistory: (newIntensity: number, zoneNotes?: string) => void;
  addDailyCheckIn: (mood: number, sleep: number) => void;
  toggleExercise: (exerciseId: string) => void;
  sendFeedback: (clientId: string, text: string, sender: "patient" | "coach") => void;
  addClient: (newClient: ClientRecord) => void;
  endSession: (clientId: string, notes: string, completedExercisesCount: number) => void;
  assessmentSubmit: (data: AssessmentSubmission) => void;
}

const initialClients: ClientRecord[] = [
  {
    id: "client_sajjad",
    name: "سجاد گنج‌زاده",
    fullName: "سجاد گنج‌زاده (قهرمان المپیک کاراته)",
    phone: "09129998888",
    email: "ganjzadeh@olympic.ir",
    age: 32,
    sport: "کاراته کنترلی",
    injury: "التهاب تاندونیت پاتلا و کشیدگی رباط صلیبی قدامی",
    injuryZone: "knee",
    joinDate: "۱۴۰۶/۰۲/۱۰",
    sessionsPurchased: 24,
    sessionsCompleted: 14,
    initialPainLevel: 8,
    currentPainLevel: 3,
    painHistory: [
      { date: "۰۲/۱۰", intensity: 8 },
      { date: "۰۲/۱۸", intensity: 7 },
      { date: "۰۲/۲۶", intensity: 6 },
      { date: "۰۳/۰۴", intensity: 5 },
      { date: "۰۳/۱۲", intensity: 4 },
      { date: "۰۳/۲۰", intensity: 3 },
    ],
    prescription: [
      { id: "ex-1", name: "ایزومتریک کوآدریسپس با رول حوله زیر زانو", reps: "۱۰ تکرار ۶ ثانیه‌ای", sets: 3, completed: true, progress: 100, description: "انقباض ارادی بالای کشکک بدون تغییر زاویه خم شدن زانو جهت فعال‌سازی غلاف میانی." },
      { id: "ex-2", name: "تمرین بالانسر یک پایی چشمان بسته", reps: "هر پا ۴۵ ثانیه", sets: 4, completed: true, progress: 100, description: "بازنشانی هماهنگی گیرنده‌های حس عمقی مفاصل تعادلی تحتانی." },
      { id: "ex-3", name: "تمرین حرکت هیپ ابداکشن با باند الاستیک", reps: "۱۵ تکرار", sets: 3, completed: false, progress: 30, description: "هدف تقویت مایل مدیال باسن برای ثبات خارجی زنجیره حرکتی ران و کاهش انحراف زانو." },
      { id: "ex-4", name: "کاف اکسپلوسیو تک پا تکیه به دیوار", reps: "۱۲ تکرار", sets: 3, completed: false, progress: 0, description: "بازیابی الاستیسیته فاسیای عضلات ساق جهت تحمل ضربه شیارهای کاراته." },
    ],
    notes: "ورزشکار المپیکی کشورمان با جدیّت تمرینات را دنبال می‌کند. تاندونیت کشکک زانو در تست کینزیو با آستانه زوایای حاد برطرف شده است.",
    completedSessionsLog: [
      { date: "۱۴۰۶/۰۲/۱۲", completedExercisesCount: 3, notes: "جلسه اول: ارزیابی دامنه حرکتی ایمن زانو و تصحیح زاویه چرخش پاشنه پا." },
      { date: "۱۴۰۶/۰۲/۲۰", completedExercisesCount: 4, notes: "جلسه دوم: اعمال نیروهای جانبی بر رباط پا و انقباض ایزومتریک زانو بدون تشدید درد." },
      { date: "۱۴۰۶/۰۳/۰۲", completedExercisesCount: 4, notes: "جلسه سوم: انجام حرکات توازن عصبی روی صفحه لرزان و بازخورد VAS خوب." },
    ]
  },
  {
    id: "client_sina",
    name: "سینا غلامی",
    fullName: "سینا غلامی (قهرمان ملی بوکس)",
    phone: "09121112233",
    email: "sina.gholami@boxing.ir",
    age: 25,
    sport: "بوکس فوق سنگین",
    injury: "سابلوکساسیون روتاتور کاف و بی‌ثباتی لابروم شانه چپ",
    injuryZone: "shoulder",
    joinDate: "۱۴۰۶/۰۳/۰۵",
    sessionsPurchased: 12,
    sessionsCompleted: 4,
    initialPainLevel: 9,
    currentPainLevel: 5,
    painHistory: [
      { date: "۰۳/۰۵", intensity: 9 },
      { date: "۰۳/۱۰", intensity: 7 },
      { date: "۰۳/۱۵", intensity: 6 },
      { date: "۰۳/۲۱", intensity: 5 },
    ],
    prescription: [
      { id: "ex-s1", name: "خارج کردن اسکاپولا با تراباند پهن", reps: "۱۵ تکرار آرام", sets: 3, completed: true, progress: 100, description: "پایدارسازی سر مفصل استخوان بازو در فضای کتف." },
      { id: "ex-s2", name: "ثبات ایزومتریک شانه تکیه به لبه رینگ", reps: "۲۰ ثانیه نگه داشتن", sets: 3, completed: false, progress: 60, description: "تحریک همزمان حرکتی برای فعال‌سازی کپسول خلفی شانه آسیب‌دیده." },
      { id: "ex-s3", name: "کشش پکتورالیس مینور با غلتک فومی", reps: "۶۰ ثانیه آرامش", sets: 2, completed: true, progress: 100, description: "کاهش کشیدگی رو به جلو کتف و هم‌راستایی مجرای عصب گردنی." },
    ],
    notes: "بوکسور سنگین‌وزن نیاز مبرم به بازسازی قدرت سه‌بعدی شانه جهت مشت‌های هوک چپ دارد. از بارهای سنگین پرتابی پرهیز شود.",
    completedSessionsLog: [
      { date: "۱۴۰۶/۰۳/۰۶", completedExercisesCount: 2, notes: "تمرینات ثبات اسکاپولا و کشش ملایم با آستانه VAS شش صورت گرفت." }
    ]
  }
];

const initialFeedbacks: Record<string, { sender: "patient" | "coach"; text: string; date: string }[]> = {
  client_sajjad: [
    { sender: "coach", text: "سجاد عزیز، تمرین ایزومتریک زانو را حتماً هر صبح تکرار کن و هرگونه درد بالای امتیاز ۴ را به من گزارش بده.", date: "۱۴۰۶/۰۲/۱۲" },
    { sender: "patient", text: "سلام دکتر امیر حبیبی عزیز، امروز خوشبختانه تمرین بالانسر را با چشمان بسته بدون لرزش زانو انجام دادم. ممنون از برنامه اصلاحی دقیق شما.", date: "۱۴۰6/۰۲/۱۵" },
    { sender: "coach", text: "بسیار عالی قهرمان، روند بازسازی غضلاف در زانوی تان شگفت‌آور است. فردا در کلینیک می‌بینمت.", date: "۱۴۰۶/۰۲/۱۶" }
  ],
  client_sina: [
    { sender: "coach", text: "سینای عزیز، از مشت زدن چپ سنگین فعلاً حین تمرینات کیسه‌بوکس پرهیز کنید تا تاندون روتاتور کاف ترمیم کامل شود.", date: "۱۴۰۶/۰۳/۰۶" },
    { sender: "patient", text: "سلام آقای دکتر. حین بالا آوردن کتف درد مبهمی دارم. روی مقیاس VAS امتیاز ۶ است.", date: "۱۴۰۶/۰۳/۰۸" }
  ]
};

const getZoneLabel = (zone: PainZone) => {
  switch (zone) {
    case "shoulder": return "شانه / روتاتور کاف";
    case "knee": return "زانو / رباط‌ها";
    case "lower_back": return "کمر / دیسک کمر";
    case "ankle": return "مچ پا / آشیل";
    case "neck": return "گردن";
    case "elbow": return "آرنج";
    default: return "لگن و باسن";
  }
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      role: "guest",
      theme: "dark",
      showAssessment: false,
      alertConfig: {
        show: false,
        title: "",
        msg: "",
        type: "success"
      },
      clients: initialClients,
      activeClientId: "client_sajjad",
      feedbacks: initialFeedbacks,

      setRole: (role) => set({ role }),
      setTheme: (theme) => set({ theme }),
      setShowAssessment: (showAssessment) => set({ showAssessment }),
      setActiveClientId: (activeClientId) => set({ activeClientId }),
      
      triggerAlert: (title, msg, type = "success") => set({
        alertConfig: { show: true, title, msg, type }
      }),
      
      dismissAlert: () => set((state) => ({
        alertConfig: { ...state.alertConfig, show: false }
      })),

      updatePainHistory: (newIntensity, zoneNotes = "") => {
        const targetId = get().activeClientId;
        
        set((state) => {
          const updatedClients = state.clients.map((c) => {
            if (c.id === targetId) {
              const todayStr = new Date().toLocaleDateString("fa-IR", { month: "2-digit", day: "2-digit" });
              const newPt = { date: todayStr, intensity: newIntensity };
              return {
                ...c,
                currentPainLevel: newIntensity,
                painHistory: [...c.painHistory, newPt],
                notes: zoneNotes ? `${c.notes}\n[بروزرسانی بیمار]: ${zoneNotes}` : c.notes
              };
            }
            return c;
          });

          return {
            clients: updatedClients,
            alertConfig: {
              show: true,
              title: "پایش درد ثبت شد",
              msg: `شدت درد شما با امتیاز ${newIntensity} روی نمودار VAS با موفقیت ذخیره گردید و به کنترلر دکتر حبیبی فرستاده شد.`,
              type: "success"
            }
          };
        });
      },

      addDailyCheckIn: (mood, sleep) => {
        const targetId = get().activeClientId;
        set((state) => ({
          clients: state.clients.map((c) => {
            if (c.id === targetId) {
              const todayStr = new Date().toLocaleDateString("fa-IR", { month: "2-digit", day: "2-digit" });
              const currentCheckIns = c.checkIns || [];
              return {
                ...c,
                checkIns: [...currentCheckIns, { date: todayStr, mood, sleep }]
              };
            }
            return c;
          }),
          alertConfig: {
            show: true,
            title: "فرم ارزیابی روزانه ثبت شد",
            msg: "اطلاعات فرم روزانه شما با موفقیت ذخیره گردید.",
            type: "success"
          }
        }));
      },

      toggleExercise: (exerciseId) => {
        const activeId = get().activeClientId;
        set((state) => ({
          clients: state.clients.map((c) => {
            if (c.id === activeId) {
              return {
                ...c,
                prescription: c.prescription.map((ex) => 
                  ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
                )
              };
            }
            return c;
          })
        }));
      },

      sendFeedback: (clientId, text, sender) => {
        const today = new Date().toLocaleDateString("fa-IR");
        set((state) => {
          const currentList = state.feedbacks[clientId] || [];
          return {
            feedbacks: {
              ...state.feedbacks,
              [clientId]: [...currentList, { sender, text, date: today }]
            }
          };
        });
      },

      addClient: (newClient) => {
        set((state) => ({
          clients: [newClient, ...state.clients],
          activeClientId: newClient.id
        }));
      },

      endSession: (clientId, notes, completedExercisesCount) => {
        set((state) => {
          const updatedClients = state.clients.map((c) => {
            if (c.id === clientId) {
              const updatedCompleted = Math.min(c.sessionsCompleted + 1, c.sessionsPurchased);
              const todayStr = new Date().toLocaleDateString("fa-IR");
              const newSessionLog = {
                date: todayStr,
                completedExercisesCount,
                notes: notes || "جلسه با موفقیت به پایان رسید."
              };
              return {
                ...c,
                sessionsCompleted: updatedCompleted,
                completedSessionsLog: [newSessionLog, ...c.completedSessionsLog]
              };
            }
            return c;
          });

          const clientObj = updatedClients.find(c => c.id === clientId);
          const updatedCount = clientObj ? clientObj.sessionsCompleted : 1;
          const totalCount = clientObj ? clientObj.sessionsPurchased : 12;

          return {
            clients: updatedClients,
            alertConfig: {
              show: true,
              title: "جلسه درمان با موفقیت تایید و پایان یافت!",
              msg: `جلسه شماره ${updatedCount} از ${totalCount} برای ورزشکارثبت و کسر گردید. الگوهای کینزیولوژیک جهت ریکاوری ذخیره شدند.`,
              type: "success"
            }
          };
        });
      },

      assessmentSubmit: (data) => {
        const newId = "client_" + Date.now();
        const mockPrescription: PatientExercise[] = [
          { id: "ex-a-1", name: "هم‌انقباضی زانو یا شانه ایزومتریک", reps: "۱۰ تکرار ۵ ثانیه‌ای", sets: 3, completed: false, progress: 0, description: "فعال‌سازی غلاف عصب عضلانی اولیه بر مبنای ارزیابی VAS" },
          { id: "ex-a-2", name: "کشش استاتیک دامنه مفصلی کینزیو", reps: "۳۰ ثانیه نگه داشتن", sets: 3, completed: false, progress: 0, description: "آزادسازی کشش محافظتی عضلات کپسول مفصل صدمه‌دیده" },
          { id: "ex-a-3", name: "تمرین اصلاح الگوهای زنجیره بسته", reps: "۱۲ تکرار تمرکزی", sets: 3, completed: false, progress: 0, description: "تقویت ثبات دینامیکی بدون گذر اندام از زاویه حاد درد" }
        ];

        const newClient: ClientRecord = {
          id: newId,
          name: data.fullName,
          fullName: `${data.fullName} (ورزشکار ${data.sport})`,
          phone: data.phone,
          email: data.fullName.toLowerCase().replace(/\s+/g, "") + "@example.com",
          age: data.age,
          sport: data.sport,
          injury: `مصدومیت ناحیه ${getZoneLabel(data.selectedZone)} - ارزیابی اولیه`,
          injuryZone: data.selectedZone,
          joinDate: new Date().toLocaleDateString("fa-IR"),
          sessionsPurchased: 12,
          sessionsCompleted: 0,
          initialPainLevel: data.painIntensity,
          currentPainLevel: data.painIntensity,
          painHistory: [
            { date: "امروز", intensity: data.painIntensity }
          ],
          prescription: mockPrescription,
          notes: `سابقه اعلامی کاربر: ${data.history || "عدم درج"}. اهداف: ${data.goals}`,
          completedSessionsLog: []
        };

        set((state) => ({
          clients: [newClient, ...state.clients],
          activeClientId: newId,
          role: "patient",
          showAssessment: false,
          alertConfig: {
            show: true,
            title: "پرونده ارزیابی با موفقیت ثبت شد!",
            msg: `به پرتال درمانی خود خوش آمدید، ${data.fullName}. نسخه اولیه تمرینات و پایش درد شما بر اساس متد علمی دکتر حبیبی فعال شد.`,
            type: "success"
          }
        }));
      }
    }),
    {
      name: 'amir-habibi-sports-rehab-storage',
      partialize: (state) => ({ role: state.role, theme: state.theme }), // persist only role and theme
    }
  )
);
