# Authentic Furniture - Documentation

Welcome to the Authentic Furniture documentation! This directory contains comprehensive documentation for all public APIs, functions, components, and usage patterns.

## 📚 Documentation Structure

### [API Documentation](./API_DOCUMENTATION.md)
**Complete API reference with detailed examples and usage instructions**

- **Types & Interfaces**: All TypeScript interfaces and data structures
- **Utility Functions**: Helper functions and utilities
- **Database & Supabase**: Database configuration and client setup
- **Product Management**: Complete CRUD operations for products
- **Authentication**: Auth hooks and user management
- **Custom Hooks**: React hooks for cart, toast, and more
- **UI Components**: All available UI components with examples
- **Layout Components**: Header, footer, and theme components
- **Product Components**: Product-specific components
- **Admin Components**: Admin interface components
- **Usage Examples**: Complete implementation examples
- **Environment Variables**: Required configuration
- **Error Handling**: Error handling patterns
- **Performance**: Performance considerations
- **Security**: Security best practices

### [Quick Reference Guide](./QUICK_REFERENCE.md)
**Fast lookup guide for common operations and patterns**

- **Getting Started**: Essential imports and setup
- **Product Management**: Quick product operations
- **Enquiry Cart**: Cart functionality examples
- **Authentication**: Auth status and sign out
- **Toast Notifications**: User feedback patterns
- **UI Components**: Common component usage
- **Common Patterns**: Loading states, error handling, responsive design
- **Utility Functions**: Quick utility usage
- **TypeScript Types**: Core type definitions
- **Error Handling**: Network fallback and validation
- **Security**: Environment variables and auth
- **Performance Tips**: Optimization guidelines
- **Debugging**: Common issues and solutions

### [Component Reference](./COMPONENT_REFERENCE.md)
**Complete component library with props and usage**

- **UI Components**: All Radix UI-based components
- **Layout Components**: Header, footer, theme provider
- **Product Components**: Product-specific components
- **Admin Components**: Admin interface components
- **Auth Components**: Authentication components
- **Customer Components**: Customer management
- **Inventory Components**: Inventory management
- **Usage Guidelines**: Import patterns, styling, accessibility

## 🚀 Getting Started

### For New Developers
1. Start with the [Quick Reference Guide](./QUICK_REFERENCE.md) for essential patterns
2. Review the [API Documentation](./API_DOCUMENTATION.md) for comprehensive understanding
3. Use the [Component Reference](./COMPONENT_REFERENCE.md) for UI component details

### For Experienced Developers
1. Jump directly to the [API Documentation](./API_DOCUMENTATION.md) for detailed API reference
2. Use the [Component Reference](./COMPONENT_REFERENCE.md) for component-specific details
3. Reference the [Quick Reference Guide](./QUICK_REFERENCE.md) for common patterns

## 🎯 Common Use Cases

### Building a Product Page
```typescript
// 1. Import required components and hooks
import { getProductBySlug } from '@/lib/products';
import { ProductCard } from '@/components/products/ProductCard';
import { useEnquiryCart } from '@/hooks/use-enquiry-cart';

// 2. Fetch product data
const product = await getProductBySlug('product-slug');

// 3. Use cart functionality
const { addToCart, isInCart } = useEnquiryCart();

// 4. Render product
<ProductCard product={product} />
```

### Creating an Admin Interface
```typescript
// 1. Import admin components and APIs
import { getAllProducts, createProduct } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';

// 2. Fetch and manage data
const products = await getAllProducts();

// 3. Handle operations with feedback
const { toast } = useToast();
await createProduct(productData);
toast({ title: "Success", description: "Product created" });
```

### Implementing Authentication
```typescript
// 1. Use auth hook
import { useAuth } from '@/hooks/use-auth';

// 2. Check auth status
const { user, isAuthenticated, loading } = useAuth();

// 3. Protect routes
if (!isAuthenticated) return <LoginPage />;
```

## 🔧 Development Workflow

### 1. Environment Setup
```env
# Required environment variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Component Development
- Use existing UI components from `components/ui/`
- Follow the established patterns in `components/products/`
- Implement proper loading states and error handling
- Use TypeScript for type safety

### 3. API Integration
- Use functions from `lib/products.ts` for product operations
- Implement proper error handling with fallback data
- Use toast notifications for user feedback

### 4. State Management
- Use React hooks for local state
- Use context providers for global state (cart, auth)
- Implement proper loading and error states

## 📋 Best Practices

### Code Organization
- Keep components in appropriate directories
- Use consistent naming conventions
- Implement proper TypeScript types
- Follow the established import patterns

### Performance
- Use Next.js Image component for images
- Implement proper loading states
- Use React.memo for expensive components
- Lazy load non-critical components

### Accessibility
- Include proper ARIA attributes
- Ensure keyboard navigation
- Test with screen readers
- Maintain proper focus management

### Error Handling
- Implement graceful fallbacks
- Provide user-friendly error messages
- Log errors for debugging
- Handle network failures gracefully

## 🐛 Troubleshooting

### Common Issues

1. **Hydration Errors**
   - Check for client/server mismatch
   - Use proper loading states
   - Avoid direct DOM manipulation

2. **CORS Errors**
   - Verify Supabase configuration
   - Check environment variables
   - Ensure proper CORS setup

3. **Cart Persistence Issues**
   - Check localStorage availability
   - Verify cart provider setup
   - Handle SSR properly

4. **Image Loading Problems**
   - Verify image URLs
   - Check Next.js image configuration
   - Use proper image optimization

### Debugging Tips

1. **Console Logging**
   ```typescript
   console.log('🛒 Cart action:', { productId, isInCart });
   console.log('🔗 Supabase response:', { data, error });
   ```

2. **Network Tab**
   - Check API requests
   - Verify response data
   - Monitor error responses

3. **React DevTools**
   - Inspect component state
   - Check hook values
   - Monitor re-renders

## 📞 Support

### Documentation Issues
- Check the relevant documentation file
- Review code examples
- Verify environment setup

### Code Issues
- Review the codebase in `src/` and `components/`
- Check TypeScript types in `types/`
- Verify API implementations in `lib/`

### Configuration Issues
- Verify environment variables
- Check Supabase setup
- Review Next.js configuration

## 🔄 Documentation Updates

This documentation is maintained alongside the codebase. When making changes:

1. **Update API Documentation** when adding new functions or changing interfaces
2. **Update Component Reference** when adding new components
3. **Update Quick Reference** for common patterns and examples
4. **Add examples** for new features and use cases

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

---

**Happy coding! 🚀**

For questions or contributions, please refer to the main project documentation or contact the development team.