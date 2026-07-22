import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma";

function getUsuarioId(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET).id;
  } catch {
    return null;
  }
}

// DELETE — eliminar transacción
export async function DELETE(req, { params }) {
  const usuarioId = getUsuarioId(req);
  if (!usuarioId)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  await prisma.transaccion.deleteMany({
    where: { id: params.id, usuarioId }, // solo puede borrar las suyas
  });

  return NextResponse.json({ ok: true });
}

// PATCH — editar transacción
export async function PATCH(req, { params }) {
  const usuarioId = getUsuarioId(req);
  if (!usuarioId)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const data = await req.json();

  const transaccion = await prisma.transaccion.updateMany({
    where: { id: params.id, usuarioId },
    data,
  });

  return NextResponse.json(transaccion);
}
