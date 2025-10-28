export const hasPermission = (user: any, perm: string | string[]) => {
  if (!user || !user.permissions) return false;

  if (Array.isArray(perm)) {
    return perm.some((p) => user.permissions.includes(p));
  }

  return user.permissions.includes(perm);
};
