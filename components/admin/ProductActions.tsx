"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product } from "@/types";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface ProductActionsProps {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (id: string | number) => void;
}

export function ProductActions({ product, onEdit, onDelete }: ProductActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(product)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => onDelete(product.id)}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
