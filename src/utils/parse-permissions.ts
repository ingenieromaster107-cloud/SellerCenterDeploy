import { Permission } from "./constants/permissions";

export function parsePermissions(permissionType: string): string[] {
  if (!permissionType) return [];

  return permissionType
    .split(',')
    .map((key) => key.trim())
    .filter(Boolean)
    .map((key) => Permission[key as keyof typeof Permission] ?? key);
}
