"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";

interface AdminEditButtonProps {
    slug: string;
}

export function AdminEditButton({ slug }: AdminEditButtonProps) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            {/* Mobile: Floating Action Button (bottom-left to avoid WhatsApp on right) */}
            <Button
                asChild
                size="icon"
                className="md:hidden fixed bottom-6 left-6 z-50 rounded-full h-12 w-12 shadow-xl bg-yellow-400 text-yellow-950 hover:bg-yellow-500 border-2 border-yellow-200"
            >
                <Link href={`/admin/products?edit=${slug}`}>
                    <Edit className="h-6 w-6" />
                    <span className="sr-only">Edit Product</span>
                </Link>
            </Button>

            {/* Desktop: Inline Header Button */}
            <Button
                asChild
                variant="outline"
                size="sm"
                className="hidden md:inline-flex gap-2 bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800"
            >
                <Link href={`/admin/products?edit=${slug}`}>
                    <Edit className="h-4 w-4" />
                    Edit Product
                </Link>
            </Button>
        </>
    );
}
