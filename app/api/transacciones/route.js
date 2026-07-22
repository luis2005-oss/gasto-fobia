import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../lib/prisma";

function getUsuarioId(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET).id;
  } catch {
    return null;
  }
}

// GET — listar transacciones del usuario
export async function GET(req) {
  const usuarioId = getUsuarioId(req);
  if (!usuarioId)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const transacciones = await prisma.transaccion.findMany({
    where: { usuarioId },
    orderBy: { fecha: "desc" },
  });

  return NextResponse.json(transacciones);
}

// POST — crear transacción
export async function POST(req) {
  const usuarioId = getUsuarioId(req);
  if (!usuarioId)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { descripcion, monto, tipo, categoria, fecha } = await req.json();

  const transaccion = await prisma.transaccion.create({
    data: {
      descripcion,
      monto,
      tipo,
      categoria,
      fecha: fecha ? new Date(fecha) : new Date(),
      usuarioId,
    },
  });

  return NextResponse.json(transaccion, { status: 201 });
}
