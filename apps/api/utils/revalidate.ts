export const triggerRevalidation = async (): Promise<void> => {
    try {
        const nextUrl = process.env.NODE_ENV === "production"
            ? "https://portfolio-website-web-five.vercel.app" 
            : "http://localhost:3000";

        const response = await fetch(`${nextUrl}/api/revalidate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.JWT_KEY}`
            }
        });

        if (!response.ok) {
            console.error("Revalidation failed with status:", response.status);
        } else {
            console.log("Next.js cache revalidated successfully");
        }
    } catch (error) {
        console.error("Error triggering revalidation:", error);
    }
};
