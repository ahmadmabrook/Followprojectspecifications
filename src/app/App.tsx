import { useState } from "react";
import { Smartphone, Wrench, Monitor, Settings, Palette, Moon, Sun } from "lucide-react";
import { Toaster } from "sonner";
import DesignSystem from "./components/fixly/DesignSystem";
import CustomerMobile from "./components/fixly/CustomerMobile";
import TechnicianMobile from "./components/fixly/TechnicianMobile";
import CustomerWeb from "./components/fixly/CustomerWeb";
import AdminPanel from "./components/fixly/AdminPanel";

type Product = "customer-mobile" | "technician-mobile" | "customer-web" | "admin" | "design-system";

const PRODUCTS: { id: Product; ar: string; en: string; Icon: any; tag?: string }[] = [
  { id: "customer-mobile",   ar: "تطبيق العميل",     en: "Customer Mobile",   Icon: Smartphone, tag: "PRIORITY" },
  { id: "technician-mobile", ar: "تطبيق الفني",       en: "Technician Mobile", Icon: Wrench },
  { id: "customer-web",      ar: "موقع العميل",       en: "Customer Web",      Icon: Monitor },
  { id: "admin",             ar: "لوحة الإدارة",      en: "Admin Panel",       Icon: Settings },
  { id: "design-system",     ar: "نظام التصميم",      en: "Design System",     Icon: Palette },
];

export default function App() {
  const [product, setProduct] = useState<Product>("customer-mobile");
  const [dark, setDark] = useState(false);

  return (
    <div className={`${dark ? "dark" : ""} size-full flex flex-col bg-background text-foreground`} style={{ fontFamily: "'Inter','Tajawal',sans-serif" }}>
      <Toaster position="top-center" richColors closeButton />
      {/* Top shell */}
      <header className="bg-white border-b border-slate-200 shrink-0">
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#1366D6" }}>
              <Wrench size={20} color="#FFF" />
            </div>
            <div>
              <div style={{ color: "#1366D6", fontWeight: 800, fontSize: 20, letterSpacing: -0.5 }}>Fixly</div>
              <div style={{ color: "#94A3B8", fontSize: 11 }}>UI/UX Prototype · Amman, JO</div>
            </div>
          </div>

          <div className="flex-1" />
          <button onClick={() => setDark(v => !v)} aria-label="تبديل المظهر" className="w-9 h-9 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 dark:bg-slate-800" style={{ color: "#1366D6" }}>
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <nav className="flex items-center gap-1.5 overflow-x-auto">
            {PRODUCTS.map(p => {
              const active = product === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setProduct(p.id)}
                  className="px-3 py-2 rounded-lg flex items-center gap-2 transition relative shrink-0"
                  style={{
                    background: active ? "#1366D6" : "transparent",
                    color: active ? "#FFF" : "#475569",
                    fontWeight: active ? 700 : 600,
                    fontSize: 13,
                  }}
                >
                  <p.Icon size={16} />
                  {p.en}
                  {p.tag && !active && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: "#F5A623", color: "#FFF" }}>{p.tag}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Stage */}
      <main className="flex-1 overflow-hidden flex items-center justify-center p-6">
        <div className="w-full h-full flex items-center justify-center">
          {product === "customer-mobile" && <CustomerMobile />}
          {product === "technician-mobile" && <TechnicianMobile />}
          {product === "customer-web" && (
            <div className="w-full max-w-[1280px] h-full shadow-2xl rounded-xl overflow-hidden border border-slate-200">
              <CustomerWeb />
            </div>
          )}
          {product === "admin" && (
            <div className="w-full max-w-[1400px] h-full shadow-2xl rounded-xl overflow-hidden border border-slate-200">
              <AdminPanel />
            </div>
          )}
          {product === "design-system" && (
            <div className="w-full max-w-[1200px] h-full shadow-2xl rounded-xl overflow-hidden border border-slate-200">
              <DesignSystem />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
