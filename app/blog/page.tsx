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
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-800/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading tracking-tight">
              Furniture <span className="text-blue-400">Blog</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-slate-300 max-w-2xl mx-auto font-light">
              Expert tips, design trends, and inspiration for your modern home and office.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:bg-white/10 focus:border-blue-500/50 rounded-xl transition-all shadow-lg backdrop-blur-sm"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Featured Post */}
        {featuredPost && !searchQuery && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Featured Article
              </h2>
            </div>

            <Card className="overflow-hidden border-none shadow-xl bg-white dark:bg-slate-900 group">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative h-72 lg:h-auto overflow-hidden">
                  <Image
                    src={featuredPost.featured_image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden"></div>
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-none px-3 py-1">
                      Featured
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-6 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      {formatBlogDate(featuredPost.created_at)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-blue-600" />
                      {featuredPost.author}
                    </span>
                    <Badge variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                      {featuredPost.category_info?.name || featuredPost.category}
                    </Badge>
                  </div>

                  <Link href={`/blog/${featuredPost.slug}`} className="group-hover:text-blue-700 transition-colors">
                    <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white font-heading leading-tight">
                      {featuredPost.title}
                    </h3>
                  </Link>

                  <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed text-lg">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                      <button
                        onClick={() => handleLike(featuredPost.id)}
                        className="flex items-center gap-2 hover:text-red-500 transition-colors group/like"
                      >
                        <Heart className="w-5 h-5 group-hover/like:fill-current" />
                        <span className="font-medium">{featuredPost.likes}</span>
                      </button>
                      <span className="flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        <span className="font-medium">{featuredPost.views}</span>
                      </span>
                    </div>
                    <Button asChild className="bg-slate-900 hover:bg-blue-800 text-white transition-colors">
                      <Link href={`/blog/${featuredPost.slug}`}>
                        Read Article <TrendingUp className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-5 h-5 text-slate-400" />
            <span className="font-medium text-slate-700 dark:text-slate-300 mr-2">Filter:</span>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px] border-slate-200 dark:border-slate-700">
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

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="font-medium text-slate-700 dark:text-slate-300 mr-2">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] border-slate-200 dark:border-slate-700">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 group border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge
                      className="bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-sm border-none shadow-sm"
                    >
                      {post.category_info?.name || post.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatBlogDate(post.created_at)}
                    </span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      5 min read
                    </span>
                  </div>

                  <Link href={`/blog/${post.slug}`} className="group-hover:text-blue-700 transition-colors">
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white line-clamp-2 font-heading">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1.5 hover:text-red-500 transition-colors group/like"
                      >
                        <Heart className="w-4 h-4 group-hover/like:fill-current" />
                        {post.likes}
                      </button>
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        {post.views}
                      </span>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                          <Share2 className="w-4 h-4 text-slate-500" />
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
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {sortedPosts.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 font-heading">
              No articles found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
              {searchQuery ? `We couldn't find any articles matching "${searchQuery}". Try adjusting your search terms.` : 'Check back later for new content.'}
            </p>
            {searchQuery && (
              <Button onClick={() => setSearchQuery('')} variant="outline" className="border-slate-200 hover:bg-slate-50">
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
