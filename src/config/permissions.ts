// Role types
export type UserRole = "ADMIN" | "DOCTOR" | "PATIENT";

// Check if user has specific role
export const hasRole = (user: any, role: UserRole | UserRole[]): boolean => {
  if (!user || !user.role || !user.role.name) return false;

  const userRole = user.role.name.toUpperCase();

  if (Array.isArray(role)) {
    return role.some((r) => userRole === r);
  }

  return userRole === role;
};

// Alias for backward compatibility (deprecated)
export const hasPermission = hasRole;
