import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { hasRole, type UserRole } from "../../config/permissions";

interface Props {
  role: UserRole | UserRole[];
  children: React.ReactElement;
}

const PermissionRoute: React.FC<Props> = ({ role, children }) => {
  const user = useAppSelector((s) => s.account.user);
  if (!user) return <Navigate to="/login" replace />;

  const allowed = hasRole(user, role);
  if (!allowed) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

export default PermissionRoute;
