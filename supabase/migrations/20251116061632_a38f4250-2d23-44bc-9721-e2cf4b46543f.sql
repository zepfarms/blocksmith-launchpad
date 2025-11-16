-- Blog categories table
CREATE TABLE blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Blog posts table
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  author_id uuid NOT NULL REFERENCES auth.users(id),
  featured_image_url text,
  category_id uuid REFERENCES blog_categories(id),
  tags text[],
  status text DEFAULT 'draft',
  published_at timestamptz,
  scheduled_for timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  meta_title text,
  meta_description text,
  view_count integer DEFAULT 0,
  read_time_minutes integer
);

-- Contact submissions table
CREATE TABLE contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  company text,
  website text,
  phone text,
  subject text,
  message text NOT NULL,
  metadata jsonb,
  status text DEFAULT 'new',
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Job applications table
CREATE TABLE job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_title text NOT NULL,
  applicant_name text NOT NULL,
  email text NOT NULL,
  phone text,
  resume_url text,
  cover_letter text,
  linkedin_url text,
  portfolio_url text,
  years_experience integer,
  status text DEFAULT 'new',
  admin_notes text,
  created_at timestamptz DEFAULT now()
);

-- Newsletter subscribers table
CREATE TABLE newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz,
  status text DEFAULT 'active',
  subscription_source text
);

-- Enable RLS
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_categories
CREATE POLICY "Anyone can view categories"
  ON blog_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert categories"
  ON blog_categories FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update categories"
  ON blog_categories FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete categories"
  ON blog_categories FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for blog_posts
CREATE POLICY "Anyone can view published posts"
  ON blog_posts FOR SELECT
  USING (status = 'published' OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert posts"
  ON blog_posts FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update posts"
  ON blog_posts FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete posts"
  ON blog_posts FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for contact_submissions
CREATE POLICY "Anyone can insert contact submissions"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view contact submissions"
  ON contact_submissions FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contact submissions"
  ON contact_submissions FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for job_applications
CREATE POLICY "Anyone can insert job applications"
  ON job_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view job applications"
  ON job_applications FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update job applications"
  ON job_applications FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for newsletter_subscribers
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view newsletter subscribers"
  ON newsletter_subscribers FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update newsletter subscribers"
  ON newsletter_subscribers FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- Add triggers for updated_at
CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();