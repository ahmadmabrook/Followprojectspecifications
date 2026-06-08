import { SERVICES, ServiceIcon, PriceBadge, StatusBadge, Stars, Avatar, GuaranteePill, Card } from "./shared";

export default function DesignSystem() {
  return (
    <div dir="rtl" className="w-full overflow-y-auto" style={{ background: "#F6F8FB", maxHeight: 844 }}>
      <div className="max-w-[1100px] mx-auto p-8 space-y-8">
        <header>
          <h1 style={{ fontWeight: 800, fontSize: 32 }}>Fixly · نظام التصميم</h1>
          <p style={{ color: "#475569" }} className="mt-1">المكوّنات الأساسية، الألوان، والطباعة المستخدمة عبر التطبيقات الأربعة.</p>
        </header>

        <Card className="p-6">
          <h2 style={{ fontWeight: 700, fontSize: 18 }}>Colors</h2>
          <div className="mt-4 grid grid-cols-4 md:grid-cols-8 gap-3">
            {[
              ["Primary", "#1366D6"], ["Primary dark", "#0E4FA8"], ["Primary tint", "#E8F1FE"],
              ["Secondary", "#0FB5A6"], ["Accent", "#F5A623"], ["Success", "#1FAA59"],
              ["Warning", "#F5A623"], ["Error", "#E5484D"], ["Ink", "#0F172A"],
              ["Ink 2", "#475569"], ["Muted", "#94A3B8"], ["Border", "#E2E8F0"],
              ["Background", "#F6F8FB"], ["Surface", "#FFFFFF"],
            ].map(([n, c]) => (
              <div key={n}>
                <div className="aspect-square rounded-xl border border-slate-200" style={{ background: c }} />
                <div className="mt-1.5 text-xs font-semibold">{n}</div>
                <div className="text-[10px] text-slate-500" style={{ fontFamily: "Inter" }}>{c}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 style={{ fontWeight: 700, fontSize: 18 }}>Typography</h2>
          <div className="mt-4 space-y-3">
            <div style={{ fontWeight: 700, fontSize: 28 }}>Display — فني محترف</div>
            <div style={{ fontWeight: 700, fontSize: 22 }}>H1 — اطلب الآن خلال 30 دقيقة</div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>H2 — العنوان الفرعي</div>
            <div style={{ fontSize: 15 }}>Body 15 — نص أساسي طبيعي للوصف والمحتوى داخل الشاشات.</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Body strong — للعناصر المُبرَزة.</div>
            <div style={{ fontSize: 13, color: "#475569" }}>Caption 13 — معلومات ثانوية.</div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>Tiny 11 — Labels & meta</div>
            <div className="text-sm text-slate-500 mt-3" dir="ltr">Latin: <span style={{ fontFamily: "Inter" }}>Inter</span> · Arabic: <span style={{ fontFamily: "Tajawal" }}>Tajawal</span></div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 style={{ fontWeight: 700, fontSize: 18 }}>Service icons & prices</h2>
          <div className="mt-4 grid grid-cols-5 gap-3">
            {SERVICES.map(s => (
              <div key={s.id} className="text-center p-4 rounded-xl border border-slate-100">
                <div className="mx-auto w-fit"><ServiceIcon id={s.id} size={28} /></div>
                <div className="mt-2" style={{ fontWeight: 700, fontSize: 14 }}>{s.ar}</div>
                <div className="mt-2"><PriceBadge amount={s.price} /></div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 style={{ fontWeight: 700, fontSize: 18 }}>Status badges</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {(["pending","searching","accepted","technician_arriving","in_progress","completed","cancelled","expired"] as const).map(s => (
              <StatusBadge key={s} status={s} />
            ))}
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h2 style={{ fontWeight: 700, fontSize: 18 }}>Buttons</h2>
            <div className="mt-4 space-y-2.5">
              <button className="w-full h-[52px] rounded-xl" style={{ background: "#1366D6", color: "#FFF", fontWeight: 600 }}>Primary L</button>
              <button className="w-full h-11 rounded-xl border-2" style={{ borderColor: "#1366D6", color: "#1366D6", fontWeight: 600 }}>Secondary M</button>
              <button className="w-full h-9 rounded-xl" style={{ background: "#F1F5F9", color: "#0F172A", fontWeight: 600, fontSize: 13 }}>Tertiary S</button>
              <button className="w-full h-[52px] rounded-xl" style={{ background: "#E5484D", color: "#FFF", fontWeight: 600 }}>Destructive</button>
              <button disabled className="w-full h-[52px] rounded-xl opacity-50" style={{ background: "#1366D6", color: "#FFF", fontWeight: 600 }}>Disabled</button>
            </div>
          </Card>
          <Card className="p-6">
            <h2 style={{ fontWeight: 700, fontSize: 18 }}>Misc</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3"><Avatar name="خالد المومني" verified /><div><div style={{ fontWeight: 700 }}>خالد المومني</div><Stars rating={4.9} size={12} /></div></div>
              <GuaranteePill />
              <PriceBadge amount={50} big />
              <div className="flex gap-2">
                <input className="flex-1 h-12 rounded-xl border border-slate-200 px-3 outline-none" placeholder="حقل إدخال" />
                <button className="px-4 rounded-xl" style={{ background: "#1366D6", color: "#FFF", fontWeight: 600 }}>تطبيق</button>
              </div>
              <div className="flex gap-2">
                {[1,2,3,4,5,6].map(i => <div key={i} className="w-12 h-14 rounded-xl border-2 flex items-center justify-center" style={{ borderColor: i <= 4 ? "#1366D6" : "#E2E8F0", background: i <= 4 ? "#E8F1FE" : "#FFF", fontFamily: "Inter", fontWeight: 700, fontSize: 20 }}>{i <= 4 ? i : ""}</div>)}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
