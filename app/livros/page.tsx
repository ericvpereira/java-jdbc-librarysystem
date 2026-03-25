"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { Plus, Search, Pencil, Trash2, BookOpen } from "lucide-react";
import { Book } from "@/types";
import { formatCurrency } from "@/lib/utils";
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

export default function LivrosPage() {
  const { data: books = [], isLoading } = useSWR<Book[]>("/api/books", fetcher);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    stock: "",
  });

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );

  const openCreateDialog = () => {
    setEditingBook(null);
    setFormData({ title: "", author: "", price: "", stock: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price.toString(),
      stock: book.stock.toString(),
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (book: Book) => {
    setBookToDelete(book);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bookData = {
      title: formData.title,
      author: formData.author,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
    };

    if (editingBook) {
      await fetch(`/api/books/${editingBook.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
    } else {
      await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
    }

    mutate("/api/books");
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    if (bookToDelete) {
      await fetch(`/api/books/${bookToDelete.id}`, { method: "DELETE" });
      mutate("/api/books");
      setDeleteDialogOpen(false);
      setBookToDelete(null);
    }
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive">Esgotado</Badge>;
    if (stock <= 2) return <Badge variant="warning">Baixo: {stock}</Badge>;
    return <Badge variant="success">Disponivel: {stock}</Badge>;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Livros</h1>
        <p className="mt-1 text-muted-foreground">
          Gerencie o catalogo de livros da biblioteca
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar livros..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4" />
          Novo Livro
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-foreground">
              Nenhum livro encontrado
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {search
                ? "Tente ajustar sua busca"
                : "Comece adicionando um novo livro"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titulo</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Preco</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead className="w-24">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{formatCurrency(book.price)}</TableCell>
                  <TableCell>{getStockBadge(book.stock)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(book)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(book)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Dialog de Criar/Editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingBook ? "Editar Livro" : "Novo Livro"}
            </DialogTitle>
            <DialogDescription>
              {editingBook
                ? "Atualize as informacoes do livro"
                : "Preencha os dados para cadastrar um novo livro"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Titulo
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Ex: Clean Code"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Autor
                </label>
                <Input
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  placeholder="Ex: Robert C. Martin"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Preco (R$)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Estoque
                  </label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    placeholder="0"
                    required
                  />
                </div>
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
              <Button type="submit">
                {editingBook ? "Salvar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmar Exclusao */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusao</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o livro{" "}
              <strong>{bookToDelete?.title}</strong>? Esta acao nao pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
