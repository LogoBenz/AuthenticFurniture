# Authentic Furniture - Premium Furniture Website

A modern, responsive furniture e-commerce website built with Next.js, featuring product management, enquiry system, and beautiful design.

## 🚀 Features

- **Modern Design**: Clean, professional interface with dark/light mode
- **Product Management**: Full CRUD operations for furniture products
- **Enquiry System**: Shopping cart-style enquiry system with WhatsApp integration
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **SEO Optimized**: Built-in SEO with proper meta tags and structure
- **Fast Performance**: Optimized images and efficient data loading
- **Fallback Data**: Works with sample data even without database

## 🛠️ Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **TypeScript**: Full type safety

## 📦 Getting Started

### 1. Clone and Install

```bash
git clone <your-repo>
cd authentic-furniture
npm install
```

### 2. Set up Supabase (Optional)

The app works with sample data by default. To enable full functionality:

1. **Create a Supabase project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for setup to complete

2. **Get your credentials**:
   - Go to Settings > API in your Supabase dashboard
   - Copy your Project URL and anon/public key

3. **Configure environment variables**:
   - Copy `.env.local` and add your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

4. **Run the database migration**:
   - The migration file is already included in `supabase/migrations/`
   - It will create the products table with sample data
   - Run it through your Supabase dashboard or CLI

### 3. Start Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see the website.

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel for product management
│   ├── products/          # Product pages and listings
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── home/             # Homepage components
│   ├── products/         # Product-related components
│   ├── layout/           # Layout components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
│   ├── products.ts       # Product data management
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # General utilities
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
├── data/                 # Fallback data
└── supabase/             # Database migrations
```

## 🎨 Key Features

### Product Management
- Add, edit, delete products
- Image upload support
- Category management
- Stock tracking
- Featured products

### Enquiry System
- Add products to enquiry cart
- WhatsApp integration
- Persistent cart storage
- Bulk enquiry sending

### Design System
- Consistent color scheme
- Responsive breakpoints
- Dark/light mode support
- Smooth animations
- Professional typography

## 🔧 Configuration

### Environment Variables

```env
# Required for full functionality
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Service role key for admin operations
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Customization

1. **Branding**: Update company name, colors, and logo in components
2. **Contact Info**: Update phone numbers and addresses in contact pages
3. **WhatsApp**: Update WhatsApp number in components
4. **Images**: Replace with your own product images
5. **Content**: Update copy and descriptions throughout

## 📱 Pages

- **Homepage** (`/`): Hero, categories, featured products, testimonials
- **Products** (`/products`): Product listing with filters and search
- **Product Detail** (`/products/[slug]`): Individual product pages
- **About** (`/about`): Company information and story
- **Contact** (`/contact`): Contact information and form
- **Admin** (`/admin`): Product management dashboard

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `out` folder to Netlify
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you need help:

1. Check the console for any errors
2. Verify your Supabase configuration
3. Ensure all environment variables are set
4. Check the network tab for failed requests

The app is designed to work gracefully with or without Supabase, so you can always fall back to sample data for development.