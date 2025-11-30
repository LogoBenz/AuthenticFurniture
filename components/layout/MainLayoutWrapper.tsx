"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface MainLayoutWrapperProps {
    children: React.ReactNode;
}

export function MainLayoutWrapper({ children }: MainLayoutWrapperProps) {
    const pathname = usePathname();
    const isAdminArea = pathname?.startsWith("/admin");

    return (
        <main
            className={cn(
                "flex-grow",
                isAdminArea ? "pt-[60px]" : "pt-[90px] md:pt-[95px]"
            )}
        >
            {children}
        </main>
    );
}
