import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Platform {
  name: string;
  displayName: string;
  url: (username: string) => string;
  icon: string;
}

const PLATFORMS: Platform[] = [
  { 
    name: 'twitter', 
    displayName: 'Twitter/X',
    url: (u: string) => `https://twitter.com/${u}`,
    icon: '𝕏'
  },
  { 
    name: 'instagram', 
    displayName: 'Instagram',
    url: (u: string) => `https://www.instagram.com/${u}/`,
    icon: '📷'
  },
  { 
    name: 'facebook', 
    displayName: 'Facebook',
    url: (u: string) => `https://www.facebook.com/${u}`,
    icon: '👤'
  },
  { 
    name: 'linkedin', 
    displayName: 'LinkedIn',
    url: (u: string) => `https://www.linkedin.com/company/${u}`,
    icon: '💼'
  },
  { 
    name: 'youtube', 
    displayName: 'YouTube',
    url: (u: string) => `https://www.youtube.com/@${u}`,
    icon: '▶️'
  },
  { 
    name: 'tiktok', 
    displayName: 'TikTok',
    url: (u: string) => `https://www.tiktok.com/@${u}`,
    icon: '🎵'
  },
  { 
    name: 'pinterest', 
    displayName: 'Pinterest',
    url: (u: string) => `https://www.pinterest.com/${u}`,
    icon: '📌'
  },
  { 
    name: 'reddit', 
    displayName: 'Reddit',
    url: (u: string) => `https://www.reddit.com/user/${u}`,
    icon: '🤖'
  },
  { 
    name: 'github', 
    displayName: 'GitHub',
    url: (u: string) => `https://github.com/${u}`,
    icon: '⚙️'
  },
  { 
    name: 'twitch', 
    displayName: 'Twitch',
    url: (u: string) => `https://www.twitch.tv/${u}`,
    icon: '🎮'
  },
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username } = await req.json();
    
    console.log(`Checking availability for username: ${username}`);
    
    // Validate username format
    if (!username || typeof username !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Username is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Clean and validate username
    const cleanUsername = username.trim().toLowerCase();
    
    // Most platforms allow: letters, numbers, underscores, periods, hyphens
    // Length: 1-30 characters
    if (!/^[a-zA-Z0-9._-]{1,30}$/.test(cleanUsername)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid username format. Use only letters, numbers, underscores, periods, and hyphens (1-30 characters)' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Check each platform
    const results = await Promise.all(
      PLATFORMS.map(async (platform) => {
        try {
          const url = platform.url(cleanUsername);
          
          console.log(`Checking ${platform.name}: ${url}`);
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
          
          const response = await fetch(url, {
            method: 'HEAD',
            redirect: 'follow',
            signal: controller.signal,
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; HandleChecker/1.0)',
            },
          });
          
          clearTimeout(timeoutId);
          
          // Different platforms have different status codes
          // 200/301/302 = profile exists (taken)
          // 404 = profile not found (available)
          // 403 = access denied (might be taken or restricted)
          
          let status: 'available' | 'taken' | 'unknown' | 'error';
          
          if (response.status === 404) {
            status = 'available';
          } else if (response.status === 200 || response.status === 301 || response.status === 302) {
            status = 'taken';
          } else if (response.status === 403 || response.status === 429) {
            status = 'unknown';
          } else {
            status = 'error';
          }
          
          console.log(`${platform.name}: ${status} (HTTP ${response.status})`);
          
          return {
            platform: platform.name,
            displayName: platform.displayName,
            status,
            url,
            icon: platform.icon,
            httpStatus: response.status,
          };
        } catch (error: any) {
          console.error(`Error checking ${platform.name}:`, error);
          
          // If it's an abort error, it's a timeout
          if (error.name === 'AbortError') {
            return {
              platform: platform.name,
              displayName: platform.displayName,
              status: 'error' as const,
              url: platform.url(cleanUsername),
              icon: platform.icon,
              error: 'Timeout',
            };
          }
          
          return {
            platform: platform.name,
            displayName: platform.displayName,
            status: 'error' as const,
            url: platform.url(cleanUsername),
            icon: platform.icon,
            error: error.message,
          };
        }
      })
    );
    
    const summary = {
      total: results.length,
      available: results.filter(r => r.status === 'available').length,
      taken: results.filter(r => r.status === 'taken').length,
      unknown: results.filter(r => r.status === 'unknown').length,
      error: results.filter(r => r.status === 'error').length,
    };
    
    console.log('Summary:', summary);
    
    return new Response(
      JSON.stringify({ 
        username: cleanUsername,
        results,
        summary 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
    
  } catch (error: any) {
    console.error('Error in check-social-handles function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
