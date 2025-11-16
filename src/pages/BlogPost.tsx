import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, Eye, ArrowLeft, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image_url: string | null;
  published_at: string;
  read_time_minutes: number | null;
  view_count: number;
  tags: string[] | null;
  meta_title: string | null;
  meta_description: string | null;
  blog_categories: {
    name: string;
    slug: string;
  } | null;
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select(`
        *,
        blog_categories (
          name,
          slug
        )
      `)
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (data) {
      setPost(data);
      
      // Increment view count
      await supabase
        .from("blog_posts")
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq("id", data.id);

      // Fetch related posts
      if (data.category_id) {
        const { data: related } = await supabase
          .from("blog_posts")
          .select("*, blog_categories(*)")
          .eq("category_id", data.category_id)
          .eq("status", "published")
          .neq("id", data.id)
          .limit(3);
        
        if (related) setRelatedPosts(related);
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "The article link has been copied to your clipboard.",
    });
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-16 px-4">
        <article className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Hero Image */}
          {post.featured_image_url && (
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          )}

          {/* Post Header */}
          <div className="mb-8">
            {post.blog_categories && (
              <Badge className="mb-4">{post.blog_categories.name}</Badge>
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.published_at).toLocaleDateString()}
              </div>
              {post.read_time_minutes && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.read_time_minutes} min read
                </div>
              )}
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.view_count} views
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>

          {/* Post Content */}
          <div 
            className="prose prose-invert prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-12">
              <h3 className="text-sm font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="block group"
                  >
                    <div className="glass-card overflow-hidden h-full hover:border-acari-green/50 transition-all">
                      {relatedPost.featured_image_url && (
                        <img
                          src={relatedPost.featured_image_url}
                          alt={relatedPost.title}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-bold mb-2 group-hover:text-acari-green transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}