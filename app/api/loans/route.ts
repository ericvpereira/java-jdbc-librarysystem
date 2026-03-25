import { NextResponse } from "next/server";
import { getLoans, addLoan } from "@/lib/data";

export async function GET() {
  const loans = getLoans();
  return NextResponse.json(loans);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newLoan = addLoan(body);
  return NextResponse.json(newLoan, { status: 201 });
}
