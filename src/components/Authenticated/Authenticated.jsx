import { useAuth } from "react-oidc-context";

const Authenticated = ({ children }) => {
  const auth = useAuth();

  if (!auth.isAuthenticated) return null;
  return <>{children}</>;
};

export default Authenticated;
