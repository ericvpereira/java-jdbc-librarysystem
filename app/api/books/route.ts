import { NextResponse } from "next/server";
import { getBooks, addBook } from "@/lib/data";

export async function GET() {
  const books = getBooks();
  return NextResponse.json(books);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newBook = addBook(body);
  return NextResponse.json(newBook, { status: 201 });
}
