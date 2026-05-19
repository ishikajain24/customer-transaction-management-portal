import { useState } from "react";

const MOCK_CUSTOMERS = [
  { id: 1, name: "Ramesh Gupta", phone: "9876543210", goldPending: 45.5, silverPending: 120, cashAdvance: 15000, metalGold: 80, metalSilver: 200 },
  { id: 2, name: "Sunita Sharma", phone: "9812345678", goldPending: 0, silverPending: 250, cashAdvance: 0, metalGold: 0, metalSilver: 500 },
  { id: 3, name: "Vijay Agarwal", phone: "9988776655", goldPending: 12.25, silverPending: 0, cashAdvance: 8500, metalGold: 30, metalSilver: 0 },
];

export default function CustomerList() {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:"", phone:"", goldPending:0, silverPending:0, cashAdvance:0, metalGold:0, metalSilver:0 });

  const filtered = customers.filter(c => {
    const match = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    if (!match) return false;
    if (filter === "gold") return c.goldPending > 0;
    if (filter === "silver") return c.silverPending > 0;
    if (filter === "cash") return c.cashAdvance > 0;
    return true;
  });

  const handleSave = () => {
    if (!form.name || !form.phone) return alert("Name and phone required");
    setCustomers(prev => [...prev, { ...form, id: Date.now() }]);
    setShowModal(false);
    setForm({ name:"", phone:"", goldPending:0, silverPending:0, cashAdvance:0, metalGold:0, metalSilver:0 });
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium text-white">Customers</h1>
          <p className="text-sm text-gray-300">Manage ledger for all customers</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700">
          + New Customer
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { label: "Customers", value: customers.length, unit: "" },
          { label: "Gold Pending", value: customers.reduce((s,c)=>s+c.goldPending,0).toFixed(2), unit: "g" },
          { label: "Silver Pending", value: customers.reduce((s,c)=>s+c.silverPending,0).toFixed(2), unit: "g" },
          { label: "Cash Advance", value: "₹"+customers.reduce((s,c)=>s+c.cashAdvance,0).toLocaleString("en-IN"), unit: "" },
          { label: "Metal Dep. Gold", value: customers.reduce((s,c)=>s+c.metalGold,0).toFixed(2), unit: "g" },
          { label: "Metal Dep. Silver", value: customers.reduce((s,c)=>s+c.metalSilver,0).toFixed(2), unit: "g" },
        ].map(s => (
          <div key={s.label} className="bg-gray-800 rounded-lg p-3 text-white">
            <div className="text-xs text-gray-300 mb-1">{s.label}</div>
            <div className="text-lg font-medium">{s.value}<span className="text-xs text-gray-400 ml-1">{s.unit}</span></div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-600 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm placeholder-gray-400"
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border border-gray-600 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All customers</option>
          <option value="gold">Gold pending</option>
          <option value="silver">Silver pending</option>
          <option value="cash">Cash advance</option>
        </select>
      </div>

      {/* Table */}
      <div className="border border-gray-700 rounded-xl overflow-x-auto">
        <table className="w-full text-sm text-white">
          <thead className="bg-gray-800 text-xs text-gray-300 uppercase">
            <tr>
              {["Customer","Phone","Gold Pending (g)","Silver Pending (g)","Cash Advance (₹)","Metal Dep. Gold (g)","Metal Dep. Silver (g)",""].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-t border-gray-700 hover:bg-gray-700 cursor-pointer">
                <td className="px-4 py-3 font-medium text-white">{c.name}</td>
                <td className="px-4 py-3 text-gray-300">{c.phone}</td>
                <td className="px-4 py-3">{c.goldPending > 0 ? <span className="bg-amber-600 text-white px-2 py-0.5 rounded-full text-xs">{c.goldPending}g</span> : "—"}</td>
                <td className="px-4 py-3">{c.silverPending > 0 ? <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs">{c.silverPending}g</span> : "—"}</td>
                <td className="px-4 py-3">{c.cashAdvance > 0 ? <span className="bg-green-600 text-white px-2 py-0.5 rounded-full text-xs">₹{c.cashAdvance.toLocaleString("en-IN")}</span> : "—"}</td>
                <td className="px-4 py-3">{c.metalGold > 0 ? <span className="bg-amber-600 text-white px-2 py-0.5 rounded-full text-xs">{c.metalGold}g</span> : "—"}</td>
                <td className="px-4 py-3">{c.metalSilver > 0 ? <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs">{c.metalSilver}g</span> : "—"}</td>
                <td className="px-4 py-3">
                  <button className="text-xs border border-gray-500 px-3 py-1 rounded-lg text-gray-300 hover:bg-gray-600">
                    + Entry
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-center py-8 text-gray-400 text-sm">No customers found</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white rounded-xl p-6 w-96 max-w-full">
            <h2 className="text-base font-medium mb-4">New Customer</h2>

            {[["name","Full Name","text"],["phone","Phone Number","text"],["goldPending","Gold Pending (g)","number"],["silverPending","Silver Pending (g)","number"],["cashAdvance","Cash Advance (₹)","number"],["metalGold","Metal Dep. Gold (g)","number"],["metalSilver","Metal Dep. Silver (g)","number"]].map(([key,label,type]) => (
              <div key={key} className="mb-3">
                <label className="text-xs text-gray-300 mb-1 block">{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => setForm(p => ({...p, [key]: type==="number" ? parseFloat(e.target.value)||0 : e.target.value}))}
                  className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm"
                />
              </div>
            ))}

            <div className="flex gap-2 justify-end mt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-600 rounded-lg text-gray-300">
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}