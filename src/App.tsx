import { AuthScreen } from "./auth/AuthScreen";
import { useAuth } from "./auth/useAuth";
import Dashboard from "./Dashboard";

export default function App() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Dashboard /> : <AuthScreen />;
}
