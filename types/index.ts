export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  stock: number;
}

export interface Loan {
  id: number;
  book_id: number;
  book_title?: string;
  user_name: string;
  loan_date: string;
  return_date?: string | null;
  status: "active" | "returned";
}

export interface DashboardStats {
  totalBooks: number;
  totalLoans: number;
  activeLoans: number;
  lowStockBooks: number;
}
