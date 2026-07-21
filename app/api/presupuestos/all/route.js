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

export async function DELETE(req) {
  const usuarioId = getUsuarioId(req);
  if (!usuarioId)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  await prisma.presupuesto.deleteMany({ where: { usuarioId } });
  return NextResponse.json({ ok: true });
}
