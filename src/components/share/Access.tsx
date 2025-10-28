import React from "react";
import { useAppSelector } from "../../redux/hooks";
import { Navigate } from "react-router-dom";
import { hasPermission } from "../../config/permissions";

interface IProps {
  permission: string | string[];
  children: React.ReactNode;
  hideChildren?: boolean;
}

const Access: React.FC<IProps> = ({
  permission,
  children,
  hideChildren = false,
}) => {
  const user = useAppSelector((state) => state.account.user);

  const allow = hasPermission(user, permission);

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
