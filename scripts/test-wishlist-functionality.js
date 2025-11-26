// Test wishlist functionality
// Run this in browser console to debug

console.log('🧪 Testing Wishlist Functionality...\n');

// Check if localStorage is accessible
try {
  const testKey = 'test_wishlist_access';
  localStorage.setItem(testKey, 'test');
  localStorage.removeItem(testKey);
  console.log('✅ localStorage is accessible');
} catch (e) {
  console.error('❌ localStorage error:', e);
}

// Check guest wishlist
const guestWishlist = localStorage.getItem('guest_wishlist');
console.log('📦 Guest wishlist:', guestWishlist ? JSON.parse(guestWishlist) : 'empty');

// Test adding to wishlist
console.log('\n📝 To test manually:');
console.log('1. Click a heart icon on a product card');
console.log('2. Check console for any errors');
console.log('3. Run: localStorage.getItem("guest_wishlist")');
console.log('4. Should see product ID in the array');
