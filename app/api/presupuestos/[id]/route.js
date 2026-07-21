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

export async function PATCH(req, { params }) {
  const usuarioId = getUsuarioId(req);
  if (!usuarioId)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { monto } = await req.json();
  await prisma.presupuesto.updateMany({
    where: { id: params.id, usuarioId },
    data: { monto },
  });
  return NextResponse.json({ ok: true });
}
