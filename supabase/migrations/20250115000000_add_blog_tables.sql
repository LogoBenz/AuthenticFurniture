-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image VARCHAR(500),
  video_url VARCHAR(500),
  author VARCHAR(100) NOT NULL DEFAULT 'Authentic Furniture Team',
  category VARCHAR(50) DEFAULT 'General',
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_likes table for tracking likes
CREATE TABLE IF NOT EXISTS blog_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_ip VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_ip)
);

-- Create blog_categories table for better category management
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
('Furniture Tips', 'furniture-tips', 'Tips and advice for choosing and maintaining furniture', '#10B981'),
('Home Decor', 'home-decor', 'Interior design and home decoration ideas', '#8B5CF6'),
('Office Solutions', 'office-solutions', 'Office furniture and workspace design', '#F59E0B'),
('Nigerian Living', 'nigerian-living', 'Furniture and design for Nigerian homes', '#EF4444'),
('Maintenance', 'maintenance', 'Care and maintenance guides', '#6B7280'),
('General', 'general', 'General blog posts and updates', '#3B82F6')
ON CONFLICT (slug) DO NOTHING;

-- Add foreign key constraint for blog_posts category (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_blog_posts_category' 
        AND table_name = 'blog_posts'
    ) THEN
        ALTER TABLE blog_posts 
        ADD CONSTRAINT fk_blog_posts_category 
        FOREIGN KEY (category) REFERENCES blog_categories(slug);
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_likes_post_id ON blog_likes(post_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON blog_posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Blog posts: public read, authenticated write
CREATE POLICY "blog_posts_select_public" ON blog_posts FOR SELECT TO public USING (published = true);
CREATE POLICY "blog_posts_select_all_admin" ON blog_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "blog_posts_insert_admin" ON blog_posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "blog_posts_update_admin" ON blog_posts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "blog_posts_delete_admin" ON blog_posts FOR DELETE TO authenticated USING (true);

-- Blog likes: public insert, authenticated read
CREATE POLICY "blog_likes_select_public" ON blog_likes FOR SELECT TO public USING (true);
CREATE POLICY "blog_likes_insert_public" ON blog_likes FOR INSERT TO public WITH CHECK (true);

-- Blog categories: public read, authenticated write
CREATE POLICY "blog_categories_select_public" ON blog_categories FOR SELECT TO public USING (true);
CREATE POLICY "blog_categories_insert_admin" ON blog_categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "blog_categories_update_admin" ON blog_categories FOR UPDATE TO authenticated USING (true);
CREATE POLICY "blog_categories_delete_admin" ON blog_categories FOR DELETE TO authenticated USING (true);

-- Insert some sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, featured_image, author, category, published, featured) VALUES
(
  '5 Essential Furniture Pieces for Every Nigerian Home',
  '5-essential-furniture-pieces-nigerian-home',
  'Discover the must-have furniture pieces that every Nigerian home needs for comfort, functionality, and style.',
  'When it comes to furnishing your home in Nigeria, there are certain pieces that are absolutely essential. These furniture items not only provide comfort and functionality but also reflect the unique lifestyle and climate of our beautiful country.

## 1. A Comfortable Sofa Set

Your living room is the heart of your home, and a quality sofa set is its centerpiece. In Nigeria, where family gatherings are frequent and important, you need furniture that can accommodate everyone comfortably.

**What to look for:**
- Durable fabric that can handle our humid climate
- Easy-to-clean materials
- Sturdy construction that lasts

## 2. A Solid Dining Table

Nigerian families love to eat together, and a good dining table is essential for these precious moments. Whether it''s Sunday dinner or a special celebration, your dining table should be both functional and beautiful.

**Key features:**
- Large enough for your family size
- Easy to clean and maintain
- Matches your home''s aesthetic

## 3. Storage Solutions

With the hustle and bustle of Nigerian life, good storage is crucial. Invest in quality wardrobes, cabinets, and storage units to keep your home organized and clutter-free.

## 4. A Comfortable Bed

A good night''s sleep is essential for productivity. Invest in a quality bed frame and mattress that will give you the rest you need to tackle each day.

## 5. Office Furniture

Whether you work from home or need a study space for the kids, having proper office furniture is increasingly important in today''s world.

At Authentic Furniture, we understand the unique needs of Nigerian families. Visit our showroom in Lagos to see our complete collection of essential furniture pieces.',
  'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Authentic Furniture Team',
  'furniture-tips',
  true,
  true
),
(
  'How to Choose the Right Office Chair for Your Workspace',
  'choose-right-office-chair-workspace',
  'Learn how to select the perfect office chair that supports your productivity and comfort during long work hours.',
  'Working from home has become the new normal, and having the right office chair is crucial for your health and productivity. Here''s how to choose the perfect one for your Nigerian workspace.

## Why Your Office Chair Matters

A good office chair isn''t just about comfort – it''s about your health. Poor posture from an uncomfortable chair can lead to back pain, neck strain, and reduced productivity.

## Key Features to Look For

### 1. Lumbar Support
Your lower back needs proper support, especially during long work sessions. Look for chairs with adjustable lumbar support.

### 2. Adjustable Height
Your feet should rest flat on the floor, with your knees at a 90-degree angle. An adjustable height mechanism is essential.

### 3. Breathable Material
In Nigeria''s climate, you need a chair that won''t make you sweat. Look for mesh or breathable fabric options.

### 4. Armrests
Adjustable armrests help reduce shoulder and neck strain. They should allow your arms to rest comfortably while typing.

## Our Top Recommendations

At Authentic Furniture, we offer a range of office chairs perfect for Nigerian professionals. Visit our showroom to try them out and find your perfect match.',
  'https://images.pexels.com/photos/174938/pexels-photo-174938.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Authentic Furniture Team',
  'office-solutions',
  true,
  false
),
(
  'Decorating Your Lagos Apartment on a Budget',
  'decorating-lagos-apartment-budget',
  'Transform your Lagos apartment into a beautiful home without breaking the bank with these budget-friendly decorating tips.',
  'Living in Lagos doesn''t mean you have to compromise on style. With some creativity and smart shopping, you can create a beautiful home that reflects your personality and fits your budget.

## Start with the Basics

### 1. Declutter First
Before buying anything new, declutter your space. You''ll be surprised how much bigger and cleaner your apartment will look.

### 2. Focus on Key Areas
Don''t try to decorate everything at once. Focus on the areas where you spend the most time – usually the living room and bedroom.

## Budget-Friendly Decorating Tips

### Use What You Have
Look around your home for items you can repurpose or rearrange. Sometimes a simple change in layout can make a huge difference.

### Shop Smart
- Visit our showroom during sales
- Look for multi-functional pieces
- Consider second-hand furniture in good condition

### DIY Projects
Simple DIY projects can add personality to your space without costing much. Consider:
- Painting old furniture
- Making your own artwork
- Creating storage solutions

## Color and Lighting

### Choose a Color Scheme
Pick 2-3 colors and stick to them throughout your space. This creates a cohesive look.

### Maximize Natural Light
Keep windows clean and use light-colored curtains to let in as much natural light as possible.

### Add Strategic Lighting
Good lighting can transform a space. Add table lamps and floor lamps to create ambiance.

## Where to Shop

At Authentic Furniture, we offer quality furniture at competitive prices. Our Lagos showroom has everything you need to transform your apartment into a beautiful home.',
  'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Authentic Furniture Team',
  'home-decor',
  true,
  false
);
