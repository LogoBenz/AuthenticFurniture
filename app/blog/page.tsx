"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Calendar, 
  User, 
  Heart, 
  Eye, 
  Share2, 
  Filter,
  ChevronDown,
  BookOpen,
  TrendingUp,
  Clock
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
import { getAllBlogPosts, getAllBlogCategories, searchBlogPosts, likeBlogPost, formatBlogDate } from '@/lib/blog';
import { BlogPost, BlogCategory } from '@/types';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    loadBlogData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      loadBlogData();
    }
  }, [searchQuery, selectedCategory, sortBy]);

  const loadBlogData = async () => {
    try {
      setLoading(true);
      const [postsData, categoriesData] = await Promise.all([
        getAllBlogPosts(),
        getAllBlogCategories()
      ]);
      
      setPosts(postsData);
      setCategories(categoriesData);
      
      // Set featured post (first featured post)
      const featured = postsData.find(post => post.featured);
      setFeaturedPost(featured || null);
    } catch (error) {
      console.error('Error loading blog data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadBlogData();
      return;
    }

    try {
      setLoading(true);
      const searchResults = await searchBlogPosts(searchQuery);
      setPosts(searchResults);
    } catch (error) {
      console.error('Error searching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const userIp = 'anonymous'; // In a real app, you'd get this from the request
      await likeBlogPost(postId, userIp);
      
      // Update local state
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, likes: post.likes + 1 }
            : post
        )
      );
      
      if (featuredPost && featuredPost.id === postId) {
        setFeaturedPost(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleShare = async (post: BlogPost, platform: string) => {
    const url = `${window.location.origin}/blog/${post.slug}`;
    const text = `Check out this article: ${post.title}`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const filteredPosts = posts.filter(post => {
    if (selectedCategory === 'all') return true;
    return post.category === selectedCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'most_liked':
        return b.likes - a.likes;
      case 'most_viewed':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden">
                  <div className="h-48 bg-slate-200 dark:bg-slate-700"></div>
                  <div className="p-6">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Furniture Blog</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Tips, trends, and inspiration for your home and office
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Post */}
        {featuredPost && !searchQuery && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-yellow-500" />
              Featured Article
            </h2>
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-80">
                  <Image
                    src={featuredPost.featured_image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-yellow-500 text-white">Featured</Badge>
                  </div>
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatBlogDate(featuredPost.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {featuredPost.author}
                    </span>
                    <Badge variant="outline" style={{ borderColor: featuredPost.category_info?.color, color: featuredPost.category_info?.color }}>
                      {featuredPost.category_info?.name || featuredPost.category}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                    {featuredPost.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <button
                        onClick={() => handleLike(featuredPost.id)}
                        className="flex items-center gap-1 hover:text-red-500 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        {featuredPost.likes}
                      </button>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {featuredPost.views}
                      </span>
                    </div>
                    <Button asChild>
                      <Link href={`/blog/${featuredPost.slug}`}>Read More</Link>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
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
          <div className="flex-1">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="most_liked">Most Liked</SelectItem>
                <SelectItem value="most_viewed">Most Viewed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative h-48">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge 
                    variant="outline" 
                    style={{ 
                      borderColor: post.category_info?.color, 
                      color: post.category_info?.color,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }}
                  >
                    {post.category_info?.name || post.category}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatBlogDate(post.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {post.author}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-white line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1 hover:text-red-500 transition-colors"
                    >
                      <Heart className="w-3 h-3" />
                      {post.likes}
                    </button>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views}
                    </span>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleShare(post, 'facebook')}>
                        Facebook
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(post, 'twitter')}>
                        Twitter
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(post, 'linkedin')}>
                        LinkedIn
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(post, 'whatsapp')}>
                        WhatsApp
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <Button asChild className="w-full mt-4">
                  <Link href={`/blog/${post.slug}`}>Read Article</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedPosts.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No articles found
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {searchQuery ? 'Try adjusting your search terms' : 'Check back later for new content'}
            </p>
            {searchQuery && (
              <Button onClick={() => setSearchQuery('')} variant="outline">
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
