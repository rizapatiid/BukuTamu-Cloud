import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase, ref, push, onValue, serverTimestamp, query, orderByChild, limitToLast
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

// ================= Inisialisasi Firebase =================
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const bukuTamuRef = ref(db, "bukutamu");

// ================= Elemen DOM =================
const $ = (id) => document.getElementById(id);
const form = $("guestForm");
const btnKirim = $("btnKirim");
const daftar = $("daftarTamu");
const statusEl = $("status");
const inputCari = $("cari");
const fields = ["nama", "instansi", "email", "telepon", "keperluan", "bertemu", "pesan"];

let semuaTamu = [];

$("tanggalHariIni").textContent = new Date().toLocaleDateString("id-ID", {
  weekday: "long", day: "numeric", month: "long", year: "numeric"
});
$("tahun").textContent = new Date().getFullYear();

$("pesan").addEventListener("input", (e) => { $("hitung").textContent = e.target.value.length; });
fields.forEach((f) => $(f).addEventListener("input", () => clearError(f)));
$("keperluan").addEventListener("change", () => clearError("keperluan"));

// ================= Validasi =================
function validasi(d) {
  const err = {};
  if (d.nama.length < 3) err.nama = "Nama minimal 3 karakter.";
  if (d.instansi.length < 2) err.instansi = "Instansi / asal wajib diisi.";
  if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) err.email = "Format email tidak valid.";
  if (d.telepon && !/^[0-9+\-\s]{8,15}$/.test(d.telepon)) err.telepon = "Nomor telepon tidak valid.";
  if (!d.keperluan) err.keperluan = "Pilih keperluan.";
  if (d.pesan.length < 3) err.pesan = "Pesan minimal 3 karakter.";
  return err;
}

function showError(id, msg) {
  const field = $(id).closest(".field");
  field.classList.add("invalid");
  if (!field.querySelector(".error-msg")) {
    const p = document.createElement("div");
    p.className = "error-msg";
    p.textContent = msg;
    field.appendChild(p);
  }
}
function clearError(id) {
  const field = $(id).closest(".field");
  field.classList.remove("invalid");
  field.querySelector(".error-msg")?.remove();
}

// ================= 1) Simpan data ke Realtime Database =================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  fields.forEach(clearError);

  const data = {};
  fields.forEach((f) => (data[f] = $(f).value.trim()));

  const err = validasi(data);
  if (Object.keys(err).length) {
    Object.entries(err).forEach(([k, v]) => showError(k, v));
    $(Object.keys(err)[0]).focus();
    return;
  }

  setLoading(true);
  try {
    await push(bukuTamuRef, { ...data, waktu: serverTimestamp() });
    form.reset();
    $("hitung").textContent = "0";
    toast("Terima kasih, data Anda telah tersimpan.", "success");
  } catch (er) {
    toast("Gagal menyimpan data. Silakan coba lagi.", "error");
    console.error(er);
  } finally {
    setLoading(false);
  }
});

function setLoading(on) {
  btnKirim.disabled = on;
  btnKirim.innerHTML = on
    ? '<svg class="icon spin"><use href="#i-loader"/></svg><span>Menyimpan</span>'
    : '<span>Simpan</span><svg class="icon"><use href="#i-arrow"/></svg>';
}

// ================= 2) Tampilkan data secara realtime =================
const q = query(bukuTamuRef, orderByChild("waktu"), limitToLast(200));
onValue(q, (snapshot) => {
  const items = [];
  snapshot.forEach((child) => { items.push({ id: child.key, ...child.val() }); });
  semuaTamu = items.reverse(); // terbaru di atas
  updateStats();
  render();
}, (er) => {
  console.error(er);
  daftar.innerHTML = emptyState("i-alert", "Data tidak dapat dimuat.");
});

inputCari.addEventListener("input", render);

function render() {
  const kata = inputCari.value.toLowerCase().trim();
  const list = kata
    ? semuaTamu.filter((t) =>
        [t.nama, t.instansi, t.keperluan, t.bertemu].some((v) => (v || "").toLowerCase().includes(kata)))
    : semuaTamu;

  if (list.length === 0) {
    daftar.innerHTML = kata
      ? emptyState("i-search", "Tidak ada hasil untuk pencarian ini.")
      : emptyState("i-inbox", "Belum ada tamu yang tercatat.");
    return;
  }

  daftar.innerHTML = list.map((t) => {
    const meta = [t.instansi, t.keperluan, t.bertemu ? "Bertemu " + t.bertemu : ""]
      .filter(Boolean).map(escapeHtml).join('<span class="sep">·</span>');
    return `
    <li class="guest">
      <div class="avatar">${inisial(t.nama)}</div>
      <div class="guest-body">
        <div class="guest-top">
          <span class="guest-name">${escapeHtml(t.nama)}</span>
          <span class="guest-time">${formatWaktu(t.waktu)}</span>
        </div>
        <div class="guest-meta">${meta}</div>
        <p class="guest-msg">${escapeHtml(t.pesan)}</p>
      </div>
    </li>`;
  }).join("");
}

function updateStats() {
  const awalHari = new Date(); awalHari.setHours(0, 0, 0, 0);
  $("statTotal").textContent = semuaTamu.length;
  $("statHariIni").textContent = semuaTamu.filter((t) => t.waktu >= awalHari.getTime()).length;
}

// ================= 3) Status koneksi =================
onValue(ref(db, ".info/connected"), (snap) => {
  const on = snap.val() === true;
  statusEl.className = "status " + (on ? "online" : "offline");
  statusEl.querySelector(".status-text").textContent = on ? "Online" : "Offline";
});

// ================= Utilitas =================
function emptyState(icon, text) {
  return `<li class="empty"><svg class="icon"><use href="#${icon}"/></svg><span>${text}</span></li>`;
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function inisial(nama = "") {
  const p = nama.trim().split(/\s+/);
  return escapeHtml(((p[0]?.[0] || "") + (p[1]?.[0] || "")).toUpperCase() || "?");
}

function formatWaktu(ts) {
  if (typeof ts !== "number") return "Baru saja";
  const s = (Date.now() - ts) / 1000;
  if (s < 60) return "Baru saja";
  if (s < 3600) return Math.floor(s / 60) + " mnt lalu";
  if (s < 86400) return Math.floor(s / 3600) + " jam lalu";
  return new Date(ts).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

let toastTimer;
function toast(msg, type = "success") {
  const el = $("toast");
  el.className = "toast " + type;
  el.innerHTML = `<svg class="icon"><use href="#${type === "success" ? "i-check" : "i-alert"}"/></svg><span>${escapeHtml(msg)}</span>`;
  requestAnimationFrame(() => el.classList.add("show"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 3000);
}
