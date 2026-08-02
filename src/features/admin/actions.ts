"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentAuthUser } from "@/features/auth/get-current-user";
import { isAdmin } from "@/services/user.service";

export type UserRoleName = "admin" | "writer" | "user";

const VALID_ROLES: UserRoleName[] = ["admin", "writer", "user"];

export type UpdateRoleResult = { error?: string } | null;

export async function updateUserRole(
  targetUserId: string,
  newRole: UserRoleName,
): Promise<UpdateRoleResult> {
  try {
    const authUser = await getCurrentAuthUser();
    if (!authUser) {
      return { error: "ต้องเข้าสู่ระบบก่อน" };
    }
    if (!(await isAdmin(authUser.id))) {
      return { error: "เฉพาะผู้ดูแลระบบเท่านั้นที่เปลี่ยนบทบาทได้" };
    }
    if (targetUserId === authUser.id) {
      return { error: "ไม่สามารถเปลี่ยนบทบาทของตัวเองได้" };
    }
    if (!VALID_ROLES.includes(newRole)) {
      return { error: "บทบาทไม่ถูกต้อง" };
    }

    await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
    });

    revalidatePath("/admin/users");
    return null;
  } catch {
    return { error: "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง" };
  }
}
