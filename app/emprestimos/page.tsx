"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { Plus, Search, RotateCcw, Users } from "lucide-react";
import { Loan, Book } from "@/types";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function EmprestimosPage() {
  const { data: loans = [], isLoading } = useSWR<Loan[]>("/api/loans", fetcher);
  const { data: books = [] } = useSWR<Book[]>("/api/books", fetcher);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    book_id: "",
    user_name: "",
    loan_date: new Date().toISOString().split("T")[0],
  });

  const filteredLoans = loans.filter(
    (loan) =>
      loan.user_name.toLowerCase().includes(search.toLowerCase()) ||
      loan.book_title?.toLowerCase().includes(search.toLowerCase())
  );

  const availableBooks = books.filter((book) => book.stock > 0);

  const openCreateDialog = () => {
    setFormData({
      book_id: "",
      user_name: "",
      loan_date: new Date().toISOString().split("T")[0],
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/loans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        book_id: parseInt(formData.book_id),
        user_name: formData.user_name,
        loan_date: formData.loan_date,
      }),
    });

    mutate("/api/loans");
    mutate("/api/books");
    setDialogOpen(false);
  };

  const handleReturn = async (loanId: number) => {
    await fetch(`/api/loans/${loanId}/return`, { method: "POST" });
    mutate("/api/loans");
    mutate("/api/books");
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Emprestimos</h1>
        <p className="mt-1 text-muted-foreground">
          Controle os emprestimos de livros da biblioteca
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por usuario ou livro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4" />
          Novo Emprestimo
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : filteredLoans.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-foreground">
              Nenhum emprestimo encontrado
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {search
                ? "Tente ajustar sua busca"
                : "Registre um novo emprestimo"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Livro</TableHead>
                <TableHead>Data do Emprestimo</TableHead>
                <TableHead>Data de Devolucao</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLoans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-medium">
                    {loan.user_name}
                  </TableCell>
                  <TableCell>{loan.book_title}</TableCell>
                  <TableCell>{formatDate(loan.loan_date)}</TableCell>
                  <TableCell>
                    {loan.return_date ? formatDate(loan.return_date) : "-"}
                  </TableCell>
                  <TableCell>
                    {loan.status === "active" ? (
                      <Badge variant="default">Ativo</Badge>
                    ) : (
                      <Badge variant="secondary">Devolvido</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {loan.status === "active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReturn(loan.id)}
                        className="gap-1"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Devolver
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Dialog de Novo Emprestimo */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Emprestimo</DialogTitle>
            <DialogDescription>
              Registre um novo emprestimo de livro
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Nome do Usuario
                </label>
                <Input
                  value={formData.user_name}
                  onChange={(e) =>
                    setFormData({ ...formData, user_name: e.target.value })
                  }
                  placeholder="Ex: Joao Silva"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Livro
                </label>
                <select
                  value={formData.book_id}
                  onChange={(e) =>
                    setFormData({ ...formData, book_id: e.target.value })
                  }
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  required
                >
                  <option value="">Selecione um livro</option>
                  {availableBooks.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title} ({book.stock} disponiveis)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Data do Emprestimo
                </label>
                <Input
                  type="date"
                  value={formData.loan_date}
                  onChange={(e) =>
                    setFormData({ ...formData, loan_date: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Registrar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
