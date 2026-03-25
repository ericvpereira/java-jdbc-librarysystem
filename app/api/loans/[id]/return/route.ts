import { NextResponse } from "next/server";
import { returnLoan } from "@/lib/data";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const loan = returnLoan(Number(id));
  if (!loan) {
    return NextResponse.json({ error: "Emprestimo nao encontrado" }, { status: 404 });
  }
  return NextResponse.json(loan);
}
