"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, AlertCircle, Database, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getProductCategories } from "@/lib/db";
import { MultiImageUpload } from "@/components/products/MultiImageUpload";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  imageUrl: string;
  productCount: number;
  createdAt: string;
}

function CategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
  });
  const [categoryImages, setCategoryImages] = useState<string[]>([]);

  useEffect(() => {
    // Check if Supabase is configured
    const checkSupabaseConfig = () => {
      if (typeof window !== 'undefined') {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        return !!(supabaseUrl && supabaseKey && supabaseUrl !== '' && supabaseKey !== '' && supabaseUrl.includes('supabase.co'));
      }
      return false;
    };
    
    setIsSupabaseConfigured(checkSupabaseConfig());
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      // Get existing categories from products
      const productCategories = await getProductCategories();
      
      // Mock category data with cover images (in real app, this would come from categories table)
      const mockCategories: Category[] = productCategories.map((category, index) => ({
        id: `cat-${index + 1}`,
        name: category,
        imageUrl: getCategoryImageUrl(category),
        productCount: Math.floor(Math.random() * 20) + 1,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }));
      
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get default category images
  const getCategoryImageUrl = (categoryName: string): string => {
    const categoryImages: Record<string, string> = {
      "Office Chairs": "https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "Lounge Chairs": "https://images.pexels.com/photos/2762247/pexels-photo-2762247.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "Gaming Chairs": "https://images.pexels.com/photos/5082573/pexels-photo-5082573.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "Public Seating": "https://images.pexels.com/photos/3771110/pexels-photo-3771110.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "Conference Furniture": "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "Tables": "https://images.pexels.com/photos/2647714/pexels-photo-2647714.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "Living Room": "https://images.pexels.com/photos/4352247/pexels-photo-4352247.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "Outdoor Furniture": "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "Office Furniture": "https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "Game Furniture": "https://images.pexels.com/photos/60912/pexels-photo-60912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    };
    
    return categoryImages[categoryName] || "https://images.pexels.com/photos/276651/pexels-photo-276651.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  };

  const resetForm = () => {
    setFormData({
      name: "",
      imageUrl: "",
    });
    setEditingCategory(null);
    setCategoryImages([]);
  };

  const handleEdit = (category: Category) => {
    if (!isSupabaseConfigured) {
      alert("Supabase is not configured. Please set up your database to edit categories.");
      return;
    }
    
    setEditingCategory(category);
    setFormData({
      name: category.name,
      imageUrl: category.imageUrl,
    });
    setCategoryImages(category.imageUrl ? [category.imageUrl] : []);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSupabaseConfigured) {
      alert("Supabase is not configured. Please set up your database to manage categories.");
      return;
    }

    // Validate required fields
    if (!formData.name.trim()) {
      alert("Please enter a category name.");
      return;
    }

    if (categoryImages.length === 0) {
      alert("Please add a cover image for the category.");
      return;
    }

    const categoryData = {
      name: formData.name.trim(),
      imageUrl: categoryImages[0], // Use first image as cover
    };

    try {
      if (editingCategory) {
        // In a real app, you would call updateCategory API
        console.log('🔄 Updating category:', editingCategory.id, categoryData);
        alert('Category updated successfully! (This is a demo - database integration required)');
      } else {
        // In a real app, you would call createCategory API
        console.log('🔄 Creating new category:', categoryData);
        alert('Category created successfully! (This is a demo - database integration required)');
      }

      setIsDialogOpen(false);
      resetForm();
      // In a real app, you would reload categories from the database
      // loadCategories();
    } catch (error) {
      console.error('❌ Category save error:', error);
      alert('Error saving category. Please try again.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!isSupabaseConfigured) {
      alert("Supabase is not configured. Please set up your database to delete categories.");
      return;
    }
    
    if (confirm(`Are you sure you want to delete the "${name}" category? This action cannot be undone.`)) {
      try {
        // In a real app, you would call deleteCategory API
        console.log('🗑️ Deleting category:', id);
        alert('Category deleted successfully! (This is a demo - database integration required)');
        // In a real app, you would reload categories from the database
        // loadCategories();
      } catch (error) {
        console.error('❌ Delete error:', error);
        alert('Error deleting category. Please try again.');
      }
    }
  };

  const openAddDialog = () => {
    if (!isSupabaseConfigured) {
      alert("Supabase is not configured. Please set up your database to add categories.");
      return;
    }
    
    resetForm();
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {!isSupabaseConfigured && (
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>Database Setup Required:</strong> You're viewing sample data. To manage categories with cover photos, you need to:
            <br />
            <span className="mt-2 block">
              1. Create a <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">categories</code> table in your Supabase database
              <br />
              2. Add API functions for category management in <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">lib/db.ts</code>
              <br />
              3. Update the frontend Categories component to use the new data source
            </span>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Category Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            {isSupabaseConfigured ? "Manage product categories and their cover photos" : "Viewing sample data - Database setup required for full functionality"}
          </p>
        </div>
        
        <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700" disabled={!isSupabaseConfigured}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Category Details */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Office Chairs, Living Room"
                    required
                  />
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Category Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Categories help organize your products and make them easier for customers to find. 
                    The cover photo will be displayed on the homepage and category pages.
                  </p>
                </div>
              </div>

              {/* Right Column - Cover Image */}
              <div>
                <Label>Category Cover Photo</Label>
                <MultiImageUpload
                  images={categoryImages}
                  onImagesChange={setCategoryImages}
                  maxImages={1}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  This image will be used as the category cover on your website.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleDialogClose(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={categoryImages.length === 0}
              >
                {editingCategory ? "Update" : "Create"} Category
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-48 bg-slate-100 dark:bg-slate-800">
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-semibold text-lg drop-shadow-lg">
                  {category.name}
                </h3>
                <p className="text-white/90 text-sm drop-shadow">
                  {category.productCount} products
                </p>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Created: {category.createdAt}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(category)}
                    disabled={!isSupabaseConfigured}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(category.id, category.name)}
                    className="text-red-600 hover:text-red-700"
                    disabled={!isSupabaseConfigured}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {categories.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No categories found</h3>
          <p className="text-muted-foreground mb-4">
            Create your first category to organize your products
          </p>
          <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700" disabled={!isSupabaseConfigured}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Category
          </Button>
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <ProtectedRoute>
      <CategoriesContent />
    </ProtectedRoute>
  );
}