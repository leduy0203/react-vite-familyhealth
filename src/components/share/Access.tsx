import React from "react";
import { useAppSelector } from "../../redux/hooks";
import { Navigate } from "react-router-dom";
import { hasRole, type UserRole } from "../../config/permissions";

interface IProps {
  role: UserRole | UserRole[];
  children: React.ReactNode;
  hideChildren?: boolean;
}

const Access: React.FC<IProps> = ({
  role,
  children,
  hideChildren = false,
}) => {
  const user = useAppSelector((state) => state.account.user);

  const allow = hasRole(user, role);

  if (allow) {
    return <>{children}</>;
  } else {
    if (hideChildren) {
      return null; // or <></>
    } else {
      return <Navigate to="/unauthorized" replace />;
    }
  }
};

export default Access;
