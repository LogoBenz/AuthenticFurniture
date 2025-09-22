"use client";

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, 
  User, 
  Heart, 
  Eye, 
  Share2, 
  ArrowLeft,
  Clock,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { getBlogPostBySlug, getAllBlogPosts, likeBlogPost, incrementBlogPostViews, formatBlogDate } from '@/lib/blog';
import { BlogPost } from '@/types';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const postData = await getBlogPostBySlug(slug);
      
      if (!postData) {
        notFound();
      }
      
      setPost(postData);
      
      // Increment view count
      await incrementBlogPostViews(postData.id);
      
      // Load related posts
      const allPosts = await getAllBlogPosts();
      const related = allPosts
        .filter(p => p.id !== postData.id && p.category === postData.category)
        .slice(0, 3);
      setRelatedPosts(related);
      
    } catch (error) {
      console.error('Error loading blog post:', error);
      notFound();
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post || liked) return;
    
    try {
      const userIp = 'anonymous'; // In a real app, you'd get this from the request
      await likeBlogPost(post.id, userIp);
      
      setPost(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
      setLiked(true);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleShare = async (platform: string) => {
    if (!post) return;
    
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/blog" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </Button>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4 text-sm text-slate-500 dark:text-slate-400">
              <Badge 
                variant="outline" 
                style={{ 
                  borderColor: post.category_info?.color, 
                  color: post.category_info?.color 
                }}
              >
                {post.category_info?.name || post.category}
              </Badge>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatBlogDate(post.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                5 min read
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                <button
                  onClick={handleLike}
                  disabled={liked}
                  className={`flex items-center gap-2 hover:text-red-500 transition-colors ${
                    liked ? 'text-red-500' : ''
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                  {post.likes} {post.likes === 1 ? 'like' : 'likes'}
                </button>
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {post.views} views
                </span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleShare('facebook')}>
                    Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('twitter')}>
                    Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('linkedin')}>
                    LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
                    WhatsApp
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Content */}
          <div className="prose dark:prose-invert lg:prose-lg max-w-none">
            <div 
              className="text-slate-700 dark:text-slate-300 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: post.content.replace(/\n/g, '<br />') 
              }}
            />
          </div>

          {/* Video Section */}
          {post.video_url && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                Watch Video
              </h3>
              <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
                <iframe
                  src={post.video_url}
                  title={post.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Category:
              </span>
              <Badge 
                variant="outline" 
                style={{ 
                  borderColor: post.category_info?.color, 
                  color: post.category_info?.color 
                }}
              >
                {post.category_info?.name || post.category}
              </Badge>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
                Related Articles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={relatedPost.featured_image}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2 text-slate-900 dark:text-white line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <Button asChild size="sm" className="w-full">
                        <Link href={`/blog/${relatedPost.slug}`}>
                          Read More
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog */}
          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href="/blog" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to All Articles
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
