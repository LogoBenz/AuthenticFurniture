import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProductBySlug, formatPrice, getAllProducts } from "@/lib/products";
import { ProductPageClient } from "@/components/products/ProductPageClient";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  
  if (!product) {
    return {
      title: 'Product Not Found | Authentic Furniture',
      description: 'The requested product could not be found.'
    };
  }

  return {
    title: `${product.name} | Authentic Furniture`,
    description: product.description,
  };
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  
  if (!product) {
    notFound();
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative h-96 md:h-[600px] bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{product.category}</p>
              <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
              <p className="text-2xl font-semibold mt-2">{formatPrice(product.price)}</p>
            </div>

            <div className="border-t border-b py-6 border-slate-200 dark:border-slate-800">
              <h2 className="font-medium text-lg mb-2">Description</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {product.features && product.features.length > 0 && (
              <div>
                <h2 className="font-medium text-lg mb-2">Features</h2>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Client-side cart functionality */}
            <ProductPageClient product={product} />

            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg mt-8">
              <p className="text-sm text-muted-foreground">
                For custom orders, bulk purchases, or more information about this product,
                please contact our sales team using the cart enquiry system or visit our showroom.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}