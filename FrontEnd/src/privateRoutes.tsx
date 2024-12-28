import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { AuthContext } from "./context/AuthContext";

export const PrivateStudent: React.FC = () => {
  const { signed, user, student } = useContext(AuthContext);

  // Verificação se o usuário é estudante
  return signed && user && student ? <Outlet /> : <Navigate to="/" replace />;
};

export const PrivateTeacher: React.FC = () => {
  const { signed, user, teacher } = useContext(AuthContext);

  // Verificação se o usuário é professor
  return signed && user && teacher ? <Outlet /> : <Navigate to="/" replace />;
};
