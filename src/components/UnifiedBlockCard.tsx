import { ExternalLink, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/runtimeClient";
import { toast } from "sonner";

interface Block {
  id: string;
  name: string;
  subtitle?: string | null;
  description: string;
  category: string;
  logo_url?: string | null;
  affiliate_link?: string | null;
  block_type: 'internal' | 'affiliate';
  internal_route?: string | null;
  pricing_type: 'free' | 'one_time' | 'monthly';
  price_cents: number;
  monthly_price_cents: number;
  click_count?: number | null;
  tags?: string[] | null;
  is_featured?: boolean;
}

interface UnifiedBlockCardProps {
  block: Block;
  context: 'public' | 'app-store' | 'my-apps' | 'onboarding';
  isSelected?: boolean;
  isOwned?: boolean;
  onSelect?: () => void;
  onClick?: () => void;
  completionStatus?: 'not_started' | 'in_progress' | 'completed';
}

const categoryColors: Record<string, string> = {
  'Foundation': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Partnership': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  'Finance': 'bg-green-500/10 text-green-500 border-green-500/20',
  'Legal': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Growth': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  'Brand': 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  'Web': 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
};

export const UnifiedBlockCard = ({
  block,
  context,
  isSelected,
  isOwned,
  onSelect,
  onClick,
  completionStatus,
}: UnifiedBlockCardProps) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    if (onClick) {
      onClick();
      return;
    }

    // Handle affiliate blocks
    if (block.block_type === 'affiliate' && block.affiliate_link) {
      // Track click
      await supabase.from('affiliate_clicks').insert({
        block_id: block.id,
      });

      if (context === 'public') {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/start');
          return;
        }
      }

      // Auto-unlock for authenticated users
      if (context === 'app-store' || context === 'onboarding') {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Get user's first business
          const { data: business } = await supabase
            .from('user_businesses')
            .select('id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true })
            .limit(1)
            .maybeSingle();

          if (business) {
            await supabase.from('user_block_unlocks').insert({
              user_id: user.id,
              business_id: business.id,
              block_name: block.name,
              unlock_type: 'partner',
            }).then(() => {
              toast.success(`${block.name} unlocked!`);
            });
          }
        }
      }

      window.open(block.affiliate_link, '_blank');
      return;
    }

    // Handle internal blocks
    if (block.block_type === 'internal' && block.internal_route) {
      if (context === 'public') {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/start');
          return;
        }
      }
      navigate(block.internal_route);
    }
  };

  const getActionButton = () => {
    if (context === 'public') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="w-full py-2.5 px-4 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
        >
          Sign up to access
          <ArrowRight className="h-4 w-4" />
        </button>
      );
    }

    if (context === 'app-store') {
      if (block.block_type === 'affiliate') {
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="w-full py-2.5 px-4 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
          >
            Visit Partner
            <ExternalLink className="h-4 w-4" />
          </button>
        );
      } else {
        const priceText = block.pricing_type === 'free' 
          ? 'FREE' 
          : block.pricing_type === 'monthly' 
          ? `$${(block.monthly_price_cents / 100).toFixed(2)}/mo`
          : `$${(block.price_cents / 100).toFixed(2)}`;
        
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="w-full py-2.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
          >
            {priceText} - Add to Business
            <ArrowRight className="h-4 w-4" />
          </button>
        );
      }
    }

    if (context === 'my-apps') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="w-full py-2.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
        >
          {block.block_type === 'affiliate' ? 'Visit' : 'Launch'}
          {block.block_type === 'affiliate' ? <ExternalLink className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
        </button>
      );
    }

    if (context === 'onboarding' && onSelect) {
      return null; // Checkbox handles selection in onboarding
    }

    return null;
  };

  return (
    <div
      onClick={context === 'onboarding' ? onSelect : undefined}
      className={cn(
        "relative p-6 rounded-xl border transition-all duration-300 cursor-pointer group",
        isSelected 
          ? "bg-primary/5 border-primary shadow-lg" 
          : "bg-card/50 border-border/50 hover:bg-card/80 hover:border-border",
        "backdrop-blur-sm"
      )}
    >
      {/* Selection indicator for onboarding */}
      {context === 'onboarding' && (
        <div className={cn(
          "absolute top-4 right-4 w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
          isSelected ? "bg-primary border-primary" : "border-border/50"
        )}>
          {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
        </div>
      )}

      {/* Logo and Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-lg bg-background/50 p-2 flex items-center justify-center flex-shrink-0">
          {block.logo_url ? (
            <img 
              src={block.logo_url} 
              alt={block.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={cn("text-xl font-bold text-primary", block.logo_url && "hidden")}>
            {block.name.charAt(0)}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {block.name}
              </h3>
              {block.subtitle && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {block.subtitle}
                </p>
              )}
            </div>
            {block.block_type === 'affiliate' && (
              <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {block.description}
      </p>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={cn(
          "px-2.5 py-1 rounded-full text-xs font-medium border",
          categoryColors[block.category] || 'bg-secondary/10 text-secondary border-secondary/20'
        )}>
          {block.category}
        </span>
        
        {block.block_type === 'affiliate' && (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-500 border border-purple-500/20">
            PARTNER
          </span>
        )}

        {block.pricing_type === 'free' && (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
            FREE
          </span>
        )}

        {block.is_featured && (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
            ⭐ FEATURED
          </span>
        )}

        {completionStatus && context === 'my-apps' && block.block_type === 'internal' && (
          <span className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium border",
            completionStatus === 'completed' && "bg-green-500/10 text-green-500 border-green-500/20",
            completionStatus === 'in_progress' && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
            completionStatus === 'not_started' && "bg-secondary/10 text-secondary border-secondary/20"
          )}>
            {completionStatus === 'completed' && '✓ Completed'}
            {completionStatus === 'in_progress' && 'In Progress'}
            {completionStatus === 'not_started' && 'Not Started'}
          </span>
        )}
      </div>

      {/* Tags and Stats */}
      {(block.tags || block.click_count) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-wrap gap-1.5">
            {block.tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
          {block.block_type === 'affiliate' && block.click_count != null && (
            <span className="text-xs text-muted-foreground">
              📊 {block.click_count} clicks
            </span>
          )}
        </div>
      )}

      {/* Action Button */}
      {getActionButton()}
    </div>
  );
};
