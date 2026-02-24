import { auth } from "@/auth";
import { Role } from "@/prisma/generated/client";

export async function getCurrentSession() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized - No active session");
  }
  return session;
}

export async function requireRole(allowedRole: Role) {
  const session = await getCurrentSession();
  
  if (session.user.role !== allowedRole) {
    throw new Error(`Forbidden - Required role: ${allowedRole}`);
  }
  
  return session;
}

export async function requireAdmin() {
  return requireRole(Role.ADMIN);
}

export function getUserId() {
  return auth().then((session) => {
    if (!session?.user?.id) {
      throw new Error("Unauthorized - No user ID in session");
    }
    return session.user.id;
  });
}

