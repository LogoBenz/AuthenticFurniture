"use client";

import { useEffect, useState } from "react";
import { getAllProducts, updateProduct, getProductBySlug } from "@/lib/products";
import { Product } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, { original_price?: string; discount_percent?: string; is_promo?: boolean; is_best_seller?: boolean }>>({});

  useEffect(() => {
    (async () => {
      try {
        const list = await getAllProducts();
        setProducts(list);
        const initial: any = {};
        list.forEach((p: any) => {
          initial[p.id] = {
            original_price: String((p as any).original_price ?? p.price ?? ""),
            discount_percent: String((p as any).discount_percent ?? 0),
            is_promo: Boolean((p as any).is_promo),
            is_best_seller: Boolean((p as any).is_best_seller),
          };
        });
        setForm(initial);
      } finally { setLoading(false); }
    })();
  }, []);

  const save = async (p: Product) => {
    setSavingId(p.id);
    try {
      const f = form[p.id] || {};
      console.log('🔄 Saving product:', p.id, 'with form data:', f);
      
      const updateData = {
        is_promo: f.is_promo,
        is_best_seller: f.is_best_seller,
        original_price: f.original_price ? Number(f.original_price) : undefined,
        discount_percent: f.discount_percent ? Number(f.discount_percent) : undefined,
      };
      
      console.log('🔄 Update data to send:', updateData);
      // Prefer ID; if missing/invalid, resolve via slug
      let targetId: string | number | null = p.id as any;
      const idInvalid = !targetId || (typeof targetId === 'string' && targetId.trim() === '') || (typeof targetId === 'number' && !Number.isFinite(targetId));
      if (idInvalid) {
        console.warn('⚠️ Missing/invalid product ID. Attempting lookup by slug:', p.slug);
        const bySlug = await getProductBySlug(p.slug);
        if (!bySlug || !bySlug.id) {
          throw new Error('Could not resolve product ID by slug.');
        }
        targetId = bySlug.id as any;
        console.log('✅ Resolved ID via slug:', targetId);
      }

      await updateProduct(targetId as any, updateData);
      alert("Saved successfully!");
    } catch (e) {
      console.error('❌ Save error:', e);
      alert(`Failed to save: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally { 
      setSavingId(null); 
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-6 grid gap-4">
      <h1 className="text-2xl font-bold">Products</h1>
      {products.map((p: any) => (
        <Card key={p.id}>
          <CardHeader>
            <CardTitle className="text-base">{p.name}</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-4 gap-3">
            <div>
              <Label>Original Price</Label>
              <Input
                value={form[p.id]?.original_price ?? ""}
                onChange={(e) => setForm({ ...form, [p.id]: { ...form[p.id], original_price: e.target.value } })}
              />
            </div>
            <div>
              <Label>Discount %</Label>
              <Input
                value={form[p.id]?.discount_percent ?? "0"}
                onChange={(e) => setForm({ ...form, [p.id]: { ...form[p.id], discount_percent: e.target.value } })}
              />
            </div>
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!form[p.id]?.is_promo} onChange={(e) => setForm({ ...form, [p.id]: { ...form[p.id], is_promo: e.target.checked } })} />
                Promo Product
              </label>
            </div>
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!form[p.id]?.is_best_seller} onChange={(e) => setForm({ ...form, [p.id]: { ...form[p.id], is_best_seller: e.target.checked } })} />
                Best Seller
              </label>
            </div>
            <div className="sm:col-span-4">
              <Button onClick={() => save(p)} disabled={savingId === p.id} className="bg-blue-600 hover:bg-blue-700">
                {savingId === p.id ? "Saving..." : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


