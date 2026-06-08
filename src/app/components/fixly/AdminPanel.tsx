import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard, Users, ClipboardList, ShieldCheck, MessageCircle, UserCircle,
  BarChart3, Bell, Search, Filter, Download, ChevronDown, MoreHorizontal,
  TrendingUp, DollarSign, Star, AlertCircle, MapPin, CheckCircle2, X, Eye, Ban, UserCheck,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { SERVICES, StatusBadge, Avatar, ServiceIcon, MapMock, Stars, notify } from "./shared";

type Nav = "dash" | "techs" | "bookings" | "guarantee" | "support" | "customers" | "finance" | "broadcast";

const NAV = [
  { id: "dash" as Nav, label: "Dashboard", Icon: LayoutDashboard },
  { id: "techs" as Nav, label: "Technicians", Icon: Users },
  { id: "bookings" as Nav, label: "Bookings", Icon: ClipboardList },
  { id: "guarantee" as Nav, label: "Guarantees", Icon: ShieldCheck },
  { id: "support" as Nav, label: "Support", Icon: MessageCircle },
  { id: "customers" as Nav, label: "Customers", Icon: UserCircle },
  { id: "finance" as Nav, label: "Financials", Icon: BarChart3 },
  { id: "broadcast" as Nav, label: "Broadcast", Icon: Bell },
];

export default function AdminPanel() {
  const [nav, setNav] = useState<Nav>("dash");
  return (
    <div dir="ltr" className="w-full overflow-hidden flex" style={{ background: "#F6F8FB", height: 844, fontFamily: "Inter" }}>
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col">
        <div className="px-5 py-5 flex items-center gap-2 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#1366D6" }}>🔧</div>
          <div>
            <div style={{ color: "#1366D6", fontWeight: 800, fontSize: 18 }}>Fixly</div>
            <div style={{ color: "#94A3B8", fontSize: 11 }}>Admin Panel</div>
          </div>
        </div>
        <nav className="flex-1 py-3">
          {NAV.map(n => {
            const active = nav === n.id;
            return (
              <button key={n.id} onClick={() => setNav(n.id)} className="w-full px-4 py-2.5 flex items-center gap-3" style={{ background: active ? "#E8F1FE" : "transparent", color: active ? "#1366D6" : "#475569", borderRight: active ? "3px solid #1366D6" : "none", fontWeight: active ? 700 : 500, fontSize: 14 }}>
                <n.Icon size={18} />
                {n.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-100 flex items-center gap-2">
          <Avatar name="Ops Admin" size={32} />
          <div className="flex-1 min-w-0">
            <div style={{ fontSize: 13, fontWeight: 700 }}>Layla Hadid</div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>super_admin</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4">
          <div className="flex-1 flex items-center gap-2 max-w-md px-3 h-9 rounded-lg" style={{ background: "#F1F5F9" }}>
            <Search size={16} color="#94A3B8" />
            <input
              className="flex-1 bg-transparent outline-none"
              placeholder="Search bookings, technicians..."
              style={{ fontSize: 13 }}
              onKeyDown={(e) => { if (e.key === "Enter") notify(`Searching for "${(e.target as HTMLInputElement).value}"…`); }}
            />
          </div>
          <button onClick={() => notify("3 unread notifications")} aria-label="notifications" className="relative w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#E5484D" }} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {nav === "dash" && <Dashboard />}
          {nav === "techs" && <Technicians />}
          {nav === "bookings" && <Bookings />}
          {nav === "guarantee" && <Guarantees />}
          {nav === "support" && <SupportInbox />}
          {nav === "customers" && <Customers />}
          {nav === "finance" && <Finance />}
          {nav === "broadcast" && <Broadcast />}
        </div>
      </div>
    </div>
  );
}

function AdminConfirm({ title, body, confirmLabel = "Confirm", variant = "primary", onConfirm, onCancel }: {
  title: string; body?: string; confirmLabel?: string; variant?: "primary" | "destructive";
  onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}>
      <div className="bg-white rounded-2xl p-6 shadow-2xl" style={{ width: 360 }}>
        <h3 className="font-bold text-lg">{title}</h3>
        {body && <p className="text-slate-500 text-sm mt-2">{body}</p>}
        <div className="mt-5 flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: variant === "destructive" ? "#E5484D" : "#1366D6" }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

type TechAction = "view" | "approve" | "suspend" | "reinstate";
function TechActionsMenu({ status, onClose, onAction }: { status: string; onClose: () => void; onAction: (a: TechAction) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  return (
    <div ref={ref} className="absolute z-40 bg-white rounded-xl shadow-xl border border-slate-100 py-1" style={{ right: 0, top: 28, minWidth: 180 }}>
      <button onClick={() => onAction("view")} className="w-full px-4 py-2.5 text-sm text-left hover:bg-slate-50 flex items-center gap-2"><Eye size={14} color="#475569" /> View profile</button>
      {status === "pending" && <button onClick={() => onAction("approve")} className="w-full px-4 py-2.5 text-sm text-left hover:bg-slate-50 flex items-center gap-2" style={{ color: "#15803D" }}><UserCheck size={14} /> Approve</button>}
      {status !== "suspended" && <button onClick={() => onAction("suspend")} className="w-full px-4 py-2.5 text-sm text-left hover:bg-slate-50 flex items-center gap-2" style={{ color: "#B91C1C" }}><Ban size={14} /> Suspend</button>}
      {status === "suspended" && <button onClick={() => onAction("reinstate")} className="w-full px-4 py-2.5 text-sm text-left hover:bg-slate-50 flex items-center gap-2" style={{ color: "#15803D" }}><UserCheck size={14} /> Reinstate</button>}
    </div>
  );
}

function DateRangePicker({ options = ["Today", "Last 7 days", "Last 30 days", "Last 6 months"], initial = 1 }: { options?: string[]; initial?: number }) {
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(initial);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-semibold flex items-center gap-2">
        <ChevronDown size={14} /> {options[sel]}
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-30 bg-white rounded-xl shadow-xl border border-slate-100 py-1 min-w-[160px]">
          {options.map((o, i) => (
            <button key={o} onClick={() => { setSel(i); setOpen(false); }} className="w-full px-3 py-2 text-sm text-left hover:bg-slate-50" style={{ fontWeight: i === sel ? 700 : 500, color: i === sel ? "#1366D6" : "#0F172A" }}>{o}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function KPI({ label, value, delta, icon, color }: { label: string; value: string; delta?: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + "20", color }}>{icon}</div>
        {delta && <span className="text-xs font-semibold" style={{ color: "#15803D" }}>{delta}</span>}
      </div>
      <div className="mt-3 text-2xl font-bold">{value}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
    </div>
  );
}

function Dashboard() {
  const revenueData = [
    { d: "Mon", revenue: 1200 }, { d: "Tue", revenue: 1450 }, { d: "Wed", revenue: 1100 },
    { d: "Thu", revenue: 1800 }, { d: "Fri", revenue: 2100 }, { d: "Sat", revenue: 2400 }, { d: "Sun", revenue: 1900 },
  ];
  const byService = [
    { name: "Electricity", count: 72 },
    { name: "Plumbing", count: 58 },
    { name: "AC", count: 64 },
    { name: "Painting", count: 31 },
    { name: "Furniture", count: 42 },
  ];
  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Today, 08/06/2026 · Amman</p>
        </div>
        <DateRangePicker />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
        <KPI label="Today's revenue" value="JOD 1,920" delta="+12%" icon={<DollarSign size={18} />} color="#1366D6" />
        <KPI label="Bookings today" value="64" delta="+8%" icon={<ClipboardList size={18} />} color="#0FB5A6" />
        <KPI label="Active technicians" value="48" icon={<Users size={18} />} color="#F5A623" />
        <KPI label="Avg rating" value="4.8 ★" icon={<Star size={18} />} color="#1FAA59" />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-5">
        <div className="col-span-2 bg-white rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Revenue trend</h3>
            <span className="text-xs text-slate-500">JOD</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData} key="dash-line">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="d" tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <Tooltip cursor={false} />
              <Line type="monotone" dataKey="revenue" stroke="#1366D6" strokeWidth={3} dot={{ r: 4, fill: "#1366D6" }} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <h3 className="font-bold">Bookings by service</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byService} key="dash-bar">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94A3B8" }} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} />
              <Tooltip cursor={false} />
              <Bar dataKey="count" fill="#0FB5A6" radius={[6, 6, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-2 bg-white rounded-2xl p-5 border border-slate-100">
          <h3 className="font-bold">Live activity</h3>
          <div className="mt-3 space-y-2">
            {[
              { ic: "✅", t: "Booking #FX-20603 accepted by خالد المومني", time: "Just now", c: "#15803D" },
              { ic: "🔧", t: "Service started — كهرباء @ Khalda", time: "2 min ago", c: "#B45309" },
              { ic: "💰", t: "Payment captured: JOD 50 (Apple Pay)", time: "5 min ago", c: "#1366D6" },
              { ic: "⚠️", t: "Guarantee ticket #GR-104 opened — needs review", time: "12 min ago", c: "#E5484D" },
              { ic: "👤", t: "New customer registered: محمد الزعبي", time: "20 min ago", c: "#0FB5A6" },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0 border-slate-100">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: a.c + "20" }}>{a.ic}</div>
                <div className="flex-1 text-sm">{a.t}</div>
                <span className="text-xs text-slate-500">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <h3 className="font-bold">Open issues</h3>
          <div className="mt-3 space-y-3">
            <div className="p-3 rounded-lg" style={{ background: "#FEE2E2" }}>
              <div className="flex items-center gap-2 text-sm font-bold" style={{ color: "#B91C1C" }}><AlertCircle size={14} /> Guarantees</div>
              <div className="text-xs mt-1">3 tickets · SLA risk: 1</div>
            </div>
            <div className="p-3 rounded-lg" style={{ background: "#FEF3C7" }}>
              <div className="flex items-center gap-2 text-sm font-bold" style={{ color: "#B45309" }}><AlertCircle size={14} /> Pending technicians</div>
              <div className="text-xs mt-1">7 awaiting approval</div>
            </div>
            <div className="p-3 rounded-lg" style={{ background: "#DBEAFE" }}>
              <div className="flex items-center gap-2 text-sm font-bold" style={{ color: "#1366D6" }}><AlertCircle size={14} /> Support</div>
              <div className="text-xs mt-1">12 open conversations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Technicians() {
  const [techs, setTechs] = useState([
    { name: "خالد المومني", phone: "+962 79 555 1234", rating: 4.9, jobs: 320, status: "approved", svc: "كهرباء" },
    { name: "عمر الشريف", phone: "+962 79 444 5678", rating: 4.7, jobs: 180, status: "approved", svc: "سباكة" },
    { name: "سامي النسور", phone: "+962 79 333 9999", rating: 4.8, jobs: 95, status: "approved", svc: "تكييف" },
    { name: "محمد القضاة", phone: "+962 79 222 8888", rating: 0, jobs: 0, status: "pending", svc: "دهان" },
    { name: "أحمد العامري", phone: "+962 79 111 7777", rating: 0, jobs: 0, status: "pending", svc: "كهرباء" },
    { name: "ياسر العواملة", phone: "+962 79 000 6666", rating: 3.2, jobs: 22, status: "suspended", svc: "سباكة" },
  ]);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [filterTab, setFilterTab] = useState(0);
  const [techConfirm, setTechConfirm] = useState<{ idx: number; action: Exclude<TechAction, "view"> } | null>(null);

  const applyTechAction = (idx: number, action: Exclude<TechAction, "view">) => {
    const next = action === "suspend" ? "suspended" : "approved";
    setTechs(ts => ts.map((t, i) => i === idx ? { ...t, status: next } : t));
    const name = techs[idx].name;
    if (action === "approve") notify(`Approved ${name}`, "success");
    else if (action === "suspend") notify(`Suspended ${name}`, "success");
    else notify(`Reinstated ${name}`, "success");
    setTechConfirm(null);
    setOpenMenu(null);
  };

  const handleAction = (idx: number, action: TechAction) => {
    if (action === "view") {
      notify(`Profile: ${techs[idx].name}`);
      setOpenMenu(null);
      return;
    }
    setTechConfirm({ idx, action });
    setOpenMenu(null);
  };

  const STATCOLOR: Record<string, [string, string]> = {
    approved: ["#DCFCE7", "#15803D"],
    pending:  ["#FEF3C7", "#B45309"],
    rejected: ["#FEE2E2", "#B91C1C"],
    suspended:["#FEE2E2", "#B91C1C"],
  };
  const tabs = ["All (48)", "Approved (38)", "Pending (7)", "Suspended (3)"];

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Technicians</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => notify("Filter panel coming soon")} className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-semibold flex items-center gap-2"><Filter size={14} /> Filters</button>
          <button onClick={() => notify("Invite link copied to clipboard", "success")} className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold">+ Invite</button>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setFilterTab(i)} className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: filterTab === i ? "#1366D6" : "#FFF", color: filterTab === i ? "#FFF" : "#475569", border: "1px solid " + (filterTab === i ? "#1366D6" : "#E2E8F0") }}>{t}</button>
        ))}
      </div>

      <div className="mt-4 bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead style={{ background: "#F8FAFC", color: "#475569" }}>
            <tr className="text-left">
              {["Technician", "Service", "Phone", "Rating", "Jobs", "Status", ""].map(h => <th key={h} className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {techs.map((t, i) => {
              const [bg, fg] = STATCOLOR[t.status];
              return (
                <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><Avatar name={t.name} size={32} /><span className="font-semibold">{t.name}</span></div></td>
                  <td className="px-4 py-3">{t.svc}</td>
                  <td className="px-4 py-3 font-mono text-xs">{t.phone}</td>
                  <td className="px-4 py-3">{t.rating > 0 ? <Stars rating={t.rating} size={12} /> : <span className="text-slate-400">—</span>}</td>
                  <td className="px-4 py-3 font-semibold">{t.jobs}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: bg, color: fg }}>{t.status}</span></td>
                  <td className="px-4 py-3 relative">
                    <button onClick={() => setOpenMenu(openMenu === i ? null : i)} className="p-1 rounded hover:bg-slate-100">
                      <MoreHorizontal size={16} color="#94A3B8" />
                    </button>
                    {openMenu === i && (
                      <TechActionsMenu status={t.status} onClose={() => setOpenMenu(null)} onAction={(a) => handleAction(i, a)} />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Pagination total={48} pageSize={6} />
      </div>

      {techConfirm && (
        <AdminConfirm
          title={techConfirm.action === "approve" ? "Approve technician?" : techConfirm.action === "suspend" ? "Suspend technician?" : "Reinstate technician?"}
          body={`This will ${techConfirm.action} ${techs[techConfirm.idx].name}. The technician will be notified.`}
          confirmLabel={techConfirm.action[0].toUpperCase() + techConfirm.action.slice(1)}
          variant={techConfirm.action === "suspend" ? "destructive" : "primary"}
          onConfirm={() => applyTechAction(techConfirm.idx, techConfirm.action)}
          onCancel={() => setTechConfirm(null)}
        />
      )}
    </div>
  );
}

function Pagination({ total, pageSize }: { total: number; pageSize: number }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(total / pageSize);
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
      <span>Showing {from}–{to} of {total}</span>
      <div className="flex gap-1">
        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-2 py-1 rounded border border-slate-200 disabled:opacity-40">‹</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => setPage(p)} className="px-2 py-1 rounded border border-slate-200" style={{ background: p === page ? "#1366D6" : "#FFF", color: p === page ? "#FFF" : "#475569" }}>{p}</button>
        ))}
        <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-2 py-1 rounded border border-slate-200 disabled:opacity-40">›</button>
      </div>
    </div>
  );
}

function Bookings() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Bookings</h1>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold">Active bookings · live map</h3>
            <span className="text-xs text-slate-500">12 active</span>
          </div>
          <MapMock height={280} showRoute showTechPin techLabel="خالد" customerLabel="Customer" />
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <h3 className="font-bold">Status distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={[
                { name: "In progress", v: 8 },
                { name: "Arriving", v: 4 },
                { name: "Completed", v: 52 },
                { name: "Cancelled", v: 3 },
              ]} dataKey="v" nameKey="name" innerRadius={45} outerRadius={75} isAnimationActive={false}>
                {["#F5A623","#0FB5A6","#1FAA59","#E5484D"].map((c) => <Cell key={`cell-${c}`} fill={c} />)}
              </Pie>
              <Tooltip cursor={false} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 text-xs">
            {[["In progress","#F5A623",8],["Arriving","#0FB5A6",4],["Completed","#1FAA59",52],["Cancelled","#E5484D",3]].map(([l,c,v]) => (
              <div key={l as string} className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: c as string }} /><span className="flex-1">{l as string}</span><span className="font-semibold">{v as number}</span></div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold">All bookings</h3>
          <div className="flex gap-2">
            <button onClick={() => notify("Status filter coming soon")} className="px-3 py-1.5 rounded-lg text-xs border border-slate-200 flex items-center gap-1.5"><Filter size={12} /> Status</button>
            <button onClick={() => notify("Exporting CSV…", "success")} className="px-3 py-1.5 rounded-lg text-xs border border-slate-200 flex items-center gap-1.5"><Download size={12} /> Export</button>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead style={{ background: "#F8FAFC", color: "#475569" }}>
            <tr className="text-left">{["ID", "Customer", "Service", "Technician", "Amount", "Status", "Date"].map(h => <th key={h} className="px-4 py-3 font-semibold text-xs uppercase">{h}</th>)}</tr>
          </thead>
          <tbody>
            {[
              { id: "FX-20603", cust: "أحمد العلي", svc: "elec" as const, tech: "خالد المومني", amount: 50, status: "technician_arriving" as const, d: "08/06 3:30 PM" },
              { id: "FX-20602", cust: "سارة خالد", svc: "ac" as const, tech: "سامي النسور", amount: 30, status: "in_progress" as const, d: "08/06 2:45 PM" },
              { id: "FX-20601", cust: "محمد الزعبي", svc: "plumb" as const, tech: "عمر الشريف", amount: 40, status: "completed" as const, d: "08/06 1:20 PM" },
              { id: "FX-20600", cust: "رنا حدّاد", svc: "paint" as const, tech: "—", amount: 70, status: "searching" as const, d: "08/06 1:05 PM" },
              { id: "FX-20599", cust: "يوسف العمري", svc: "furn" as const, tech: "خالد المومني", amount: 35, status: "cancelled" as const, d: "08/06 11:30 AM" },
            ].map(b => (
              <tr key={b.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-mono font-semibold">{b.id}</td>
                <td className="px-4 py-3">{b.cust}</td>
                <td className="px-4 py-3"><div className="flex items-center gap-1.5"><ServiceIcon id={b.svc} size={14} /><span>{SERVICES.find(s => s.id === b.svc)!.en}</span></div></td>
                <td className="px-4 py-3">{b.tech}</td>
                <td className="px-4 py-3 font-bold">JOD {b.amount}</td>
                <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                <td className="px-4 py-3 text-slate-500">{b.d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Guarantees() {
  const [tickets, setTickets] = useState([
    { id: "GR-104", cust: "أحمد العلي", svc: "plumb" as const, when: "06/06 9:20 AM", sla: 35, status: "review" },
    { id: "GR-103", cust: "سارة خالد", svc: "ac" as const, when: "05/06 4:10 PM", sla: 5, status: "review" },
    { id: "GR-102", cust: "محمد الزعبي", svc: "elec" as const, when: "04/06", sla: 0, status: "approved" },
    { id: "GR-101", cust: "رنا حدّاد", svc: "paint" as const, when: "02/06", sla: 0, status: "rejected" },
  ]);
  const [confirm, setConfirm] = useState<{ id: string; action: "approve" | "reject" } | null>(null);

  const handleDecision = (id: string, action: "approve" | "reject") => {
    setTickets(ts => ts.map(t => t.id === id ? { ...t, status: action === "approve" ? "approved" : "rejected" } : t));
    setConfirm(null);
  };

  return (
    <div className="relative">
      <h1 className="text-2xl font-bold">Guarantee tickets</h1>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {tickets.map(t => (
          <div key={t.id} className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono font-bold">{t.id}</div>
                <div className="text-xs text-slate-500">{t.cust} · {t.when}</div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{
                background: t.status === "approved" ? "#DCFCE7" : t.status === "rejected" ? "#FEE2E2" : "#FEF3C7",
                color: t.status === "approved" ? "#15803D" : t.status === "rejected" ? "#B91C1C" : "#B45309",
              }}>{t.status}</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <ServiceIcon id={t.svc} size={18} />
              <span className="text-sm">{SERVICES.find(s => s.id === t.svc)!.en}</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {[1,2,3].map(i => <div key={i} className="aspect-square rounded-lg bg-slate-100 flex items-center justify-center text-2xl">🖼️</div>)}
            </div>
            {t.status === "review" && (
              <>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500">SLA (2h)</span>
                  <span className={t.sla < 15 ? "font-bold" : "font-semibold"} style={{ color: t.sla < 15 ? "#B91C1C" : "#475569" }}>{t.sla} min left</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                  <div className="h-full rounded-full" style={{ width: `${(t.sla / 120) * 100}%`, background: t.sla < 15 ? "#E5484D" : "#1366D6" }} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button onClick={() => setConfirm({ id: t.id, action: "approve" })} className="h-9 rounded-lg text-sm font-semibold" style={{ background: "#1FAA59", color: "#FFF" }}>Approve</button>
                  <button onClick={() => setConfirm({ id: t.id, action: "reject" })} className="h-9 rounded-lg text-sm font-semibold border border-slate-200">Reject</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {confirm && (
        <AdminConfirm
          title={confirm.action === "approve" ? "Approve guarantee claim?" : "Reject guarantee claim?"}
          body={confirm.action === "approve"
            ? `This will approve ${confirm.id} and schedule a free revisit. The customer will be notified.`
            : `This will reject ${confirm.id}. The customer will be notified of the decision.`}
          confirmLabel={confirm.action === "approve" ? "Approve" : "Reject"}
          variant={confirm.action === "reject" ? "destructive" : "primary"}
          onConfirm={() => handleDecision(confirm.id, confirm.action)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

function SupportInbox() {
  const convos = [
    { name: "أحمد العلي", msg: "متى يصل الفني؟", unread: true, time: "2m" },
    { name: "سارة خالد", msg: "كيف أسترد المبلغ؟", unread: true, time: "8m" },
    { name: "محمد الزعبي", msg: "شكراً لمساعدتكم", unread: false, time: "1h" },
    { name: "رنا حدّاد", msg: "هل يمكن إعادة الجدولة؟", unread: false, time: "3h" },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold">Support</h1>
      <div className="mt-4 grid grid-cols-3 gap-4" style={{ height: 580 }}>
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100"><h3 className="font-bold text-sm">Inbox · 12 open</h3></div>
          <div className="flex-1 overflow-y-auto">
            {convos.map((c, i) => (
              <button key={i} className="w-full px-4 py-3 flex items-center gap-2 border-b border-slate-100 hover:bg-slate-50 text-left" style={{ background: i === 0 ? "#E8F1FE" : "#FFF" }}>
                <Avatar name={c.name} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{c.name}</span>
                    <span className="text-xs text-slate-500">{c.time}</span>
                  </div>
                  <div className="text-xs text-slate-500 truncate mt-0.5">{c.msg}</div>
                </div>
                {c.unread && <span className="w-2 h-2 rounded-full" style={{ background: "#1366D6" }} />}
              </button>
            ))}
          </div>
        </div>
        <div className="col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
            <Avatar name="أحمد العلي" size={32} />
            <div>
              <div className="font-bold text-sm">أحمد العلي</div>
              <div className="text-xs text-slate-500">Booking #FX-20603 · Customer</div>
            </div>
            <div className="flex-1" />
            <button onClick={() => notify("Conversation marked as resolved", "success")} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200">Resolve</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: "#F8FAFC" }}>
            <div className="flex gap-2 items-end">
              <Avatar name="أحمد العلي" size={28} />
              <div className="max-w-xs rounded-2xl rounded-bl-sm bg-white p-3 text-sm border border-slate-100">السلام عليكم، متى يصل الفني؟</div>
            </div>
            <div className="flex gap-2 items-end justify-end">
              <div className="max-w-xs rounded-2xl rounded-br-sm p-3 text-sm" style={{ background: "#1366D6", color: "#FFF" }}>وعليكم السلام. الفني خالد على بُعد 5 دقائق، ويمكنك تتبّعه على الخريطة.</div>
              <Avatar name="Layla" size={28} />
            </div>
            <div className="flex gap-2 items-end">
              <Avatar name="أحمد العلي" size={28} />
              <div className="max-w-xs rounded-2xl rounded-bl-sm bg-white p-3 text-sm border border-slate-100">شكراً، لاحظت أن السعر 50 د — هل يشمل الضمان؟</div>
            </div>
          </div>
          <SupportReply />
        </div>
      </div>
    </div>
  );
}

function SupportReply() {
  const [val, setVal] = useState("");
  const send = () => {
    if (!val.trim()) return;
    notify("Reply sent", "success");
    setVal("");
  };
  return (
    <div className="p-3 border-t border-slate-100 flex gap-2">
      <input
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") send(); }}
        className="flex-1 h-10 rounded-lg border border-slate-200 px-3 outline-none text-sm"
        placeholder="Type a reply..."
      />
      <button onClick={send} className="px-4 rounded-lg text-sm font-semibold" style={{ background: "#1366D6", color: "#FFF" }}>Send</button>
    </div>
  );
}

function Customers() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Customers</h1>
      <div className="mt-4 bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead style={{ background: "#F8FAFC", color: "#475569" }}>
            <tr className="text-left">{["Name","Phone","Bookings","Total spent","Status","Joined"].map(h => <th key={h} className="px-4 py-3 font-semibold text-xs uppercase">{h}</th>)}</tr>
          </thead>
          <tbody>
            {[
              { n: "أحمد العلي", p: "+962 79 0000 000", b: 12, s: 580, st: "active", j: "12/03/2025" },
              { n: "سارة خالد", p: "+962 78 1234 567", b: 8, s: 320, st: "active", j: "04/04/2025" },
              { n: "محمد الزعبي", p: "+962 79 8888 999", b: 5, s: 210, st: "active", j: "20/05/2025" },
              { n: "رنا حدّاد", p: "+962 77 1111 222", b: 3, s: 105, st: "active", j: "01/01/2026" },
              { n: "يوسف العمري", p: "+962 79 5555 444", b: 1, s: 35, st: "blocked", j: "10/02/2026" },
            ].map((c, i) => (
              <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3"><div className="flex items-center gap-2"><Avatar name={c.n} size={32} /><span className="font-semibold">{c.n}</span></div></td>
                <td className="px-4 py-3 font-mono text-xs">{c.p}</td>
                <td className="px-4 py-3 font-semibold">{c.b}</td>
                <td className="px-4 py-3 font-bold">JOD {c.s}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: c.st === "active" ? "#DCFCE7" : "#FEE2E2", color: c.st === "active" ? "#15803D" : "#B91C1C" }}>{c.st}</span></td>
                <td className="px-4 py-3 text-slate-500">{c.j}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Finance() {
  const monthly = [
    { m: "Jan", rev: 18, fee: 3.6 }, { m: "Feb", rev: 22, fee: 4.4 }, { m: "Mar", rev: 25, fee: 5 },
    { m: "Apr", rev: 31, fee: 6.2 }, { m: "May", rev: 38, fee: 7.6 }, { m: "Jun", rev: 42, fee: 8.4 },
  ];
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Financial reports</h1>
        <div className="flex gap-2">
          <DateRangePicker initial={3} />
          <button onClick={() => notify("Exporting financial report as CSV…", "success")} className="px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2" style={{ background: "#1FAA59", color: "#FFF" }}><Download size={14} /> Export CSV</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-5">
        <KPI label="Total revenue (6mo)" value="JOD 176k" delta="+18%" icon={<DollarSign size={18} />} color="#1366D6" />
        <KPI label="Platform fees (20%)" value="JOD 35.2k" delta="+18%" icon={<TrendingUp size={18} />} color="#0FB5A6" />
        <KPI label="Technician payouts" value="JOD 140.8k" icon={<Users size={18} />} color="#F5A623" />
      </div>

      <div className="mt-5 bg-white rounded-2xl border border-slate-100 p-5">
        <h3 className="font-bold mb-3">Revenue vs platform fees</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthly} key="fin-bar">
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="m" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} unit="k" />
            <Tooltip cursor={false} />
            <Bar dataKey="rev" fill="#1366D6" radius={[6,6,0,0]} name="Revenue (k JOD)" isAnimationActive={false} />
            <Bar dataKey="fee" fill="#0FB5A6" radius={[6,6,0,0]} name="Fee (k JOD)" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Broadcast() {
  const [segment, setSegment] = useState(1);
  const [confirmSend, setConfirmSend] = useState(false);
  const segCounts = ["8,476 users", "4,238 customers", "4,238 technicians"];
  return (
    <div>
      <h1 className="text-2xl font-bold">Broadcast notifications</h1>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h3 className="font-bold">Compose</h3>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-500">Segment</label>
              <div className="mt-1.5 grid grid-cols-3 gap-2">
                {["All", "Customers", "Technicians"].map((s, i) => (
                  <button key={s} onClick={() => setSegment(i)} className="p-3 rounded-lg border-2 text-center text-sm font-semibold" style={{ borderColor: segment === i ? "#1366D6" : "#E2E8F0", background: segment === i ? "#E8F1FE" : "#FFF" }}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Title (Arabic)</label>
              <input className="mt-1.5 w-full h-11 rounded-lg border border-slate-200 px-3 outline-none text-sm" defaultValue="عرض خاص: خصم 20% على كل الخدمات" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Body</label>
              <textarea rows={4} className="mt-1.5 w-full rounded-lg border border-slate-200 p-3 outline-none text-sm" defaultValue="استمتع بخصم 20% على جميع خدمات Fixly اليوم فقط. استخدم الرمز SUMMER20." />
            </div>
            <button onClick={() => setConfirmSend(true)} className="w-full h-11 rounded-lg font-semibold" style={{ background: "#1366D6", color: "#FFF" }}>Send to {segCounts[segment]}</button>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h3 className="font-bold">Preview</h3>
          <div className="mt-4 mx-auto" style={{ width: 280 }}>
            <div className="rounded-2xl p-4 text-white" style={{ background: "linear-gradient(135deg,#1366D6 0%,#0E4FA8 100%)" }}>
              <div className="flex items-center gap-2 text-xs opacity-80"><div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">🔧</div> Fixly · الآن</div>
              <div className="font-bold mt-2" dir="rtl">عرض خاص: خصم 20% على كل الخدمات</div>
              <div className="text-xs mt-1 opacity-90" dir="rtl">استمتع بخصم 20% على جميع خدمات Fixly اليوم فقط. استخدم الرمز SUMMER20.</div>
            </div>
            <div className="mt-3 p-3 rounded-lg bg-slate-100 text-xs text-slate-500">
              <div className="font-semibold text-slate-700 mb-1">Estimated reach</div>
              <div>{segCounts[segment]} · ~92% delivery</div>
            </div>
          </div>
        </div>
      </div>

      {confirmSend && (
        <AdminConfirm
          title="Send broadcast?"
          body={`This will send a push notification to ${segCounts[segment]}. This action cannot be undone.`}
          confirmLabel="Send now"
          onConfirm={() => { setConfirmSend(false); notify(`Broadcast sent to ${segCounts[segment]}`, "success"); }}
          onCancel={() => setConfirmSend(false)}
        />
      )}
    </div>
  );
}
