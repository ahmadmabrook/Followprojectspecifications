import { useState } from "react";
import {
  Briefcase, Wallet, User, ChevronLeft, Phone, Navigation, MapPin, Camera,
  Star, CheckCircle2, Clock, Plus, AlertCircle,
  Bell, Headphones,
} from "lucide-react";
import {
  PhoneFrame, TopBar, PrimaryButton, Card, Section, Avatar, Stars, ServiceIcon,
  PriceBadge, MapMock, StatusBadge, FullCTA, InlineRow, SERVICES, ConfirmDialog,
  FaqAccordion, notify, soon,
} from "./shared";

type S =
  | "auth" | "docs" | "pending" | "approved"
  | "home" | "incoming" | "active" | "in-progress" | "completed"
  | "earnings" | "withdraw" | "ratings" | "profile" | "suspended"
  | "personal-data" | "services-pricing" | "bank-account" | "tech-notifications" | "tech-support";

const TABS = [
  { id: "home" as S, ar: "الطلبات", Icon: Briefcase, badge: 1 },
  { id: "earnings" as S, ar: "الأرباح", Icon: Wallet },
  { id: "profile" as S, ar: "حسابي", Icon: User },
];

export default function TechnicianMobile() {
  const [s, setS] = useState<S>("auth");

  return (
    <PhoneFrame>
      <div className="h-full overflow-hidden" style={{ background: "#F6F8FB" }}>
        {s === "auth" && <Auth onNext={() => setS("docs")} />}
        {s === "docs" && <Docs onNext={() => setS("pending")} />}
        {s === "pending" && <Pending onApproved={() => setS("approved")} />}
        {s === "approved" && <Approved onContinue={() => setS("home")} />}

        {s === "home" && <HomeDash onIncoming={() => setS("incoming")} onRatings={() => setS("ratings")} />}
        {s === "incoming" && <Incoming onAccept={() => setS("active")} onReject={() => setS("home")} />}
        {s === "active" && <Active onStart={() => setS("in-progress")} />}
        {s === "in-progress" && <InProgressTech onDone={() => setS("completed")} />}
        {s === "completed" && <Completed onBack={() => setS("home")} />}

        {s === "earnings" && <Earnings onWithdraw={() => setS("withdraw")} />}
        {s === "withdraw" && <Withdraw onBack={() => setS("earnings")} />}
        {s === "ratings" && <Ratings onBack={() => setS("home")} />}
        {s === "profile" && <TechProfile onSuspended={() => setS("suspended")} onPersonalData={() => setS("personal-data")} onServicesPricing={() => setS("services-pricing")} onBankAccount={() => setS("bank-account")} onNotifications={() => setS("tech-notifications")} onSupport={() => setS("tech-support")} onLogout={() => setS("auth")} />}
        {s === "suspended" && <Suspended onBack={() => setS("profile")} />}
        {s === "personal-data" && <TechPersonalData onBack={() => setS("profile")} />}
        {s === "services-pricing" && <TechServicesPricing onBack={() => setS("profile")} />}
        {s === "bank-account" && <TechBankAccount onBack={() => setS("profile")} />}
        {s === "tech-notifications" && <TechNotifications onBack={() => setS("profile")} />}
        {s === "tech-support" && <TechSupport onBack={() => setS("profile")} />}

        {(s === "home" || s === "earnings" || s === "profile") && (
          <div className="absolute bottom-0 inset-x-0 h-16 bg-white border-t border-slate-200 flex">
            {TABS.map(t => {
              const active = s === t.id;
              return (
                <button key={t.id} onClick={() => setS(t.id)} className="flex-1 flex flex-col items-center justify-center gap-0.5 relative">
                  <div className="relative">
                    <t.Icon size={22} color={active ? "#1366D6" : "#94A3B8"} strokeWidth={active ? 2.5 : 2} />
                    {t.badge && <span className="absolute -top-1 -end-2 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center text-white" style={{ background: "#E5484D", fontFamily: "Inter" }}>{t.badge}</span>}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: active ? "#1366D6" : "#94A3B8" }}>{t.ar}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}

function Auth({ onNext }: { onNext: () => void }) {
  return (
    <div className="h-full bg-white flex flex-col px-5 pt-10 relative">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center" style={{ background: "#1366D6" }}>
          <span style={{ fontSize: 36 }}>🔧</span>
        </div>
        <h1 className="mt-4" style={{ fontWeight: 800, fontSize: 26 }}>Fixly للفنيين</h1>
        <p style={{ color: "#475569", fontSize: 14 }} className="mt-2">سجّل دخولك لتبدأ استقبال الطلبات</p>
      </div>

      <div className="mt-8 h-[52px] border border-slate-200 rounded-xl flex items-center px-4 gap-3 bg-white" dir="ltr">
        <span style={{ fontWeight: 600 }}>+962</span>
        <span className="w-px h-6 bg-slate-200" />
        <input className="flex-1 outline-none" style={{ fontFamily: "Inter", fontSize: 16 }} defaultValue="79 555 1234" />
      </div>
      <FullCTA onClick={onNext}>إرسال الرمز</FullCTA>
    </div>
  );
}

function Docs({ onNext }: { onNext: () => void }) {
  const [services, setServices] = useState<string[]>(["elec"]);
  const docs = [
    { label: "صورة الهوية الوطنية", icon: "🪪", done: true },
    { label: "شهادة مهنية (اختياري)", icon: "📜", done: false },
    { label: "صورة شخصية (سيلفي)", icon: "🤳", done: true },
  ];
  return (
    <div className="h-full bg-white relative">
      <TopBar title="بيانات الفني" />
      <div className="px-5 mt-2 space-y-4 overflow-y-auto pb-32" style={{ height: "calc(100% - 56px)" }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 14 }} className="mb-2">المستندات</h3>
          {docs.map((d, i) => (
            <Card key={i} className="p-3 mb-2 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "#F1F5F9", fontSize: 20 }}>{d.icon}</div>
              <div className="flex-1">
                <div style={{ fontWeight: 600, fontSize: 13 }}>{d.label}</div>
                <div style={{ color: d.done ? "#15803D" : "#94A3B8", fontSize: 11 }}>{d.done ? "✓ تم الرفع" : "لم يُرفع بعد"}</div>
              </div>
              <button onClick={soon} aria-label="رفع مستند" className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#E8F1FE" }}>
                <Camera size={18} color="#1366D6" />
              </button>
            </Card>
          ))}
        </div>

        <div>
          <h3 style={{ fontWeight: 700, fontSize: 14 }} className="mb-2">الخدمات المُقدّمة</h3>
          <div className="grid grid-cols-3 gap-2">
            {SERVICES.map(sv => {
              const on = services.includes(sv.id);
              return (
                <button key={sv.id} onClick={() => setServices(on ? services.filter(x => x !== sv.id) : [...services, sv.id])} className="p-3 rounded-xl border-2 text-center" style={{ borderColor: on ? "#1366D6" : "#E2E8F0", background: on ? "#E8F1FE" : "#FFF" }}>
                  <div className="mx-auto" style={{ width: 36, height: 36 }}><ServiceIcon id={sv.id} size={18} /></div>
                  <div style={{ fontSize: 11, fontWeight: 600 }} className="mt-1.5">{sv.ar}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 style={{ fontWeight: 700, fontSize: 14 }} className="mb-2">الأجر بالساعة (40–60 دينار)</h3>
          <Card className="p-4">
            <div className="text-center"><span style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 32, color: "#1366D6" }}>50</span> <span style={{ fontWeight: 600 }}>دينار/ساعة</span></div>
            <div className="mt-3 h-2 rounded-full bg-slate-100 relative">
              <div className="absolute inset-y-0 right-0 rounded-full" style={{ background: "#1366D6", width: "50%" }} />
              <div className="absolute -top-1 w-4 h-4 rounded-full bg-white border-2" style={{ right: "50%", borderColor: "#1366D6" }} />
            </div>
            <div className="mt-2 flex justify-between" style={{ color: "#94A3B8", fontSize: 11, fontFamily: "Inter" }}><span>40</span><span>60</span></div>
          </Card>
        </div>
      </div>
      <FullCTA onClick={onNext}>إرسال للمراجعة</FullCTA>
    </div>
  );
}

function Pending({ onApproved }: { onApproved: () => void }) {
  return (
    <div className="h-full bg-white flex flex-col items-center justify-center text-center px-8">
      <div className="w-32 h-32 rounded-full flex items-center justify-center" style={{ background: "#FEF3C7" }}>
        <Clock size={64} color="#B45309" />
      </div>
      <h1 className="mt-5" style={{ fontWeight: 700, fontSize: 22 }}>طلبك قيد المراجعة</h1>
      <p style={{ color: "#475569", fontSize: 14 }} className="mt-2">سنرد عليك خلال 24 ساعة. سترسل إشعاراً عند الموافقة.</p>
      <div className="absolute bottom-8 inset-x-5">
        <PrimaryButton variant="outline" onClick={onApproved}>محاكاة: تمت الموافقة</PrimaryButton>
      </div>
    </div>
  );
}

function Approved({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="h-full bg-white flex flex-col items-center justify-center text-center px-8">
      <div className="w-32 h-32 rounded-full flex items-center justify-center" style={{ background: "#DCFCE7" }}>
        <CheckCircle2 size={72} color="#15803D" strokeWidth={2.5} />
      </div>
      <h1 className="mt-5" style={{ fontWeight: 700, fontSize: 22 }}>تمت الموافقة! 🎉</h1>
      <p style={{ color: "#475569", fontSize: 14 }} className="mt-2">يمكنك الآن البدء في استقبال الطلبات.</p>
      <div className="absolute bottom-8 inset-x-5">
        <PrimaryButton onClick={onContinue}>ابدأ العمل</PrimaryButton>
      </div>
    </div>
  );
}

function HomeDash({ onIncoming, onRatings }: { onIncoming: () => void; onRatings: () => void }) {
  const [online, setOnline] = useState(true);
  return (
    <div className="h-full overflow-y-auto pb-20">
      <div className="bg-white px-5 pt-3 pb-4">
        <div className="flex items-center gap-3">
          <Avatar name="خالد المومني" size={48} verified />
          <div className="flex-1">
            <div style={{ fontWeight: 700, fontSize: 16 }}>أهلاً خالد</div>
            <div className="flex items-center gap-2 mt-0.5">
              <Stars rating={4.9} size={12} />
              <span style={{ color: "#94A3B8", fontSize: 11 }}>· <span style={{ fontFamily: "Inter" }}>320</span> خدمة</span>
            </div>
          </div>
        </div>

        <Card className="mt-4 p-4 flex items-center gap-3" style={{ background: online ? "linear-gradient(95deg,#0FB5A6 0%,#0D9488 100%)" : "#F1F5F9" }}>
          <div className="flex-1">
            <div style={{ color: online ? "#FFF" : "#0F172A", fontWeight: 700, fontSize: 16 }}>{online ? "متاح للعمل" : "غير متاح"}</div>
            <div style={{ color: online ? "#CFFAFE" : "#475569", fontSize: 12 }}>{online ? "تستقبل الطلبات الآن" : "لا تظهر للعملاء"}</div>
          </div>
          <button onClick={() => setOnline(!online)} className="w-14 h-8 rounded-full relative transition" style={{ background: online ? "rgba(255,255,255,0.3)" : "#CBD5E1" }}>
            <div className="absolute top-1 w-6 h-6 rounded-full bg-white transition-all" style={{ [online ? "right" : "left"]: 4 }} />
          </button>
        </Card>
      </div>

      <Section>
        <div className="grid grid-cols-3 gap-2">
          {[
            { v: "85", l: "اليوم", c: "#1366D6" },
            { v: "6", l: "خدمات", c: "#0FB5A6" },
            { v: "4.9", l: "تقييم", c: "#F5A623" },
          ].map(k => (
            <Card key={k.l} className="p-3 text-center">
              <div style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 22, color: k.c }}>{k.v}</div>
              <div style={{ color: "#475569", fontSize: 11 }} className="mt-0.5">{k.l}</div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="طلبات قريبة">
        <button onClick={onIncoming} className="w-full text-start">
          <Card className="p-4 border-2" style={{ borderColor: "#1366D6", background: "#E8F1FE" }}>
            <div className="flex items-center gap-3">
              <ServiceIcon id="elec" size={22} />
              <div className="flex-1">
                <div style={{ fontWeight: 700, fontSize: 14 }}>طلب جديد — كهرباء</div>
                <div style={{ color: "#475569", fontSize: 12 }} className="mt-0.5">خلدا · على بُعد <span style={{ fontFamily: "Inter", fontWeight: 700 }}>1.2</span> كم</div>
              </div>
              <PriceBadge amount={50} />
            </div>
            <div className="mt-3 flex items-center justify-between p-2 rounded-lg" style={{ background: "#FFF" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#B45309" }}>اقبل خلال 5 دقائق</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#E5484D" }} />
                <span style={{ fontFamily: "Inter", fontWeight: 700, color: "#E5484D" }}>4:32</span>
              </div>
            </div>
          </Card>
        </button>

        <button onClick={onRatings} className="w-full mt-3 text-start">
          <Card className="p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#FEF3C7" }}><Star size={18} color="#F5A623" fill="#F5A623" /></div>
            <div className="flex-1">
              <div style={{ fontWeight: 600, fontSize: 13 }}>تقييماتي</div>
              <div style={{ color: "#475569", fontSize: 11 }}>عرض تعليقات العملاء</div>
            </div>
            <ChevronLeft size={18} color="#94A3B8" />
          </Card>
        </button>
      </Section>
    </div>
  );
}

function Incoming({ onAccept, onReject }: { onAccept: () => void; onReject: () => void }) {
  return (
    <div className="h-full bg-white relative flex flex-col">
      <TopBar title="طلب جديد" />
      <MapMock height={260} customerLabel="موقع العميل" />
      <div className="flex-1 px-5 pt-4">
        <div className="flex items-center gap-3">
          <ServiceIcon id="elec" size={24} />
          <div className="flex-1">
            <div style={{ fontWeight: 800, fontSize: 18 }}>كهرباء</div>
            <div style={{ color: "#475569", fontSize: 13 }}>إصلاح قاطع رئيسي</div>
          </div>
          <PriceBadge amount={50} big />
        </div>
        <Card className="mt-4 p-3 space-y-2">
          <div className="flex items-center gap-2"><MapPin size={16} color="#475569" /><span style={{ fontSize: 13 }}>خلدا، شارع وصفي التل · <span style={{ fontFamily: "Inter", fontWeight: 600 }}>1.2</span> كم</span></div>
          <div className="flex items-center gap-2"><Clock size={16} color="#475569" /><span style={{ fontSize: 13 }}>فوراً — خلال 30 دقيقة</span></div>
        </Card>

        <div className="mt-4 p-3 rounded-xl text-center" style={{ background: "#FEE2E2" }}>
          <div style={{ color: "#B91C1C", fontSize: 12, fontWeight: 600 }}>اقبل الطلب خلال</div>
          <div className="mt-1 flex items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#FFF" }}>
              <span style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 20, color: "#E5484D" }}>4:32</span>
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 pb-6 pt-3 grid grid-cols-2 gap-2">
        <PrimaryButton variant="outline" onClick={onReject}>رفض</PrimaryButton>
        <PrimaryButton onClick={onAccept}>قبول</PrimaryButton>
      </div>
    </div>
  );
}

function Active({ onStart }: { onStart: () => void }) {
  return (
    <div className="h-full bg-white relative">
      <TopBar title="الطلب النشط" />
      <MapMock showRoute showTechPin height={300} customerLabel="عميل" techLabel="أنت" />
      <div className="px-5 pt-4">
        <Card className="p-3 flex items-center gap-3">
          <Avatar name="أحمد العلي" />
          <div className="flex-1">
            <div style={{ fontWeight: 700, fontSize: 14 }}>أحمد العلي</div>
            <div style={{ color: "#475569", fontSize: 12 }}>خلدا — <span style={{ fontFamily: "Inter" }}>1.2</span> كم</div>
          </div>
        </Card>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button onClick={() => notify("فتح خرائط Google…")} className="h-12 rounded-xl border border-slate-200 flex items-center justify-center gap-2" style={{ fontSize: 13, fontWeight: 600 }}><Navigation size={16} color="#1366D6" /> فتح الخرائط</button>
          <button onClick={() => notify("جارٍ الاتصال بالعميل…")} className="h-12 rounded-xl border border-slate-200 flex items-center justify-center gap-2" style={{ fontSize: 13, fontWeight: 600 }}><Phone size={16} color="#1366D6" /> اتصال</button>
        </div>
      </div>
      <FullCTA onClick={onStart}>بدء الخدمة</FullCTA>
    </div>
  );
}

function InProgressTech({ onDone }: { onDone: () => void }) {
  return (
    <div className="h-full bg-white relative">
      <TopBar title="الخدمة جارية" />
      <div className="px-5 mt-3 text-center">
        <StatusBadge status="in_progress" />
        <div className="mt-5 w-32 h-32 mx-auto rounded-full flex items-center justify-center" style={{ background: "#FEF3C7" }}>
          <span style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 28, color: "#B45309" }}>00:42</span>
        </div>
        <div style={{ color: "#475569", fontSize: 13 }} className="mt-2">المدة المنقضية</div>

        <Card className="mt-5 p-4 text-start">
          <div style={{ fontWeight: 700, fontSize: 14 }} className="mb-2">عمل إضافي</div>
          <div className="flex items-center justify-between py-2">
            <span style={{ fontSize: 13 }}>استبدال مفتاح إضاءة</span>
            <span style={{ fontFamily: "Inter", fontWeight: 700 }}>15 دينار</span>
          </div>
          <button onClick={() => notify("سيتم إرسال البند للعميل للموافقة")} className="w-full mt-2 p-3 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center gap-2" style={{ color: "#1366D6", fontWeight: 600, fontSize: 13 }}>
            <Plus size={16} /> إضافة بند
          </button>
        </Card>
      </div>
      <FullCTA onClick={onDone}>إنهاء الخدمة</FullCTA>
    </div>
  );
}

function Completed({ onBack }: { onBack: () => void }) {
  return (
    <div className="h-full bg-white flex flex-col items-center justify-center px-8 text-center">
      <div className="w-28 h-28 rounded-full flex items-center justify-center" style={{ background: "#DCFCE7" }}>
        <CheckCircle2 size={64} color="#15803D" strokeWidth={2.5} />
      </div>
      <h1 className="mt-5" style={{ fontWeight: 700, fontSize: 22 }}>أحسنت! تم إنهاء الخدمة</h1>
      <Card className="mt-5 p-4 w-full text-start">
        <InlineRow label="المبلغ" value="50 دينار" />
        <InlineRow label="عمل إضافي" value="15 دينار" />
        <div className="h-px bg-slate-100 my-1" />
        <InlineRow strong label="الإجمالي" value="65 دينار" />
      </Card>
      <div className="absolute bottom-8 inset-x-5"><PrimaryButton onClick={onBack}>تم</PrimaryButton></div>
    </div>
  );
}

function Earnings({ onWithdraw }: { onWithdraw: () => void }) {
  return (
    <div className="h-full overflow-y-auto pb-20">
      <div className="px-5 pt-3 pb-4" style={{ background: "linear-gradient(180deg,#1366D6 0%,#0E4FA8 100%)" }}>
        <h1 style={{ fontWeight: 700, fontSize: 22, color: "#FFF" }}>الأرباح</h1>
        <Card className="mt-3 p-5">
          <div style={{ color: "#475569", fontSize: 12 }}>الرصيد المتاح</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 42, color: "#1366D6" }}>310</span>
            <span style={{ fontWeight: 700 }}>دينار</span>
          </div>
          <PrimaryButton onClick={onWithdraw}>سحب الرصيد</PrimaryButton>
        </Card>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Card className="p-3">
            <div style={{ color: "#475569", fontSize: 11 }}>اليوم</div>
            <div className="mt-1" style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 22 }}>85 <span style={{ fontWeight: 600, fontSize: 13 }}>د</span></div>
          </Card>
          <Card className="p-3">
            <div style={{ color: "#475569", fontSize: 11 }}>هذا الشهر</div>
            <div className="mt-1" style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 22 }}>1,240 <span style={{ fontWeight: 600, fontSize: 13 }}>د</span></div>
          </Card>
        </div>
      </div>

      <Section title="آخر المعاملات">
        <Card>
          {[
            { svc: "كهرباء", amount: 50, date: "اليوم · 3:30 م", type: "in" },
            { svc: "تكييف", amount: 35, date: "اليوم · 11:00 ص", type: "in" },
            { svc: "سحب رصيد", amount: 200, date: "أمس", type: "out" },
            { svc: "سباكة", amount: 40, date: "05/06", type: "in" },
          ].map((t, i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-3 border-b last:border-0 border-slate-100">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: t.type === "in" ? "#DCFCE7" : "#FEE2E2", color: t.type === "in" ? "#15803D" : "#B91C1C", fontWeight: 700 }}>
                {t.type === "in" ? "+" : "−"}
              </div>
              <div className="flex-1">
                <div style={{ fontWeight: 600, fontSize: 14 }}>{t.svc}</div>
                <div style={{ color: "#94A3B8", fontSize: 11 }}>{t.date}</div>
              </div>
              <span style={{ fontFamily: "Inter", fontWeight: 700, color: t.type === "in" ? "#15803D" : "#0F172A" }}>{t.type === "in" ? "+" : "−"}{t.amount} د</span>
            </div>
          ))}
        </Card>
      </Section>
    </div>
  );
}

function Withdraw({ onBack }: { onBack: () => void }) {
  return (
    <div className="h-full bg-white relative">
      <TopBar title="سحب الرصيد" onBack={onBack} />
      <div className="px-5 mt-3 space-y-3">
        <Card className="p-4">
          <div style={{ color: "#475569", fontSize: 12 }}>الرصيد المتاح</div>
          <div className="mt-1"><span style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 28, color: "#1366D6" }}>310</span> <span style={{ fontWeight: 700 }}>دينار</span></div>
        </Card>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600 }}>المبلغ</label>
          <div className="mt-2 h-14 rounded-xl border-2 border-slate-200 flex items-center px-4 gap-2" style={{ borderColor: "#1366D6" }}>
            <input className="flex-1 outline-none" style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 22 }} defaultValue="200" />
            <span style={{ fontWeight: 700, color: "#475569" }}>دينار</span>
          </div>
          <p style={{ color: "#94A3B8", fontSize: 11 }} className="mt-1">الحد الأدنى <span style={{ fontFamily: "Inter", fontWeight: 600 }}>20</span> دينار · كل 24 ساعة</p>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600 }}>الحساب البنكي</label>
          <Card className="mt-2 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#E8F1FE" }}>🏦</div>
            <div className="flex-1">
              <div style={{ fontWeight: 600, fontSize: 13 }}>البنك العربي</div>
              <div style={{ color: "#475569", fontSize: 11, fontFamily: "Inter" }}>JO94 ARAB 1234 5678</div>
            </div>
            <button onClick={soon} style={{ color: "#1366D6", fontSize: 12, fontWeight: 600 }}>تغيير</button>
          </Card>
        </div>
      </div>
      <FullCTA onClick={onBack}>تأكيد السحب</FullCTA>
    </div>
  );
}

function Ratings({ onBack }: { onBack: () => void }) {
  return (
    <div className="h-full bg-white">
      <TopBar title="تقييماتي" onBack={onBack} />
      <div className="px-5 mt-3 overflow-y-auto" style={{ height: "calc(100% - 56px)" }}>
        <Card className="p-5 text-center">
          <div style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 56, color: "#F5A623" }}>4.9</div>
          <div className="flex justify-center gap-0.5 mt-1">
            {[1,2,3,4,5].map(n => <Star key={n} size={18} fill="#F5A623" color="#F5A623" />)}
          </div>
          <div style={{ color: "#475569", fontSize: 12 }} className="mt-1">من <span style={{ fontFamily: "Inter", fontWeight: 600 }}>320</span> تقييم</div>
        </Card>

        <div className="mt-4 space-y-3">
          {[
            { name: "أحمد العلي", rating: 5, comment: "فني محترف ووصل بسرعة. أنصح بالتعامل معه.", date: "اليوم" },
            { name: "سارة خالد", rating: 5, comment: "ممتاز جداً، حلّ المشكلة بدقة وأمانة.", date: "05/06" },
            { name: "محمد الزعبي", rating: 4, comment: "جيد، لكن تأخر قليلاً عن الموعد.", date: "01/06" },
          ].map((r, i) => (
            <Card key={i} className="p-3">
              <div className="flex items-center gap-2">
                <Avatar name={r.name} size={32} />
                <div className="flex-1">
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{r.name}</div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(n => <Star key={n} size={12} fill={n <= r.rating ? "#F5A623" : "transparent"} color={n <= r.rating ? "#F5A623" : "#CBD5E1"} />)}
                  </div>
                </div>
                <span style={{ color: "#94A3B8", fontSize: 11 }}>{r.date}</span>
              </div>
              <p style={{ color: "#475569", fontSize: 13 }} className="mt-2">{r.comment}</p>
              <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded" style={{ background: "#DCFCE7", color: "#15803D", fontSize: 10, fontWeight: 600 }}>تقييم موثّق</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function TechProfile({ onSuspended, onPersonalData, onServicesPricing, onBankAccount, onNotifications, onSupport, onLogout }: {
  onSuspended: () => void; onPersonalData: () => void; onServicesPricing: () => void;
  onBankAccount: () => void; onNotifications: () => void; onSupport: () => void; onLogout: () => void;
}) {
  const [confirmLogout, setConfirmLogout] = useState(false);

  const menuItems = [
    { label: "البيانات الشخصية", action: onPersonalData },
    { label: "الخدمات والأسعار", action: onServicesPricing },
    { label: "الحساب البنكي", action: onBankAccount },
    { label: "الإشعارات", action: onNotifications },
    { label: "الدعم", action: onSupport },
  ];

  return (
    <div className="h-full overflow-y-auto pb-20 relative">
      <div className="bg-white px-5 pt-5 pb-5 text-center">
        <Avatar name="خالد المومني" size={80} verified />
        <h1 className="mt-3" style={{ fontWeight: 700, fontSize: 20 }}>خالد المومني</h1>
        <div className="flex justify-center mt-1"><Stars rating={4.9} /></div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div><div style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 18 }}>320</div><div style={{ fontSize: 11, color: "#475569" }}>خدمة</div></div>
          <div><div style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 18 }}>4.9</div><div style={{ fontSize: 11, color: "#475569" }}>تقييم</div></div>
          <div><div style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 18 }}>98%</div><div style={{ fontSize: 11, color: "#475569" }}>قبول</div></div>
        </div>
      </div>
      <Section>
        <Card>
          {menuItems.map((item, i) => (
            <button key={i} onClick={item.action} className="w-full px-4 py-3.5 flex items-center text-start border-b border-slate-100">
              <span className="flex-1" style={{ fontSize: 14, color: "#0F172A", fontWeight: 600 }}>{item.label}</span>
              <ChevronLeft size={16} color="#94A3B8" />
            </button>
          ))}
          <button onClick={() => setConfirmLogout(true)} className="w-full px-4 py-3.5 flex items-center text-start">
            <span className="flex-1" style={{ fontSize: 14, color: "#E5484D", fontWeight: 600 }}>تسجيل الخروج</span>
            <ChevronLeft size={16} color="#94A3B8" />
          </button>
        </Card>
      </Section>

      {confirmLogout && (
        <ConfirmDialog
          title="تسجيل الخروج"
          body="هل أنت متأكد من تسجيل الخروج؟"
          confirmLabel="تسجيل الخروج"
          variant="destructive"
          onConfirm={onLogout}
          onCancel={() => setConfirmLogout(false)}
        />
      )}
    </div>
  );
}

/* ---------- Tech sub-screens ---------- */

function TechPersonalData({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState("خالد المومني");
  const [email, setEmail] = useState("khaled@example.com");
  return (
    <div className="h-full bg-white relative">
      <TopBar title="البيانات الشخصية" onBack={onBack} />
      <div className="px-5 mt-5 space-y-4">
        <div className="flex flex-col items-center mb-2">
          <div className="relative">
            <Avatar name={name} size={80} verified />
            <button onClick={soon} aria-label="تغيير الصورة" className="absolute bottom-0 end-0 w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center">
              <Camera size={14} color="#1366D6" />
            </button>
          </div>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>الاسم الكامل</label>
          <input value={name} onChange={e => setName(e.target.value)} className="mt-2 w-full h-12 rounded-xl border border-slate-200 px-4 outline-none" style={{ fontSize: 14 }} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>البريد الإلكتروني</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full h-12 rounded-xl border border-slate-200 px-4 outline-none" style={{ fontSize: 14, fontFamily: "Inter" }} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>رقم الهاتف</label>
          <div className="mt-2 h-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center px-4">
            <span style={{ fontFamily: "Inter", color: "#94A3B8" }}>+962 79 555 1234</span>
            <span className="ms-2 px-1.5 py-0.5 rounded" style={{ background: "#E2E8F0", color: "#64748B", fontSize: 10, fontWeight: 700 }}>لا يمكن تغييره</span>
          </div>
        </div>
      </div>
      <FullCTA onClick={onBack}>حفظ التغييرات</FullCTA>
    </div>
  );
}

function TechServicesPricing({ onBack }: { onBack: () => void }) {
  const [services, setServices] = useState<string[]>(["elec", "plumb"]);
  return (
    <div className="h-full bg-white relative">
      <TopBar title="الخدمات والأسعار" onBack={onBack} />
      <div className="px-5 mt-3 overflow-y-auto pb-32" style={{ height: "calc(100% - 56px)" }}>
        <p style={{ color: "#475569", fontSize: 13 }} className="mb-3">اختر الخدمات التي تقدمها</p>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {SERVICES.map(sv => {
            const on = services.includes(sv.id);
            return (
              <button key={sv.id} onClick={() => setServices(on ? services.filter(x => x !== sv.id) : [...services, sv.id])} className="p-3 rounded-xl border-2 text-center" style={{ borderColor: on ? "#1366D6" : "#E2E8F0", background: on ? "#E8F1FE" : "#FFF" }}>
                <div className="mx-auto" style={{ width: 36, height: 36 }}><ServiceIcon id={sv.id} size={18} /></div>
                <div style={{ fontSize: 11, fontWeight: 600 }} className="mt-1.5">{sv.ar}</div>
              </button>
            );
          })}
        </div>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 14 }} className="mb-2">الأجر بالساعة</h3>
          <Card className="p-4">
            <div className="text-center"><span style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 32, color: "#1366D6" }}>50</span> <span style={{ fontWeight: 600 }}>دينار/ساعة</span></div>
            <div className="mt-3 h-2 rounded-full bg-slate-100 relative">
              <div className="absolute inset-y-0 right-0 rounded-full" style={{ background: "#1366D6", width: "50%" }} />
              <div className="absolute -top-1 w-4 h-4 rounded-full bg-white border-2" style={{ right: "50%", borderColor: "#1366D6" }} />
            </div>
            <div className="mt-2 flex justify-between" style={{ color: "#94A3B8", fontSize: 11, fontFamily: "Inter" }}><span>40</span><span>60</span></div>
          </Card>
        </div>
      </div>
      <FullCTA onClick={onBack}>حفظ</FullCTA>
    </div>
  );
}

function TechBankAccount({ onBack }: { onBack: () => void }) {
  return (
    <div className="h-full bg-white relative">
      <TopBar title="الحساب البنكي" onBack={onBack} />
      <div className="px-5 mt-3 space-y-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#E8F1FE", fontSize: 22 }}>🏦</div>
          <div className="flex-1">
            <div style={{ fontWeight: 700, fontSize: 14 }}>البنك العربي</div>
            <div style={{ color: "#475569", fontSize: 12, fontFamily: "Inter" }}>JO94 ARAB 1234 5678</div>
          </div>
          <span className="px-1.5 py-0.5 rounded" style={{ background: "#DCFCE7", color: "#15803D", fontSize: 10, fontWeight: 700 }}>نشط</span>
        </Card>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>اسم صاحب الحساب</label>
          <input defaultValue="خالد المومني" className="mt-2 w-full h-12 rounded-xl border border-slate-200 px-4 outline-none" style={{ fontSize: 14 }} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>رقم IBAN</label>
          <input defaultValue="JO94 ARAB 1234 5678" className="mt-2 w-full h-12 rounded-xl border border-slate-200 px-4 outline-none" style={{ fontSize: 14, fontFamily: "Inter" }} dir="ltr" />
        </div>
        <Card className="p-3 flex items-start gap-2" style={{ background: "#E8F1FE" }}>
          <AlertCircle size={16} color="#1366D6" />
          <p style={{ color: "#0E4FA8", fontSize: 12 }}>يتم التحقق من الحساب البنكي خلال 24 ساعة</p>
        </Card>
      </div>
      <FullCTA onClick={onBack}>حفظ التغييرات</FullCTA>
    </div>
  );
}

function TechNotifications({ onBack }: { onBack: () => void }) {
  const [prefs, setPrefs] = useState({ newRequests: true, reminders: true, earnings: true, promos: false });
  const rows: { key: keyof typeof prefs; label: string; sub: string }[] = [
    { key: "newRequests", label: "طلبات جديدة", sub: "إشعار فوري عند وصول طلب" },
    { key: "reminders", label: "تذكيرات المواعيد", sub: "قبل الموعد بـ 15 دقيقة" },
    { key: "earnings", label: "تحديثات الأرباح", sub: "عند استلام مبلغ جديد" },
    { key: "promos", label: "العروض والأخبار", sub: "نصائح وعروض Fixly" },
  ];
  return (
    <div className="h-full bg-white">
      <TopBar title="الإشعارات" onBack={onBack} />
      <div className="px-5 mt-3">
        <Card>
          {rows.map(r => (
            <div key={r.key} className="px-4 py-3.5 flex items-center gap-3 border-b last:border-0 border-slate-100">
              <div className="flex-1">
                <div style={{ fontWeight: 600, fontSize: 14 }}>{r.label}</div>
                <div style={{ color: "#94A3B8", fontSize: 12 }}>{r.sub}</div>
              </div>
              <button onClick={() => setPrefs({ ...prefs, [r.key]: !prefs[r.key] })} className="w-12 h-7 rounded-full relative transition-colors" style={{ background: prefs[r.key] ? "#1366D6" : "#CBD5E1" }}>
                <div className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all" style={{ [prefs[r.key] ? "right" : "left"]: 2 }} />
              </button>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function TechSupport({ onBack }: { onBack: () => void }) {
  return (
    <div className="h-full bg-white">
      <TopBar title="الدعم والمساعدة" onBack={onBack} />
      <div className="px-5 mt-3 space-y-3">
        <Card className="p-4 flex items-center gap-3" style={{ background: "linear-gradient(95deg,#1366D6 0%,#0E4FA8 100%)" }}>
          <Headphones size={28} color="#FFF" />
          <div className="flex-1">
            <div style={{ color: "#FFF", fontWeight: 700, fontSize: 15 }}>دعم الفنيين 24/7</div>
            <div style={{ color: "#CFE0FB", fontSize: 12 }}>الرد خلال 5 دقائق</div>
          </div>
        </Card>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => notify("مركز المساعدة")} className="text-start">
            <Card className="p-4 text-center">
              <Bell size={24} color="#1366D6" className="mx-auto mb-2" />
              <div style={{ fontWeight: 700, fontSize: 14 }}>مركز المساعدة</div>
              <div style={{ color: "#475569", fontSize: 11 }} className="mt-0.5">أسئلة شائعة</div>
            </Card>
          </button>
          <button onClick={() => notify("تم فتح نموذج الإبلاغ")} className="text-start">
            <Card className="p-4 text-center">
              <AlertCircle size={24} color="#E5484D" className="mx-auto mb-2" />
              <div style={{ fontWeight: 700, fontSize: 14 }}>الإبلاغ عن مشكلة</div>
              <div style={{ color: "#475569", fontSize: 11 }} className="mt-0.5">عميل · دفع · أخرى</div>
            </Card>
          </button>
        </div>
        <Section title="الأسئلة الشائعة">
          <FaqAccordion items={[
            { q: "كيف أسحب أرباحي؟", a: "من شاشة الأرباح، اضغط 'سحب الرصيد' وأدخل المبلغ. يصل الحوالة خلال 24 ساعة." },
            { q: "متى يُضاف المبلغ؟", a: "يُضاف مبلغ الخدمة فور تأكيد العميل اكتمالها." },
            { q: "كيف أرفع مستنداً؟", a: "من 'البيانات الشخصية' أو شاشة المستندات اضغط زر الكاميرا لرفع المستند." },
            { q: "ماذا أفعل عند مشكلة؟", a: "تواصل معنا عبر زر الدعم 24/7 — الرد خلال 5 دقائق." },
          ]} />
        </Section>
      </div>
    </div>
  );
}

function Suspended({ onBack }: { onBack: () => void }) {
  return (
    <div className="h-full bg-white flex flex-col items-center justify-center text-center px-8">
      <div className="w-28 h-28 rounded-full flex items-center justify-center" style={{ background: "#FEE2E2" }}>
        <AlertCircle size={64} color="#B91C1C" />
      </div>
      <h1 className="mt-5" style={{ fontWeight: 700, fontSize: 22 }}>الحساب موقوف مؤقتاً</h1>
      <p style={{ color: "#475569", fontSize: 14 }} className="mt-2">السبب: تراكم رفض الطلبات. تواصل مع الدعم للمراجعة.</p>
      <div className="absolute bottom-8 inset-x-5 space-y-2">
        <PrimaryButton onClick={() => notify("جارٍ الاتصال بدعم الفنيين…")}>تواصل مع الدعم</PrimaryButton>
        <PrimaryButton variant="ghost" onClick={onBack}>رجوع</PrimaryButton>
      </div>
    </div>
  );
}
