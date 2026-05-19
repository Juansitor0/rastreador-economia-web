import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [, navigate] = useLocation();

  const { login, signup } = useAuth();

  const [isRegister, setIsRegister] =
    useState(false);

  const [name, setName] = useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  function handleSubmit() {
    if (isRegister) {
      const success = signup(
        name,
        email,
        password
      );

      if (!success) {
        alert("Usuário já existe");
        return;
      }
    } else {
      const success = login(
        email,
        password
      );

      if (!success) {
        alert("Credenciais inválidas");
        return;
      }
    }

    navigate("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">
          {isRegister
            ? "Criar Conta"
            : "Entrar"}
        </h1>

        <div className="space-y-4">
          {isRegister && (
            <input
              className="w-full border p-3 rounded-lg"
              placeholder="Nome"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          )}

          <input
            className="w-full border p-3 rounded-lg"
            placeholder="E-mail"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            className="w-full border p-3 rounded-lg"
            placeholder="Senha"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg"
          >
            {isRegister
              ? "Cadastrar"
              : "Entrar"}
          </button>

          <button
            onClick={() =>
              setIsRegister(!isRegister)
            }
            className="text-sm text-emerald-600"
          >
            {isRegister
              ? "Já possui conta?"
              : "Criar nova conta"}
          </button>
        </div>
      </div>
    </div>
  );
}