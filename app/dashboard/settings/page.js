"use client";

import {
  Bell,
  Shield,
  Moon,
  Database,
  Download,
  Trash2,
  ChevronRight,
  LogOut,
  Sun,
  Eye,
  EyeOff,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// PDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// EXCEL
import * as XLSX from "xlsx";

export default function SettingsPage() {
  const router = useRouter();

  // ============================
  // ESTADOS
  // ============================

  const [darkMode, setDarkMode] = useState(true);

  const [notifications, setNotifications] = useState(true);

  const [privacy, setPrivacy] = useState(false);

  const [currency, setCurrency] = useState("Soles (S/)");

  const [startDay, setStartDay] = useState(1);

  const [storageInfo, setStorageInfo] = useState({
    expenses: 0,
    income: 0,
    budget: 0,
  });

  // ============================
  // CARGAR CONFIGURACIÓN
  // ============================

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const notify = localStorage.getItem("notifications");
    const hide = localStorage.getItem("privacy");
    const moneda = localStorage.getItem("currency");
    const inicio = localStorage.getItem("startDay");

    if (theme) setDarkMode(theme === "dark");

    if (notify)
      setNotifications(JSON.parse(notify));

    if (hide)
      setPrivacy(JSON.parse(hide));

    if (moneda)
      setCurrency(moneda);

    if (inicio)
      setStartDay(Number(inicio));

    loadStorageInfo();
  }, []);

  // ============================
  // GUARDAR CONFIGURACIÓN
  // ============================

  useEffect(() => {
    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );

    localStorage.setItem("notifications",
      JSON.stringify(notifications)
    );

    localStorage.setItem(
      "privacy",
      JSON.stringify(privacy)
    );

    localStorage.setItem(
      "currency",
      currency
    );

    localStorage.setItem(
      "startDay",
      startDay
    );
  }, [
    darkMode,
    notifications,
    privacy,
    currency,
    startDay,
  ]);

  // ============================
  // DATOS GUARDADOS
  // ============================

  const loadStorageInfo = () => {
    const expenses = JSON.parse(
      localStorage.getItem("expenses") || "[]"
    );

    const income = JSON.parse(
      localStorage.getItem("income") || "[]"
    );

    const budget =
      localStorage.getItem("budget") || 0;

    setStorageInfo({
      expenses: expenses.length,
      income: income.length,
      budget,
    });
  };

  // ============================
  // CERRAR SESIÓN
  // ============================

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    router.push("/login");
  };
    // ============================
  // EXPORTAR PDF
  // ============================

  const exportPDF = () => {
    const expenses = JSON.parse(
      localStorage.getItem("expenses") || "[]"
    );

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Reporte de Gastos - GastoFobia", 14, 18);

    if (expenses.length === 0) {
      doc.text("No existen gastos registrados.", 14, 35);
    } else {
      autoTable(doc, {
        head: [["#", "Descripción", "Categoría", "Monto", "Fecha"]],
        body: expenses.map((e, i) => [
          i + 1,
          e.description || e.descripcion || "",
          e.category || e.categoria || "",
          e.amount || e.monto || 0,
          e.date || e.fecha || "",
        ]),
        startY: 30,
      });
    }

    doc.save("Reporte_Gastos.pdf");
  };

  // ============================
  // EXPORTAR EXCEL
  // ============================

  const exportExcel = () => {
    const expenses = JSON.parse(
      localStorage.getItem("expenses") || "[]"
    );

    const datos = expenses.map((e) => ({
      Descripción: e.description || e.descripcion,
      Categoría: e.category || e.categoria,
      Monto: e.amount || e.monto,
      Fecha: e.date || e.fecha,
    }));

    const ws = XLSX.utils.json_to_sheet(datos);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      "Gastos"
    );

    XLSX.writeFile(
      wb,
      "Reporte_Gastos.xlsx"
    );
  };

  // ============================
  // EXPORTAR
  // ============================

  const handleExport = () => {
    const opcion = window.prompt(
      "¿Cómo deseas exportar?\n\nEscribe:\nPDF\nEXCEL"
    );

    if (!opcion) return;

    const value = opcion.toLowerCase();

    if (value === "pdf") {
      exportPDF();
    } else if (
      value === "excel" ||
      value === "xlsx"
    ) {
      exportExcel();
    } else {
      alert("Opción no válida.");
    }
  };

  // ============================
  // BORRAR TODO
  // ============================

  const handleDeleteAll = () => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar TODOS los datos?"
    );

    if (!confirmar) return;

    localStorage.clear();

    alert("Todos los datos fueron eliminados.");

    router.push("/login");
  };

  // ============================
  // MOSTRAR DATOS
  // ============================

  const handleShowData = () => {
    alert(
`Información almacenada

Gastos registrados: ${storageInfo.expenses}

Ingresos registrados: ${storageInfo.income}

Presupuesto: ${storageInfo.budget}

Moneda: ${currency}

Inicio de mes: ${startDay}

Tema: ${darkMode ? "Oscuro" : "Claro"}

Notificaciones:
${notifications ? "Activadas" : "Desactivadas"}

Privacidad:
${privacy ? "Ocultar montos" : "Mostrar montos"}`
    );
  };

  return (
    <div
      className={`space-y-8 min-h-screen transition-all duration-300 p-8 ${
        darkMode ? "bg-slate-950 text-white" : "bg-white text-black"
      }`}
    >
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Ajustes</h1>
        <p className="text-gray-400 mt-2">
          Configura tu cuenta y personaliza tu experiencia
        </p>
      </div>

      {/* PERFIL */}
      <section
        className={`rounded-3xl border p-6 ${
          darkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-gray-100 border-gray-300"
        }`}
      >
        <h2 className="text-xl font-semibold mb-6">Perfil</h2>

        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-2xl font-bold">L</span>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Luis</h3>
            <p className="text-sm text-gray-400">
              Usuario Premium
            </p>
          </div>
        </div>
      </section>

      {/* OPCIONES */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* APARIENCIA */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`rounded-3xl border p-6 flex justify-between items-center transition ${
            darkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-gray-100 border-gray-300"
          }`}
        >
          <div className="flex gap-4">
            <div className="text-blue-500">
              {darkMode ? <Moon /> : <Sun />}
            </div>

            <div>
              <h3 className="font-semibold">Apariencia</h3>
              <p className="text-sm">
                {darkMode
                  ? "Modo oscuro activado"
                  : "Modo claro activado"}
              </p>
            </div>
          </div>

          <ChevronRight />
        </button>

        {/* NOTIFICACIONES */}
        <button
          onClick={() =>
            setNotifications(!notifications)
          }
          className={`rounded-3xl border p-6 flex justify-between items-center transition ${
            darkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-gray-100 border-gray-300"
          }`}
        >
          <div className="flex gap-4">
            <Bell className="text-blue-500" />

            <div>
              <h3 className="font-semibold">
                Notificaciones
              </h3>
              <p className="text-sm">
                {notifications
                  ? "Activadas"
                  : "Desactivadas"}
              </p>
            </div>
          </div>

          <ChevronRight />
        </button>

        {/* PRIVACIDAD */}
        <button
          onClick={() => setPrivacy(!privacy)}
          className={`rounded-3xl border p-6 flex justify-between items-center transition ${
            darkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-gray-100 border-gray-300"
          }`}
        >
          <div className="flex gap-4">
            <Shield className="text-blue-500" />

            <div>
              <h3 className="font-semibold">
                Privacidad
              </h3>
              <p className="text-sm">
                {privacy
                  ? "Ocultar montos activado"
                  : "Mostrar montos"}
              </p>
            </div>
          </div>

          <ChevronRight />
        </button>

        {/* DATOS */}
        <button
          onClick={handleShowData}
          className={`rounded-3xl border p-6 flex justify-between items-center transition ${
            darkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-gray-100 border-gray-300"
          }`}
        >
          <div className="flex gap-4">
            <Database className="text-blue-500" />

            <div>
              <h3 className="font-semibold">
                Datos
              </h3>
              <p className="text-sm">
                Ver información almacenada
              </p>
            </div>
          </div>

          <ChevronRight />
        </button>
      </div>
            {/* CONFIGURACIÓN FINANCIERA */}
      <section
        className={`rounded-3xl border p-6 ${
          darkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-gray-100 border-gray-300"
        }`}
      >
        <h2 className="text-xl font-semibold mb-5">
          Configuración financiera
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-2">Moneda</label>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`w-full p-3 rounded-xl ${
                darkMode
                  ? "bg-slate-800 text-white"
                  : "bg-white border"
              }`}
            >
              <option>Soles (S/)</option>
              <option>Dólares ($)</option>
              <option>Euros (€)</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">
              Inicio de mes
            </label>

            <input
              type="number"
              value={startDay}
              onChange={(e) =>
                setStartDay(Number(e.target.value))
              }
              className={`w-full p-3 rounded-xl ${
                darkMode
                  ? "bg-slate-800 text-white"
                  : "bg-white border"
              }`}
            />
          </div>
        </div>
      </section>

      {/* ACCIONES */}
      <section
        className={`rounded-3xl border p-6 ${
          darkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-gray-100 border-gray-300"
        }`}
      >
        <h2 className="text-xl font-semibold mb-6">
          Acciones
        </h2>

        <div className="space-y-3">

          {/* EXPORTAR */}
          <button
            onClick={handleExport}
            className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-4 flex justify-center items-center gap-3"
          >
            <Download size={20} />
            Exportar datos (PDF / Excel)
          </button>

          {/* BORRAR TODO */}
          <button
            onClick={handleDeleteAll}
            className="w-full bg-red-600 hover:bg-red-700 rounded-xl py-4 flex justify-center items-center gap-3"
          >
            <Trash2 size={20} />
            Borrar todo
          </button>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full bg-slate-700 hover:bg-slate-600 rounded-xl py-4 flex justify-center items-center gap-3"
          >
            <LogOut size={20} />
            Cerrar sesión
          </button>
        </div>
      </section>
    </div>
  );
}

/* =========================
   CARD COMPONENT
========================= */

function Card({ icon, title, darkMode }) {
  return (
    <button
      className={`rounded-3xl border p-6 flex justify-between items-center transition ${
        darkMode
          ? "bg-slate-900 border-slate-800"
          : "bg-gray-100 border-gray-300"
      }`}
    >
      <div className="flex gap-4">
        <div className="text-blue-500">{icon}</div>

        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-gray-400">
            Configuración del sistema
          </p>
        </div>
      </div>

      <ChevronRight />
    </button>
  );
}