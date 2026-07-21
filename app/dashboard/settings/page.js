"use client";

import {
  Bell,
  Shield,
  Moon,
  Sun,
  Database,
  Download,
  Trash2,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/auth-context";
import { useFinance } from "../../../context/finance-context";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function SettingsPage() {
  const router = useRouter();
  const { usuario, logout } = useAuth();
  const { transactions, presupuestos, presupuestoTotal, totalGastado } =
    useFinance();

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return true;
    const theme = localStorage.getItem("theme");
    return theme ? theme === "dark" : true;
  });

  const [notifications, setNotifications] = useState(() => {
    if (typeof window === "undefined") return true;
    const val = localStorage.getItem("notifications");
    return val ? JSON.parse(val) : true;
  });

  const [privacy, setPrivacy] = useState(() => {
    if (typeof window === "undefined") return false;
    const val = localStorage.getItem("privacy");
    return val ? JSON.parse(val) : false;
  });

  const [currency, setCurrency] = useState(() => {
    if (typeof window === "undefined") return "Soles (S/)";
    return localStorage.getItem("currency") ?? "Soles (S/)";
  });

  const [startDay, setStartDay] = useState(() => {
    if (typeof window === "undefined") return 1;
    return Number(localStorage.getItem("startDay")) || 1;
  });

  // ── MODALES ───
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // ── GUARDAR PREFERENCIAS ──
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    localStorage.setItem("notifications", JSON.stringify(notifications));
    localStorage.setItem("privacy", JSON.stringify(privacy));
    localStorage.setItem("currency", currency);
    localStorage.setItem("startDay", startDay);
  }, [darkMode, notifications, privacy, currency, startDay]);

  // ── CERRAR SESIÓN ──
  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // ── EXPORTAR PDF ──
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Reporte de Gastos - GastoFobia", 14, 18);
    doc.setFontSize(11);
    doc.text(
      `Usuario: ${usuario?.nombre ?? ""}  |  Fecha: ${new Date().toLocaleDateString("es-PE")}`,
      14,
      27,
    );

    const gastos = transactions.filter((t) => t.type === "expense");

    if (gastos.length === 0) {
      doc.text("No existen gastos registrados.", 14, 40);
    } else {
      autoTable(doc, {
        head: [["#", "Descripción", "Categoría", "Monto (S/)", "Fecha"]],
        body: gastos.map((t, i) => [
          i + 1,
          t.description,
          t.category,
          Number(t.amount).toFixed(2),
          new Date(t.date).toLocaleDateString("es-PE"),
        ]),
        startY: 35,
      });
    }

    // Resumen al final
    const finalY = doc.lastAutoTable?.finalY ?? 40;
    doc.text(`Total gastado: S/ ${totalGastado.toFixed(2)}`, 14, finalY + 10);
    doc.text(
      `Presupuesto:   S/ ${presupuestoTotal.toFixed(2)}`,
      14,
      finalY + 18,
    );

    doc.save("Reporte_Gastos_GastoFobia.pdf");
  };

  // ── EXPORTAR EXCEL ───
  const exportExcel = () => {
    const gastos = transactions
      .filter((t) => t.type === "expense")
      .map((t) => ({
        Descripción: t.description,
        Categoría: t.category,
        "Monto (S/)": Number(t.amount).toFixed(2),
        Fecha: new Date(t.date).toLocaleDateString("es-PE"),
      }));

    const ingresos = transactions
      .filter((t) => t.type === "income")
      .map((t) => ({
        Descripción: t.description,
        Categoría: t.category,
        "Monto (S/)": Number(t.amount).toFixed(2),
        Fecha: new Date(t.date).toLocaleDateString("es-PE"),
      }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(gastos),
      "Gastos",
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(ingresos),
      "Ingresos",
    );
    XLSX.writeFile(wb, "Reporte_GastoFobia.xlsx");
  };

  // ── BORRAR TODOS LOS DATOS ───
  const handleDeleteAll = async () => {
    // Llama a una API que borre todas las transacciones/presupuestos del usuario
    await Promise.all([
      fetch("/api/transacciones/all", { method: "DELETE" }),
      fetch("/api/presupuestos/all", { method: "DELETE" }),
      fetch("/api/categorias/all", { method: "DELETE" }),
    ]);
    setShowDeleteConfirm(false);
    await logout();
    router.push("/login");
  };

  // ── CLASES COMPARTIDAS ─
  const card = `rounded-3xl border p-6 ${
    darkMode ? "bg-slate-900 border-slate-800" : "bg-gray-100 border-gray-300"
  }`;

  const toggleBtn = `${card} flex justify-between items-center w-full text-left transition hover:border-blue-500`;

  return (
    <div
      className={`space-y-8 transition-all duration-300 ${darkMode ? "text-white" : "text-black"}`}
    >
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Ajustes</h1>
        <p className="text-slate-400 mt-1">
          Configura tu cuenta y personaliza tu experiencia
        </p>
      </div>

      {/* PERFIL */}
      <section className={card}>
        <h2 className="text-xl font-semibold mb-6">Perfil</h2>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
            <User size={28} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {usuario?.nombre ?? "Usuario"}
            </h3>
            <p className="text-sm text-slate-400">{usuario?.email ?? ""}</p>
          </div>
        </div>
      </section>

      {/* OPCIONES */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* APARIENCIA */}
        <button onClick={() => setDarkMode(!darkMode)} className={toggleBtn}>
          <div className="flex gap-4 items-center">
            <div className="text-blue-500">{darkMode ? <Moon /> : <Sun />}</div>
            <div>
              <h3 className="font-semibold">Apariencia</h3>
              <p className="text-sm text-slate-400">
                {darkMode ? "Modo oscuro activado" : "Modo claro activado"}
              </p>
            </div>
          </div>
          <ChevronRight />
        </button>

        {/* NOTIFICACIONES */}
        <button
          onClick={() => setNotifications(!notifications)}
          className={toggleBtn}
        >
          <div className="flex gap-4 items-center">
            <Bell className="text-blue-500" />
            <div>
              <h3 className="font-semibold">Notificaciones</h3>
              <p className="text-sm text-slate-400">
                {notifications ? "Activadas" : "Desactivadas"}
              </p>
            </div>
          </div>
          <div
            className={`w-11 h-6 rounded-full transition-colors ${notifications ? "bg-blue-600" : "bg-slate-600"} relative`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications ? "left-6" : "left-1"}`}
            />
          </div>
        </button>

        {/* PRIVACIDAD */}
        <button onClick={() => setPrivacy(!privacy)} className={toggleBtn}>
          <div className="flex gap-4 items-center">
            <Shield className="text-blue-500" />
            <div>
              <h3 className="font-semibold">Privacidad</h3>
              <p className="text-sm text-slate-400">
                {privacy ? "Montos ocultos" : "Montos visibles"}
              </p>
            </div>
          </div>
          <div
            className={`w-11 h-6 rounded-full transition-colors ${privacy ? "bg-blue-600" : "bg-slate-600"} relative`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${privacy ? "left-6" : "left-1"}`}
            />
          </div>
        </button>

        {/* DATOS */}
        <button onClick={() => setShowDataModal(true)} className={toggleBtn}>
          <div className="flex gap-4 items-center">
            <Database className="text-blue-500" />
            <div>
              <h3 className="font-semibold">Datos</h3>
              <p className="text-sm text-slate-400">
                Ver resumen de tu información
              </p>
            </div>
          </div>
          <ChevronRight />
        </button>
      </div>

      {/* CONFIGURACIÓN FINANCIERA */}
      <section className={card}>
        <h2 className="text-xl font-semibold mb-5">Configuración financiera</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm text-slate-400">Moneda</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 focus:border-blue-500 outline-none"
            >
              <option>Soles (S/)</option>
              <option>Dólares ($)</option>
              <option>Euros (€)</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm text-slate-400">
              Día de inicio del mes
            </label>
            <input
              type="number"
              min={1}
              max={28}
              value={startDay}
              onChange={(e) => setStartDay(Number(e.target.value))}
              className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
      </section>

      {/* ACCIONES */}
      <section className={card}>
        <h2 className="text-xl font-semibold mb-6">Acciones</h2>
        <div className="space-y-3">
          <button
            onClick={() => setShowExportModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-4 flex justify-center items-center gap-3 transition"
          >
            <Download size={20} />
            Exportar datos
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full bg-red-600 hover:bg-red-700 rounded-xl py-4 flex justify-center items-center gap-3 transition"
          >
            <Trash2 size={20} />
            Borrar todos mis datos
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-slate-700 hover:bg-slate-600 rounded-xl py-4 flex justify-center items-center gap-3 transition"
          >
            <LogOut size={20} />
            Cerrar sesión
          </button>
        </div>
      </section>

      {/* ── MODAL: EXPORTAR */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-sm space-y-4">
            <h3 className="text-xl font-bold">Exportar datos</h3>
            <p className="text-slate-400 text-sm">
              Elige el formato de exportación
            </p>
            <button
              onClick={() => {
                exportPDF();
                setShowExportModal(false);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-3 font-semibold transition"
            >
              Descargar PDF
            </button>
            <button
              onClick={() => {
                exportExcel();
                setShowExportModal(false);
              }}
              className="w-full bg-green-600 hover:bg-green-700 rounded-xl py-3 font-semibold transition"
            >
              Descargar Excel
            </button>
            <button
              onClick={() => setShowExportModal(false)}
              className="w-full bg-slate-700 hover:bg-slate-600 rounded-xl py-3 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL: RESUMEN DE DATOS */}
      {showDataModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-sm space-y-4">
            <h3 className="text-xl font-bold">Resumen de datos</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Usuario</span>
                <span>{usuario?.nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email</span>
                <span>{usuario?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transacciones</span>
                <span>{transactions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Presupuestos</span>
                <span>{presupuestos.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total gastado</span>
                <span className="text-red-400">
                  S/ {totalGastado.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Presupuesto total</span>
                <span className="text-blue-400">
                  S/ {presupuestoTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Moneda</span>
                <span>{currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Inicio de mes</span>
                <span>Día {startDay}</span>
              </div>
            </div>
            <button
              onClick={() => setShowDataModal(false)}
              className="w-full bg-slate-700 hover:bg-slate-600 rounded-xl py-3 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL: CONFIRMAR BORRADO  */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6">
          <div className="bg-slate-900 border border-red-800 rounded-3xl p-8 w-full max-w-sm space-y-4">
            <h3 className="text-xl font-bold text-red-400">¿Borrar todo?</h3>
            <p className="text-slate-400 text-sm">
              Esta acción eliminará todas tus transacciones, presupuestos y
              categorías. No se puede deshacer.
            </p>
            <button
              onClick={handleDeleteAll}
              className="w-full bg-red-600 hover:bg-red-700 rounded-xl py-3 font-semibold transition"
            >
              Sí, borrar todo
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="w-full bg-slate-700 hover:bg-slate-600 rounded-xl py-3 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}