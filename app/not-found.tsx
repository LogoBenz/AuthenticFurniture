import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          We're sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="bg-amber-700 hover:bg-amber-800 text-white">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}