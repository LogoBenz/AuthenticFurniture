# Admin Access Guide

## Overview
The admin area is hidden from regular customers to maintain security while providing easy access for authorized personnel.

## Access Methods

### 1. Keyboard Shortcut (Desktop - Primary Method)
- **Shortcut**: `Ctrl + Shift + A`
- **Works on**: Any page of the website (desktop only)
- **Behavior**: 
  - If logged in: Redirects to admin dashboard
  - If not logged in: Redirects to login page

### 2. Mobile Long-Press Gesture (Mobile - Primary Method)
- **Gesture**: Long-press (2 seconds) on the "Authentic Furniture" logo
- **Works on**: Any page of the website (mobile only)
- **Behavior**: Same as keyboard shortcut
- **Note**: Only works on touch devices

### 3. Mobile Menu Access (Mobile - Secondary Method)
- **Location**: Mobile menu (hamburger menu)
- **Visibility**: Only appears for authenticated users
- **Appearance**: "Admin Dashboard" button with settings icon
- **Behavior**: Direct access to admin dashboard

### 4. Footer Access (Subtle)
- **Location**: Bottom right of the footer
- **Visibility**: Only appears for authenticated users
- **Appearance**: Small lock icon (🔒)
- **Behavior**: Same as keyboard shortcut

### 5. Direct URL Access
- **Login**: `/auth/login`
- **Dashboard**: `/admin/dashboard`
- **Note**: These URLs are accessible but not prominently displayed

## Security Features

### Hidden from Regular Users
- No visible admin links in the main navigation
- Admin access is completely hidden from unauthenticated users
- Keyboard shortcut is only active when not in admin area
- Mobile menu admin button only shows for authenticated users

### Visual Indicators for Authorized Users
- Small lock icon appears in header after 3 seconds (desktop)
- Footer shows admin access hint after 5 seconds
- Mobile menu includes admin hint for authenticated users
- Long-press hint appears in mobile menu

## User Experience

### For Regular Customers
- Clean, professional interface without admin clutter
- No confusion about admin functionality
- Focus on product browsing and purchasing

### For Authorized Personnel
- **Desktop**: Quick access via keyboard shortcut
- **Mobile**: Long-press logo or use mobile menu
- Subtle visual reminders of admin access
- Professional admin interface when accessed

## Platform-Specific Access

### Desktop Users
1. **Primary**: `Ctrl + Shift + A` keyboard shortcut
2. **Secondary**: Footer lock icon
3. **Fallback**: Direct URL access

### Mobile Users
1. **Primary**: Long-press (2s) on logo
2. **Secondary**: Mobile menu → "Admin Dashboard"
3. **Fallback**: Footer lock icon or direct URL

## Best Practices

1. **Desktop users**: Use the keyboard shortcut for fastest access
2. **Mobile users**: Use long-press gesture for quick access
3. **Share access methods** with authorized team members
4. **Bookmark the admin dashboard** for frequent access
5. **Log out properly** when finished with admin tasks

## Troubleshooting

### Keyboard Shortcut Not Working (Desktop)
- Ensure you're not in the admin area (shortcut is disabled there)
- Check that no other application is intercepting the shortcut
- Try refreshing the page and trying again

### Long-Press Not Working (Mobile)
- Ensure you're pressing for at least 2 seconds
- Try pressing on the logo text specifically
- Check that you're on a touch device
- Try refreshing the page

### Can't See Admin Access
- Verify you're logged in with an authorized account
- Wait for the visual hints to appear (3-5 seconds)
- Check the footer for the lock icon
- On mobile, check the hamburger menu

### Access Denied
- Ensure your account has admin privileges
- Try logging out and logging back in
- Contact the system administrator if issues persist

## Mobile-Specific Notes

- The long-press gesture only works on touch devices
- The mobile menu admin button is only visible to authenticated users
- Long-press duration is 2 seconds to prevent accidental activation
- Mobile hints are different from desktop hints to reflect available methods 