"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Wallet, Mail, Lock } from "lucide-react";
import { useAuth } from "../../context/auth-context";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  function entrar(e) {
    e.preventDefault();

    const ok = login({
      email,
      password,
    });

    if (!ok) {
      alert("Correo o contraseña incorrectos");
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur shadow-2xl">
        {/* IZQUIERDA */}
        <div className="hidden lg:flex flex-col justify-center p-14 bg-gradient-to-br from-blue-700 to-slate-950">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-8">
            <Wallet size={32} />
          </div>

          <h1 className="text-5xl font-black leading-tight">
            Controla tus gastos.
          </h1>

          <p className="mt-6 text-slate-300 text-lg">
            Visualiza ingresos, organiza presupuestos y mejora tus finanzas.
          </p>
        </div>

        {/* DERECHA */}
        <div className="p-10 lg:p-14">
          <div className="mb-10">
            <h2 className="text-4xl font-bold">Bienvenido</h2>

            <p className="text-slate-400 mt-2">Ingresa para continuar</p>
          </div>

          <div className="space-y-5">
            <form onSubmit={entrar} className="space-y-5">
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-4 text-slate-500"
                />

                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-4 text-slate-500"
                />

                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-4 top-4"
                >
                  {show ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 font-semibold transition"
              >
                Ingresar
              </button>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-700" />
                <span className="text-sm text-slate-500">o</span>
                <div className="flex-1 h-px bg-slate-700" />
              </div>

              <Link
                href="/register"
                className="block w-full text-center py-4 rounded-2xl border border-slate-700 hover:border-blue-500 hover:bg-slate-800 transition"
              >
                Crear cuenta con correo
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
