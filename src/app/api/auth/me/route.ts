import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
