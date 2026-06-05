import { NextRequest, NextResponse } from "next/server";

export const proxy = (req: NextRequest) => {
    const token = req.cookies.get("PortfolioAdmin")?.value;
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
};

export const config = {
    matcher: ["/admin/:path*"]
};
