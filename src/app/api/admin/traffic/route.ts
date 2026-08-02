import { NextRequest, NextResponse } from "next/server";
import { getTrafficData, type TrafficRange } from "@/services/dashboard.service";
import { getCurrentAuthUser } from "@/features/auth/get-current-user";
import { isStaff } from "@/services/user.service";

const VALID_RANGES = new Set<TrafficRange>(["24h", "7d", "30d", "year", "all"]);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(req: NextRequest) {
  const user = await getCurrentAuthUser();
  if (!user || !(await isStaff(user.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sp = req.nextUrl.searchParams;
  const from = sp.get("from");
  const to = sp.get("to");

  if (from || to) {
    if (!from || !to || !ISO_DATE.test(from) || !ISO_DATE.test(to)) {
      return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
    }
    try {
      const data = await getTrafficData({ from, to });
      return NextResponse.json(data);
    } catch {
      return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
    }
  }

  const range = (sp.get("range") ?? "30d") as TrafficRange;
  if (!VALID_RANGES.has(range)) {
    return NextResponse.json({ error: "Invalid range" }, { status: 400 });
  }

  const data = await getTrafficData({ range });
  return NextResponse.json(data);
}
