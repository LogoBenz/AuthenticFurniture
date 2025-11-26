import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProductBySlug, getAllProducts } from "@/lib/products";
import { EnhancedProductGallery } from "@/components/products/EnhancedProductGallery";
import { EnhancedProductInfo } from "@/components/products/EnhancedProductInfo";
import { EnhancedProductTabs } from "@/components/products/EnhancedProductTabs";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { Breadcrumb } from "@/components/ui/breadcrumb";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  console.log('🔍 generateMetadata: Looking for product with slug:', slug);
  
  const product = await getProductBySlug(slug);
  
  if (!product) {
    console.log('❌ generateMetadata: Product not found for slug:', slug);
    return {
      title: 'Product Not Found | Authentic Furniture',
      description: 'The requested product could not be found.'
    };
  }

  console.log('✅ generateMetadata: Found product:', product.name);
  return {
    title: `${product.name} | Authentic Furniture`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  console.log('🔍 ProductPage: Looking for product with slug:', slug);
  
  let product = await getProductBySlug(slug);
  
  // If not found by slug, try to find by ID as fallback
  if (!product) {
    console.log('🔄 ProductPage: Not found by slug, trying to find by ID...');
    const allProducts = await getAllProducts();
    product = allProducts.find(p => p.id === slug) || null;
    
    if (product) {
      console.log('✅ ProductPage: Found product by ID:', product.name);
    } else {
      console.log('❌ ProductPage: Product not found by slug or ID:', slug);
    }
  } else {
    console.log('✅ ProductPage: Found product by slug:', product.name);
  }
  
  if (!product) {
    console.log('❌ ProductPage: Calling notFound() for slug:', slug);
    notFound();
  }

  return (
    <main className="pt-16 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumbs */}
        <Breadcrumb 
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: product.name }
          ]}
        />

        {/* Main Product Section */}
        <article className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 lg:gap-10 mb-12">
          {/* Product Gallery */}
          <section aria-label="Product images">
            <EnhancedProductGallery
              images={product.images}
              videos={product.videos}
              productName={product.name}
              category={product.category}
            />
          </section>

          {/* Product Info */}
          <section aria-label="Product information">
            <EnhancedProductInfo product={product} />
          </section>
        </article>

        {/* Product Tabs */}
        <section aria-label="Product details">
          <EnhancedProductTabs product={product} />
        </section>

        {/* Related Products */}
        <section aria-label="Related products">
          <RelatedProducts currentProduct={product} />
        </section>
      </div>
    </main>
  );
}
