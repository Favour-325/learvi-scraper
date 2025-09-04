"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    /* This component protects routes by checking authentication status
    It automatically redirects unauthenticated users to login */

    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-900"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        router.push("/login")
        return // To ensure that the component always returns a valid JSX object
    }

    return <>{children}</>;
}

// withRouter() injects the Next.js router object into the props of the component.