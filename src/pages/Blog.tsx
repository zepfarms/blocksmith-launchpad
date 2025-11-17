import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/runtimeClient";
import { Link } from "react-router-dom";
import { Calendar, Clock, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url: string | null;
  published_at: string;
  read_time_minutes: number | null;
  view_count: number;
  blog_categories: {
    name: string;
    slug: string;
  } | null;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("blog_categories")
      .select("*")
      .order("display_order");
    
    if (data) setCategories(data);
  };

  const fetchPosts = async () => {
    let query = supabase
      .from("blog_posts")
      .select(`
        *,
        blog_categories (
          name,
          slug
        )
      `)
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (selectedCategory) {
      const category = categories.find(c => c.slug === selectedCategory);
      if (category) {
        query = query.eq("category_id", category.id);
      }
    }

    const { data } = await query;

    if (data && data.length > 0) {
      setFeaturedPost(data[0]);
      setPosts(data.slice(1));
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-acari-green to-neon-cyan bg-clip-text text-transparent">
              Acari Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Insights, tips, and resources for entrepreneurs
            </p>
          </div>

          {/* Search and Category Filters */}
          <div className="mb-8 space-y-4">
            <Input
              type="search"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md mx-auto"
            />
            
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge
                variant={selectedCategory === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={selectedCategory === category.slug ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category.slug)}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Featured Post */}
          {featuredPost && !searchQuery && (
            <Link to={`/blog/${featuredPost.slug}`} className="block mb-12">
              <div className="glass-card overflow-hidden hover:border-acari-green/50 transition-all">
                {featuredPost.featured_image_url && (
                  <img
                    src={featuredPost.featured_image_url}
                    alt={featuredPost.title}
                    className="w-full h-96 object-cover"
                  />
                )}
                <div className="p-8">
                  {featuredPost.blog_categories && (
                    <Badge className="mb-4">{featuredPost.blog_categories.name}</Badge>
                  )}
                  <h2 className="text-3xl font-bold mb-4 hover:text-acari-green transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground mb-4">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(featuredPost.published_at).toLocaleDateString()}
                    </div>
                    {featuredPost.read_time_minutes && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredPost.read_time_minutes} min read
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {featuredPost.view_count} views
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="block group"
              >
                <div className="glass-card overflow-hidden h-full hover:border-acari-green/50 transition-all">
                  {post.featured_image_url && (
                    <img
                      src={post.featured_image_url}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                    />
                  )}
                  <div className="p-6">
                    {post.blog_categories && (
                      <Badge className="mb-3">{post.blog_categories.name}</Badge>
                    )}
                    <h3 className="text-xl font-bold mb-2 group-hover:text-acari-green transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.published_at).toLocaleDateString()}
                      </div>
                      {post.read_time_minutes && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.read_time_minutes} min
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found. Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}