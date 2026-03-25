import { NextResponse } from "next/server";
import { getBookById, updateBook, deleteBook } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const book = getBookById(Number(id));
  if (!book) {
    return NextResponse.json({ error: "Livro nao encontrado" }, { status: 404 });
  }
  return NextResponse.json(book);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const updated = updateBook(Number(id), body);
  if (!updated) {
    return NextResponse.json({ error: "Livro nao encontrado" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = deleteBook(Number(id));
  if (!deleted) {
    return NextResponse.json({ error: "Livro nao encontrado" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
