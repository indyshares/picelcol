"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentAuthUser } from "@/features/auth/get-current-user";

type State = { error?: string } | null;

export async function updateProfileAction(_prev: State, formData: FormData): Promise<State> {
  try {
    const authUser = await getCurrentAuthUser();
    if (!authUser) {
      return { error: "ต้องเข้าสู่ระบบก่อน" };
    }

    const displayName = formData.get("displayName")
      ? String(formData.get("displayName")).trim()
      : null;

    const updateData: Record<string, string> = {};
    if (displayName !== null) updateData.displayName = displayName;

    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({
        where: { id: authUser.id },
        data: updateData,
      });
    }

    revalidatePath("/profile");
    return { error: undefined };
  } catch {
    return { error: "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง" };
  }
}
