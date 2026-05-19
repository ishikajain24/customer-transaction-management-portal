// CustomerTransactions.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Opening balances would come from your API/database
const OPENING = { goldPending: 45.5, silverPending: 120, cashAdvance: 15000, metalGold: 80, metalSilver: 200 };

const MOCK_TXS = [
  { id: 1, date: "2025-01-15", notes: "Necklace order", goldOut: 20, goldIn: 0, silverOut: 0, silverIn: 50, cashOut: 5000, cashIn: 0, mdepGold: 0, mdepSilver: 0 },
  { id: 2, date: "2025-02-03", notes: "Partial payment", goldOut: 0, goldIn: 5, silverOut: 30, silverIn: 0, cashOut: 0, cashIn: 2000, mdepGold: 10, mdepSilver: 0 },
];

const today = new Date().toISOString().split("T")[0];

const EMPTY_FORM = { date: today, notes: "", goldOut: "", goldIn: "", silverOut: "", silverIn: "", cashOut: "", cashIn: "", mdepGold: "", mdepSilver: "" };

export default function CustomerTransactions() {
  const navigate = useNavigate();
  // const { customerId } = useParams(); // use this to fetch from API
  const [transactions, setTransactions] = useState(MOCK_TXS);
  const [form, setForm] = useState(EMPTY_FORM);
  const [toast, setToast] = useState(false);

  const f = (key) => parseFloat(form[key]) || 0;

  function calcBalances() {
    let gP = OPENING.goldPending, sP = OPENING.silverPending, cA = OPENING.cashAdvance, mG = OPENING.metalGold, mS = OPENING.metalSilver;
    transactions.forEach(t => {
      gP += t.goldOut - t.goldIn;
      sP += t.silverOut - t.silverIn;
      cA += t.cashOut - t.cashIn;
      mG += t.mdepGold;
      mS += t.mdepSilver;
    });
    return { gP, sP, cA, mG, mS };
  }

  function handleSave() {
    if (!form.date) return alert("Select a date");
    const allZero = ["goldOut","goldIn","silverOut","silverIn","cashOut","cashIn","mdepGold","mdepSilver"].every(k => !parseFloat(form[k]));
    if (allZero) return alert("Enter at least one value");
    const tx = { id: Date.now(), ...form, goldOut: f("goldOut"), goldIn: f("goldIn"), silverOut: f("silverOut"), silverIn: f("silverIn"), cashOut: f("cashOut"), cashIn: f("cashIn"), mdepGold: f("mdepGold"), mdepSilver: f("mdepSilver") };
    setTransactions(prev => [...prev, tx]);
    setForm(EMPTY_FORM);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  }

  function handleDelete(id) {
    if (!window.confirm("Delete this transaction?")) return;
    setTransactions(prev => prev.filter(t => t.id !== id));
  }

  const bal = calcBalances();
  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  const Pill = ({ val, type }) => {
    if (!val) return <span className="text-gray-300">—</span>;
    const fmt = type === "cash" ? "₹" + Math.abs(val).toLocaleString("en-IN") : parseFloat(val).toFixed(2) + "g";
    const cls = type === "gold" ? "bg-amber-50 text-amber-800" : type === "silver" ? "bg-blue-50 text-blue-800" : type === "cash" ? "bg-green-50 text-green-800" : "bg-purple-50 text-purple-800";
    return <span className={`${cls} text-xs px-2 py-0.5 rounded-full font-medium`}>{fmt}</span>;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Back */}
      <button onClick={() => navigate("/customers")} className="text-sm text-gray-400 mb-4 flex items-center gap-1 hover:text-gray-700">
        ← Back to customers
      </button>

      {/* Customer header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center font-medium text-sm">RG</div>
        <div>
          <div className="font-medium text-gray-900 text-lg">Ramesh Gupta</div>
          <div className="text-sm text-gray-400">+91 9876543210</div>
        </div>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { label: "Gold pending", val: bal.gP.toFixed(2) + "g" },
          { label: "Silver pending", val: bal.sP.toFixed(2) + "g" },
          { label: "Cash advance", val: "₹" + Math.abs(bal.cA).toLocaleString("en-IN") },
          { label: "Metal dep. gold", val: bal.mG.toFixed(2) + "g" },
          { label: "Metal dep. silver", val: bal.mS.toFixed(2) + "g" },
        ].map(c => (
          <div key={c.label} className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">{c.label}</div>
            <div className="text-base font-medium text-gray-900">{c.val}</div>
          </div>
        ))}
      </div>

      {/* Entry form */}
      <div className="border border-gray-100 rounded-xl p-4 mb-6 bg-white">
        <div className="font-medium text-sm mb-3">Add transaction</div>

        {toast && <div className="bg-green-50 text-green-800 text-xs font-medium px-3 py-2 rounded-lg mb-3">Transaction saved successfully</div>}

        <div className="flex gap-3 mb-4 flex-wrap">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Date</label>
            <input type="date" value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex-1 min-w-40">
            <label className="text-xs text-gray-400 block mb-1">Notes</label>
            <input type="text" value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))} placeholder="e.g. Diwali order..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>

        {[
          { label: "Gold", color: "amber", fields: [["goldOut","Given to customer (g)"],["goldIn","Received from customer (g)"]] },
          { label: "Silver", color: "blue", fields: [["silverOut","Given to customer (g)"],["silverIn","Received from customer (g)"]] },
          { label: "Cash", color: "green", fields: [["cashOut","Advance given (₹)"],["cashIn","Advance received back (₹)"]] },
          { label: "Metal deposited", color: "purple", fields: [["mdepGold","Gold deposited (g)"],["mdepSilver","Silver deposited (g)"]] },
        ].map(group => (
          <div key={group.label} className="border border-gray-100 rounded-lg overflow-hidden mb-2">
            <div className="bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">{group.label}</div>
            <div className="grid grid-cols-2 gap-3 p-3">
              {group.fields.map(([key, label]) => (
                <div key={key}>
                  <label className="text-xs text-gray-400 block mb-1">{label}</label>
                  <input type="number" value={form[key]} onChange={e => setForm(p => ({...p, [key]: e.target.value}))}
                    placeholder="0" step="0.01" min="0" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button onClick={handleSave} className="mt-2 bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-700">
          Save transaction
        </button>
      </div>

      {/* History table */}
      <div className="font-medium text-sm mb-2">Transaction history <span className="text-gray-400 font-normal">({transactions.length} entries)</span></div>
      <div className="border border-gray-100 rounded-xl overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 text-gray-400 uppercase tracking-wide">
            <tr>
              {["Date","Notes","Gold out","Gold in","Silver out","Silver in","Cash out","Cash in",""].map(h => (
                <th key={h} className="px-3 py-2 text-left font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr><td colSpan={9} className="text-center py-6 text-gray-400">No transactions yet</td></tr>
            )}
            {sorted.map(t => (
              <tr key={t.id} className="border-t border-gray-50">
                <td className="px-3 py-2 whitespace-nowrap">{t.date}</td>
                <td className="px-3 py-2 text-gray-400">{t.notes || "—"}</td>
                <td className="px-3 py-2"><Pill val={t.goldOut} type="gold" /></td>
                <td className="px-3 py-2"><Pill val={t.goldIn} type="gold" /></td>
                <td className="px-3 py-2"><Pill val={t.silverOut} type="silver" /></td>
                <td className="px-3 py-2"><Pill val={t.silverIn} type="silver" /></td>
                <td className="px-3 py-2"><Pill val={t.cashOut} type="cash" /></td>
                <td className="px-3 py-2"><Pill val={t.cashIn} type="cash" /></td>
                <td className="px-3 py-2">
                  <button onClick={() => handleDelete(t.id)} className="text-gray-300 hover:text-red-400 text-base leading-none">×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}