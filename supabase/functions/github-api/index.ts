import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN');
const REPO_OWNER = 'zepfarms';
const REPO_NAME = 'blocksmith-launchpad';
const BRANCH = 'main';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, path, content, message } = await req.json();

    // Get repository contents
    if (action === 'getContents') {
      const url = path 
        ? `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`
        : `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents?ref=${BRANCH}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Acari-Admin'
        }
      });

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get file content
    if (action === 'getFile') {
      const response = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`,
        {
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Acari-Admin'
          }
        }
      );

      const data = await response.json();
      
      // Decode base64 content
      if (data.content) {
        const decodedContent = atob(data.content.replace(/\n/g, ''));
        return new Response(JSON.stringify({ 
          ...data, 
          decodedContent 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Update file
    if (action === 'updateFile') {
      const encodedContent = btoa(content);

      // First get the current file to get its SHA
      const fileResponse = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`,
        {
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Acari-Admin'
          }
        }
      );
      
      const fileData = await fileResponse.json();

      // Update the file
      const updateResponse = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Acari-Admin'
          },
          body: JSON.stringify({
            message: message || `Update ${path}`,
            content: encodedContent,
            sha: fileData.sha,
            branch: BRANCH
          })
        }
      );

      const updateData = await updateResponse.json();
      return new Response(JSON.stringify(updateData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('GitHub API error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
