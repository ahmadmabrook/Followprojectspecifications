import { useState } from "react";
import {
  Search, MapPin, Phone, ShieldCheck, Clock, CreditCard, Star, ChevronLeft,
  Headphones, Menu, ChevronDown,
} from "lucide-react";
import { SERVICES, ServiceIcon, PriceBadge, Card, Stars, Avatar, MapMock, StatusBadge, GuaranteePill, InlineRow, notify, soon, ConfirmDialog } from "./shared";

type View = "landing" | "catalog" | "service" | "booking";

export default function CustomerWeb() {
  const [view, setView] = useState<View>("landing");
  const [svc, setSvc] = useState(SERVICES[0]);
  return (
    <div dir="rtl" className="w-full overflow-y-auto" style={{ background: "#F6F8FB", maxHeight: 844 }}>
      <TopNav active={view} setView={setView} />
      {view === "landing" && <Landing onCTA={() => setView("catalog")} onPickService={(s) => { setSvc(s); setView("service"); }} />}
      {view === "catalog" && <Catalog onPick={(s) => { setSvc(s); setView("service"); }} />}
      {view === "service" && <ServicePage svc={svc} onBook={() => setView("booking")} onBack={() => setView("catalog")} />}
      {view === "booking" && <Booking svc={svc} onBack={() => setView("service")} />}
      <Footer />
    </div>
  );
}

function TopNav({ active, setView }: { active: string; setView: (v: View) => void }) {
  return (
    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center gap-6">
        <button onClick={() => setView("landing")} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#1366D6" }}>🔧</div>
          <span style={{ color: "#1366D6", fontWeight: 800, fontSize: 22 }}>Fixly</span>
        </button>
        <nav className="hidden md:flex items-center gap-6">
          {[["landing", "الرئيسية"], ["catalog", "الخدمات"], ["guarantee", "الضمان"], ["contact", "تواصل"]].map(([k, l]) => (
            <button key={l} onClick={() => { if (k === "landing" || k === "catalog") setView(k as View); else notify(l); }} style={{ fontSize: 14, fontWeight: 600, color: active === k ? "#1366D6" : "#475569" }}>{l}</button>
          ))}
        </nav>
        <div className="flex-1" />
        <button onClick={() => notify("تم تغيير اللغة")} className="px-3 py-1.5 rounded-lg" style={{ background: "#F1F5F9", fontSize: 13, fontWeight: 600 }}>EN / العربية</button>
        <button onClick={() => notify("فتح صفحة تسجيل الدخول")} className="hidden md:block px-4 py-2 rounded-lg" style={{ background: "#1366D6", color: "#FFF", fontSize: 14, fontWeight: 600 }}>تسجيل دخول</button>
        <button onClick={() => notify("القائمة")} aria-label="menu" className="md:hidden"><Menu size={22} /></button>
      </div>
    </div>
  );
}

function Landing({ onCTA, onPickService }: { onCTA: () => void; onPickService: (s: typeof SERVICES[number]) => void }) {
  return (
    <div className="max-w-[1200px] mx-auto px-6">
      {/* Hero */}
      <section className="grid md:grid-cols-2 gap-8 items-center py-16">
        <div>
          <GuaranteePill />
          <h1 className="mt-4" style={{ fontWeight: 800, fontSize: 48, lineHeight: 1.15, color: "#0F172A" }}>
            فني محترف <span style={{ color: "#1366D6" }}>خلال 30 دقيقة</span>
          </h1>
          <p className="mt-4" style={{ fontSize: 17, color: "#475569" }}>كهرباء، سباكة، تكييف، دهان وتركيب أثاث — بأسعار ثابتة وضمان 30 يوم.</p>

          <div className="mt-7 p-2 bg-white rounded-2xl shadow-lg flex items-center gap-2" style={{ boxShadow: "0 10px 30px rgba(15,23,42,0.08)" }}>
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search size={18} color="#94A3B8" />
              <input className="flex-1 h-12 outline-none" placeholder="ابحث عن خدمة..." style={{ fontSize: 15 }} />
            </div>
            <div className="hidden sm:flex items-center gap-1 px-3 border-r border-slate-200" style={{ color: "#475569", fontSize: 14 }}>
              <MapPin size={16} /> عمّان
            </div>
            <button onClick={onCTA} className="h-12 px-6 rounded-xl" style={{ background: "#1366D6", color: "#FFF", fontWeight: 700 }}>اطلب الآن</button>
          </div>

          <div className="mt-6 flex items-center gap-6">
            <div className="flex items-center gap-2"><Stars rating={4.8} /><span style={{ fontSize: 13, color: "#475569" }}>+5,000 تقييم</span></div>
            <div className="flex items-center gap-2" style={{ color: "#475569", fontSize: 13 }}><ShieldCheck size={16} color="#15803D" /> ضمان 30 يوم</div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden relative" style={{ background: "linear-gradient(135deg,#1366D6 0%,#0FB5A6 100%)" }}>
            <div className="absolute inset-0 flex items-center justify-center text-[200px]">🔧</div>
            <div className="absolute top-6 right-6 left-6 flex justify-between">
              <Card className="p-3 flex items-center gap-2"><div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#DCFCE7" }}>⚡</div><div><div style={{ fontSize: 11, color: "#475569" }}>وقت الوصول</div><div style={{ fontWeight: 700, fontSize: 14 }}><span style={{ fontFamily: "Inter" }}>22</span> دقيقة</div></div></Card>
              <Card className="p-3 flex items-center gap-2"><Avatar name="خالد المومني" size={36} verified /><div><div style={{ fontSize: 11, color: "#475569" }}>الفني</div><div style={{ fontWeight: 700, fontSize: 13 }}>خالد</div></div></Card>
            </div>
            <Card className="absolute bottom-6 left-6 right-6 p-4 flex items-center gap-3">
              <ServiceIcon id="elec" size={20} />
              <div className="flex-1">
                <div style={{ fontWeight: 700, fontSize: 14 }}>كهرباء — سعر ثابت</div>
                <StatusBadge status="technician_arriving" />
              </div>
              <PriceBadge amount={50} />
            </Card>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-16">
        {[
          { i: <Clock size={26} color="#1366D6" />, t: "30 دقيقة", b: "أقرب فني يصلك سريعاً" },
          { i: <CreditCard size={26} color="#0FB5A6" />, t: "سعر ثابت", b: "بدون مفاجآت أو خفايا" },
          { i: <ShieldCheck size={26} color="#15803D" />, t: "ضمان 30 يوم", b: "إصلاح مجاني أو استرداد" },
          { i: <Headphones size={26} color="#F5A623" />, t: "دعم 24/7", b: "بالعربية وعلى مدار الساعة" },
        ].map(v => (
          <Card key={v.t} className="p-5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#F1F5F9" }}>{v.i}</div>
            <div className="mt-3" style={{ fontWeight: 700, fontSize: 17 }}>{v.t}</div>
            <div style={{ color: "#475569", fontSize: 13 }} className="mt-1">{v.b}</div>
          </Card>
        ))}
      </section>

      {/* Services */}
      <section className="pb-16">
        <h2 style={{ fontWeight: 800, fontSize: 32 }}>الخدمات</h2>
        <p style={{ color: "#475569", fontSize: 15 }} className="mt-1">أسعار ثابتة وشفافة — تعرفها قبل الحجز</p>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          {SERVICES.map(s => (
            <button key={s.id} onClick={() => onPickService(s)} className="text-start">
              <Card className="p-5 hover:-translate-y-0.5 transition">
                <ServiceIcon id={s.id} size={28} />
                <div className="mt-4" style={{ fontWeight: 700, fontSize: 16 }}>{s.ar}</div>
                <div className="mt-1" style={{ color: "#94A3B8", fontSize: 12 }}>المدة: <span style={{ fontFamily: "Inter" }}>{s.dur}</span> د</div>
                <div className="mt-3"><PriceBadge amount={s.price} /></div>
              </Card>
            </button>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="pb-16">
        <h2 style={{ fontWeight: 800, fontSize: 32 }}>كيف يعمل التطبيق؟</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {[
            { n: 1, t: "اختر الخدمة", b: "حدد ما تحتاج من القائمة وشاهد السعر الثابت." },
            { n: 2, t: "حدد الموقع والدفع", b: "ضع الدبوس على عنوانك واختر طريقة دفع آمنة." },
            { n: 3, t: "تتبّع الفني", b: "تابع الفني مباشرة على الخريطة حتى وصوله." },
          ].map(s => (
            <Card key={s.n} className="p-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#1366D6", color: "#FFF", fontFamily: "Inter", fontWeight: 800 }}>{s.n}</div>
              <div className="mt-4" style={{ fontWeight: 700, fontSize: 18 }}>{s.t}</div>
              <div style={{ color: "#475569", fontSize: 14 }} className="mt-1.5">{s.b}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="pb-16">
        <div className="flex items-end justify-between">
          <h2 style={{ fontWeight: 800, fontSize: 32 }}>آراء العملاء</h2>
          <Stars rating={4.8} size={18} />
        </div>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {[
            { name: "سارة خالد", text: "خدمة ممتازة! وصل الفني خلال 20 دقيقة وحلّ مشكلة التكييف بسرعة." },
            { name: "محمد الزعبي", text: "سعر ثابت كما هو معلن وبدون مفاجآت. أنصح بالتطبيق بشدة." },
            { name: "رنا حدّاد", text: "الضمان فعلاً حقيقي — أعادوا الفني بدون أي رسوم." },
          ].map(r => (
            <Card key={r.name} className="p-5">
              <Stars rating={5} />
              <p style={{ fontSize: 14 }} className="mt-3">«{r.text}»</p>
              <div className="mt-4 flex items-center gap-2">
                <Avatar name={r.name} size={32} />
                <span style={{ fontWeight: 700, fontSize: 13 }}>{r.name}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function Catalog({ onPick }: { onPick: (s: typeof SERVICES[number]) => void }) {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <h1 style={{ fontWeight: 800, fontSize: 32 }}>كل الخدمات</h1>
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {SERVICES.map(s => (
          <button key={s.id} onClick={() => onPick(s)} className="text-start">
            <Card className="p-5 flex items-center gap-4">
              <ServiceIcon id={s.id} size={28} />
              <div className="flex-1">
                <div style={{ fontWeight: 700, fontSize: 17 }}>{s.ar}</div>
                <div style={{ color: "#475569", fontSize: 12 }}>المدة: <span style={{ fontFamily: "Inter" }}>{s.dur}</span> دقيقة</div>
              </div>
              <PriceBadge amount={s.price} />
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}

function ServicePage({ svc, onBook, onBack }: { svc: typeof SERVICES[number]; onBook: () => void; onBack: () => void }) {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <button onClick={onBack} className="flex items-center gap-1" style={{ color: "#1366D6", fontWeight: 600, fontSize: 14 }}><ChevronLeft size={18} /> رجوع</button>
      <div className="mt-4 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-4">
            <ServiceIcon id={svc.id} size={32} />
            <div>
              <h1 style={{ fontWeight: 800, fontSize: 32 }}>{svc.ar}</h1>
              <div style={{ color: "#475569", fontSize: 14 }} className="mt-1">المدة المتوقعة: <span style={{ fontFamily: "Inter" }}>{svc.dur}</span> دقيقة</div>
            </div>
          </div>
          <Card className="mt-5 p-6">
            <h3 style={{ fontWeight: 700, fontSize: 17 }}>ما يشمله</h3>
            <ul className="mt-3 grid sm:grid-cols-2 gap-2">
              {["فحص شامل من فني معتمد","إصلاح المشكلة الأساسية","اختبار التشغيل","ضمان 30 يوم"].map(t => (
                <li key={t} className="flex items-center gap-2" style={{ fontSize: 14 }}>✅ {t}</li>
              ))}
            </ul>
          </Card>
        </div>
        <Card className="p-6 h-fit sticky top-20">
          <div style={{ color: "#475569", fontSize: 13 }}>السعر الثابت</div>
          <div className="mt-1"><PriceBadge amount={svc.price} big /></div>
          <div className="my-4 h-px bg-slate-100" />
          <ul className="space-y-2" style={{ fontSize: 13, color: "#475569" }}>
            <li className="flex items-center gap-2"><Clock size={14} /> فوراً خلال 30 دقيقة</li>
            <li className="flex items-center gap-2"><ShieldCheck size={14} color="#15803D" /> ضمان 30 يوم مشمول</li>
            <li className="flex items-center gap-2"><CreditCard size={14} /> دفع آمن — لا نقدي</li>
          </ul>
          <button onClick={onBook} className="mt-5 w-full h-12 rounded-xl" style={{ background: "#1366D6", color: "#FFF", fontWeight: 700 }}>اطلب الآن</button>
        </Card>
      </div>
    </div>
  );
}

function Booking({ svc, onBack }: { svc: typeof SERVICES[number]; onBack: () => void }) {
  const [when, setWhen] = useState<"now" | "later">("now");
  const [address, setAddress] = useState("خلدا، شارع وصفي التل، عمارة 12، ط2");
  const [pay, setPay] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const methods = ["Apple Pay", "Google Pay", "بطاقة"];
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <button onClick={onBack} className="flex items-center gap-1" style={{ color: "#1366D6", fontWeight: 600, fontSize: 14 }}><ChevronLeft size={18} /> رجوع</button>
      <div className="mt-4 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card className="p-6">
            <h3 style={{ fontWeight: 700, fontSize: 16 }}>الموعد</h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button onClick={() => setWhen("now")} className="p-4 rounded-xl border-2 text-start" style={{ borderColor: when === "now" ? "#1366D6" : "#E2E8F0", background: when === "now" ? "#E8F1FE" : "#FFF" }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: when === "now" ? "#1366D6" : "#0F172A" }}>فوراً</div>
                <div style={{ fontSize: 12, color: "#475569" }}>خلال 30 دقيقة</div>
              </button>
              <button onClick={() => setWhen("later")} className="p-4 rounded-xl border-2 text-start" style={{ borderColor: when === "later" ? "#1366D6" : "#E2E8F0", background: when === "later" ? "#E8F1FE" : "#FFF" }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: when === "later" ? "#1366D6" : "#0F172A" }}>حجز لاحقاً</div>
                <div style={{ fontSize: 12, color: "#475569" }}>اختر التاريخ</div>
              </button>
            </div>
          </Card>
          <Card className="p-6">
            <h3 style={{ fontWeight: 700, fontSize: 16 }}>الموقع</h3>
            <div className="mt-3 rounded-xl overflow-hidden">
              <MapMock height={240} customerLabel="عنوانك" />
            </div>
            <input value={address} onChange={e => setAddress(e.target.value)} className="mt-3 w-full h-12 rounded-xl border border-slate-200 px-4 outline-none" style={{ fontSize: 14 }} />
          </Card>
          <Card className="p-6">
            <h3 style={{ fontWeight: 700, fontSize: 16 }}>الدفع</h3>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {methods.map((m, i) => (
                <button key={m} onClick={() => setPay(i)} className="p-4 rounded-xl border-2 text-center" style={{ borderColor: i === pay ? "#1366D6" : "#E2E8F0", background: i === pay ? "#E8F1FE" : "#FFF", fontWeight: 700, fontSize: 14 }}>{m}</button>
              ))}
            </div>
          </Card>
        </div>
        <Card className="p-6 h-fit sticky top-20">
          <h3 style={{ fontWeight: 700, fontSize: 16 }}>ملخص الطلب</h3>
          <div className="mt-4 flex items-center gap-3">
            <ServiceIcon id={svc.id} size={20} />
            <div className="flex-1"><div style={{ fontWeight: 700, fontSize: 14 }}>{svc.ar}</div><div style={{ fontSize: 12, color: "#475569" }}>سعر ثابت</div></div>
            <PriceBadge amount={svc.price} />
          </div>
          <div className="my-4 h-px bg-slate-100" />
          <InlineRow label="سعر الخدمة" value={`${svc.price} دينار`} />
          <InlineRow label="الخصم" value="0 دينار" />
          <div className="my-2 h-px bg-slate-100" />
          <InlineRow strong label="الإجمالي" value={`${svc.price} دينار`} />
          <p className="mt-3 p-3 rounded-lg" style={{ background: "#E8F1FE", color: "#0E4FA8", fontSize: 12 }}>سيتم حجز المبلغ الآن ويُخصم بعد إتمام الخدمة.</p>
          <button onClick={() => setConfirming(true)} className="mt-4 w-full h-12 rounded-xl" style={{ background: "#1366D6", color: "#FFF", fontWeight: 700 }}>تأكيد الحجز</button>
        </Card>
      </div>
      {confirming && (
        <ConfirmDialog
          title="تأكيد الحجز"
          body={`سيتم حجز ${svc.price} دينار عبر ${methods[pay]} وخصمه بعد إتمام الخدمة.`}
          confirmLabel="تأكيد والدفع"
          onConfirm={() => { setConfirming(false); notify("تم تأكيد الحجز — سنرسل لك رابط التتبع", "success"); onBack(); }}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-10 grid md:grid-cols-4 gap-6">
        <div>
          <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#1366D6" }}>🔧</div><span style={{ color: "#1366D6", fontWeight: 800, fontSize: 22 }}>Fixly</span></div>
          <p className="mt-3" style={{ color: "#475569", fontSize: 13 }}>فني محترف خلال 30 دقيقة — في عمّان.</p>
        </div>
        {[
          { t: "الشركة", items: ["عن Fixly", "الوظائف", "المدوّنة"] },
          { t: "الخدمات", items: ["كهرباء", "سباكة", "تكييف", "دهان", "تركيب أثاث"] },
          { t: "الدعم", items: ["مركز المساعدة", "الضمان", "تواصل معنا", "+962 6 555 0000"] },
        ].map(c => (
          <div key={c.t}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{c.t}</div>
            <ul className="mt-3 space-y-1.5">{c.items.map(i => <li key={i}><button onClick={() => notify(i)} style={{ color: "#475569", fontSize: 13 }}>{i}</button></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200 py-4 text-center" style={{ color: "#94A3B8", fontSize: 12 }}>© 2026 Fixly. جميع الحقوق محفوظة.</div>
    </footer>
  );
}
