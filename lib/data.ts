import { Book, Loan } from "@/types";

// Dados simulados baseados no sistema Java JDBC
export const initialBooks: Book[] = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin", price: 89.9, stock: 3 },
  { id: 2, title: "The Pragmatic Programmer", author: "David Thomas", price: 95.0, stock: 5 },
  { id: 3, title: "Design Patterns", author: "Gang of Four", price: 120.0, stock: 2 },
  { id: 4, title: "Entendendo Algoritmos", author: "Aditya Y. Bhargava", price: 50.0, stock: 4 },
  { id: 5, title: "Estruturas de Dados", author: "Michael T. Goodrich", price: 75.0, stock: 1 },
  { id: 6, title: "Java: Como Programar", author: "Paul Deitel", price: 110.0, stock: 6 },
];

export const initialLoans: Loan[] = [
  { id: 1, book_id: 1, book_title: "Clean Code", user_name: "Eric Vieira", loan_date: "2024-01-04", status: "active" },
  { id: 2, book_id: 2, book_title: "The Pragmatic Programmer", user_name: "Maria Silva", loan_date: "2024-01-10", return_date: "2024-01-20", status: "returned" },
  { id: 3, book_id: 4, book_title: "Entendendo Algoritmos", user_name: "Joao Santos", loan_date: "2024-01-15", status: "active" },
];

// Simulacao de armazenamento em memoria para o frontend
let books = [...initialBooks];
let loans = [...initialLoans];
let nextBookId = 7;
let nextLoanId = 4;

export function getBooks(): Book[] {
  return books;
}

export function getBookById(id: number): Book | undefined {
  return books.find(book => book.id === id);
}

export function addBook(book: Omit<Book, "id">): Book {
  const newBook = { ...book, id: nextBookId++ };
  books.push(newBook);
  return newBook;
}

export function updateBook(id: number, data: Partial<Book>): Book | null {
  const index = books.findIndex(book => book.id === id);
  if (index === -1) return null;
  books[index] = { ...books[index], ...data };
  return books[index];
}

export function deleteBook(id: number): boolean {
  const index = books.findIndex(book => book.id === id);
  if (index === -1) return false;
  books.splice(index, 1);
  return true;
}

export function getLoans(): Loan[] {
  return loans;
}

export function addLoan(loan: Omit<Loan, "id" | "status">): Loan {
  const book = getBookById(loan.book_id);
  const newLoan: Loan = { 
    ...loan, 
    id: nextLoanId++, 
    status: "active",
    book_title: book?.title 
  };
  loans.push(newLoan);
  
  // Diminui o estoque
  if (book) {
    updateBook(loan.book_id, { stock: book.stock - 1 });
  }
  
  return newLoan;
}

export function returnLoan(id: number): Loan | null {
  const index = loans.findIndex(loan => loan.id === id);
  if (index === -1) return null;
  
  const loan = loans[index];
  loans[index] = { 
    ...loan, 
    status: "returned", 
    return_date: new Date().toISOString().split("T")[0] 
  };
  
  // Aumenta o estoque
  const book = getBookById(loan.book_id);
  if (book) {
    updateBook(loan.book_id, { stock: book.stock + 1 });
  }
  
  return loans[index];
}

export function getStats() {
  return {
    totalBooks: books.reduce((acc, book) => acc + book.stock, 0),
    totalLoans: loans.length,
    activeLoans: loans.filter(loan => loan.status === "active").length,
    lowStockBooks: books.filter(book => book.stock <= 2).length,
  };
}
