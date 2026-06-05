import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
    user?: {
        _id?: string;
        id?: string;
        role?: string;
    };
}

export const protectAdmin = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let token = req.cookies?.PortfolioAdmin;

        // Also check Authorization header for mobile app support
        if (!token && req.headers.authorization) {
            const parts = req.headers.authorization.split(" ");
            if (parts[0] === "Bearer" && parts[1]) {
                token = parts[1];
            }
        }

        if (!token) {
            res.status(401).json({ message: "Access denied. No token provided." });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY as string) as { _id?: string; id?: string; role?: string };
        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token." });
    }
};
