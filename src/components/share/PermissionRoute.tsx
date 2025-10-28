import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { hasPermission } from "../../config/permissions";

interface Props {
  permission: string | string[];
  children: React.ReactElement;
}

const PermissionRoute: React.FC<Props> = ({ permission, children }) => {
  const user = useAppSelector((s) => s.account.user);
  if (!user) return <Navigate to="/login" replace />;

  const perms = Array.isArray(permission) ? permission : [permission];
  const allowed = perms.some((p) => hasPermission(user, p));
  if (!allowed) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default PermissionRoute;
