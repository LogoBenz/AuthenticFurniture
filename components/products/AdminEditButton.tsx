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
        <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-2 bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800"
        >
            <Link href={`/admin/products?edit=${slug}`}>
                <Edit className="h-4 w-4" />
                Edit Product
            </Link>
        </Button>
    );
}
