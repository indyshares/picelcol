import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/services/user.service";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      return NextResponse.json({ user: null });
    }

    const role = await getUserRole(data.user.id);

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        role,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
