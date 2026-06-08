import { useState, useEffect } from "react";
import {
  Search, MapPin, Bell, ChevronLeft, ChevronRight, Headphones, Tag, Calendar,
  CreditCard, ShieldCheck, Phone, MessageCircle, X, Star, Camera, CheckCircle2,
  Home, ClipboardList, User, AlertCircle, Plus, ChevronDown, Apple, Clock,
  Sun, Moon, Settings as SettingsIcon, Download, Share2,
} from "lucide-react";
import {
  PhoneFrame, SERVICES, ServiceIcon, PriceBadge, TopBar, StatusBadge, Stars,
  PrimaryButton, MapMock, Avatar, Card, Section, GuaranteePill, StepIndicator,
  LOGO, FullCTA, InlineRow, ConfirmDialog, FaqAccordion, notify, soon,
} from "./shared";

type Screen =
  | "splash" | "onboarding" | "phone" | "otp" | "permissions"
  | "home" | "service" | "time" | "location" | "payment" | "review" | "searching"
  | "tracking" | "cancel" | "in-progress" | "approve-work" | "completed" | "rate"
  | "bookings" | "booking-detail" | "guarantee" | "guarantee-new" | "guarantee-ticket"
  | "profile" | "edit-profile" | "addresses" | "payment-methods" | "notifications" | "support" | "settings"
  | "settings-language" | "settings-notifications-pref" | "settings-appearance"
  | "no-techs";

const TABS = [
  { id: "home" as Screen, ar: "الرئيسية", Icon: Home },
  { id: "bookings" as Screen, ar: "حجوزاتي", Icon: ClipboardList, badge: 1 },
  { id: "guarantee" as Screen, ar: "الضمان", Icon: ShieldCheck },
  { id: "profile" as Screen, ar: "حسابي", Icon: User },
];

export default function CustomerMobile() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [selectedService, setSelectedService] = useState<typeof SERVICES[number]>(SERVICES[0]);
  const [bookingStep, setBookingStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(45);

  useEffect(() => {
    if (screen === "otp" && resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [screen, resendTimer]);

  const go = (s: Screen) => setScreen(s);
  const tabActive = TABS.some(t => t.id === screen) ? screen : null;

  return (
    <PhoneFrame>
      <div className="h-full overflow-hidden" style={{ background: "#F6F8FB" }}>
        {screen === "splash" && <Splash onContinue={() => go("onboarding")} />}
        {screen === "onboarding" && <Onboarding onDone={() => go("phone")} />}
        {screen === "phone" && <PhoneEntry onSubmit={() => { setResendTimer(45); go("otp"); }} />}
        {screen === "otp" && <OtpVerify otp={otp} setOtp={setOtp} resendTimer={resendTimer} onDone={() => go("permissions")} onBack={() => go("phone")} onResend={() => { setResendTimer(45); notify("تم إرسال رمز جديد عبر واتساب", "success"); }} />}
        {screen === "permissions" && <Permissions onDone={() => go("home")} />}

        {screen === "home" && <HomeScreen onPickService={(s) => { setSelectedService(s); go("service"); }} onTracking={() => go("tracking")} onNotifications={() => go("notifications")} onSupport={() => go("support")} />}
        {screen === "service" && <ServiceDetail svc={selectedService} onBack={() => go("home")} onBook={() => { setBookingStep(0); go("time"); }} />}
        {screen === "time" && <TimeStep onBack={() => go("service")} onNext={() => { setBookingStep(1); go("location"); }} />}
        {screen === "location" && <LocationStep onBack={() => go("time")} onNext={() => { setBookingStep(2); go("payment"); }} />}
        {screen === "payment" && <PaymentStep onBack={() => go("location")} onNext={() => { setBookingStep(3); go("review"); }} />}
        {screen === "review" && <ReviewStep svc={selectedService} onBack={() => go("payment")} onConfirm={() => go("searching")} />}
        {screen === "searching" && <Searching onAssign={() => go("tracking")} onCancel={() => go("home")} onNoTechs={() => go("no-techs")} />}
        {screen === "tracking" && <LiveTracking svc={selectedService} onCancel={() => go("cancel")} onInProgress={() => go("in-progress")} onBack={() => go("home")} onApprove={() => go("approve-work")} />}
        {screen === "cancel" && <CancelFlow onBack={() => go("tracking")} onDone={() => go("home")} />}
        {screen === "in-progress" && <InProgress onApprove={() => go("approve-work")} onDone={() => go("completed")} />}
        {screen === "approve-work" && <ApproveWork onBack={() => go("in-progress")} onApproved={() => go("in-progress")} />}
        {screen === "completed" && <Completed onRate={() => go("rate")} />}
        {screen === "rate" && <RateTechnician onSubmit={() => go("home")} />}

        {screen === "bookings" && <Bookings onOpen={() => go("booking-detail")} />}
        {screen === "booking-detail" && <BookingDetail onBack={() => go("bookings")} />}
        {screen === "guarantee" && <GuaranteeHome onNew={() => go("guarantee-new")} onTicket={() => go("guarantee-ticket")} />}
        {screen === "guarantee-new" && <GuaranteeNew onBack={() => go("guarantee")} onDone={() => go("guarantee-ticket")} />}
        {screen === "guarantee-ticket" && <GuaranteeTicket onBack={() => go("guarantee")} />}

        {screen === "profile" && <Profile onAddresses={() => go("addresses")} onPayments={() => go("payment-methods")} onNotifs={() => go("notifications")} onSupport={() => go("support")} onSettings={() => go("settings")} onEditProfile={() => go("edit-profile")} />}
        {screen === "edit-profile" && <EditProfile onBack={() => go("profile")} />}
        {screen === "addresses" && <Addresses onBack={() => go("profile")} />}
        {screen === "payment-methods" && <PaymentMethods onBack={() => go("profile")} />}
        {screen === "notifications" && <Notifications onBack={() => go("profile")} />}
        {screen === "support" && <Support onBack={() => go("profile")} />}
        {screen === "settings" && <Settings onBack={() => go("profile")} onLanguage={() => go("settings-language")} onNotifPref={() => go("settings-notifications-pref")} onAppearance={() => go("settings-appearance")} onLogout={() => go("splash")} />}
        {screen === "settings-language" && <SettingsLanguage onBack={() => go("settings")} />}
        {screen === "settings-notifications-pref" && <SettingsNotificationsPref onBack={() => go("settings")} />}
        {screen === "settings-appearance" && <SettingsAppearance onBack={() => go("settings")} />}

        {screen === "no-techs" && <NoTechs onRetry={() => go("home")} />}

        {/* Bottom tab bar — only on tabs */}
        {tabActive && (
          <div className="absolute bottom-0 inset-x-0 h-16 bg-white border-t border-slate-200 flex">
            {TABS.map(t => {
              const active = tabActive === t.id;
              return (
                <button key={t.id} onClick={() => setScreen(t.id)} className="flex-1 flex flex-col items-center justify-center gap-0.5 relative">
                  <div className="relative">
                    <t.Icon size={22} color={active ? "#1366D6" : "#94A3B8"} strokeWidth={active ? 2.5 : 2} />
                    {t.badge && (
                      <span className="absolute -top-1 -end-2 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center text-white" style={{ background: "#E5484D", fontFamily: "Inter" }}>{t.badge}</span>
                    )}
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

/* ---------- Auth & onboarding ---------- */

function Splash({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center" style={{ background: "linear-gradient(180deg,#1366D6 0%,#0E4FA8 100%)" }} onClick={onContinue}>
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center">
          <span style={{ fontSize: 32 }}>🔧</span>
        </div>
        <span style={{ color: "#FFF", fontWeight: 800, fontSize: 44, letterSpacing: -1 }}>Fixly</span>
      </div>
      <p className="mt-4" style={{ color: "#E8F1FE", fontSize: 16 }}>فني محترف خلال 30 دقيقة</p>
      <div className="absolute bottom-16">
        <span style={{ color: "#CFE0FB", fontSize: 12 }}>اضغط للمتابعة</span>
      </div>
    </div>
  );
}

function Onboarding({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const slides = [
    { emoji: "⏱️", title: "فني محترف خلال 30 دقيقة", body: "أقرب فني موثوق في عمّان يصلك بسرعة." },
    { emoji: "💰", title: "سعر ثابت وشفاف", body: "تعرف السعر قبل الحجز — بدون مفاجآت." },
    { emoji: "🛡️", title: "ضمان 30 يوم", body: "إذا تكررت المشكلة، نعيد إصلاحها مجاناً." },
  ];
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex justify-end p-4">
        <button onClick={onDone} style={{ color: "#475569", fontSize: 14, fontWeight: 600 }}>تخطّي</button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="w-44 h-44 rounded-full flex items-center justify-center mb-8" style={{ background: "#E8F1FE", fontSize: 88 }}>{slides[i].emoji}</div>
        <h1 style={{ fontWeight: 700, fontSize: 24 }}>{slides[i].title}</h1>
        <p className="mt-3" style={{ color: "#475569", fontSize: 15 }}>{slides[i].body}</p>
      </div>
      <div className="flex items-center justify-center gap-2 mb-6">
        {slides.map((_, idx) => (
          <div key={idx} className="h-2 rounded-full transition-all" style={{ width: idx === i ? 28 : 8, background: idx === i ? "#1366D6" : "#E2E8F0" }} />
        ))}
      </div>
      <div className="px-5 pb-8">
        <PrimaryButton onClick={() => i < 2 ? setI(i + 1) : onDone()}>{i < 2 ? "متابعة" : "ابدأ الآن"}</PrimaryButton>
      </div>
    </div>
  );
}

function PhoneEntry({ onSubmit }: { onSubmit: () => void }) {
  const [phone, setPhone] = useState("79 000 0000");
  return (
    <div className="h-full bg-white">
      <TopBar title="" onBack={() => {}} />
      <div className="px-5 mt-2">
        <h1 style={{ fontWeight: 700, fontSize: 26 }}>أدخل رقم هاتفك</h1>
        <p style={{ color: "#475569", fontSize: 14 }} className="mt-2">سنرسل لك رمز التحقق عبر واتساب</p>

        <div className="mt-8 h-[52px] border border-slate-200 rounded-xl flex items-center px-4 gap-3 bg-white" dir="ltr">
          <span style={{ fontWeight: 600, color: "#0F172A" }}>+962</span>
          <span className="w-px h-6 bg-slate-200" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1 outline-none" style={{ fontFamily: "Inter", fontSize: 16, letterSpacing: 1 }} />
        </div>

        <p className="mt-4" style={{ color: "#94A3B8", fontSize: 12 }}>بالمتابعة فإنك توافق على <span style={{ color: "#1366D6", fontWeight: 600 }}>الشروط</span> و<span style={{ color: "#1366D6", fontWeight: 600 }}>سياسة الخصوصية</span>.</p>
      </div>
      <FullCTA onClick={onSubmit}>متابعة</FullCTA>
    </div>
  );
}

function OtpVerify({ otp, setOtp, resendTimer, onDone, onBack, onResend }: { otp: string; setOtp: (v: string) => void; resendTimer: number; onDone: () => void; onBack: () => void; onResend: () => void; }) {
  return (
    <div className="h-full bg-white">
      <TopBar title="" onBack={onBack} />
      <div className="px-5">
        <h1 style={{ fontWeight: 700, fontSize: 26 }}>أدخل رمز التحقق</h1>
        <p style={{ color: "#475569", fontSize: 14 }} className="mt-2">
          تم الإرسال عبر واتساب إلى <span style={{ fontFamily: "Inter", fontWeight: 600, color: "#0F172A" }} dir="ltr">+962 79 0••• ••00</span>
        </p>

        <div className="mt-8 flex gap-2.5 justify-center" dir="ltr">
          {Array.from({ length: 6 }).map((_, i) => {
            const ch = otp[i] || "";
            return (
              <div key={i} className="w-12 h-14 rounded-xl border-2 flex items-center justify-center" style={{ borderColor: ch ? "#1366D6" : "#E2E8F0", fontFamily: "Inter", fontSize: 22, fontWeight: 700, color: "#0F172A", background: ch ? "#E8F1FE" : "#FFF" }}>
                {ch}
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col items-center gap-3">
          <div className="grid grid-cols-3 gap-2 w-full max-w-xs" dir="ltr">
            {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((k, i) => (
              <button key={i} onClick={() => {
                if (k === "⌫") setOtp(otp.slice(0, -1));
                else if (k && otp.length < 6) setOtp(otp + k);
                if (otp.length === 5 && k !== "" && k !== "⌫") setTimeout(onDone, 300);
              }} className="h-12 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-95 transition" style={{ fontFamily: "Inter", fontSize: 20, fontWeight: 600 }}>{k}</button>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          {resendTimer > 0 ? (
            <span style={{ color: "#475569", fontSize: 13 }}>إعادة الإرسال خلال <span style={{ fontFamily: "Inter", fontWeight: 600 }}>{resendTimer}s</span></span>
          ) : (
            <button onClick={onResend} style={{ color: "#1366D6", fontWeight: 600, fontSize: 14 }}>إعادة إرسال الرمز</button>
          )}
        </div>
      </div>
    </div>
  );
}

function Permissions({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const items = [
    { emoji: "📍", title: "فعّل الموقع", body: "نحتاج موقعك لإرسال أقرب فني." },
    { emoji: "🔔", title: "فعّل الإشعارات", body: "لإبلاغك بحالة الفني والحجز." },
  ];
  return (
    <div className="h-full bg-white flex flex-col items-center justify-center text-center px-8">
      <div className="w-44 h-44 rounded-full flex items-center justify-center mb-8" style={{ background: "#E8F1FE", fontSize: 80 }}>{items[step].emoji}</div>
      <h1 style={{ fontWeight: 700, fontSize: 22 }}>{items[step].title}</h1>
      <p className="mt-3" style={{ color: "#475569", fontSize: 15 }}>{items[step].body}</p>
      <div className="absolute bottom-8 left-5 right-5 space-y-3">
        <PrimaryButton onClick={() => step === 0 ? setStep(1) : onDone()}>السماح</PrimaryButton>
        <PrimaryButton variant="ghost" onClick={() => step === 0 ? setStep(1) : onDone()}>ليس الآن</PrimaryButton>
      </div>
    </div>
  );
}

/* ---------- Home ---------- */

function HomeScreen({ onPickService, onTracking, onNotifications, onSupport }: { onPickService: (s: typeof SERVICES[number]) => void; onTracking: () => void; onNotifications: () => void; onSupport: () => void }) {
  return (
    <div className="h-full overflow-y-auto pb-20">
      {/* Header */}
      <div className="px-5 pt-3 pb-4 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <div style={{ color: "#475569", fontSize: 12 }} className="flex items-center gap-1">
              <MapPin size={12} /> خلدا، عمّان <ChevronDown size={14} />
            </div>
            <h1 className="mt-1" style={{ fontWeight: 700, fontSize: 22 }}>مرحباً أحمد 👋</h1>
          </div>
          <button onClick={onNotifications} aria-label="notifications" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center relative">
            <Bell size={18} color="#0F172A" />
            <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full" style={{ background: "#E5484D" }} />
          </button>
        </div>
        <button onClick={soon} className="mt-4 h-12 w-full rounded-xl bg-slate-100 flex items-center px-4 gap-2 text-start">
          <Search size={18} color="#94A3B8" />
          <span style={{ color: "#94A3B8", fontSize: 14 }}>ابحث عن خدمة...</span>
        </button>
      </div>

      {/* Active booking banner */}
      <Section>
        <button onClick={onTracking} className="w-full">
          <Card className="p-3 flex items-center gap-3" style={{ background: "linear-gradient(95deg,#0FB5A6 0%,#0D9488 100%)" }}>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">⚡</div>
            <div className="flex-1 text-start">
              <div style={{ color: "#FFF", fontWeight: 700, fontSize: 14 }}>الفني خالد في الطريق</div>
              <div style={{ color: "#CFFAFE", fontSize: 12 }}>سيصل خلال <span style={{ fontFamily: "Inter", fontWeight: 700 }}>5</span> دقائق</div>
            </div>
            <ChevronLeft size={20} color="#FFF" />
          </Card>
        </button>
      </Section>

      {/* Services grid */}
      <Section title="الخدمات">
        <div className="grid grid-cols-2 gap-3">
          {SERVICES.map(s => (
            <button key={s.id} onClick={() => onPickService(s)} className="text-start">
              <Card className="p-4">
                <ServiceIcon id={s.id} size={24} />
                <div className="mt-3" style={{ fontWeight: 700, fontSize: 15 }}>{s.ar}</div>
                <div className="mt-1 flex items-center justify-between">
                  <PriceBadge amount={s.price} />
                  <span style={{ color: "#94A3B8", fontSize: 11 }}><span style={{ fontFamily: "Inter" }}>{s.dur}</span> د</span>
                </div>
              </Card>
            </button>
          ))}
          <button onClick={() => notify("خدمات جديدة قريباً!")} className="text-start">
            <Card className="p-4 h-full flex flex-col items-center justify-center gap-2" style={{ background: "#F1F5F9" }}>
              <Plus size={24} color="#94A3B8" />
              <span style={{ color: "#475569", fontWeight: 600, fontSize: 13 }}>قريباً</span>
            </Card>
          </button>
        </div>
      </Section>

      {/* Promo */}
      <Section>
        <Card className="p-4 flex items-center gap-3" style={{ background: "linear-gradient(95deg,#F5A623 0%,#EA8A0C 100%)" }}>
          <div className="w-12 h-12 rounded-xl bg-white/25 flex items-center justify-center text-white"><Tag size={22} /></div>
          <div className="flex-1">
            <div style={{ color: "#FFF", fontWeight: 700, fontSize: 14 }}>خصم 20% على أول طلب</div>
            <div style={{ color: "#FEF3C7", fontSize: 12 }}>استخدم رمز: FIXLY20</div>
          </div>
        </Card>
      </Section>

      <Section>
        <button onClick={onSupport} className="w-full text-start">
          <Card className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#E8F1FE", color: "#1366D6" }}>
              <Headphones size={20} />
            </div>
            <div className="flex-1">
              <div style={{ fontWeight: 600, fontSize: 14 }}>دعم 24/7</div>
              <div style={{ color: "#475569", fontSize: 12 }}>نحن هنا لمساعدتك في أي وقت</div>
            </div>
            <ChevronLeft size={20} color="#94A3B8" />
          </Card>
        </button>
      </Section>
    </div>
  );
}

/* ---------- Service detail ---------- */

function ServiceDetail({ svc, onBack, onBook }: { svc: typeof SERVICES[number]; onBack: () => void; onBook: () => void }) {
  return (
    <div className="h-full bg-white relative">
      <TopBar title={svc.ar} onBack={onBack} />
      <div className="overflow-y-auto pb-32 h-full">
        <div className="px-5 pt-6 flex items-center gap-4">
          <ServiceIcon id={svc.id} size={32} />
          <div className="flex-1">
            <h1 style={{ fontWeight: 700, fontSize: 22 }}>{svc.ar}</h1>
            <div style={{ color: "#475569", fontSize: 13 }} className="mt-1">المدة المتوقعة: <span style={{ fontFamily: "Inter", fontWeight: 600 }}>{svc.dur}</span> دقيقة</div>
          </div>
        </div>

        <div className="mx-5 mt-5 p-5 rounded-2xl" style={{ background: "#E8F1FE" }}>
          <div style={{ color: "#0E4FA8", fontSize: 13, fontWeight: 600 }}>السعر الثابت</div>
          <div className="mt-1"><PriceBadge amount={svc.price} big /></div>
          <div className="mt-2" style={{ color: "#0E4FA8", fontSize: 12 }}>لا مفاجآت — السعر شامل الفحص واليد العاملة</div>
        </div>

        <Section title="ما يشمله">
          <ul className="space-y-2.5">
            {["فحص شامل من فني معتمد", "إصلاح المشكلة الأساسية", "اختبار التشغيل بعد الإصلاح", "ضمان 30 يوم على العمل"].map(t => (
              <li key={t} className="flex items-center gap-2" style={{ fontSize: 14 }}>
                <CheckCircle2 size={18} color="#1FAA59" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="ملاحظة">
          <Card className="p-3 flex items-start gap-2.5" style={{ background: "#DCFCE7" }}>
            <ShieldCheck size={18} color="#15803D" />
            <p style={{ color: "#166534", fontSize: 13 }}>إذا تكررت المشكلة خلال 30 يوم، نعيد الإصلاح مجاناً أو نسترد المبلغ.</p>
          </Card>
        </Section>
      </div>
      <FullCTA onClick={onBook}>اطلب الآن</FullCTA>
    </div>
  );
}

/* ---------- Booking flow ---------- */

function BookingHeader({ step, onBack, title }: { step: number; onBack: () => void; title: string }) {
  return (
    <div className="bg-white">
      <TopBar title={title} onBack={onBack} />
      <div className="px-5 py-3 flex items-center justify-between">
        <StepIndicator step={step} total={4} />
        <span style={{ color: "#475569", fontSize: 12 }}><span style={{ fontFamily: "Inter", fontWeight: 600 }}>{step + 1}/4</span></span>
      </div>
    </div>
  );
}

function TimeStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [mode, setMode] = useState<"now" | "later">("now");
  return (
    <div className="h-full bg-white relative">
      <BookingHeader step={0} onBack={onBack} title="موعد الخدمة" />
      <div className="px-5 mt-5 space-y-3">
        <button onClick={() => setMode("now")} className="w-full text-start">
          <Card className="p-4 flex items-center gap-3" style={{ borderColor: mode === "now" ? "#1366D6" : "transparent", borderWidth: 2 }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#E8F1FE", color: "#1366D6" }}>⚡</div>
            <div className="flex-1">
              <div style={{ fontWeight: 700, fontSize: 15 }}>فوراً (خلال 30 دقيقة)</div>
              <div style={{ color: "#475569", fontSize: 12 }}>الفني الأقرب يصلك مباشرةً</div>
            </div>
            <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: mode === "now" ? "#1366D6" : "#CBD5E1" }}>
              {mode === "now" && <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#1366D6" }} />}
            </div>
          </Card>
        </button>
        <button onClick={() => setMode("later")} className="w-full text-start">
          <Card className="p-4 flex items-center gap-3" style={{ borderColor: mode === "later" ? "#1366D6" : "transparent", borderWidth: 2 }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#FEF3C7", color: "#B45309" }}><Calendar size={22} /></div>
            <div className="flex-1">
              <div style={{ fontWeight: 700, fontSize: 15 }}>حجز لاحقاً</div>
              <div style={{ color: "#475569", fontSize: 12 }}>اختر التاريخ والوقت المناسبين</div>
            </div>
            <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: mode === "later" ? "#1366D6" : "#CBD5E1" }}>
              {mode === "later" && <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#1366D6" }} />}
            </div>
          </Card>
        </button>

        {mode === "later" && (
          <Card className="p-4 mt-2">
            <div className="grid grid-cols-3 gap-2">
              {["اليوم", "غداً", "السبت"].map((d, i) => (
                <div key={d} className="text-center py-3 rounded-lg border" style={{ borderColor: i === 0 ? "#1366D6" : "#E2E8F0", background: i === 0 ? "#E8F1FE" : "#FFF" }}>
                  <div style={{ fontSize: 12, color: "#475569" }}>{d}</div>
                  <div style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 18, color: i === 0 ? "#1366D6" : "#0F172A" }}>{8 + i}</div>
                  <div style={{ fontSize: 10, color: "#94A3B8" }}>يونيو</div>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {["10:00 ص","11:30 ص","2:00 م","4:30 م","6:00 م","7:30 م"].map((t, i) => (
                <div key={t} className="text-center py-2 rounded-lg border" style={{ borderColor: i === 2 ? "#1366D6" : "#E2E8F0", background: i === 2 ? "#E8F1FE" : "#FFF", fontSize: 12, fontWeight: 600, color: i === 2 ? "#1366D6" : "#0F172A" }}>{t}</div>
              ))}
            </div>
          </Card>
        )}
      </div>
      <FullCTA onClick={onNext}>متابعة</FullCTA>
    </div>
  );
}

function LocationStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  return (
    <div className="h-full bg-white relative">
      <BookingHeader step={1} onBack={onBack} title="حدد الموقع" />
      <MapMock height={300} customerLabel="حدد موقعك هنا" />
      <div className="px-5 pt-4 space-y-3 overflow-y-auto" style={{ maxHeight: 280 }}>
        <div className="flex items-center gap-2 p-3 rounded-xl border border-slate-200">
          <MapPin size={18} color="#1366D6" />
          <span style={{ fontSize: 14 }}>خلدا، شارع وصفي التل، عمارة 12، ط2</span>
        </div>
        <input placeholder="رقم العمارة / الشقة" className="w-full h-12 rounded-xl border border-slate-200 px-4 outline-none" style={{ fontSize: 14 }} defaultValue="عمارة 12، شقة 5" />
        <textarea placeholder="ملاحظات (مثال: رمز البوابة 1234)" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none resize-none" rows={2} style={{ fontSize: 14 }} defaultValue="رمز البوابة 1234، شقة في الطابق الثاني" />
      </div>
      <FullCTA onClick={onNext}>متابعة</FullCTA>
    </div>
  );
}

function PaymentStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [sel, setSel] = useState("apple");
  const methods = [
    { id: "apple", icon: <Apple size={22} />, name: "Apple Pay", note: "الدفع السريع" },
    { id: "google", icon: <span style={{ fontWeight: 800, fontSize: 16 }}>G</span>, name: "Google Pay", note: "الدفع السريع" },
    { id: "card1", icon: <CreditCard size={22} color="#1366D6" />, name: "Visa •••• 4242", note: "بطاقة محفوظة" },
  ];
  return (
    <div className="h-full bg-white relative">
      <BookingHeader step={2} onBack={onBack} title="طريقة الدفع" />
      <div className="px-5 mt-5 space-y-2.5">
        {methods.map(m => (
          <button key={m.id} onClick={() => setSel(m.id)} className="w-full text-start">
            <Card className="p-4 flex items-center gap-3" style={{ borderColor: sel === m.id ? "#1366D6" : "transparent", borderWidth: 2 }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "#F1F5F9" }}>{m.icon}</div>
              <div className="flex-1">
                <div style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</div>
                <div style={{ color: "#475569", fontSize: 12 }}>{m.note}</div>
              </div>
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: sel === m.id ? "#1366D6" : "#CBD5E1" }}>
                {sel === m.id && <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#1366D6" }} />}
              </div>
            </Card>
          </button>
        ))}
        <button onClick={soon} className="w-full p-3 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center gap-2" style={{ color: "#1366D6", fontWeight: 600, fontSize: 14 }}>
          <Plus size={18} /> إضافة بطاقة جديدة
        </button>
      </div>
      <div className="absolute bottom-24 inset-x-5 p-3 rounded-xl flex items-center gap-2" style={{ background: "#E8F1FE" }}>
        <ShieldCheck size={18} color="#1366D6" />
        <span style={{ color: "#0E4FA8", fontSize: 12, fontWeight: 600 }}>دفع آمن 100% — لا دفع نقدي للفني</span>
      </div>
      <FullCTA onClick={onNext}>متابعة</FullCTA>
    </div>
  );
}

function ReviewStep({ svc, onBack, onConfirm }: { svc: typeof SERVICES[number]; onBack: () => void; onConfirm: () => void }) {
  const [promo, setPromo] = useState("FIXLY20");
  const [applied, setApplied] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const discount = applied ? Math.round(svc.price * 0.2) : 0;
  const total = svc.price - discount;
  return (
    <div className="h-full bg-white relative">
      <BookingHeader step={3} onBack={onBack} title="مراجعة وتأكيد" />
      <div className="px-5 mt-4 space-y-3 overflow-y-auto pb-36" style={{ maxHeight: "calc(100% - 200px)" }}>
        <Card className="p-4 flex items-center gap-3">
          <ServiceIcon id={svc.id} size={22} />
          <div className="flex-1">
            <div style={{ fontWeight: 700, fontSize: 15 }}>{svc.ar}</div>
            <div style={{ color: "#475569", fontSize: 12 }}><span style={{ fontFamily: "Inter" }}>{svc.dur}</span> دقيقة</div>
          </div>
          <PriceBadge amount={svc.price} />
        </Card>

        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2.5">
            <Clock size={16} color="#475569" />
            <span style={{ fontSize: 14 }}>فوراً — خلال 30 دقيقة</span>
          </div>
          <div className="h-px bg-slate-100" />
          <div className="flex items-start gap-2.5">
            <MapPin size={16} color="#475569" />
            <span style={{ fontSize: 14 }}>خلدا، شارع وصفي التل، عمارة 12، ط2</span>
          </div>
          <div className="h-px bg-slate-100" />
          <div className="flex items-center gap-2.5">
            <CreditCard size={16} color="#475569" />
            <span style={{ fontSize: 14 }}>Apple Pay</span>
          </div>
        </Card>

        <Card className="p-4">
          <div style={{ fontSize: 13, fontWeight: 600, color: "#475569" }} className="mb-2">أدخل رمز الخصم</div>
          <div className="flex gap-2">
            <input value={promo} onChange={(e) => setPromo(e.target.value)} className="flex-1 h-11 rounded-lg border border-slate-200 px-3 outline-none" style={{ fontSize: 14, fontFamily: "Inter" }} />
            <button onClick={() => setApplied(true)} className="px-4 rounded-lg" style={{ background: applied ? "#DCFCE7" : "#1366D6", color: applied ? "#15803D" : "#FFF", fontWeight: 600, fontSize: 13 }}>{applied ? "✓ مُطبَّق" : "تطبيق"}</button>
          </div>
        </Card>

        <Card className="p-4">
          <InlineRow label="سعر الخدمة" value={`${svc.price} دينار`} />
          {applied && <InlineRow label="خصم FIXLY20" value={<span style={{ color: "#1FAA59" }}>−{discount} دينار</span>} />}
          <div className="h-px bg-slate-100 my-1" />
          <InlineRow strong label="الإجمالي" value={`${total} دينار`} />
        </Card>

        <Card className="p-3 flex items-start gap-2.5" style={{ background: "#E8F1FE" }}>
          <ShieldCheck size={18} color="#1366D6" />
          <p style={{ color: "#0E4FA8", fontSize: 12 }}>سيتم حجز مبلغ <span style={{ fontFamily: "Inter", fontWeight: 700 }}>{total}</span> دينار الآن ويُخصم بعد إتمام الخدمة. ضمان 30 يوم مشمول.</p>
        </Card>
      </div>
      <FullCTA onClick={() => setConfirming(true)}>تأكيد الحجز — <span style={{ fontFamily: "Inter" }}>{total}</span> دينار</FullCTA>
      {confirming && (
        <ConfirmDialog
          title="تأكيد الحجز"
          body={`سيتم حجز ${total} دينار عبر Apple Pay وخصمه بعد إتمام الخدمة.`}
          confirmLabel="تأكيد والدفع"
          onConfirm={onConfirm}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
}

/* ---------- Searching ---------- */

function Searching({ onAssign, onCancel, onNoTechs }: { onAssign: () => void; onCancel: () => void; onNoTechs: () => void }) {
  return (
    <div className="h-full bg-white flex flex-col items-center justify-center px-8 text-center">
      <div className="relative w-48 h-48 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full animate-ping" style={{ background: "#1366D6", opacity: 0.1 }} />
        <div className="absolute inset-4 rounded-full animate-ping" style={{ background: "#1366D6", opacity: 0.15, animationDelay: "0.3s" }} />
        <div className="absolute inset-10 rounded-full animate-pulse" style={{ background: "#1366D6", opacity: 0.2 }} />
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "#1366D6" }}>
          <span style={{ fontSize: 36 }}>🔧</span>
        </div>
      </div>
      <h1 className="mt-6" style={{ fontWeight: 700, fontSize: 22 }}>نبحث عن أقرب فني...</h1>
      <p className="mt-2" style={{ color: "#475569", fontSize: 14 }}>عادة يستغرق هذا أقل من دقيقة</p>

      <div className="absolute bottom-8 inset-x-5 space-y-3">
        <PrimaryButton variant="outline" onClick={onAssign}>محاكاة: تم العثور على فني</PrimaryButton>
        <PrimaryButton variant="ghost" onClick={onNoTechs}>محاكاة: لا يوجد فنيون</PrimaryButton>
        <PrimaryButton variant="destructive" onClick={onCancel}>إلغاء البحث</PrimaryButton>
      </div>
    </div>
  );
}

/* ---------- Live tracking ---------- */

function LiveTracking({ svc, onCancel, onInProgress, onBack, onApprove }: { svc: typeof SERVICES[number]; onCancel: () => void; onInProgress: () => void; onBack: () => void; onApprove: () => void; }) {
  return (
    <div className="h-full relative">
      <div className="absolute top-0 inset-x-0 z-10 bg-white/95 backdrop-blur border-b border-slate-200">
        <TopBar title="تتبع الفني" onBack={onBack} />
      </div>
      <div className="pt-14 h-full flex flex-col">
        <div className="flex-1 relative">
          <MapMock showRoute showTechPin techLabel="خالد" customerLabel="عنوانك" height={420} />
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white rounded-full px-4 py-2 shadow-md flex items-center gap-1">
            <span style={{ color: "#0F766E", fontWeight: 700, fontFamily: "Inter", fontSize: 16 }}>5</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#0F766E" }}>دقائق</span>
          </div>
        </div>

        <div className="bg-white rounded-t-3xl -mt-6 z-10 relative shadow-2xl px-5 pt-3 pb-4">
          <div className="w-9 h-1 rounded-full bg-slate-300 mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <StatusBadge status="technician_arriving" />
            <GuaranteePill />
          </div>

          {/* Status stepper */}
          <div className="mt-4 flex items-center gap-2">
            {["تم القبول", "في الطريق", "وصل", "اكتمل"].map((s, i) => (
              <div key={s} className="flex-1 text-center">
                <div className="h-1.5 rounded-full" style={{ background: i <= 1 ? "#0FB5A6" : "#E2E8F0" }} />
                <div className="mt-1.5" style={{ fontSize: 10, color: i <= 1 ? "#0F766E" : "#94A3B8", fontWeight: 600 }}>{s}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Avatar name="خالد المومني" size={48} verified />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span style={{ fontWeight: 700, fontSize: 15 }}>خالد المومني</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Stars rating={4.9} size={12} />
                <span style={{ color: "#94A3B8", fontSize: 11 }}>· <span style={{ fontFamily: "Inter" }}>320</span> خدمة</span>
              </div>
              <div style={{ color: "#475569", fontSize: 11 }} className="mt-0.5">تويوتا كورولا · أبيض · <span style={{ fontFamily: "Inter" }}>34-12345</span></div>
            </div>
            <button onClick={onInProgress} className="text-xs px-2 py-1 rounded-md" style={{ background: "#FEF3C7", color: "#B45309", fontWeight: 600 }}>محاكاة: بدأ</button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <button onClick={() => notify("جارٍ الاتصال بالفني خالد…")} className="h-11 rounded-xl border border-slate-200 flex items-center justify-center gap-1.5" style={{ fontSize: 13, fontWeight: 600 }}>
              <Phone size={16} color="#1366D6" /> اتصال
            </button>
            <button onClick={() => notify("فتح محادثة مع خالد…")} className="h-11 rounded-xl border border-slate-200 flex items-center justify-center gap-1.5" style={{ fontSize: 13, fontWeight: 600 }}>
              <MessageCircle size={16} color="#1366D6" /> رسالة
            </button>
            <button onClick={onCancel} className="h-11 rounded-xl flex items-center justify-center gap-1.5" style={{ fontSize: 13, fontWeight: 600, color: "#E5484D", background: "#FEE2E2" }}>
              <X size={16} /> إلغاء
            </button>
          </div>

          <div className="mt-3 p-3 rounded-xl flex items-center gap-2" style={{ background: "#F1F5F9" }}>
            <ServiceIcon id={svc.id} size={18} />
            <div className="flex-1">
              <div style={{ fontSize: 13, fontWeight: 600 }}>{svc.ar}</div>
              <div style={{ color: "#475569", fontSize: 11 }}>الرقم #FX-20603</div>
            </div>
            <PriceBadge amount={svc.price} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CancelFlow({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [reason, setReason] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const reasons = ["وصل الفني متأخراً", "غيّرت رأيي", "خطأ في الطلب", "أخرى"];
  return (
    <div className="h-full bg-white relative">
      <TopBar title="إلغاء الحجز" onBack={onBack} />
      <div className="px-5 mt-3 space-y-2">
        <p style={{ color: "#475569", fontSize: 13 }} className="mb-2">سبب الإلغاء</p>
        {reasons.map((r, i) => (
          <button key={r} onClick={() => setReason(i)} className="w-full text-start">
            <Card className="p-4 flex items-center" style={{ borderColor: reason === i ? "#1366D6" : "transparent", borderWidth: 2 }}>
              <span className="flex-1" style={{ fontSize: 14 }}>{r}</span>
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: reason === i ? "#1366D6" : "#CBD5E1" }}>
                {reason === i && <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#1366D6" }} />}
              </div>
            </Card>
          </button>
        ))}
      </div>
      <div className="px-5 mt-4">
        <Card className="p-4" style={{ background: "#FEF3C7" }}>
          <div style={{ color: "#B45309", fontWeight: 700, fontSize: 13 }}>ملخص الاسترداد</div>
          <InlineRow label="المبلغ المحجوز" value="50 دينار" />
          <InlineRow label="رسوم الإلغاء" value="0 دينار" />
          <div className="h-px bg-amber-200 my-1" />
          <InlineRow strong label="المبلغ المسترد" value={<span style={{ color: "#15803D" }}>50 دينار</span>} />
        </Card>
      </div>
      <FullCTA variant="destructive" onClick={() => setConfirming(true)}>تأكيد الإلغاء</FullCTA>
      {confirming && (
        <ConfirmDialog
          title="تأكيد الإلغاء"
          body="هل تريد إلغاء هذا الحجز؟ سيتم استرداد المبلغ كاملاً."
          confirmLabel="نعم، إلغاء الحجز"
          variant="destructive"
          onConfirm={onDone}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
}

function InProgress({ onApprove, onDone }: { onApprove: () => void; onDone: () => void }) {
  return (
    <div className="h-full bg-white relative">
      <TopBar title="الخدمة جارية" />
      <div className="px-5 pt-4 text-center">
        <StatusBadge status="in_progress" />
        <div className="mt-6 w-36 h-36 mx-auto rounded-full flex items-center justify-center" style={{ background: "#FEF3C7" }}>
          <span style={{ fontSize: 56 }}>🛠️</span>
        </div>
        <h1 className="mt-5" style={{ fontWeight: 700, fontSize: 22 }}>الفني يعمل الآن</h1>
        <p style={{ color: "#475569", fontSize: 14 }} className="mt-2">بدأ العمل في 3:42 م</p>
        <Card className="mt-6 p-4 text-start">
          <div className="flex items-center gap-3">
            <Avatar name="خالد المومني" verified />
            <div className="flex-1">
              <div style={{ fontWeight: 700, fontSize: 14 }}>خالد المومني</div>
              <Stars rating={4.9} size={12} />
            </div>
            <button onClick={() => notify("جارٍ الاتصال بالفني خالد…")} aria-label="اتصال">
              <Phone size={18} color="#1366D6" />
            </button>
          </div>
        </Card>

        <button onClick={onApprove} className="w-full mt-5 p-4 rounded-2xl text-start border-2 border-dashed" style={{ borderColor: "#F5A623", background: "#FFFBEB" }}>
          <div className="flex items-center gap-2">
            <AlertCircle size={18} color="#B45309" />
            <span style={{ color: "#B45309", fontWeight: 700, fontSize: 13 }}>طلب اعتماد عمل إضافي</span>
          </div>
          <p style={{ color: "#92400E", fontSize: 12 }} className="mt-1">أضاف الفني بنداً جديداً — اضغط للمراجعة</p>
        </button>
      </div>
      <FullCTA onClick={onDone}>محاكاة: اكتمال الخدمة</FullCTA>
    </div>
  );
}

function ApproveWork({ onBack, onApproved }: { onBack: () => void; onApproved: () => void }) {
  return (
    <div className="h-full bg-white relative">
      <TopBar title="عمل إضافي" onBack={onBack} />
      <div className="px-5 mt-3">
        <p style={{ color: "#475569", fontSize: 13 }}>أضاف الفني خالد البنود التالية:</p>
        <Card className="mt-3 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 14 }}>استبدال مفتاح الإضاءة</span>
            <span style={{ fontFamily: "Inter", fontWeight: 700 }}>15 دينار</span>
          </div>
          <div className="h-px bg-slate-100" />
          <InlineRow label="الخدمة الأساسية" value="50 دينار" />
          <InlineRow label="عمل إضافي" value="15 دينار" />
          <div className="h-px bg-slate-100" />
          <InlineRow strong label="الإجمالي الجديد" value="65 دينار" />
        </Card>

        <div className="mt-4 p-3 rounded-xl" style={{ background: "#E8F1FE" }}>
          <p style={{ color: "#0E4FA8", fontSize: 12 }}>لن تتم إضافة أي مبلغ دون موافقتك. يمكنك رفض العمل الإضافي.</p>
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0 px-5 pt-3 pb-6 bg-white border-t border-slate-100 space-y-2">
        <PrimaryButton onClick={onApproved}>الموافقة على 15 دينار إضافية</PrimaryButton>
        <PrimaryButton variant="ghost" onClick={onBack}>رفض</PrimaryButton>
      </div>
    </div>
  );
}

function Completed({ onRate }: { onRate: () => void }) {
  return (
    <div className="h-full bg-white flex flex-col items-center justify-center px-8 text-center">
      <div className="w-32 h-32 rounded-full flex items-center justify-center" style={{ background: "#DCFCE7" }}>
        <CheckCircle2 size={72} color="#15803D" strokeWidth={2.5} />
      </div>
      <h1 className="mt-6" style={{ fontWeight: 700, fontSize: 24 }}>اكتملت الخدمة ✅</h1>
      <p style={{ color: "#475569", fontSize: 14 }} className="mt-2">شكراً لاستخدامك Fixly. ضمان 30 يوم مفعّل.</p>
      <Card className="mt-6 p-4 w-full text-start">
        <InlineRow label="رقم الحجز" value={<span style={{ fontFamily: "Inter" }}>#FX-20603</span>} />
        <InlineRow label="الفني" value="خالد المومني" />
        <InlineRow strong label="المبلغ المدفوع" value="50 دينار" />
      </Card>
      <div className="absolute bottom-8 inset-x-5">
        <PrimaryButton onClick={onRate}>قيّم تجربتك</PrimaryButton>
      </div>
    </div>
  );
}

function RateTechnician({ onSubmit }: { onSubmit: () => void }) {
  const [rating, setRating] = useState(5);
  return (
    <div className="h-full bg-white relative">
      <TopBar title="قيّم الخدمة" />
      <div className="px-5 mt-3 text-center">
        <Avatar name="خالد المومني" size={72} verified />
        <h2 className="mt-3" style={{ fontWeight: 700, fontSize: 18 }}>كيف كانت تجربتك مع خالد؟</h2>

        <div className="mt-5 flex justify-center gap-2">
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setRating(n)} className="transition active:scale-90">
              <Star size={42} fill={n <= rating ? "#F5A623" : "transparent"} color={n <= rating ? "#F5A623" : "#CBD5E1"} strokeWidth={2} />
            </button>
          ))}
        </div>
        <div className="mt-2" style={{ color: "#F5A623", fontWeight: 700 }}>{["", "سيء", "مقبول", "جيد", "ممتاز", "رائع جداً!"][rating]}</div>

        <textarea placeholder="اكتب تعليقاً (اختياري)" className="w-full mt-5 rounded-xl border border-slate-200 px-4 py-3 outline-none resize-none text-start" rows={3} style={{ fontSize: 14 }} />

        <div className="mt-3 flex items-center gap-2">
          <button onClick={soon} className="flex-1 h-12 rounded-xl border border-dashed border-slate-300 flex items-center justify-center gap-2" style={{ color: "#1366D6", fontWeight: 600, fontSize: 13 }}>
            <Camera size={16} /> إضافة صور قبل/بعد
          </button>
        </div>
      </div>
      <FullCTA onClick={onSubmit}>إرسال التقييم</FullCTA>
    </div>
  );
}

/* ---------- Bookings ---------- */

function Bookings({ onOpen }: { onOpen: () => void }) {
  const [tab, setTab] = useState<"active" | "past">("active");
  const active = [{ id: "FX-20603", svc: SERVICES[0], status: "technician_arriving" as const, when: "اليوم · 3:30 م", price: 50 }];
  const past = [
    { id: "FX-20480", svc: SERVICES[1], status: "completed" as const, when: "05/06/2026", price: 40 },
    { id: "FX-20210", svc: SERVICES[2], status: "completed" as const, when: "28/05/2026", price: 30 },
    { id: "FX-19980", svc: SERVICES[4], status: "cancelled" as const, when: "20/05/2026", price: 35 },
  ];
  const list = tab === "active" ? active : past;
  return (
    <div className="h-full overflow-y-auto pb-20">
      <div className="bg-white px-5 pt-3 pb-1">
        <h1 style={{ fontWeight: 700, fontSize: 24 }}>حجوزاتي</h1>
        <div className="mt-4 flex gap-2 p-1 rounded-xl" style={{ background: "#F1F5F9" }}>
          {[["active","نشطة"],["past","سابقة"]].map(([k, label]) => (
            <button key={k} onClick={() => setTab(k as any)} className="flex-1 h-9 rounded-lg transition" style={{ background: tab === k ? "#FFF" : "transparent", fontWeight: 600, fontSize: 13, color: tab === k ? "#1366D6" : "#475569", boxShadow: tab === k ? "0 1px 3px rgba(0,0,0,0.06)" : "none" }}>{label}</button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4 space-y-3">
        {list.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-3">📋</div>
            <p style={{ color: "#475569", fontSize: 14 }}>لا توجد حجوزات بعد</p>
            <p style={{ color: "#94A3B8", fontSize: 12 }} className="mt-1">اطلب أول خدمة الآن</p>
          </div>
        )}
        {list.map(b => (
          <button key={b.id} onClick={onOpen} className="w-full text-start">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <ServiceIcon id={b.svc.id} size={22} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{b.svc.ar}</span>
                  </div>
                  <div style={{ color: "#94A3B8", fontSize: 11 }} className="mt-0.5"><span style={{ fontFamily: "Inter" }}>#{b.id}</span> · {b.when}</div>
                </div>
                <PriceBadge amount={b.price} />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <StatusBadge status={b.status} />
                <span style={{ color: "#1366D6", fontWeight: 600, fontSize: 12 }}>عرض التفاصيل ›</span>
              </div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}

function BookingDetail({ onBack }: { onBack: () => void }) {
  return (
    <div className="h-full bg-white">
      <TopBar title="إيصال الخدمة" onBack={onBack} />
      <div className="px-5 mt-3 overflow-y-auto pb-8" style={{ height: "calc(100% - 56px)" }}>
        <Card className="p-5 text-center">
          <CheckCircle2 size={48} color="#1FAA59" className="mx-auto" />
          <div style={{ fontWeight: 700, fontSize: 18 }} className="mt-2">مكتملة</div>
          <div style={{ color: "#475569", fontSize: 12 }}><span style={{ fontFamily: "Inter" }}>#FX-20480</span> · 05/06/2026</div>
        </Card>

        <Card className="mt-4 p-4">
          <div className="flex items-center gap-3">
            <ServiceIcon id="plumb" size={22} />
            <div className="flex-1">
              <div style={{ fontWeight: 700, fontSize: 15 }}>سباكة</div>
              <div style={{ color: "#475569", fontSize: 12 }}>إصلاح تسريب الحوض</div>
            </div>
          </div>
        </Card>

        <Card className="mt-3 p-4">
          <div className="flex items-center gap-3">
            <Avatar name="عمر الشريف" verified />
            <div className="flex-1">
              <div style={{ fontWeight: 700, fontSize: 14 }}>عمر الشريف</div>
              <Stars rating={4.7} size={12} />
            </div>
          </div>
        </Card>

        <Card className="mt-3 p-4 space-y-2">
          <InlineRow label="سعر الخدمة" value="40 دينار" />
          <InlineRow label="عمل إضافي" value="0 دينار" />
          <InlineRow label="الخصم" value="−0 دينار" />
          <div className="h-px bg-slate-100" />
          <InlineRow strong label="المدفوع" value="40 دينار" />
          <div style={{ color: "#475569", fontSize: 12 }}>Apple Pay · ضمان فعّال حتى 05/07/2026</div>
        </Card>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <PrimaryButton variant="outline" onClick={() => notify("جارٍ تحميل الإيصال…", "success")}><Download size={16} /> تحميل</PrimaryButton>
          <PrimaryButton variant="outline" onClick={() => notify("تم نسخ رابط الإيصال", "success")}><Share2 size={16} /> مشاركة</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* ---------- Guarantee ---------- */

function GuaranteeHome({ onNew, onTicket }: { onNew: () => void; onTicket: () => void }) {
  return (
    <div className="h-full overflow-y-auto pb-20">
      <div className="bg-white px-5 pt-3 pb-5">
        <h1 style={{ fontWeight: 700, fontSize: 24 }}>الضمان</h1>
        <Card className="mt-4 p-4 flex items-start gap-3" style={{ background: "linear-gradient(95deg,#1FAA59 0%,#15803D 100%)" }}>
          <ShieldCheck size={28} color="#FFF" />
          <div>
            <div style={{ color: "#FFF", fontWeight: 700, fontSize: 16 }}>ضمان 30 يوم</div>
            <div style={{ color: "#DCFCE7", fontSize: 12 }} className="mt-1">إذا تكررت المشكلة خلال 30 يوم، نعيد الإصلاح مجاناً أو نسترد المبلغ.</div>
          </div>
        </Card>
      </div>

      <Section title="تذاكر مفتوحة">
        <button onClick={onTicket} className="w-full text-start">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span style={{ fontWeight: 700, fontSize: 14 }}>تذكرة #GR-104</span>
              <span className="px-2 py-0.5 rounded-full" style={{ background: "#FEF3C7", color: "#B45309", fontSize: 11, fontWeight: 600 }}>قيد المراجعة</span>
            </div>
            <div style={{ color: "#475569", fontSize: 12 }} className="mt-1">سباكة — عاد التسريب · 06/06/2026</div>
          </Card>
        </button>
      </Section>

      <Section title="حجوزات مشمولة بالضمان">
        <Card className="p-4">
          {[
            { svc: SERVICES[1], date: "05/06/2026", until: "05/07/2026" },
            { svc: SERVICES[0], date: "28/05/2026", until: "27/06/2026" },
          ].map((it, i) => (
            <button key={i} onClick={onNew} className="w-full text-start flex items-center gap-3 py-2.5 border-b last:border-0 border-slate-100">
              <ServiceIcon id={it.svc.id} size={20} />
              <div className="flex-1">
                <div style={{ fontWeight: 600, fontSize: 14 }}>{it.svc.ar}</div>
                <div style={{ color: "#94A3B8", fontSize: 11 }}>الضمان حتى <span style={{ fontFamily: "Inter" }}>{it.until}</span></div>
              </div>
              <ChevronLeft size={18} color="#94A3B8" />
            </button>
          ))}
        </Card>
        <button onClick={onNew} className="w-full mt-3 p-4 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center gap-2" style={{ color: "#1366D6", fontWeight: 600, fontSize: 14 }}>
          <Plus size={18} /> فتح تذكرة ضمان جديدة
        </button>
      </Section>
    </div>
  );
}

function GuaranteeNew({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  return (
    <div className="h-full bg-white relative">
      <TopBar title="تذكرة ضمان جديدة" onBack={onBack} />
      <div className="px-5 mt-3 space-y-3 overflow-y-auto pb-32" style={{ height: "calc(100% - 56px)" }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>الحجز</label>
          <Card className="mt-2 p-3 flex items-center gap-3">
            <ServiceIcon id="plumb" size={20} />
            <div className="flex-1">
              <div style={{ fontWeight: 600, fontSize: 14 }}>سباكة · #FX-20480</div>
              <div style={{ color: "#94A3B8", fontSize: 11 }}>05/06/2026</div>
            </div>
            <ChevronLeft size={16} color="#94A3B8" />
          </Card>
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>وصف المشكلة</label>
          <textarea className="w-full mt-2 rounded-xl border border-slate-200 px-4 py-3 outline-none resize-none" rows={4} style={{ fontSize: 14 }} defaultValue="عاد التسريب من حوض المطبخ بعد يومين من الإصلاح." />
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>صور / فيديو (اختياري)</label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <div className="aspect-square rounded-xl bg-slate-100 flex items-center justify-center" style={{ fontSize: 24 }}>🖼️</div>
            <div className="aspect-square rounded-xl bg-slate-100 flex items-center justify-center" style={{ fontSize: 24 }}>🎥</div>
            <button onClick={soon} className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center" style={{ color: "#1366D6" }}>
              <Plus size={20} />
              <span style={{ fontSize: 11, fontWeight: 600 }}>إضافة</span>
            </button>
          </div>
        </div>

        <Card className="p-3 flex items-start gap-2" style={{ background: "#E8F1FE" }}>
          <ShieldCheck size={16} color="#1366D6" />
          <p style={{ color: "#0E4FA8", fontSize: 12 }}>سيتم الرد خلال ساعتين من فريقنا.</p>
        </Card>
      </div>
      <FullCTA onClick={onDone}>إرسال التذكرة</FullCTA>
    </div>
  );
}

function GuaranteeTicket({ onBack }: { onBack: () => void }) {
  return (
    <div className="h-full bg-white">
      <TopBar title="تذكرة #GR-104" onBack={onBack} />
      <div className="px-5 mt-3 overflow-y-auto pb-8" style={{ height: "calc(100% - 56px)" }}>
        <div className="space-y-4 mt-2">
          {[
            { label: "مفتوحة", time: "06/06 · 9:20 ص", state: "done" },
            { label: "قيد المراجعة", time: "06/06 · 10:05 ص", state: "active" },
            { label: "موافقة / رفض", time: "بانتظار", state: "wait" },
            { label: "الحل", time: "بانتظار", state: "wait" },
          ].map((s, i, arr) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: s.state === "wait" ? "#F1F5F9" : s.state === "active" ? "#FEF3C7" : "#DCFCE7", color: s.state === "wait" ? "#94A3B8" : s.state === "active" ? "#B45309" : "#15803D" }}>
                  {s.state === "done" ? "✓" : i + 1}
                </div>
                {i < arr.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ background: "#E2E8F0" }} />}
              </div>
              <div className="pb-4">
                <div style={{ fontWeight: 700, fontSize: 14 }}>{s.label}</div>
                <div style={{ color: "#94A3B8", fontSize: 11, fontFamily: "Inter" }}>{s.time}</div>
              </div>
            </div>
          ))}
        </div>

        <Card className="p-4 mt-2" style={{ background: "#E8F1FE" }}>
          <div style={{ color: "#0E4FA8", fontWeight: 700, fontSize: 13 }}>رد الفريق</div>
          <p style={{ color: "#0E4FA8", fontSize: 13 }} className="mt-1">شكراً لتواصلك. سنرسل الفني عمر مرة أخرى دون أي رسوم. سيتم التواصل لتحديد الموعد.</p>
        </Card>
      </div>
    </div>
  );
}

/* ---------- Profile + edges ---------- */

function Profile({ onAddresses, onPayments, onNotifs, onSupport, onSettings, onEditProfile }: any) {
  const rows = [
    { icon: MapPin, label: "العناوين المحفوظة", action: onAddresses },
    { icon: CreditCard, label: "وسائل الدفع", action: onPayments },
    { icon: Bell, label: "الإشعارات", action: onNotifs },
    { icon: Headphones, label: "الدعم والمساعدة", action: onSupport },
    { icon: User, label: "الإعدادات", action: onSettings },
  ];
  return (
    <div className="h-full overflow-y-auto pb-20">
      <div className="bg-white px-5 pt-3 pb-5">
        <h1 style={{ fontWeight: 700, fontSize: 24 }}>حسابي</h1>
        <Card className="mt-4 p-4 flex items-center gap-4">
          <Avatar name="أحمد العلي" size={56} verified />
          <div className="flex-1">
            <div style={{ fontWeight: 700, fontSize: 17 }}>أحمد العلي</div>
            <div style={{ color: "#475569", fontSize: 13, fontFamily: "Inter" }}>+962 79 0••• ••00</div>
          </div>
          <button onClick={onEditProfile} style={{ color: "#1366D6", fontWeight: 600, fontSize: 13 }}>تعديل</button>
        </Card>
      </div>

      <Section>
        <Card className="overflow-hidden">
          {rows.map((r, i) => (
            <button key={i} onClick={r.action} className="w-full px-4 py-3.5 flex items-center gap-3 border-b last:border-0 border-slate-100">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#E8F1FE", color: "#1366D6" }}>
                <r.icon size={18} />
              </div>
              <span className="flex-1 text-start" style={{ fontSize: 14, fontWeight: 600 }}>{r.label}</span>
              <ChevronLeft size={18} color="#94A3B8" />
            </button>
          ))}
        </Card>
      </Section>

      <Section>
        <Card className="p-4 flex items-center gap-3" style={{ background: "linear-gradient(95deg,#1366D6 0%,#0E4FA8 100%)" }}>
          <ShieldCheck size={28} color="#FFF" />
          <div className="flex-1">
            <div style={{ color: "#FFF", fontWeight: 700, fontSize: 14 }}>تحقق من حسابك</div>
            <div style={{ color: "#CFE0FB", fontSize: 12 }}>احصل على شارة التوثيق</div>
          </div>
        </Card>
      </Section>
    </div>
  );
}

const INITIAL_ADDRESSES = [
  { id: 1, label: "المنزل", addr: "خلدا، شارع وصفي التل، عمارة 12، ط2", def: true },
  { id: 2, label: "العمل", addr: "الصويفية، دوار باريس، عمارة 5، ط4", def: false },
  { id: 3, label: "بيت الوالد", addr: "تلاع العلي، شارع زهران، فيلا 8", def: false },
];

function Addresses({ onBack }: { onBack: () => void }) {
  const [addrs, setAddrs] = useState(INITIAL_ADDRESSES);
  const [editing, setEditing] = useState<typeof INITIAL_ADDRESSES[number] | null>(null);
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newAddr, setNewAddr] = useState("");

  return (
    <div className="h-full bg-white relative">
      <TopBar title="العناوين المحفوظة" onBack={onBack} />
      <div className="px-5 mt-3 space-y-3 overflow-y-auto pb-6" style={{ height: "calc(100% - 56px)" }}>
        {addrs.map((a) => (
          <Card key={a.id} className="p-4 flex items-start gap-3">
            <MapPin size={20} color="#1366D6" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span style={{ fontWeight: 700, fontSize: 14 }}>{a.label}</span>
                {a.def && <span className="px-1.5 py-0.5 rounded" style={{ background: "#DCFCE7", color: "#15803D", fontSize: 10, fontWeight: 700 }}>افتراضي</span>}
              </div>
              <p style={{ color: "#475569", fontSize: 13 }} className="mt-1">{a.addr}</p>
            </div>
            <button onClick={() => setEditing({ ...a })} style={{ color: "#1366D6", fontSize: 12, fontWeight: 600 }}>تعديل</button>
          </Card>
        ))}
        <button onClick={() => { setNewLabel(""); setNewAddr(""); setAdding(true); }} className="w-full p-4 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center gap-2" style={{ color: "#1366D6", fontWeight: 600, fontSize: 14 }}>
          <Plus size={18} /> إضافة عنوان جديد
        </button>
      </div>

      {/* Edit address modal */}
      {editing && (
        <div className="absolute inset-0 z-50 flex items-end" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="w-full bg-white rounded-t-3xl p-5 space-y-3">
            <h3 style={{ fontWeight: 700, fontSize: 18 }}>تعديل العنوان</h3>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>الاسم</label>
              <input value={editing.label} onChange={e => setEditing({ ...editing, label: e.target.value })} className="mt-1 w-full h-11 rounded-xl border border-slate-200 px-3 outline-none" style={{ fontSize: 14 }} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>العنوان</label>
              <input value={editing.addr} onChange={e => setEditing({ ...editing, addr: e.target.value })} className="mt-1 w-full h-11 rounded-xl border border-slate-200 px-3 outline-none" style={{ fontSize: 14 }} />
            </div>
            <div className="flex gap-2 pt-2">
              <PrimaryButton variant="outline" onClick={() => setEditing(null)}>إلغاء</PrimaryButton>
              <PrimaryButton onClick={() => { setAddrs(addrs.map(a => a.id === editing!.id ? editing! : a)); setEditing(null); }}>حفظ</PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* Add address modal */}
      {adding && (
        <div className="absolute inset-0 z-50 flex items-end" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="w-full bg-white rounded-t-3xl p-5 space-y-3">
            <h3 style={{ fontWeight: 700, fontSize: 18 }}>إضافة عنوان جديد</h3>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>الاسم</label>
              <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="مثال: المنزل" className="mt-1 w-full h-11 rounded-xl border border-slate-200 px-3 outline-none" style={{ fontSize: 14 }} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>العنوان</label>
              <input value={newAddr} onChange={e => setNewAddr(e.target.value)} placeholder="الحي، الشارع، رقم العمارة" className="mt-1 w-full h-11 rounded-xl border border-slate-200 px-3 outline-none" style={{ fontSize: 14 }} />
            </div>
            <div className="flex gap-2 pt-2">
              <PrimaryButton variant="outline" onClick={() => setAdding(false)}>إلغاء</PrimaryButton>
              <PrimaryButton onClick={() => { if (newLabel && newAddr) { setAddrs([...addrs, { id: Date.now(), label: newLabel, addr: newAddr, def: false }]); setAdding(false); } }}>إضافة</PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentMethods({ onBack }: { onBack: () => void }) {
  const [cards, setCards] = useState([
    { id: 1, brand: "Visa", num: "•••• 4242", def: true },
    { id: 2, brand: "Mastercard", num: "•••• 5588", def: false },
  ]);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  return (
    <div className="h-full bg-white relative">
      <TopBar title="وسائل الدفع" onBack={onBack} />
      <div className="px-5 mt-3 space-y-3">
        {cards.map((c) => (
          <Card key={c.id} className="p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "#F1F5F9" }}>
              <CreditCard size={20} color="#1366D6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span style={{ fontWeight: 700, fontSize: 14 }}>{c.brand}</span>
                <span style={{ fontFamily: "Inter", fontWeight: 600, color: "#475569" }}>{c.num}</span>
                {c.def && <span className="px-1.5 py-0.5 rounded" style={{ background: "#DCFCE7", color: "#15803D", fontSize: 10, fontWeight: 700 }}>افتراضي</span>}
              </div>
            </div>
            {!c.def && (
              <button onClick={() => setDeletingId(c.id)} style={{ color: "#E5484D", fontSize: 12, fontWeight: 600 }}>حذف</button>
            )}
          </Card>
        ))}
        <button onClick={soon} className="w-full p-4 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center gap-2" style={{ color: "#1366D6", fontWeight: 600, fontSize: 14 }}>
          <Plus size={18} /> إضافة بطاقة جديدة
        </button>
      </div>

      {deletingId !== null && (
        <ConfirmDialog
          title="حذف البطاقة"
          body="هل تريد حذف هذه البطاقة؟"
          confirmLabel="حذف"
          variant="destructive"
          onConfirm={() => { setCards(cards.filter(c => c.id !== deletingId)); setDeletingId(null); }}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
}

function Notifications({ onBack }: { onBack: () => void }) {
  const items = [
    { icon: "✅", title: "تم قبول حجزك", body: "الفني خالد في الطريق", time: "الآن", unread: true },
    { icon: "🚗", title: "الفني على بُعد 5 دقائق", body: "تتبع الفني الآن", time: "قبل 5 د", unread: true },
    { icon: "⭐", title: "تم إكمال الخدمة", body: "قيّم تجربتك مع عمر", time: "أمس", unread: false },
    { icon: "🛡️", title: "تحديث على طلب الضمان", body: "ردّ فريقنا على تذكرتك", time: "06/06", unread: false },
  ];
  return (
    <div className="h-full bg-white">
      <TopBar title="الإشعارات" onBack={onBack} />
      <div className="overflow-y-auto">
        {items.map((n, i) => (
          <div key={i} className="px-5 py-3.5 flex items-center gap-3 border-b border-slate-100" style={{ background: n.unread ? "#E8F1FE" : "#FFF" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#FFF", fontSize: 20 }}>{n.icon}</div>
            <div className="flex-1">
              <div style={{ fontWeight: 700, fontSize: 14 }}>{n.title}</div>
              <div style={{ color: "#475569", fontSize: 12 }} className="mt-0.5">{n.body}</div>
            </div>
            <span style={{ color: "#94A3B8", fontSize: 11 }}>{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const FAQ_ITEMS = [
  { q: "كيف يتم الدفع؟", a: "يتم الدفع إلكترونياً عبر Apple Pay أو Google Pay أو بطاقة الائتمان. لا يتم الخصم إلا بعد إتمام الخدمة." },
  { q: "ما مدة الضمان؟", a: "كل خدمة تشمل ضمان 30 يوماً. إذا تكررت المشكلة، نعيد الإصلاح مجاناً أو نسترد المبلغ." },
  { q: "هل يمكنني الإلغاء؟", a: "نعم، يمكنك الإلغاء مجاناً قبل توجّه الفني. بعد انطلاقه قد تُطبَّق رسوم رمزية." },
  { q: "هل الأسعار ثابتة؟", a: "نعم، السعر المعروض هو السعر النهائي. لا مفاجآت. قد يُضاف عمل إضافي فقط بموافقتك المسبقة." },
];

function Support({ onBack }: { onBack: () => void }) {
  return (
    <div className="h-full bg-white">
      <TopBar title="الدعم والمساعدة" onBack={onBack} />
      <div className="px-5 mt-3 space-y-3">
        <Card className="p-4 flex items-center gap-3" style={{ background: "linear-gradient(95deg,#1366D6 0%,#0E4FA8 100%)" }}>
          <Headphones size={28} color="#FFF" />
          <div className="flex-1">
            <div style={{ color: "#FFF", fontWeight: 700, fontSize: 15 }}>نحن هنا لمساعدتك 24/7</div>
            <div style={{ color: "#CFE0FB", fontSize: 12 }}>الرد خلال 5 دقائق</div>
          </div>
        </Card>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => notify("جارٍ الاتصال بـ +962 6 555 0000…")} className="text-start">
            <Card className="p-4 text-center">
              <Phone size={24} color="#1366D6" className="mx-auto mb-2" />
              <div style={{ fontWeight: 700, fontSize: 14 }}>اتصل بنا</div>
              <div style={{ color: "#475569", fontSize: 11, fontFamily: "Inter" }} className="mt-0.5">+962 6 555 0000</div>
            </Card>
          </button>
          <button onClick={() => notify("فتح المحادثة الفورية…")} className="text-start">
            <Card className="p-4 text-center">
              <MessageCircle size={24} color="#0FB5A6" className="mx-auto mb-2" />
              <div style={{ fontWeight: 700, fontSize: 14 }}>محادثة فورية</div>
              <div style={{ color: "#475569", fontSize: 11 }} className="mt-0.5">عربي · 5 د</div>
            </Card>
          </button>
        </div>
        <Section title="الأسئلة الشائعة">
          <FaqAccordion items={FAQ_ITEMS} />
        </Section>
      </div>
    </div>
  );
}

function Settings({ onBack, onLanguage, onNotifPref, onAppearance, onLogout }: { onBack: () => void; onLanguage: () => void; onNotifPref: () => void; onAppearance: () => void; onLogout: () => void }) {
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const prefRows = [
    { label: "اللغة", value: "العربية", action: onLanguage },
    { label: "الإشعارات", value: "مفعّلة", action: onNotifPref },
    { label: "المظهر", value: "فاتح", action: onAppearance },
  ];

  return (
    <div className="h-full bg-white relative">
      <TopBar title="الإعدادات" onBack={onBack} />
      <div className="px-5 mt-3 space-y-3">
        <Card>
          {prefRows.map(({ label, value, action }) => (
            <button key={label} onClick={action} className="w-full px-4 py-3.5 flex items-center justify-between border-b last:border-0 border-slate-100">
              <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
              <span style={{ color: "#475569", fontSize: 13 }}>{value} ›</span>
            </button>
          ))}
        </Card>
        <Card>
          {["الشروط والأحكام", "سياسة الخصوصية", "عن التطبيق · الإصدار 1.0.0"].map((t, i) => (
            <button key={i} onClick={() => notify(t)} className="w-full px-4 py-3.5 flex items-center text-start border-b last:border-0 border-slate-100">
              <span className="flex-1" style={{ fontSize: 14 }}>{t}</span>
              <ChevronLeft size={16} color="#94A3B8" />
            </button>
          ))}
        </Card>
        <button onClick={() => setConfirmLogout(true)} className="w-full p-4 rounded-xl bg-white border border-red-200" style={{ color: "#E5484D", fontWeight: 700, fontSize: 14 }}>تسجيل الخروج</button>
        <button onClick={() => setConfirmDelete(true)} className="w-full p-4 text-center" style={{ color: "#94A3B8", fontSize: 13 }}>حذف الحساب نهائياً</button>
      </div>

      {confirmLogout && (
        <ConfirmDialog
          title="تسجيل الخروج"
          body="هل أنت متأكد من تسجيل الخروج من حسابك؟"
          confirmLabel="تسجيل الخروج"
          variant="destructive"
          onConfirm={onLogout}
          onCancel={() => setConfirmLogout(false)}
        />
      )}
      {confirmDelete && (
        <ConfirmDialog
          title="حذف الحساب نهائياً"
          body="سيتم حذف جميع بياناتك بشكل دائم. هذا الإجراء لا يمكن التراجع عنه."
          confirmLabel="حذف الحساب"
          variant="destructive"
          onConfirm={() => { setConfirmDelete(false); notify("تم حذف الحساب", "success"); onLogout(); }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}

/* ---------- Edit Profile ---------- */

function EditProfile({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState("أحمد العلي");
  const [email, setEmail] = useState("ahmed@example.com");
  const [saved, setSaved] = useState(false);

  return (
    <div className="h-full bg-white relative">
      <TopBar title="تعديل الملف الشخصي" onBack={onBack} />
      <div className="px-5 mt-5 space-y-4">
        <div className="flex flex-col items-center mb-2">
          <div className="relative">
            <Avatar name={name} size={80} verified />
            <button onClick={soon} aria-label="تغيير الصورة" className="absolute bottom-0 end-0 w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center">
              <Camera size={14} color="#1366D6" />
            </button>
          </div>
          <button onClick={soon} style={{ color: "#1366D6", fontSize: 13, fontWeight: 600 }} className="mt-2">تغيير الصورة</button>
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>الاسم الكامل</label>
          <input value={name} onChange={e => setName(e.target.value)} className="mt-2 w-full h-12 rounded-xl border border-slate-200 px-4 outline-none" style={{ fontSize: 14 }} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>رقم الهاتف</label>
          <div className="mt-2 h-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center px-4 gap-2">
            <span style={{ fontFamily: "Inter", color: "#94A3B8" }}>+962 79 0••• ••00</span>
            <span className="px-1.5 py-0.5 rounded" style={{ background: "#E2E8F0", color: "#64748B", fontSize: 10, fontWeight: 700 }}>لا يمكن تغييره</span>
          </div>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>البريد الإلكتروني (اختياري)</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full h-12 rounded-xl border border-slate-200 px-4 outline-none" style={{ fontSize: 14, fontFamily: "Inter" }} />
        </div>
      </div>
      <FullCTA onClick={() => { setSaved(true); setTimeout(onBack, 600); }}>
        {saved ? "تم الحفظ ✓" : "حفظ التغييرات"}
      </FullCTA>
    </div>
  );
}

/* ---------- Settings sub-screens ---------- */

function SettingsLanguage({ onBack }: { onBack: () => void }) {
  const [sel, setSel] = useState("ar");
  const langs = [{ id: "ar", label: "العربية", sub: "Arabic" }, { id: "en", label: "English", sub: "الإنجليزية" }];
  return (
    <div className="h-full bg-white">
      <TopBar title="اللغة" onBack={onBack} />
      <div className="px-5 mt-3 space-y-2">
        {langs.map(l => (
          <button key={l.id} onClick={() => setSel(l.id)} className="w-full text-start">
            <Card className="p-4 flex items-center gap-3" style={{ borderColor: sel === l.id ? "#1366D6" : "transparent", borderWidth: 2 }}>
              <div className="flex-1">
                <div style={{ fontWeight: 700, fontSize: 15 }}>{l.label}</div>
                <div style={{ color: "#475569", fontSize: 12 }}>{l.sub}</div>
              </div>
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: sel === l.id ? "#1366D6" : "#CBD5E1" }}>
                {sel === l.id && <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#1366D6" }} />}
              </div>
            </Card>
          </button>
        ))}
        <p style={{ color: "#94A3B8", fontSize: 12, textAlign: "center" }} className="mt-4">سيتم تطبيق اللغة فور الاختيار</p>
      </div>
    </div>
  );
}

function SettingsNotificationsPref({ onBack }: { onBack: () => void }) {
  const [prefs, setPrefs] = useState({
    bookings: true, arriving: true, completed: true, promotions: false, guarantee: true,
  });
  const rows: { key: keyof typeof prefs; label: string; sub: string }[] = [
    { key: "bookings", label: "تحديثات الحجوزات", sub: "تأكيد، قبول، إلغاء" },
    { key: "arriving", label: "الفني في الطريق", sub: "إشعار عند اقتراب الفني" },
    { key: "completed", label: "اكتمال الخدمة", sub: "إيصال بعد الإنجاز" },
    { key: "guarantee", label: "تحديثات الضمان", sub: "ردود على تذاكر الضمان" },
    { key: "promotions", label: "العروض والتخفيضات", sub: "رموز الخصم والعروض الخاصة" },
  ];
  return (
    <div className="h-full bg-white">
      <TopBar title="إعدادات الإشعارات" onBack={onBack} />
      <div className="px-5 mt-3">
        <Card>
          {rows.map((r, i) => (
            <div key={r.key} className="px-4 py-3.5 flex items-center gap-3 border-b last:border-0 border-slate-100">
              <div className="flex-1">
                <div style={{ fontWeight: 600, fontSize: 14 }}>{r.label}</div>
                <div style={{ color: "#94A3B8", fontSize: 12 }}>{r.sub}</div>
              </div>
              <button
                onClick={() => setPrefs({ ...prefs, [r.key]: !prefs[r.key] })}
                className="w-12 h-7 rounded-full relative transition-colors"
                style={{ background: prefs[r.key] ? "#1366D6" : "#CBD5E1" }}
              >
                <div className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all" style={{ [prefs[r.key] ? "right" : "left"]: 2 }} />
              </button>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function SettingsAppearance({ onBack }: { onBack: () => void }) {
  const [theme, setTheme] = useState("light");
  const themes = [
    { id: "light", label: "فاتح", icon: <Sun size={22} color="#F5A623" /> },
    { id: "dark", label: "داكن", icon: <Moon size={22} color="#6366F1" /> },
    { id: "system", label: "تلقائي (النظام)", icon: <SettingsIcon size={22} color="#64748B" /> },
  ];
  return (
    <div className="h-full bg-white">
      <TopBar title="المظهر" onBack={onBack} />
      <div className="px-5 mt-3 space-y-2">
        {themes.map(t => (
          <button key={t.id} onClick={() => setTheme(t.id)} className="w-full text-start">
            <Card className="p-4 flex items-center gap-3" style={{ borderColor: theme === t.id ? "#1366D6" : "transparent", borderWidth: 2 }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "#F1F5F9" }}>{t.icon}</div>
              <span className="flex-1" style={{ fontWeight: 700, fontSize: 15 }}>{t.label}</span>
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: theme === t.id ? "#1366D6" : "#CBD5E1" }}>
                {theme === t.id && <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#1366D6" }} />}
              </div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Edge cases ---------- */

function NoTechs({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="h-full bg-white flex flex-col items-center justify-center px-8 text-center">
      <div className="text-7xl mb-5">🛠️</div>
      <h1 style={{ fontWeight: 700, fontSize: 22 }}>لا يوجد فنيون متاحون الآن</h1>
      <p style={{ color: "#475569", fontSize: 14 }} className="mt-2">حاول بعد قليل، أو اختر موعداً لاحقاً.</p>
      <div className="absolute bottom-8 inset-x-5 space-y-2">
        <PrimaryButton onClick={onRetry}>إعادة المحاولة</PrimaryButton>
        <PrimaryButton variant="outline" onClick={onRetry}>حجز لاحقاً</PrimaryButton>
      </div>
    </div>
  );
}


