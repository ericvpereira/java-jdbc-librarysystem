"use client";

import useSWR from "swr";
import Link from "next/link";
import {
  BookOpen,
  Users,
  Package,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book, Loan, DashboardStats } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {description && (
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            {trend === "up" && (
              <TrendingUp className="h-3 w-3 text-success" />
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: stats } = useSWR<DashboardStats>("/api/stats", fetcher);
  const { data: books = [] } = useSWR<Book[]>("/api/books", fetcher);
  const { data: loans = [] } = useSWR<Loan[]>("/api/loans", fetcher);

  const recentLoans = loans
    .filter((loan) => loan.status === "active")
    .slice(0, 5);
  const lowStockBooks = books.filter((book) => book.stock <= 2).slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Visao geral do sistema de biblioteca
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Livros"
          value={stats?.totalBooks ?? 0}
          icon={Package}
          description="Unidades em estoque"
        />
        <StatCard
          title="Total de Emprestimos"
          value={stats?.totalLoans ?? 0}
          icon={Users}
          description="Emprestimos registrados"
        />
        <StatCard
          title="Emprestimos Ativos"
          value={stats?.activeLoans ?? 0}
          icon={BookOpen}
          description="Aguardando devolucao"
          trend="up"
        />
        <StatCard
          title="Estoque Baixo"
          value={stats?.lowStockBooks ?? 0}
          icon={AlertTriangle}
          description="Livros com estoque <= 2"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Emprestimos Ativos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Emprestimos Ativos</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Livros aguardando devolucao
              </p>
            </div>
            <Link href="/emprestimos">
              <Button variant="ghost" size="sm" className="gap-1">
                Ver todos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentLoans.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Nenhum emprestimo ativo
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {recentLoans.map((loan) => (
                  <div
                    key={loan.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-accent/30 p-3"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {loan.book_title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {loan.user_name} - {formatDate(loan.loan_date)}
                      </p>
                    </div>
                    <Badge variant="default">Ativo</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Livros com Estoque Baixo */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Estoque Baixo</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Livros que precisam de reposicao
              </p>
            </div>
            <Link href="/livros">
              <Button variant="ghost" size="sm" className="gap-1">
                Ver todos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {lowStockBooks.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Todos os livros com estoque adequado
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {lowStockBooks.map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-accent/30 p-3"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {book.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {book.author} - {formatCurrency(book.price)}
                      </p>
                    </div>
                    <Badge
                      variant={book.stock === 0 ? "destructive" : "warning"}
                    >
                      {book.stock === 0 ? "Esgotado" : `${book.stock} und`}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Acoes Rapidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/livros">
              <Button variant="outline" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Gerenciar Livros
              </Button>
            </Link>
            <Link href="/emprestimos">
              <Button variant="outline" className="gap-2">
                <Users className="h-4 w-4" />
                Gerenciar Emprestimos
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
