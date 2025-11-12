import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface BlockPricing {
  block_name: string;
  price_cents: number;
  is_free: boolean;
}

export default function AppStore() {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState<BlockPricing[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlocks();
  }, []);

  const loadBlocks = async () => {
    const { data, error } = await supabase
      .from("blocks_pricing")
      .select("*")
      .order("block_name");

    if (error) {
      console.error("Error loading blocks:", error);
      return;
    }

    setBlocks(data || []);
    setLoading(false);
  };

  const filteredBlocks = blocks.filter(block =>
    block.block_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCart = (blockName: string) => {
    setCart(prev =>
      prev.includes(blockName)
        ? prev.filter(b => b !== blockName)
        : [...prev, blockName]
    );
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Please select at least one block");
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('create-checkout-session', {
        body: { blockNames: cart },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (response.error) throw response.error;
      if (response.data?.sessionUrl) {
        window.location.href = response.data.sessionUrl;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to create checkout session");
    }
  };

  const totalCost = cart.reduce((sum, blockName) => {
    const block = blocks.find(b => b.block_name === blockName);
    return sum + (block?.price_cents || 0);
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="pt-24 px-4 pb-12 max-w-7xl mx-auto">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="rounded-full mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            App Store
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            Browse and add new blocks to your business
          </p>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search blocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full bg-white/5 border-white/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredBlocks.map((block) => {
            const inCart = cart.includes(block.block_name);
            return (
              <div
                key={block.block_name}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{block.block_name}</h3>
                  {block.is_free ? (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      FREE
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      ${(block.price_cents / 100).toFixed(2)}
                    </Badge>
                  )}
                </div>
                
                <Button
                  onClick={() => toggleCart(block.block_name)}
                  variant={inCart ? "default" : "outline"}
                  className="w-full rounded-full"
                >
                  {inCart ? "Remove from Cart" : "Add to Cart"}
                </Button>
              </div>
            );
          })}
        </div>

        {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-black/95 border-t border-white/10 backdrop-blur-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-4">
                <ShoppingCart className="h-6 w-6" />
                <div>
                  <p className="font-semibold">{cart.length} blocks in cart</p>
                  <p className="text-sm text-gray-400">
                    Total: ${(totalCost / 100).toFixed(2)}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleCheckout}
                size="lg"
                className="rounded-full"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
