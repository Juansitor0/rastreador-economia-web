import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContextNew";
import { toast } from "sonner";

export default function LoginNew() {
  const { login, signup, loading, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (isLogin) {
      const success = await login(email, password);
      if (success) {
        toast.success("Bem-vindo de volta!");
      } else {
        toast.error(error || "Erro ao fazer login");
      }
    } else {
      if (!name) {
        toast.error("Nome é obrigatório");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("As senhas não coincidem");
        return;
      }

      if (password.length < 6) {
        toast.error("Senha deve ter pelo menos 6 caracteres");
        return;
      }

      const success = await signup(name, email, password);
      if (success) {
        toast.success("Conta criada com sucesso!");
      } else {
        toast.error(error || "Erro ao criar conta");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-primary p-2 rounded-lg">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Rastreador de Economia
            </h1>
          </div>
          <CardTitle>{isLogin ? "Entrar" : "Criar Conta"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Acesse seu rastreador de economia"
              : "Comece a planejar sua moto hoje"}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  disabled={loading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                disabled={loading}
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua senha"
                  disabled={loading}
                />
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                {error}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Carregando..."
                : isLogin
                ? "Entrar"
                : "Cadastrar"}
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-sm"
              disabled={loading}
            >
              {isLogin
                ? "Não tem uma conta? Cadastre-se"
                : "Já tem uma conta? Entre aqui"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
