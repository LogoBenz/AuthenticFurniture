"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  User,
  Heart,
  Eye as EyeIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getAllBlogPostsAdmin, getAllBlogCategories, deleteBlogPost, updateBlogPost, createBlogPost, formatBlogDate } from '@/lib/blog';
import { BlogPost, BlogCategory } from '@/types';
import { toast } from 'sonner';

export const dynamic = 'force-dynamic';

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    video_url: '',
    author: 'Authentic Furniture Team',
    category: 'general',
    published: false,
    featured: false
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [postsData, categoriesData] = await Promise.all([
        getAllBlogPostsAdmin(),
        getAllBlogCategories()
      ]);

      setPosts(postsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading blog data:', error);
      toast.error('Failed to load blog data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    try {
      const newPost = await createBlogPost(formData);
      if (newPost) {
        setPosts(prev => [newPost, ...prev]);
      }
      setShowCreateModal(false);
      resetForm();
      toast.success('Blog post created successfully');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create blog post');
    }
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;

    try {
      const updatedPost = await updateBlogPost(editingPost.id, formData);
      if (updatedPost) {
        setPosts(prev => prev.map(p => p.id === editingPost.id ? updatedPost : p));
        setEditingPost(null);
        resetForm();
        toast.success('Blog post updated successfully');
      } else {
        toast.error('Failed to update blog post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update blog post');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await deleteBlogPost(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
      toast.success('Blog post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete blog post');
    }
  };

  const handleTogglePublished = async (post: BlogPost) => {
    try {
      const updatedPost = await updateBlogPost(post.id, { published: !post.published });
      if (updatedPost) {
        setPosts(prev => prev.map(p => p.id === post.id ? updatedPost : p));
        toast.success(`Post ${updatedPost.published ? 'published' : 'unpublished'}`);
      } else {
        toast.error('Failed to update post status');
      }
    } catch (error) {
      console.error('Error toggling published status:', error);
      toast.error('Failed to update post status');
    }
  };

  const handleToggleFeatured = async (post: BlogPost) => {
    try {
      const updatedPost = await updateBlogPost(post.id, { featured: !post.featured });
      if (updatedPost) {
        setPosts(prev => prev.map(p => p.id === post.id ? updatedPost : p));
        toast.success(`Post ${updatedPost.featured ? 'featured' : 'unfeatured'}`);
      } else {
        toast.error('Failed to update featured status');
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast.error('Failed to update featured status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image: '',
      video_url: '',
      author: 'Authentic Furniture Team',
      category: 'general',
      published: false,
      featured: false
    });
  };

  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featured_image: post.featured_image,
      video_url: post.video_url || '',
      author: post.author,
      category: post.category,
      published: post.published,
      featured: post.featured
    });
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-lg p-6">
                <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Blog Management</h1>
          <p className="text-slate-600 dark:text-slate-300">Manage your blog posts and content</p>
        </div>

        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
            </DialogHeader>
            <BlogPostForm
              formData={formData}
              setFormData={setFormData}
              categories={categories}
              onSubmit={handleCreatePost}
              onCancel={() => setShowCreateModal(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex-1">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                {post.published && (
                  <Badge className="bg-green-500">Published</Badge>
                )}
                {post.featured && (
                  <Badge className="bg-yellow-500">Featured</Badge>
                )}
              </div>
            </div>

            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatBlogDate(post.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {post.author}
                </span>
              </div>

              <h3 className="font-semibold mb-2 text-slate-900 dark:text-white line-clamp-2">
                {post.title}
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <EyeIcon className="w-3 h-3" />
                    {post.views}
                  </span>
                </div>
                <Badge variant="outline" style={{ borderColor: post.category_info?.color, color: post.category_info?.color }}>
                  {post.category_info?.name || post.category}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTogglePublished(post)}
                >
                  {post.published ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleFeatured(post)}
                >
                  {post.featured ? <StarOff className="w-3 h-3" /> : <Star className="w-3 h-3" />}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditModal(post)}>
                      <Edit className="w-3 h-3 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-3 h-3 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            No blog posts found
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            {searchQuery ? 'Try adjusting your search terms' : 'Create your first blog post to get started'}
          </p>
          {!searchQuery && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Post
            </Button>
          )}
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
          </DialogHeader>
          <BlogPostForm
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            onSubmit={handleUpdatePost}
            onCancel={() => setEditingPost(null)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Blog Post Form Component
function BlogPostForm({
  formData,
  setFormData,
  categories,
  onSubmit,
  onCancel
}: {
  formData: any;
  setFormData: (data: any) => void;
  categories: BlogCategory[];
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => {
              handleInputChange('title', e.target.value);
              if (!formData.slug) {
                handleInputChange('slug', generateSlug(e.target.value));
              }
            }}
            placeholder="Enter blog post title"
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            placeholder="url-friendly-slug"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => handleInputChange('excerpt', e.target.value)}
          placeholder="Brief description of the post"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          placeholder="Write your blog post content here..."
          rows={10}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="featured_image">Featured Image URL</Label>
          <Input
            id="featured_image"
            value={formData.featured_image}
            onChange={(e) => handleInputChange('featured_image', e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <Label htmlFor="video_url">Video URL (Optional)</Label>
          <Input
            id="video_url"
            value={formData.video_url}
            onChange={(e) => handleInputChange('video_url', e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => handleInputChange('author', e.target.value)}
            placeholder="Author name"
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="published"
            checked={formData.published}
            onCheckedChange={(checked) => handleInputChange('published', checked)}
          />
          <Label htmlFor="published">Published</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => handleInputChange('featured', checked)}
          />
          <Label htmlFor="featured">Featured</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {formData.title ? 'Update Post' : 'Create Post'}
        </Button>
      </div>
    </div>
  );
}
