import { ReactNode } from "react";
import { isAuthenticated } from "@/lib/auth";
import AuthForm from "./AuthForm";

interface ProtectedRouteProps {
  children: ReactNode;
  onAuthSuccess: () => void;
}

export default function ProtectedRoute({ children, onAuthSuccess }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    return <AuthForm onAuthSuccess={onAuthSuccess} />;
  }

  return <>{children}</>;
}