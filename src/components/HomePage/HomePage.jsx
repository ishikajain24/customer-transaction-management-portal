// pages/HomePage.jsx
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const actions = [
    { title: "Customer list", desc: "View and manage all customer ledgers", path: "/customers", color: "bg-amber-50" },
    { title: "Add transaction", desc: "Enter today's gold, silver or cash entry", path: "/customers", color: "bg-green-50" },
    { title: "Transaction history", desc: "View past entries and balances", path: "/customers", color: "bg-blue-50" },
    { title: "New customer", desc: "Register a new customer with opening balances", path: "/customers?new=true", color: "bg-purple-50" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Welcome */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium text-white-800">Welcome back, Owner</h1>
          <p className="text-sm text-white-700">Here is your business at a glance today.</p>
        </div>
        <span className="text-sm text-gray-400 border border-gray-100 rounded-lg px-3 py-1.5">{today}</span>
      </div>

      {/* Stats — fetched from API in real app */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total customers", value: "6", note: "Active ledgers" },
          { label: "Gold pending", value: "166.50g", note: "Across all customers" },
          { label: "Silver pending", value: "820g", note: "Across all customers" },
          { label: "Cash advance", value: "₹51,700", note: "Outstanding total" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">{s.label}</div>
            <div className="text-xl font-medium text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.note}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Quick actions</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {actions.map(a => (
          <div key={a.title} onClick={() => navigate(a.path)}
            className="bg-white border border-gray-100 rounded-xl p-4 cursor-pointer hover:border-gray-300 transition-colors">
            <div className={`w-8 h-8 ${a.color} rounded-lg mb-3`} />
            <div className="font-medium text-sm text-gray-900 mb-1">{a.title}</div>
            <div className="text-xs text-gray-400 leading-relaxed">{a.desc}</div>
            <div className="text-gray-300 mt-3 text-base">→</div>
          </div>
        ))}
      </div>

      {/* Recent customers — fetched from API */}
      <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Recent customers</div>
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
          <span className="text-sm font-medium text-gray-900">All customers</span>
          <span className="text-sm text-gray-400 cursor-pointer hover:text-gray-700" onClick={() => navigate("/customers")}>See all →</span>
        </div>
        {/* Map over customers from API here */}
      </div>
    </div>
  );
}