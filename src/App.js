import './App.css';
import { useState } from 'react';

import { useState } from "react";

// ── INITIAL DATA ─────────────────────────────────────────────────────────────
const INITIAL_STUDENTS = [
  {
    id: 1,
    ad: "Ahmet Yılmaz",
    sinif: "5-A",
    grup: "Bireysel",
    notlar: "Dikkatli ve ciddiyetli",
    calisma: {
      ikinciKat:  { cuz: "3. Cüz", sure: "Bakara 1-50", not: "" },
      birinciKat: { cuz: "15. Cüz", sure: "İsra", not: "" },
      yariEzber:  { cuz: "20. Cüz", ayet: "1-15", not: "" },
      yuzune:     { cuz: "25. Cüz", sure: "Furkan", not: "Akıcı değil" },
    },
    takip: {
      verdigiCuz:    "3. Cüz",
      yirmiDortSaat: true,
      kirkSekizSaat: false,
      etudHazir:     false,
    },
    pismisler: {
      1: 3, 2: 3, 3: 2, 4: 2, 5: 1,
      6: 3, 7: 3, 8: 2, 9: 1, 10: 0,
      11: 3, 12: 2, 13: 1, 14: 0, 15: 3,
      16: 2, 17: 1, 18: 0, 19: 0, 20: 0,
    },
  },
  {
    id: 2,
    ad: "Fatma Demir",
    sinif: "6-B",
    grup: "Koro Grubu A",
    notlar: "Hızlı öğreniyor",
    calisma: {
      ikinciKat:  { cuz: "7. Cüz", sure: "Maide", not: "" },
      birinciKat: { cuz: "18. Cüz", sure: "Müminun", not: "Tekrar edilmeli" },
      yariEzber:  { cuz: "22. Cüz", ayet: "20-30", not: "" },
      yuzune:     { cuz: "28. Cüz", sure: "Mücadele", not: "" },
    },
    takip: {
      verdigiCuz:    "7. Cüz",
      yirmiDortSaat: true,
      kirkSekizSaat: true,
      etudHazir:     true,
    },
    pismisler: {
      1: 3, 2: 3, 3: 3, 4: 3, 5: 3,
      6: 3, 7: 2, 8: 2, 9: 1, 10: 1,
      11: 3, 12: 3, 13: 2, 14: 1, 15: 0,
      16: 0, 17: 0, 18: 0, 19: 0, 20: 0,
    },
  },
  {
    id: 3,
    ad: "Mehmet Kaya",
    sinif: "4-C",
    grup: "Bireysel",
    notlar: "Yavaş ama kararlı",
    calisma: {
      ikinciKat:  { cuz: "1. Cüz", sure: "Fatiha", not: "" },
      birinciKat: { cuz: "10. Cüz", sure: "Yunus", not: "" },
      yariEzber:  { cuz: "12. Cüz", ayet: "1-10", not: "Yavaş" },
      yuzune:     { cuz: "14. Cüz", sure: "Hicr", not: "" },
    },
    takip: {
      verdigiCuz:    "1. Cüz",
      yirmiDortSaat: false,
      kirkSekizSaat: false,
      etudHazir:     false,
    },
    pismisler: {
      1: 2, 2: 1, 3: 1, 4: 0, 5: 0,
      6: 2, 7: 1, 8: 0, 9: 0, 10: 0,
      11: 0, 12: 0, 13: 0, 14: 0, 15: 0,
      16: 0, 17: 0, 18: 0, 19: 0, 20: 0,
    },
  },
];

const PISMILIK_LABELS = ["—", "Başlangıç", "Orta", "Pişmiş"];
const PISMILIK_COLORS = [
  "bg-slate-100 text-slate-400 border-slate-200",
  "bg-amber-100 text-amber-700 border-amber-300",
  "bg-emerald-100 text-emerald-700 border-emerald-300",
  "bg-emerald-600 text-white border-emerald-700",
];

const BLANK_ODEV = {
  ikinciKat:  { cuz: "", sure: "", not: "" },
  birinciKat: { cuz: "", sure: "", not: "" },
  yariEzber:  { cuz: "", ayet: "", not: "" },
  yuzune:     { cuz: "", sure: "", not: "" },
};

// ── HELPERS ──────────────────────────────────────────────────────────────────
function calcProgress(pismisler) {
  const vals = Object.values(pismisler);
  const total = vals.length * 3;
  const current = vals.reduce((a, b) => a + b, 0);
  return Math.round((current / total) * 100);
}

function calcPismisCount(pismisler) {
  return Object.values(pismisler).filter((v) => v === 3).length;
}

// ── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function ModeTab({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
        active
          ? "bg-amber-400 text-slate-900 shadow-md scale-105"
          : "text-slate-300 hover:text-white hover:bg-slate-700"
      }`}
    >
      <span className="text-base">{icon}</span>
      {label}
    </button>
  );
}

function StatCard({ label, value, sub, color = "amber" }) {
  const colors = {
    amber: "from-amber-400 to-amber-500",
    emerald: "from-emerald-500 to-emerald-600",
    blue: "from-blue-500 to-blue-600",
    rose: "from-rose-500 to-rose-600",
  };
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</span>
      <span className={`text-3xl font-black bg-gradient-to-br ${colors[color]} bg-clip-text text-transparent`}>
        {value}
      </span>
      {sub && <span className="text-xs text-slate-500">{sub}</span>}
    </div>
  );
}

function ProgressBar({ value, color = "#D4A84B" }) {
  return (
    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
      <div
        className="h-2 rounded-full transition-all duration-500"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}

function PismisGrid({ pismisler, editable, onChange }) {
  return (
    <div className="grid grid-cols-10 gap-1">
      {Array.from({ length: 20 }, (_, i) => i + 1).map((cuz) => {
        const level = pismisler[cuz] ?? 0;
        return (
          <button
            key={cuz}
            title={`${cuz}. Cüz — ${PISMILIK_LABELS[level]}`}
            disabled={!editable}
            onClick={() => editable && onChange(cuz, (level + 1) % 4)}
            className={`relative flex flex-col items-center justify-center rounded-lg border-2 py-1.5 transition-all duration-200 ${PISMILIK_COLORS[level]} ${
              editable ? "cursor-pointer hover:scale-110" : "cursor-default"
            }`}
            style={{ minWidth: 0 }}
          >
            <span className="text-[10px] font-bold leading-none">{cuz}</span>
            <span className="text-[7px] leading-none mt-0.5 opacity-70">
              {["—", "B", "O", "P"][level]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function StudentCard({ student, onSelect, selected }) {
  const progress = calcProgress(student.pismisler);
  const pismis = calcPismisCount(student.pismisler);
  return (
    <div
      onClick={() => onSelect(student.id)}
      className={`cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
        selected ? "border-amber-400 shadow-amber-100" : "border-slate-100 hover:border-amber-200"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-bold text-slate-800 text-sm">{student.ad}</div>
          <div className="text-xs text-slate-500 mt-0.5">
            {student.sinif} · {student.grup}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
              student.takip.yirmiDortSaat
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-600"
            }`}
          >
            24s {student.takip.yirmiDortSaat ? "✓" : "✗"}
          </span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
              student.takip.kirkSekizSaat
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-600"
            }`}
          >
            48s {student.takip.kirkSekizSaat ? "✓" : "✗"}
          </span>
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-slate-500">İlerleme</span>
        <span className="font-bold text-slate-700">{pismis}/20 pişmiş</span>
      </div>
      <ProgressBar value={progress} />

      <div className="mt-3">
        <PismisGrid pismisler={student.pismisler} editable={false} onChange={() => {}} />
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
        <div>
          <span className="text-slate-400 block">Verdiği Cüz</span>
          <span className="font-semibold text-slate-700">{student.takip.verdigiCuz}</span>
        </div>
        <div>
          <span className="text-slate-400 block">Yüzüne</span>
          <span className="font-semibold text-slate-700">{student.calisma.yuzune.cuz}</span>
        </div>
        <div>
          <span className="text-slate-400 block">2. Kat</span>
          <span className="font-semibold text-slate-700">{student.calisma.ikinciKat.cuz}</span>
        </div>
        <div>
          <span className="text-slate-400 block">1. Kat</span>
          <span className="font-semibold text-slate-700">{student.calisma.birinciKat.cuz}</span>
        </div>
      </div>
    </div>
  );
}

// ── DETAIL PANEL ─────────────────────────────────────────────────────────────
function DetailPanel({ student, onUpdate, onClose, viewMode }) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(JSON.parse(JSON.stringify(student)));

  const canEdit = viewMode === "ogretmen";

  function handlePismisChange(cuz, level) {
    setLocal((s) => ({ ...s, pismisler: { ...s.pismisler, [cuz]: level } }));
  }

  function handleSave() {
    onUpdate(local);
    setEditing(false);
  }

  const progress = calcProgress(local.pismisler);
  const pismis = calcPismisCount(local.pismisler);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-900 text-white rounded-t-3xl p-5 flex items-start justify-between z-10">
          <div>
            <h2 className="text-xl font-black">{local.ad}</h2>
            <p className="text-slate-400 text-sm mt-0.5">
              {local.sinif} · {local.grup}
            </p>
          </div>
          <div className="flex gap-2">
            {canEdit && !editing && (
              <button
                onClick={() => setEditing(true)}
                className="bg-amber-400 text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-300 transition"
              >
                ✏️ Düzenle
              </button>
            )}
            {editing && (
              <button
                onClick={handleSave}
                className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-400 transition"
              >
                💾 Kaydet
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-600 transition"
            >
              ✕ Kapat
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-4 text-white">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-slate-300">Genel İlerleme</span>
              <span className="text-amber-400 font-black text-lg">{pismis}/20</span>
            </div>
            <ProgressBar value={progress} color="#D4A84B" />
            <div className="text-xs text-slate-500 mt-1">{progress}% tamamlandı</div>
          </div>

          <section>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
              📅 Günlük Takip
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-xs text-slate-400 mb-1">Verdiği Cüz</div>
                {editing ? (
                  <input
                    className="w-full text-sm font-bold border-b border-amber-400 bg-transparent outline-none"
                    value={local.takip.verdigiCuz}
                    onChange={(e) =>
                      setLocal((s) => ({
                        ...s,
                        takip: { ...s.takip, verdigiCuz: e.target.value },
                      }))
                    }
                  />
                ) : (
                  <div className="font-bold text-slate-800 text-sm">{local.takip.verdigiCuz}</div>
                )}
              </div>

              {[
                { key: "yirmiDortSaat", label: "24 Saat Tekrarı" },
                { key: "kirkSekizSaat", label: "48 Saat Tekrarı" },
              ].map(({ key, label }) => (
                <div
                  key={key}
                  className={`rounded-xl p-3 border-2 flex flex-col gap-1 ${
                    local.takip[key]
                      ? "bg-emerald-50 border-emerald-300"
                      : "bg-rose-50 border-rose-200"
                  }`}
                >
                  <div className="text-xs text-slate-400">{label}</div>
                  {editing ? (
                    <button
                      onClick={() =>
                        setLocal((s) => ({
                          ...s,
                          takip: { ...s.takip, [key]: !s.takip[key] },
                        }))
                      }
                      className={`text-xs font-bold px-2 py-1 rounded-lg transition ${
                        local.takip[key]
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {local.takip[key] ? "✓ Yapıldı" : "✗ Yapılmadı"}
                    </button>
                  ) : (
                    <span
                      className={`text-sm font-black ${
                        local.takip[key] ? "text-emerald-600" : "text-rose-500"
                      }`}
                    >
                      {local.takip[key] ? "✓ Yapıldı" : "✗ Yapılmadı"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
              📚 Günlük Çalışma Planı
            </h3>
            <div className="space-y-2">
              {[
                { key: "ikinciKat", label: "2. Kat (Tümden Katı)", icon: "🟣", fields: ["cuz", "sure", "not"] },
                { key: "birinciKat", label: "1. Kat (Yarım-Yarım)", icon: "🔵", fields: ["cuz", "sure", "not"] },
                { key: "yariEzber", label: "Yarı Ezber (Ayet-Ayet)", icon: "🟡", fields: ["cuz", "ayet", "not"] },
                { key: "yuzune", label: "Yüzüne", icon: "🟢", fields: ["cuz", "sure", "not"] },
              ].map(({ key, label, icon, fields }) => (
                <div key={key} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="text-xs font-bold text-slate-600 mb-2">
                    {icon} {label}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {fields.map((field) => (
                      <div key={field}>
                        <div className="text-[10px] text-slate-400 capitalize mb-0.5">
                          {field === "cuz" ? "Cüz" : field === "sure" ? "Süre" : field === "ayet" ? "Ayet" : "Not"}
                        </div>
                        {editing ? (
                          <input
                            className="w-full text-xs font-semibold border-b border-amber-300 bg-transparent outline-none text-slate-700"
                            value={local.calisma[key][field]}
                            onChange={(e) =>
                              setLocal((s) => ({
                                ...s,
                                calisma: {
                                  ...s.calisma,
                                  [key]: { ...s.calisma[key], [field]: e.target.value },
                                },
                              }))
                            }
                          />
                        ) : (
                          <div className="text-xs font-semibold text-slate-700">
                            {local.calisma[key][field] || <span className="text-slate-300 italic">—</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
              🔥 Pişmişler Takibi (1–20. Cüzler)
            </h3>
            {editing && (
              <p className="text-[10px] text-amber-600 mb-2">
                Tıklayarak aşama değiştir: — → Başlangıç → Orta → Pişmiş
              </p>
            )}
            <PismisGrid
              pismisler={local.pismisler}
              editable={editing}
              onChange={handlePismisChange}
            />
            <div className="flex gap-3 mt-2">
              {PISMILIK_LABELS.map((lbl, i) => (
                <div key={i} className="flex items-center gap-1 text-[10px] text-slate-500">
                  <span
                    className={`w-3 h-3 rounded border inline-block ${PISMILIK_COLORS[i]}`}
                  />
                  {lbl}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// ── ÖDEV PANELİ ──────────────────────────────────────────────────────────────
function OdevPaneli({ students, onBulkUpdate }) {
  const gruplar = ["Tümü", ...new Set(students.map((s) => s.grup))];
  const [hedefGrup, setHedefGrup] = useState("Tümü");
  const [hedefOgrenci, setHedefOgrenci] = useState("");
  const [odev, setOdev] = useState(JSON.parse(JSON.stringify(BLANK_ODEV)));
  const [sent, setSent] = useState(false);

  const filteredStudents = hedefGrup === "Tümü" ? students : students.filter((s) => s.grup === hedefGrup);

  function setField(bolum, field, val) {
    setOdev((prev) => ({
      ...prev,
      [bolum]: { ...prev[bolum], [field]: val },
    }));
  }

  function handleGonder() {
    const hedefler = hedefOgrenci
      ? students.filter((s) => String(s.id) === hedefOgrenci)
      : filteredStudents;

    hedefler.forEach((s) => {
      const updated = { ...s, calisma: JSON.parse(JSON.stringify(odev)) };
      onBulkUpdate(updated);
    });
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  const BOLUMLER = [
    { key: "ikinciKat",  label: "2. Kat (Tümden Katı)",   icon: "🟣", fields: ["cuz","sure","not"] },
    { key: "birinciKat", label: "1. Kat (Yarım-Yarım)",    icon: "🔵", fields: ["cuz","sure","not"] },
    { key: "yariEzber",  label: "Yarı Ezber (Ayet-Ayet)",  icon: "🟡", fields: ["cuz","ayet","not"] },
    { key: "yuzune",     label: "Yüzüne",                  icon: "🟢", fields: ["cuz","sure","not"] },
  ];

  const FIELD_LABELS = { cuz: "Cüz No", sure: "Hedef Süre / Sure", ayet: "Ayet Aralığı", not: "Öğretmen Notu" };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
          🎯 Ödev Hedefi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Koro Grubu / Sınıf</label>
            <select
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:border-amber-400"
              value={hedefGrup}
              onChange={(e) => { setHedefGrup(e.target.value); setHedefOgrenci(""); }}
            >
              {gruplar.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Belirli Öğrenci (opsiyonel)</label>
            <select
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:border-amber-400"
              value={hedefOgrenci}
              onChange={(e) => setHedefOgrenci(e.target.value)}
            >
              <option value="">— Grubun Tamamı —</option>
              {filteredStudents.map((s) => (
                <option key={s.id} value={s.id}>{s.ad} ({s.sinif})</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {(hedefOgrenci
            ? students.filter((s) => String(s.id) === hedefOgrenci)
            : filteredStudents
          ).map((s) => (
            <span key={s.id} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-semibold">
              {s.ad}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
          📚 Günlük Çalışma Planı Ödevi
        </h3>
        <div className="space-y-3">
          {BOLUMLER.map(({ key, label, icon, fields }) => (
            <div key={key} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="text-sm font-bold text-slate-700 mb-3">{icon} {label}</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {fields.map((f) => (
                  <div key={f}>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-1 uppercase tracking-wide">
                      {FIELD_LABELS[f]}
                    </label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-amber-400 bg-white"
                      value={odev[key][f]}
                      onChange={(e) => setField(key, f, e.target.value)}
                      placeholder={f === "not" ? "Not ekle…" : f === "cuz" ? "Örn: 5. Cüz" : "…"}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex gap-3 items-center">
          <button
            onClick={handleGonder}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition shadow-md flex items-center gap-2"
          >
            📤 Ödevi Gönder
          </button>
          <button
            onClick={() => setOdev(JSON.parse(JSON.stringify(BLANK_ODEV)))}
            className="bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-200 transition"
          >
            Temizle
          </button>
          {sent && (
            <span className="text-emerald-600 text-sm font-bold flex items-center gap-1 animate-pulse">
              ✅ Ödev gönderildi!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── SABAH ETÜDÜ TAKİP ────────────────────────────────────────────────────────
function SabahEtudu({ students }) {
  const gruplar = ["Tümü", ...new Set(students.map((s) => s.grup))];
  const [filterGrup, setFilterGrup] = useState("Tümü");
  const [etudTarih] = useState(new Date().toLocaleDateString("tr-TR", { day:"2-digit", month:"long", year:"numeric" }));
  const [katilim, setKatilim] = useState(() =>
    Object.fromEntries(students.map((s) => [s.id, null]))
  );

  const filtered = filterGrup === "Tümü" ? students : students.filter((s) => s.grup === filterGrup);

  function toggle(id, durum) {
    setKatilim((prev) => ({ ...prev, [id]: prev[id] === durum ? null : durum }));
  }

  const gelenCount  = Object.values(katilim).filter((v) => v === "geldi").length;
  const gelmeCount  = Object.values(katilim).filter((v) => v === "gelmedi").length;
  const bekleyenCount = students.length - gelenCount - gelmeCount;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-emerald-600">{gelenCount}</div>
          <div className="text-xs text-emerald-700 font-semibold mt-0.5">Geldi</div>
        </div>
        <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-rose-500">{gelmeCount}</div>
          <div className="text-xs text-rose-600 font-semibold mt-0.5">Gelmedi</div>
        </div>
        <div className="bg-slate-100 border-2 border-slate-200 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-slate-400">{bekleyenCount}</div>
          <div className="text-xs text-slate-500 font-semibold mt-0.5">Bekliyor</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="text-sm font-semibold text-slate-500">📅 {etudTarih} — Sabah Etüdü</div>
        <div className="flex gap-2 flex-wrap">
          {gruplar.map((g) => (
            <button
              key={g}
              onClick={() => setFilterGrup(g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterGrup === g ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_auto] text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 py-2 border-b border-slate-100 bg-slate-50">
          <span>Öğrenci</span>
          <span className="pr-2">Katılım</span>
        </div>
        {filtered.map((s) => {
          const k = katilim[s.id];
          return (
            <div
              key={s.id}
              className={`grid grid-cols-[1fr_auto] items-center px-4 py-3 gap-3 border-b border-slate-50 last:border-0 transition ${
                k === "geldi" ? "bg-emerald-50/50" : k === "gelmedi" ? "bg-rose-50/50" : ""
              }`}
            >
              <div>
                <div className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                  {s.ad}
                  {s.takip.etudHazir && (
                    <span title="Veli: Etüde hazır bildirimi gönderildi" className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold border border-blue-200">
                      📨 Veli onayı
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400">{s.sinif} · {s.grup}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggle(s.id, "geldi")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    k === "geldi"
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "bg-slate-100 text-slate-500 hover:bg-emerald-100 hover:text-emerald-700"
                  }`}
                >
                  ✓ Geldi
                </button>
                <button
                  onClick={() => toggle(s.id, "gelmedi")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    k === "gelmedi"
                      ? "bg-rose-500 text-white shadow-sm"
                      : "bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-600"
                  }`}
                >
                  ✗ Gelmedi
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm">Bu grupta öğrenci yok.</div>
        )}
      </div>

      {(gelenCount + gelmeCount) > 0 && (
        <div className="bg-slate-900 text-slate-300 rounded-2xl p-4 text-xs">
          <span className="font-bold text-white">Etüd Özeti:</span>{" "}
          {students.length} öğrenciden {gelenCount} katıldı, {gelmeCount} gelmedi
          {bekleyenCount > 0 && `, ${bekleyenCount} henüz işaretlenmedi`}.
        </div>
      )}
    </div>
  );
}

// ── HAFIZLIK ÇİZELGESİ ───────────────────────────────────────────────────────
function HafizlikCizelgesi({ students, onUpdate }) {
  const [tarih, setTarih] = useState(new Date().toISOString().split('T')[0]);
  const [editablePismis, setEditablePismis] = useState(() =>
    Object.fromEntries(students.map((s) => [s.id, JSON.parse(JSON.stringify(s.pismisler))]))
  );

  function handlePismisChange(studentId, cuz, level) {
    setEditablePismis((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [cuz]: level },
    }));
  }

  function handleSaveAll() {
    students.forEach((s) => {
      onUpdate({ ...s, pismisler: editablePismis[s.id] });
    });
  }

  function exportJSON() {
    const data = {
      tarih,
      ogrenciler: students.map((s) => ({
        ad: s.ad,
        sinif: s.sinif,
        grup: s.grup,
        verdigiCuz: s.takip.verdigiCuz,
        yirmiDortSaat: s.takip.yirmiDortSaat ? "✓" : "✗",
        kirkSekizSaat: s.takip.kirkSekizSaat ? "✓" : "✗",
        notlar: s.notlar,
        pismisler: editablePismis[s.id],
      })),
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hafizlik-cizelge-${tarih}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handlePrint() {
    const printContent = document.getElementById("cizelge-container");
    const printWindow = window.open("", "", "height=800,width=1400");
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.close();
    printWindow.print();
  }

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-emerald-50 to-white rounded-2xl border-2 border-emerald-200 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-emerald-900">📋 Hafızlık Takip Çizelgesi</h2>
            <p className="text-sm text-emerald-700 mt-0.5">Tüm öğrencilerin günlük ilerleme ve pişmişlik durumu</p>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Tarih</label>
            <input
              type="date"
              value={tarih}
              onChange={(e) => setTarih(e.target.value)}
              className="border-2 border-emerald-300 rounded-lg px-3 py-1.5 text-sm font-semibold bg-white outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleSaveAll}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition shadow-md flex items-center gap-2"
        >
          💾 Tüm Değişiklikleri Kaydet
        </button>
        <button
          onClick={exportJSON}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-md flex items-center gap-2"
        >
          📥 JSON Dışarı Aktar
        </button>
        <button
          onClick={handlePrint}
          className="bg-slate-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-700 transition shadow-md flex items-center gap-2"
        >
          🖨️ Yazdır
        </button>
      </div>

      <div id="cizelge-container" className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-b-2 border-emerald-800">
              <th className="px-4 py-3 text-left font-black text-xs uppercase tracking-wide">Sıra</th>
              <th className="px-4 py-3 text-left font-black text-xs uppercase tracking-wide">Adı Soyadı</th>
              <th className="px-4 py-3 text-left font-black text-xs uppercase tracking-wide">Sınıf</th>
              <th className="px-4 py-3 text-left font-black text-xs uppercase tracking-wide">Verdiği Cüz</th>
              <th className="px-4 py-3 text-center font-black text-xs uppercase tracking-wide">24s</th>
              <th className="px-4 py-3 text-center font-black text-xs uppercase tracking-wide">48s</th>
              <th className="px-4 py-3 text-left font-black text-xs uppercase tracking-wide">Notlar</th>
              <th className="px-4 py-3 text-left font-black text-xs uppercase tracking-wide">Pişmişler (1–20)</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, idx) => {
              const pismis = calcPismisCount(editablePismis[s.id]);
              return (
                <tr key={s.id} className={`border-b border-slate-100 hover:bg-emerald-50 transition ${idx % 2 === 0 ? "bg-slate-50" : "bg-white"}`}>
                  <td className="px-4 py-3 font-bold text-slate-700">{idx + 1}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">{s.ad}</td>
                  <td className="px-4 py-3 text-slate-700">{s.sinif}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-700">{s.takip.verdigiCuz}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      s.takip.yirmiDortSaat
                        ? "bg-emerald-200 text-emerald-800"
                        : "bg-rose-100 text-rose-700"
                    }`}>
                      {s.takip.yirmiDortSaat ? "✓" : "✗"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      s.takip.kirkSekizSaat
                        ? "bg-emerald-200 text-emerald-800"
                        : "bg-rose-100 text-rose-700"
                    }`}>
                      {s.takip.kirkSekizSaat ? "✓" : "✗"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs max-w-xs">{s.notlar}</td>
                  <td className="px-4 py-3">
                    <div className="grid grid-cols-10 gap-0.5">
                      {Array.from({ length: 20 }, (_, i) => i + 1).map((cuz) => {
                        const level = editablePismis[s.id][cuz] ?? 0;
                        return (
                          <button
                            key={cuz}
                            onClick={() => handlePismisChange(s.id, cuz, (level + 1) % 4)}
                            title={`${cuz}. Cüz — ${PISMILIK_LABELS[level]}`}
                            className={`w-6 h-6 rounded text-[9px] font-bold border transition-all hover:scale-110 cursor-pointer ${PISMILIK_COLORS[level]}`}
                          >
                            {cuz}
                          </button>
                        );
                      })}
                    </div>
                    <div className="text-[9px] text-slate-500 mt-1">{pismis}/20 pişmiş</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
        <div className="text-xs font-bold text-emerald-900 mb-2">📌 Pişmişlik Seviyeleri:</div>
        <div className="flex flex-wrap gap-3">
          {PISMILIK_LABELS.map((lbl, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded border text-[8px] font-bold flex items-center justify-center ${PISMILIK_COLORS[i]}`}>
                {["—", "B", "O", "P"][i]}
              </span>
              <span className="text-xs text-emerald-700">{lbl}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TEACHER VIEW ─────────────────────────────────────────────────────────────
function OgretmenView({ students, onUpdate }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterGrup, setFilterGrup] = useState("Tümü");

  const gruplar = ["Tümü", "Bireysel", ...new Set(students.map((s) => s.grup).filter((g) => g !== "Bireysel"))];

  const filtered = students.filter(
    (s) =>
      (filterGrup === "Tümü" || s.grup === filterGrup) &&
      s.ad.toLowerCase().includes(search.toLowerCase())
  );

  const totalPismis = students.reduce((sum, s) => sum + calcPismisCount(s.pismisler), 0);
  const avgProgress = Math.round(students.reduce((sum, s) => sum + calcProgress(s.pismisler), 0) / students.length);
  const tekrarYapan = students.filter((s) => s.takip.yirmiDortSaat).length;

  const selectedStudent = students.find((s) => s.id === selected);

  const TABS = [
    { id: "dashboard", label: "📊 Genel Takip" },
    { id: "odev",      label: "📤 Ödev Paneli" },
    { id: "etud",      label: "🌅 Sabah Etüdü" },
    { id: "cizelge",   label: "📋 Çizelge" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex gap-2 border-b border-slate-200 pb-0">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-sm font-bold rounded-t-xl transition border-b-2 -mb-px ${
              activeTab === t.id
                ? "border-amber-400 text-slate-900 bg-white"
                : "border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Toplam Öğrenci" value={students.length} sub="aktif" color="blue" />
            <StatCard label="Ort. İlerleme" value={`${avgProgress}%`} sub="genel ortalama" color="amber" />
            <StatCard label="Toplam Pişmiş Cüz" value={totalPismis} sub="tüm öğrenciler" color="emerald" />
            <StatCard label="24s Tekrar Yapan" value={tekrarYapan} sub={`${students.length} öğrenciden`} color="rose" />
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Öğrenci ara…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-amber-400 bg-white shadow-sm flex-1 min-w-[160px]"
            />
            <div className="flex gap-2 flex-wrap">
              {gruplar.map((g) => (
                <button
                  key={g}
                  onClick={() => setFilterGrup(g)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    filterGrup === g
                      ? "bg-slate-900 text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((s) => (
              <StudentCard
                key={s.id}
                student={s}
                onSelect={setSelected}
                selected={selected === s.id}
              />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-3 text-center py-16 text-slate-400">
                Arama kriterlerine uyan öğrenci bulunamadı.
              </div>
            )}
          </div>

          {selectedStudent && (
            <DetailPanel
              student={selectedStudent}
              onUpdate={(updated) => { onUpdate(updated); setSelected(null); }}
              onClose={() => setSelected(null)}
              viewMode="ogretmen"
            />
          )}
        </div>
      )}

      {activeTab === "odev" && (
        <OdevPaneli students={students} onBulkUpdate={onUpdate} />
      )}

      {activeTab === "etud" && (
        <SabahEtudu students={students} />
      )}

      {activeTab === "cizelge" && (
        <HafizlikCizelgesi students={students} onUpdate={onUpdate} />
      )}
    </div>
  );
}

// ── PARENT VIEW ──────────────────────────────────────────────────────────────
function VeliView({ students, onUpdate }) {
  const s = students[0];
  const progress = calcProgress(s.pismisler);
  const pismis   = calcPismisCount(s.pismisler);

  const [form, setForm] = useState({
    verdigiCuz:      s.takip.verdigiCuz,
    yirmiDortSaat:   s.takip.yirmiDortSaat,
    kirkSekizSaat:   s.takip.kirkSekizSaat,
    etudHazir:       false,
  });
  const [gonderildi, setGonderildi] = useState(false);
  const [activeTab, setActiveTab] = useState("odev");

  const GOREVLER = [
    { key: "ikinciKat",  emoji: "🟣", label: "2. Kat (Tümden Katı)",  cuz: s.calisma.ikinciKat.cuz,  detay: s.calisma.ikinciKat.sure,  not: s.calisma.ikinciKat.not },
    { key: "birinciKat", emoji: "🔵", label: "1. Kat (Yarım-Yarım)",   cuz: s.calisma.birinciKat.cuz, detay: s.calisma.birinciKat.sure, not: s.calisma.birinciKat.not },
    { key: "yariEzber",  emoji: "🟡", label: "Yarı Ezber (Ayet-Ayet)", cuz: s.calisma.yariEzber.cuz,  detay: s.calisma.yariEzber.ayet,  not: s.calisma.yariEzber.not },
    { key: "yuzune",     emoji: "🟢", label: "Yüzüne",                 cuz: s.calisma.yuzune.cuz,     detay: s.calisma.yuzune.sure,     not: s.calisma.yuzune.not },
  ];
  const [tamamlanan, setTamamlanan] = useState({});

  function toggleGorev(key) {
    setTamamlanan((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleGonder() {
    const updated = {
      ...s,
      takip: {
        ...s.takip,
        verdigiCuz:    form.verdigiCuz,
        yirmiDortSaat: form.yirmiDortSaat,
        kirkSekizSaat: form.kirkSekizSaat,
        etudHazir:     form.etudHazir,
      },
    };
    onUpdate(updated);
    setGonderildi(true);
    setTimeout(() => setGonderildi(false), 3500);
  }

  const TABS = [
    { id: "odev",     label: "📋 Günün Ödevi" },
    { id: "giris",    label: "✏️ Veri Girişi" },
    { id: "ilerleme", label: "📊 İlerleme" },
    { id: "cizelge",  label: "📈 Çizelge" },
  ];

  return (
    <div className="max-w-lg mx-auto space-y-4">

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-5 text-white flex items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-widest mb-0.5">Çocuğunuz</div>
          <div className="text-xl font-black">{s.ad}</div>
          <div className="text-slate-400 text-sm">{s.sinif} · {s.grup}</div>
        </div>
        <div className="text-right">
          <div className="text-amber-400 font-black text-2xl">{pismis}/20</div>
          <div className="text-slate-400 text-xs">cüz pişmiş</div>
          <div className="mt-2 w-28">
            <ProgressBar value={progress} color="#D4A84B" />
          </div>
        </div>
      </div>

      <div className="flex gap-1 bg-slate-100 rounded-2xl p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition ${
              activeTab === t.id
                ? "bg-white shadow text-slate-900"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "odev" && (
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">📣</span>
              <span className="text-sm font-black text-amber-800">Öğretmenin Bugünkü Planı</span>
            </div>
            <p className="text-xs text-amber-700">
              Aşağıdaki görevler öğretmen tarafından belirlenmiştir. Tamamladığınızda kutucuğu işaretleyin.
            </p>
          </div>

          {GOREVLER.map(({ key, emoji, label, cuz, detay, not }) => {
            const done = !!tamamlanan[key];
            const hasContent = cuz || detay;
            return (
              <div
                key={key}
                onClick={() => hasContent && toggleGorev(key)}
                className={`rounded-2xl border-2 p-4 transition-all duration-200 ${
                  hasContent ? "cursor-pointer" : "opacity-40 cursor-default"
                } ${
                  done
                    ? "bg-emerald-50 border-emerald-300"
                    : "bg-white border-slate-100 hover:border-amber-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                    done ? "bg-emerald-500 border-emerald-500" : "border-slate-300"
                  }`}>
                    {done && <span className="text-white text-[10px] font-black">✓</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span>{emoji}</span>
                      <span className={`text-sm font-bold ${done ? "text-emerald-700 line-through" : "text-slate-800"}`}>
                        {label}
                      </span>
                    </div>
                    {hasContent ? (
                      <div className="flex flex-wrap gap-2">
                        {cuz && (
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                            {cuz}
                          </span>
                        )}
                        {detay && (
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                            {detay}
                          </span>
                        )}
                        {not && (
                          <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-semibold border border-amber-200">
                            💬 {not}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Öğretmen tarafından henüz eklenmedi</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {Object.values(tamamlanan).some(Boolean) && (
            <div className="text-center text-xs text-emerald-600 font-semibold py-1">
              {Object.values(tamamlanan).filter(Boolean).length} / {GOREVLER.length} görev tamamlandı
            </div>
          )}
        </div>
      )}

      {activeTab === "giris" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
              📖 Bugün Verilen / Ezberlenen
            </h3>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Son Cüz Numarası</label>
            <input
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-amber-400 transition"
              placeholder="Örn: 5. Cüz veya Bakara 50-100"
              value={form.verdigiCuz}
              onChange={(e) => setForm((f) => ({ ...f, verdigiCuz: e.target.value }))}
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
              🔁 Evde Yapılan Tekrarlar
            </h3>
            <div className="space-y-3">
              {[
                { key: "yirmiDortSaat", label: "24 Saat Tekrarı Tamamlandı", desc: "Dün verilen cüz bugün tekrar edildi" },
                { key: "kirkSekizSaat", label: "48 Saat Tekrarı Tamamlandı", desc: "Önceki cüz yeniden gözden geçirildi" },
              ].map(({ key, label, desc }) => (
                <div
                  key={key}
                  onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    form[key]
                      ? "bg-emerald-50 border-emerald-300"
                      : "bg-slate-50 border-slate-200 hover:border-amber-300"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition ${
                    form[key] ? "bg-emerald-500 border-emerald-500" : "border-slate-300 bg-white"
                  }`}>
                    {form[key] && <span className="text-white text-xs font-black">✓</span>}
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${form[key] ? "text-emerald-700" : "text-slate-700"}`}>
                      {label}
                    </div>
                    <div className="text-xs text-slate-400">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-2xl border-2 p-5 transition-all ${
            form.etudHazir
              ? "bg-blue-50 border-blue-300"
              : "bg-white border-slate-100 shadow-sm"
          }`}>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
              🌅 Sabah Etüdü Bildirimi
            </h3>
            <div
              onClick={() => setForm((f) => ({ ...f, etudHazir: !f.etudHazir }))}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                form.etudHazir
                  ? "bg-blue-100 border-blue-400"
                  : "bg-slate-50 border-slate-200 hover:border-blue-300"
              }`}
            >
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition ${
                form.etudHazir ? "bg-blue-500 border-blue-500" : "border-slate-300 bg-white"
              }`}>
                {form.etudHazir && <span className="text-white text-xs font-black">✓</span>}
              </div>
              <div>
                <div className={`text-sm font-bold leading-snug ${form.etudHazir ? "text-blue-800" : "text-slate-700"}`}>
                  Çocuğum yarın sabah etüdüne hazırdır
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Ezberi tamamlandı, sabah etüdüne katılacaktır
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleGonder}
            className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-black text-sm hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2"
          >
            📨 Hocaya Gönder
          </button>

          {gonderildi && (
            <div className="bg-emerald-500 text-white rounded-2xl p-4 text-center font-bold text-sm animate-pulse">
              ✅ Bilgiler öğretmene başarıyla iletildi!
            </div>
          )}
        </div>
      )}

      {activeTab === "ilerleme" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className={`rounded-2xl p-4 border-2 text-center ${s.takip.yirmiDortSaat ? "bg-emerald-50 border-emerald-300" : "bg-rose-50 border-rose-200"}`}>
              <div className="text-2xl">{s.takip.yirmiDortSaat ? "✅" : "❌"}</div>
              <div className="text-xs text-slate-500 mt-1">24s Tekrar</div>
            </div>
            <div className={`rounded-2xl p-4 border-2 text-center ${s.takip.kirkSekizSaat ? "bg-emerald-50 border-emerald-300" : "bg-rose-50 border-rose-200"}`}>
              <div className="text-2xl">{s.takip.kirkSekizSaat ? "✅" : "❌"}</div>
              <div className="text-xs text-slate-500 mt-1">48s Tekrar</div>
            </div>
            <div className="rounded-2xl p-4 border-2 border-slate-100 bg-slate-50 text-center">
              <div className="text-base font-black text-amber-500">{s.takip.verdigiCuz || "—"}</div>
              <div className="text-xs text-slate-500 mt-1">Son Verdi</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
              🔥 Pişmişler ({pismis}/20)
            </div>
            <ProgressBar value={progress} color="#D4A84B" />
            <div className="mt-3">
              <PismisGrid pismisler={s.pismisler} editable={false} onChange={() => {}} />
            </div>
            <div className="flex gap-3 mt-3 flex-wrap">
              {PISMILIK_LABELS.map((lbl, i) => (
                <div key={i} className="flex items-center gap-1 text-[10px] text-slate-500">
                  <span className={`w-3 h-3 rounded border inline-block ${PISMILIK_COLORS[i]}`} />
                  {lbl}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "cizelge" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 overflow-x-auto">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">📈 Hafızlık Özeti</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-emerald-50 border-b border-emerald-200">
                <th className="px-2 py-2 text-left font-bold">Cüz</th>
                <th className="px-2 py-2 text-center font-bold">Durum</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 20 }, (_, i) => i + 1).map((cuz) => {
                const level = s.pismisler[cuz] ?? 0;
                return (
                  <tr key={cuz} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-2 py-1.5 font-semibold text-slate-700">{cuz}. Cüz</td>
                    <td className="px-2 py-1.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${PISMILIK_COLORS[level]}`}>
                        {PISMILIK_LABELS[level]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── STUDENT VIEW ─────────────────────────────────────────────────────────────
function OgrenciView({ students }) {
  const s = students[0];
  const progress = calcProgress(s.pismisler);
  const pismis = calcPismisCount(s.pismisler);

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <div className="text-center py-4">
        <div className="text-4xl mb-2">📖</div>
        <div className="text-2xl font-black text-slate-800">Merhaba, {s.ad.split(" ")[0]}!</div>
        <div className="text-slate-400 text-sm">{s.sinif} · {s.grup}</div>
      </div>

      <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-3xl p-5 text-slate-900">
        <div className="text-sm font-bold mb-1">Bugün Verdiklerin</div>
        <div className="text-3xl font-black">{s.takip.verdigiCuz}</div>
        <div className="mt-3 flex gap-3">
          <div className={`flex-1 rounded-xl p-2 text-center text-xs font-bold ${s.takip.yirmiDortSaat ? "bg-white/40" : "bg-black/10 opacity-60"}`}>
            {s.takip.yirmiDortSaat ? "✓" : "✗"} 24s Tekrar
          </div>
          <div className={`flex-1 rounded-xl p-2 text-center text-xs font-bold ${s.takip.kirkSekizSaat ? "bg-white/40" : "bg-black/10 opacity-60"}`}>
            {s.takip.kirkSekizSaat ? "✓" : "✗"} 48s Tekrar
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Bugün Çalışacakların</div>
        <div className="space-y-3">
          {[
            { emoji: "🟣", label: "2. Kat", val: `${s.calisma.ikinciKat.cuz}`, sub: s.calisma.ikinciKat.sure },
            { emoji: "🔵", label: "1. Kat", val: `${s.calisma.birinciKat.cuz}`, sub: s.calisma.birinciKat.sure },
            { emoji: "🟡", label: "Yarı Ezber", val: `${s.calisma.yariEzber.cuz}`, sub: `${s.calisma.yariEzber.ayet}. ayet` },
            { emoji: "🟢", label: "Yüzüne", val: `${s.calisma.yuzune.cuz}`, sub: s.calisma.yuzune.sure },
          ].map(({ emoji, label, val, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-lg">{emoji}</span>
              <div className="flex-1">
                <div className="text-[10px] text-slate-400">{label}</div>
                <div className="text-sm font-bold text-slate-800">{val} <span className="font-normal text-slate-500">— {sub}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <div className="text-xs font-black uppercase tracking-widest text-slate-400">Pişmişlerim</div>
          <div className="text-sm font-black text-amber-500">{pismis}/20 🔥</div>
        </div>
        <ProgressBar value={progress} color="#D4A84B" />
        <div className="mt-3">
          <PismisGrid pismisler={s.pismisler} editable={false} onChange={() => {}} />
        </div>
      </div>
    </div>
  );
}

// ── APP ROOT ─────────────────────────────────────────────────────────────────
const MODES = [
  { id: "ogretmen", label: "Öğretmen", icon: "🎓" },
  { id: "veli", label: "Veli", icon: "👨‍👩‍👧" },
  { id: "ogrenci", label: "Öğrenci", icon: "📖" },
];

export default function App() {
  const [mode, setMode] = useState("ogretmen");
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState({ ad: "", sinif: "", grup: "Bireysel" });

  function handleUpdate(updated) {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  }

  function handleAddStudent() {
    if (!newStudent.ad.trim()) return;
    const blank = {
      id: Date.now(),
      ad: newStudent.ad,
      sinif: newStudent.sinif,
      grup: newStudent.grup,
      notlar: "",
      calisma: {
        ikinciKat: { cuz: "", sure: "", not: "" },
        birinciKat: { cuz: "", sure: "", not: "" },
        yariEzber: { cuz: "", ayet: "", not: "" },
        yuzune: { cuz: "", sure: "", not: "" },
      },
      takip: { verdigiCuz: "", yirmiDortSaat: false, kirkSekizSaat: false, etudHazir: false },
      pismisler: Object.fromEntries(Array.from({ length: 20 }, (_, i) => [i + 1, 0])),
    };
    setStudents((prev) => [...prev, blank]);
    setNewStudent({ ad: "", sinif: "", grup: "Bireysel" });
    setShowAddForm(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center text-slate-900 font-black text-sm">
              ☪
            </div>
            <div>
              <div className="text-white font-black text-sm leading-tight">Hafızlık Takip</div>
              <div className="text-slate-500 text-[10px]">Kuran Hafızlık Sistemi</div>
            </div>
          </div>

          <nav className="flex items-center gap-1 bg-slate-800 rounded-xl p-1">
            {MODES.map((m) => (
              <ModeTab
                key={m.id}
                label={m.label}
                icon={m.icon}
                active={mode === m.id}
                onClick={() => setMode(m.id)}
              />
            ))}
          </nav>

          {mode === "ogretmen" && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-amber-400 text-slate-900 px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-300 transition shadow-md"
            >
              + Öğrenci Ekle
            </button>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-5 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold bg-slate-900 text-amber-400 px-3 py-1 rounded-full uppercase tracking-widest">
            {MODES.find((m) => m.id === mode)?.icon} {MODES.find((m) => m.id === mode)?.label} Görünümü
          </span>
          {mode !== "ogretmen" && (
            <span className="text-xs text-slate-400">
              · Demo: {students[0].ad} için görünüm
            </span>
          )}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 pb-12 pt-4">
        {mode === "ogretmen" && <OgretmenView students={students} onUpdate={handleUpdate} />}
        {mode === "veli" && <VeliView students={students} onUpdate={handleUpdate} />}
        {mode === "ogrenci" && <OgrenciView students={students} />}
      </main>

      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-lg font-black text-slate-800 mb-4">Yeni Öğrenci Ekle</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Ad Soyad</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-400"
                  value={newStudent.ad}
                  onChange={(e) => setNewStudent((n) => ({ ...n, ad: e.target.value }))}
                  placeholder="Örn: Ali Veli"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Sınıf</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-400"
                  value={newStudent.sinif}
                  onChange={(e) => setNewStudent((n) => ({ ...n, sinif: e.target.value }))}
                  placeholder="Örn: 5-A"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Grup</label>
                <select
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-400 bg-white"
                  value={newStudent.grup}
                  onChange={(e) => setNewStudent((n) => ({ ...n, grup: e.target.value }))}
                >
                  <option>Bireysel</option>
                  <option>Koro Grubu A</option>
                  <option>Koro Grubu B</option>
                  <option>Koro Grubu C</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={handleAddStudent}
                className="flex-1 bg-slate-900 text-white py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition"
              >
                Ekle
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-xl text-sm font-bold hover:bg-slate-200 transition"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
