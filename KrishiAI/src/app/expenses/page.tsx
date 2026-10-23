"use client";
import AppShell from "@/components/layout/AppShell";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { expenseCategories, monthlyExpenses, expenses as defaultExpenses } from "@/lib/mockData";
import { getCurrentUser } from "@/lib/userAuth";
import { formatCurrency } from "@/lib/utils";
import { Plus, Search, Download, Filter, Wallet, TrendingUp, AlertTriangle, Zap, Calendar, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getTranslation } from "@/lib/translations";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const COLORS = ["#E74C3C", "#2ECC71", "#3498DB", "#9B59B6", "#F39C12", "#1ABC9C"];
const categoryFilters = ["All", ...expenseCategories.map((c) => c.name)];

export default function ExpensesPage() {
  const { language } = useAppStore();
  const t = getTranslation(language);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const user = getCurrentUser();
  const [expensesList, setExpensesList] = useState(user?.expenses || defaultExpenses);

  // Load from Firebase on client-side mount
  useEffect(() => {
    fetch(`/api/user/expenses?uid=${user?.uid || "user-001"}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.expenses) && data.expenses.length > 0) {
          setExpensesList(data.expenses);
        }
      })
      .catch((err) => console.warn("Failed to load Firebase expenses:", err));
  }, [user?.uid]);

  // Form states
  const [newCategory, setNewCategory] = useState("Fertilizer");
  const [newAmount, setNewAmount] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [newNotes, setNewNotes] = useState("");

  const totalExpenses = expensesList.reduce((sum, e) => sum + e.amount, 0);

  // Compute category totals dynamically
  const dynamicCategories = expenseCategories.map((c) => {
    const sum = expensesList.filter((e) => e.category.toLowerCase() === c.name.toLowerCase()).reduce((s, e) => s + e.amount, 0);
    return { ...c, total: sum };
  });

  const filtered = expensesList.filter((e) => {
    const matchFilter = filter === "All" || e.category.toLowerCase() === filter.toLowerCase();
    const matchSearch = e.notes.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleSaveExpense = async () => {
    const amt = parseFloat(newAmount);
    if (!amt || amt <= 0) return;

    const newItem = {
      id: `e-${Date.now()}`,
      category: newCategory,
      amount: amt,
      date: newDate || new Date().toISOString().split("T")[0],
      notes: newNotes.trim() || `${newCategory} purchase`,
    };

    setExpensesList((prev) => [newItem, ...prev]);
    setNewAmount("");
    setNewNotes("");
    setShowAdd(false);

    try {
      const res = await fetch("/api/user/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user?.uid || "user-001",
          category: newItem.category,
          amount: newItem.amount,
          date: newItem.date,
          notes: newItem.notes,
        }),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.expense) {
          setExpensesList((prev) => [d.expense, ...prev.filter((e) => e.id !== newItem.id)]);
        }
      }
    } catch (e) {
      console.warn("Failed to persist expense to Firebase:", e);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    setExpensesList((prev) => prev.filter((e) => e.id !== id));
    try {
      await fetch(`/api/user/expenses?uid=${user?.uid || "user-001"}&id=${id}`, {
        method: "DELETE",
      });
    } catch (e) {
      console.warn("Failed to delete expense from Firebase:", e);
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Category", "Amount (INR)", "Date", "Notes"];
    const rows = expensesList.map((e) => [e.id, `"${e.category}"`, e.amount, e.date, `"${e.notes.replace(/"/g, '""')}"`]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `farm_expenses_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const topCategory = [...dynamicCategories].sort((a, b) => b.total - a.total)[0] || expenseCategories[0];

  const getCategoryName = (name: string) => {
    const map: Record<string, { hi: string; mr: string }> = {
      Fertilizer: { hi: "उर्वरक / खाद", mr: "खते" },
      Labor: { hi: "मजदूरी", mr: "मजुरी" },
      Seeds: { hi: "बीज", mr: "बियाणे" },
      Irrigation: { hi: "सिंचाई", mr: "सिंचन / पाणी" },
      Machinery: { hi: "मशीनरी / ट्रैक्टर", mr: "अवजारे / यंत्रसामग्री" },
      Pesticide: { hi: "कीटनाशक", mr: "कीटकनाशके" },
    };
    return language === "mr" ? (map[name]?.mr || name) : language === "hi" ? (map[name]?.hi || name) : name;
  };

  return (
    <AppShell>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t.expenses.title}</h1>
            <p className="text-sm text-[var(--text-secondary)]">{t.expenses.subtitle}</p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold hover:shadow-lg transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> {t.expenses.addExpense}
          </button>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="gc p-5 border-l-4 border-emerald-400">
            <p className="text-xs text-[var(--text-secondary)] font-medium uppercase">{t.expenses.totalThisSeason}</p>
            <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{formatCurrency(totalExpenses)}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Rabi 2025-26 · {expensesList.length} Entries</p>
          </div>
          <div className="gc p-5 border-l-4 border-red-400">
            <p className="text-xs text-[var(--text-secondary)] font-medium uppercase">{t.expenses.highestCategory}</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(topCategory.total)}</p>
            <p className="text-xs text-red-500 mt-1">{topCategory.icon} {getCategoryName(topCategory.name)} ({totalExpenses > 0 ? ((topCategory.total / totalExpenses) * 100).toFixed(0) : 0}%)</p>
          </div>
          <div className="gc p-5 border-l-4 border-amber-400">
            <p className="text-xs text-[var(--text-secondary)] font-medium uppercase">{t.expenses.thisMonth}</p>
            <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{formatCurrency(monthlyExpenses[monthlyExpenses.length - 1].total)}</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-red-500 font-semibold">
              <TrendingUp className="w-3 h-3" /> +39% vs last month
            </div>
          </div>
        </motion.div>

        {/* AI Insight */}
        <motion.div variants={item} className="gc p-5 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-amber-800 dark:text-amber-200">{t.expenses.aiInsightTitle}</h3>
          </div>
          <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
            {language === "mr" ? (
              <>
                ⚠️ तुमचा खत खर्च मागील हंगामापेक्षा <strong>३४% जास्त</strong> आहे — प्रामुख्याने हॉर्मुझ आखातातील संकटामुळे.
                तुमच्या {user?.acres || 12} एकरांवर ₹{(5000 * (user?.acres || 12)).toLocaleString("en-IN")} ची मदत मिळवण्यासाठी <strong>आणीबाणी खत दिलासा पॅकेज</strong> साठी अर्ज करा किंवा नॅनो युरिया वापरा.
              </>
            ) : language === "hi" ? (
              <>
                ⚠️ आपका उर्वरक खर्च पिछले सीजन से <strong>34% अधिक</strong> है — मुख्य रूप से होर्मुज संकट के कारण।
                अपनी {user?.acres || 12} एकड़ भूमि पर ₹{(5000 * (user?.acres || 12)).toLocaleString("en-IN")} की राहत के लिए <strong>इमरजेंसी फर्टिलाइजर पैकेज</strong> का लाभ लें।
              </>
            ) : (
              <>
                ⚠️ Your fertilizer spend is <strong>34% above</strong> last season — primarily due to global supply disruptions from the Strait of Hormuz crisis.
                Apply for the <strong>Emergency Fertilizer Relief Package</strong> (₹5,000/acre) to offset ₹{(5000 * (user?.acres || 12)).toLocaleString("en-IN")} across your {user?.acres || 12} acres.
              </>
            )}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Monthly Bar Chart */}
          <motion.div variants={item} className="gc p-5">
            <h3 className="font-bold text-[var(--text-primary)] mb-4">{t.expenses.monthlySpending}</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyExpenses}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e8f5e8", fontSize: "13px" }} formatter={(v) => formatCurrency(v as number)} />
                <Bar dataKey="total" fill="#2ECC71" radius={[6, 6, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Donut */}
          <motion.div variants={item} className="gc p-5">
            <h3 className="font-bold text-[var(--text-primary)] mb-4">{t.expenses.categoryBreakdown}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={dynamicCategories} dataKey="total" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {dynamicCategories.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v as number)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {dynamicCategories.map((c, i) => (
                <div key={c.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                  <span>{c.icon}</span>
                  <span className="text-[var(--text-secondary)]">{getCategoryName(c.name)}</span>
                  <span className="ml-auto font-bold text-[var(--text-primary)]">{formatCurrency(c.total)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Expense List */}
        <motion.div variants={item} className="gc p-5">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input type="text" placeholder={t.expenses.searchExpenses} value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-[var(--bg-muted)] text-[var(--text-primary)]" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categoryFilters.map((c) => (
                <button key={c} onClick={() => setFilter(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    filter === c ? "bg-emerald-500 text-white" : "bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-gray-200"
                  }`}>
                  {c === "All" ? (language === "mr" ? "सर्व" : language === "hi" ? "सभी" : "All") : getCategoryName(c)}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <p className="text-center py-8 text-sm text-[var(--text-muted)]">{t.expenses.noExpenses}</p>
            ) : (
              filtered.map((e) => {
                const cat = expenseCategories.find((c) => c.name.toLowerCase() === e.category.toLowerCase());
                return (
                  <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-muted)] transition group">
                    <span className="text-2xl">{cat?.icon || "💰"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{e.notes}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(e.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: (cat?.color || "#666") + "15", color: cat?.color }}>{getCategoryName(e.category)}</span>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">{formatCurrency(e.amount)}</p>
                    <button onClick={() => handleDeleteExpense(e.id)} title="Delete expense"
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
          <div className="flex gap-3 mt-4 pt-4 border-t border-[var(--border)]">
            <button onClick={handleExportCSV} className="flex-1 py-2 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-sm font-medium hover:bg-[var(--bg-muted)] flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> {t.expenses.exportCsv}
            </button>
            <button onClick={handleExportPDF} className="flex-1 py-2 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-sm font-medium hover:bg-[var(--bg-muted)] flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> {t.expenses.exportPdf}
            </button>
          </div>
        </motion.div>

        {/* Add Expense Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-[var(--bg-card)] rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">{t.expenses.addExpense}</h3>
                <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg hover:bg-[var(--bg-muted)]"><X className="w-5 h-5 text-[var(--text-muted)]" /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">{t.expenses.category}</label>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-[var(--bg-card)]">
                    {expenseCategories.map((c) => (<option key={c.name} value={c.name}>{c.icon} {getCategoryName(c.name)}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">{t.expenses.amount} (₹)</label>
                  <input type="number" placeholder="Enter amount (e.g. 15000)" value={newAmount} onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-[var(--bg-card)] text-[var(--text-primary)]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">{t.expenses.date}</label>
                  <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-[var(--bg-card)]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">{t.expenses.notes}</label>
                  <textarea placeholder="e.g. Fertilizer, seeds, diesel, labor..." value={newNotes} onChange={(e) => setNewNotes(e.target.value)}
                    rows={2} className="w-full p-3 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none bg-[var(--bg-card)] text-[var(--text-primary)]" />
                </div>
                <button onClick={handleSaveExpense} disabled={!newAmount || parseFloat(newAmount) <= 0}
                  className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {t.expenses.saveExpense}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </AppShell>
  );
}
