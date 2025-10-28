export const hasPermission = (user: any, perm: string) => {
  if (!user) return false;
  if (!user.permissions) return false;
  return user.permissions.includes(perm);
};
