export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action_type: string
          admin_user_id: string
          changes_made: Json | null
          created_at: string
          customer_user_id: string | null
          id: string
          notes: string | null
          website_id: string | null
        }
        Insert: {
          action_type: string
          admin_user_id: string
          changes_made?: Json | null
          created_at?: string
          customer_user_id?: string | null
          id?: string
          notes?: string | null
          website_id?: string | null
        }
        Update: {
          action_type?: string
          admin_user_id?: string
          changes_made?: Json | null
          created_at?: string
          customer_user_id?: string | null
          id?: string
          notes?: string | null
          website_id?: string | null
        }
        Relationships: []
      }
      affiliate_blocks: {
        Row: {
          affiliate_link: string | null
          block_type: string | null
          category: string
          click_count: number | null
          created_at: string | null
          created_by: string | null
          description: string
          display_order: number | null
          id: string
          internal_route: string | null
          is_active: boolean | null
          is_affiliate: boolean | null
          is_featured: boolean | null
          logo_url: string | null
          monthly_price_cents: number | null
          name: string
          price_cents: number | null
          pricing_type: string | null
          stripe_monthly_price_id: string | null
          stripe_price_id: string | null
          stripe_product_id: string | null
          subtitle: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          affiliate_link?: string | null
          block_type?: string | null
          category: string
          click_count?: number | null
          created_at?: string | null
          created_by?: string | null
          description: string
          display_order?: number | null
          id?: string
          internal_route?: string | null
          is_active?: boolean | null
          is_affiliate?: boolean | null
          is_featured?: boolean | null
          logo_url?: string | null
          monthly_price_cents?: number | null
          name: string
          price_cents?: number | null
          pricing_type?: string | null
          stripe_monthly_price_id?: string | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          subtitle?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          affiliate_link?: string | null
          block_type?: string | null
          category?: string
          click_count?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          display_order?: number | null
          id?: string
          internal_route?: string | null
          is_active?: boolean | null
          is_affiliate?: boolean | null
          is_featured?: boolean | null
          logo_url?: string | null
          monthly_price_cents?: number | null
          name?: string
          price_cents?: number | null
          pricing_type?: string | null
          stripe_monthly_price_id?: string | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          subtitle?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      affiliate_clicks: {
        Row: {
          block_id: string | null
          clicked_at: string | null
          id: string
          ip_address: string | null
          referrer: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          block_id?: string | null
          clicked_at?: string | null
          id?: string
          ip_address?: string | null
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          block_id?: string | null
          clicked_at?: string | null
          id?: string
          ip_address?: string | null
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "affiliate_blocks"
            referencedColumns: ["id"]
          },
        ]
      }
      block_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      block_category_assignments: {
        Row: {
          block_name: string
          category_id: string
          created_at: string
          id: string
        }
        Insert: {
          block_name: string
          category_id: string
          created_at?: string
          id?: string
        }
        Update: {
          block_name?: string
          category_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "block_category_assignments_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "block_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string
          category_id: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          read_time_minutes: number | null
          scheduled_for: string | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id: string
          category_id?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          read_time_minutes?: number | null
          scheduled_for?: string | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string
          category_id?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          read_time_minutes?: number | null
          scheduled_for?: string | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      business_ideas: {
        Row: {
          category: string
          created_at: string | null
          description: string
          display_order: number | null
          growth_blocks: string
          id: string
          is_active: boolean
          name: string
          starter_blocks: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          display_order?: number | null
          growth_blocks: string
          id?: string
          is_active?: boolean
          name: string
          starter_blocks: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          display_order?: number | null
          growth_blocks?: string
          id?: string
          is_active?: boolean
          name?: string
          starter_blocks?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      business_plans: {
        Row: {
          business_id: string
          created_at: string | null
          edited_content: Json | null
          finalized_at: string | null
          generated_content: Json
          id: string
          questionnaire_data: Json
          status: string | null
          updated_at: string | null
          user_id: string
          version: number | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          edited_content?: Json | null
          finalized_at?: string | null
          generated_content: Json
          id?: string
          questionnaire_data: Json
          status?: string | null
          updated_at?: string | null
          user_id: string
          version?: number | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          edited_content?: Json | null
          finalized_at?: string | null
          generated_content?: Json
          id?: string
          questionnaire_data?: Json
          status?: string | null
          updated_at?: string | null
          user_id?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "business_plans_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "user_businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          admin_notes: string | null
          company: string | null
          created_at: string | null
          email: string
          id: string
          message: string
          metadata: Json | null
          name: string
          phone: string | null
          status: string | null
          subject: string | null
          type: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          admin_notes?: string | null
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          message: string
          metadata?: Json | null
          name: string
          phone?: string | null
          status?: string | null
          subject?: string | null
          type: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          admin_notes?: string | null
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          metadata?: Json | null
          name?: string
          phone?: string | null
          status?: string | null
          subject?: string | null
          type?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      document_analytics: {
        Row: {
          action_type: string
          created_at: string
          document_id: string
          id: string
          ip_address: string | null
          referrer: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          document_id: string
          id?: string
          ip_address?: string | null
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          document_id?: string
          id?: string
          ip_address?: string | null
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_analytics_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "document_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      document_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          icon: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      document_templates: {
        Row: {
          alternative_file_type: string | null
          alternative_file_url: string | null
          category_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          download_count: number
          file_type: Database["public"]["Enums"]["document_file_type"]
          file_url: string | null
          id: string
          is_editable_online: boolean
          is_featured: boolean
          is_premium: boolean
          slug: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          alternative_file_type?: string | null
          alternative_file_url?: string | null
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          download_count?: number
          file_type: Database["public"]["Enums"]["document_file_type"]
          file_url?: string | null
          id?: string
          is_editable_online?: boolean
          is_featured?: boolean
          is_premium?: boolean
          slug: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          alternative_file_type?: string | null
          alternative_file_url?: string | null
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          download_count?: number
          file_type?: Database["public"]["Enums"]["document_file_type"]
          file_url?: string | null
          id?: string
          is_editable_online?: boolean
          is_featured?: boolean
          is_premium?: boolean
          slug?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_templates_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "document_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      email_verifications: {
        Row: {
          attempts: number
          code: string
          created_at: string
          created_ip: string | null
          email: string
          expires_at: string
          id: string
          used: boolean
        }
        Insert: {
          attempts?: number
          code: string
          created_at?: string
          created_ip?: string | null
          email: string
          expires_at?: string
          id?: string
          used?: boolean
        }
        Update: {
          attempts?: number
          code?: string
          created_at?: string
          created_ip?: string | null
          email?: string
          expires_at?: string
          id?: string
          used?: boolean
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          admin_notes: string | null
          applicant_name: string
          cover_letter: string | null
          created_at: string | null
          email: string
          id: string
          job_title: string
          linkedin_url: string | null
          phone: string | null
          portfolio_url: string | null
          resume_url: string | null
          status: string | null
          years_experience: number | null
        }
        Insert: {
          admin_notes?: string | null
          applicant_name: string
          cover_letter?: string | null
          created_at?: string | null
          email: string
          id?: string
          job_title: string
          linkedin_url?: string | null
          phone?: string | null
          portfolio_url?: string | null
          resume_url?: string | null
          status?: string | null
          years_experience?: number | null
        }
        Update: {
          admin_notes?: string | null
          applicant_name?: string
          cover_letter?: string | null
          created_at?: string | null
          email?: string
          id?: string
          job_title?: string
          linkedin_url?: string | null
          phone?: string | null
          portfolio_url?: string | null
          resume_url?: string | null
          status?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      logo_generation_sessions: {
        Row: {
          ai_prompt: string | null
          business_id: string
          created_at: string | null
          generation_number: number | null
          id: string
          logo_urls: string[] | null
          user_feedback: string | null
          user_id: string
        }
        Insert: {
          ai_prompt?: string | null
          business_id: string
          created_at?: string | null
          generation_number?: number | null
          id?: string
          logo_urls?: string[] | null
          user_feedback?: string | null
          user_id: string
        }
        Update: {
          ai_prompt?: string | null
          business_id?: string
          created_at?: string | null
          generation_number?: number | null
          id?: string
          logo_urls?: string[] | null
          user_feedback?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "logo_generation_sessions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "user_businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          name: string | null
          status: string | null
          subscribed_at: string | null
          subscription_source: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          name?: string | null
          status?: string | null
          subscribed_at?: string | null
          subscription_source?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          name?: string | null
          status?: string | null
          subscribed_at?: string | null
          subscription_source?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          email_verified: boolean
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          email_verified?: boolean
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          email_verified?: boolean
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscription_payment_failures: {
        Row: {
          attempt_count: number
          created_at: string
          failure_reason: string | null
          id: string
          last_reminder_sent_at: string | null
          next_retry_date: string | null
          reminder_count: number | null
          resolved: boolean
          resolved_at: string | null
          stripe_invoice_id: string
          subscription_id: string
          user_id: string
        }
        Insert: {
          attempt_count?: number
          created_at?: string
          failure_reason?: string | null
          id?: string
          last_reminder_sent_at?: string | null
          next_retry_date?: string | null
          reminder_count?: number | null
          resolved?: boolean
          resolved_at?: string | null
          stripe_invoice_id: string
          subscription_id: string
          user_id: string
        }
        Update: {
          attempt_count?: number
          created_at?: string
          failure_reason?: string | null
          id?: string
          last_reminder_sent_at?: string | null
          next_retry_date?: string | null
          reminder_count?: number | null
          resolved?: boolean
          resolved_at?: string | null
          stripe_invoice_id?: string
          subscription_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_payment_failures_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_payment_failures_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_assets: {
        Row: {
          asset_type: string
          business_id: string
          created_at: string | null
          file_url: string
          id: string
          metadata: Json | null
          status: string
          thumbnail_url: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          asset_type: string
          business_id: string
          created_at?: string | null
          file_url: string
          id?: string
          metadata?: Json | null
          status?: string
          thumbnail_url?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          asset_type?: string
          business_id?: string
          created_at?: string | null
          file_url?: string
          id?: string
          metadata?: Json | null
          status?: string
          thumbnail_url?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_assets_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "user_businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_block_purchases: {
        Row: {
          block_name: string
          business_id: string | null
          id: string
          price_paid_cents: number
          pricing_type: string
          purchased_at: string
          stripe_payment_intent_id: string | null
          user_id: string
        }
        Insert: {
          block_name: string
          business_id?: string | null
          id?: string
          price_paid_cents: number
          pricing_type?: string
          purchased_at?: string
          stripe_payment_intent_id?: string | null
          user_id: string
        }
        Update: {
          block_name?: string
          business_id?: string | null
          id?: string
          price_paid_cents?: number
          pricing_type?: string
          purchased_at?: string
          stripe_payment_intent_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_block_purchases_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "user_businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_block_unlocks: {
        Row: {
          block_name: string
          business_id: string
          completion_status: string
          created_at: string
          expires_at: string | null
          id: string
          subscription_id: string | null
          unlock_type: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          block_name: string
          business_id: string
          completion_status?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          subscription_id?: string | null
          unlock_type: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          block_name?: string
          business_id?: string
          completion_status?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          subscription_id?: string | null
          unlock_type?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_block_unlocks_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "user_businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_block_unlocks_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_block_unlocks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_businesses: {
        Row: {
          ai_analysis: string | null
          business_idea: string
          business_name: string
          business_type: string | null
          created_at: string
          id: string
          payment_status: string | null
          selected_blocks: string[] | null
          status: string | null
          stripe_session_id: string | null
          total_cost_cents: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_analysis?: string | null
          business_idea: string
          business_name: string
          business_type?: string | null
          created_at?: string
          id?: string
          payment_status?: string | null
          selected_blocks?: string[] | null
          status?: string | null
          stripe_session_id?: string | null
          total_cost_cents?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_analysis?: string | null
          business_idea?: string
          business_name?: string
          business_type?: string | null
          created_at?: string
          id?: string
          payment_status?: string | null
          selected_blocks?: string[] | null
          status?: string | null
          stripe_session_id?: string | null
          total_cost_cents?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_documents: {
        Row: {
          content: Json
          created_at: string
          document_type: string
          file_url: string | null
          id: string
          template_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: Json
          created_at?: string
          document_type: string
          file_url?: string | null
          id?: string
          template_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          document_type?: string
          file_url?: string | null
          id?: string
          template_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_documents_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "document_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_domain_selections: {
        Row: {
          business_id: string
          created_at: string
          domain_name: string | null
          domain_status: string
          existing_website_url: string | null
          has_existing_domain: boolean
          id: string
          registered_via_acari: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          domain_name?: string | null
          domain_status?: string
          existing_website_url?: string | null
          has_existing_domain?: boolean
          id?: string
          registered_via_acari?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          domain_name?: string | null
          domain_status?: string
          existing_website_url?: string | null
          has_existing_domain?: boolean
          id?: string
          registered_via_acari?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_edited_documents: {
        Row: {
          created_at: string | null
          edit_count: number | null
          file_url: string
          id: string
          last_edited_at: string | null
          original_file_url: string | null
          template_id: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          edit_count?: number | null
          file_url: string
          id?: string
          last_edited_at?: string | null
          original_file_url?: string | null
          template_id?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          edit_count?: number | null
          file_url?: string
          id?: string
          last_edited_at?: string | null
          original_file_url?: string | null
          template_id?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_edited_documents_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "document_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_edited_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          block_name: string
          business_id: string
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string
          current_period_start: string
          grace_period_end: string | null
          id: string
          last_payment_status: string | null
          monthly_price_cents: number
          payment_retry_count: number | null
          status: string
          stripe_subscription_id: string
          stripe_subscription_item_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          block_name: string
          business_id: string
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end: string
          current_period_start: string
          grace_period_end?: string | null
          id?: string
          last_payment_status?: string | null
          monthly_price_cents: number
          payment_retry_count?: number | null
          status?: string
          stripe_subscription_id: string
          stripe_subscription_item_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          block_name?: string
          business_id?: string
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          grace_period_end?: string | null
          id?: string
          last_payment_status?: string | null
          monthly_price_cents?: number
          payment_retry_count?: number | null
          status?: string
          stripe_subscription_id?: string
          stripe_subscription_item_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "user_businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      document_file_type: "pdf" | "docx" | "google-docs" | "html"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      document_file_type: ["pdf", "docx", "google-docs", "html"],
    },
  },
} as const
