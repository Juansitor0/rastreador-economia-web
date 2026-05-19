import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  password?: string;
}

export default function Auth({ onLogin }: { onLogin: (user: User) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useLocalStorage<User[]>("users", []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (isLogin) {
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        onLogin(user);
        toast.success(`Bem-vindo de volta, ${username}!`);
      } else {
        toast.error("Usuário ou senha incorretos");
      }
    } else {
      if (users.some(u => u.username === username)) {
        toast.error("Este nome de usuário já existe");
        return;
      }
      const newUser = { id: Math.random().toString(36).substr(2, 9), username, password };
      setUsers([...users, newUser]);
      onLogin(newUser);
      toast.success("Conta criada com sucesso!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? "Entrar" : "Criar Conta"}</CardTitle>
          <CardDescription>
            {isLogin ? "Acesse seu rastreador de economia" : "Comece a planejar sua moto hoje"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Seu nome de usuário"
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
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              {isLogin ? "Entrar" : "Cadastrar"}
            </Button>
            <Button 
              type="button" 
              variant="link" 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm"
            >
              {isLogin ? "Não tem uma conta? Cadastre-se" : "Já tem uma conta? Entre aqui"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
