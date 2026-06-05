import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        
        // Simple security check using the JWT_KEY as a shared secret
        if (authHeader !== `Bearer ${process.env.JWT_KEY}`) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Revalidate the home page and about page
        revalidatePath("/");
        revalidatePath("/aboutme");

        return NextResponse.json({ revalidated: true, now: Date.now() });
    } catch (err) {
        const error = err as Error;
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
