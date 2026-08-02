import { NextRequest, NextResponse } from "next/server";
import { getActivityPage } from "@/services/dashboard.service";
import { getCurrentAuthUser } from "@/features/auth/get-current-user";
import { isAdmin } from "@/services/user.service";

export async function GET(req: NextRequest) {
  const user = await getCurrentAuthUser();
  if (!user || !(await isAdmin(user.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sp = req.nextUrl.searchParams;
  const rawPage = sp.get("page");
  const page = rawPage ? Math.max(1, Number.parseInt(rawPage, 10) || 1) : 1;
  const rawSince = sp.get("since");
  const since = rawSince && /^\d+$/.test(rawSince) ? Number(rawSince) : undefined;

  const data = await getActivityPage({ page, since });
  return NextResponse.json(data);
}
