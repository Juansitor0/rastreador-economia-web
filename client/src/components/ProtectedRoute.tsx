import { Route, Redirect } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute(
  props: any
) {
  const { user } = useAuth();

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <Route {...props} />;
}