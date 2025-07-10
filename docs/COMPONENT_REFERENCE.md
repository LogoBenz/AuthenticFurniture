# Authentic Furniture - Component Reference

## Table of Contents

1. [UI Components](#ui-components)
2. [Layout Components](#layout-components)
3. [Product Components](#product-components)
4. [Admin Components](#admin-components)
5. [Auth Components](#auth-components)
6. [Customer Components](#customer-components)
7. [Inventory Components](#inventory-components)

---

## UI Components

### Button
**Location**: `components/ui/button.tsx`

```typescript
import { Button } from '@/components/ui/button';

<Button variant="default" size="default" asChild={false}>
  Click me
</Button>
```

**Props**:
- `variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'`
- `size?: 'default' | 'sm' | 'lg' | 'icon'`
- `asChild?: boolean`
- All standard button HTML attributes

### Card
**Location**: `components/ui/card.tsx`

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

**Components**:
- `Card` - Main container
- `CardHeader` - Header section
- `CardTitle` - Title (h3 element)
- `CardDescription` - Description text
- `CardContent` - Main content area
- `CardFooter` - Footer section

### Dialog
**Location**: `components/ui/dialog.tsx`

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    Content
  </DialogContent>
</Dialog>
```

**Components**:
- `Dialog` - Root dialog
- `DialogTrigger` - Trigger element
- `DialogContent` - Content container
- `DialogHeader` - Header section
- `DialogTitle` - Dialog title
- `DialogDescription` - Dialog description

### Form
**Location**: `components/ui/form.tsx`

```typescript
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

<Form {...form}>
  <FormField
    control={form.control}
    name="fieldName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Label</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

**Components**:
- `Form` - Form wrapper
- `FormField` - Field wrapper
- `FormItem` - Item container
- `FormLabel` - Field label
- `FormControl` - Control wrapper
- `FormMessage` - Validation message

### Input
**Location**: `components/ui/input.tsx`

```typescript
import { Input } from '@/components/ui/input';

<Input type="text" placeholder="Enter text" />
```

**Props**: All standard input HTML attributes

### Textarea
**Location**: `components/ui/textarea.tsx`

```typescript
import { Textarea } from '@/components/ui/textarea';

<Textarea placeholder="Enter description" />
```

**Props**: All standard textarea HTML attributes

### Select
**Location**: `components/ui/select.tsx`

```typescript
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

**Components**:
- `Select` - Root select
- `SelectTrigger` - Trigger button
- `SelectValue` - Display value
- `SelectContent` - Dropdown content
- `SelectItem` - Individual option

### Checkbox
**Location**: `components/ui/checkbox.tsx`

```typescript
import { Checkbox } from '@/components/ui/checkbox';

<Checkbox checked={checked} onCheckedChange={setChecked} />
```

**Props**:
- `checked?: boolean`
- `onCheckedChange?: (checked: boolean) => void`
- All standard checkbox attributes

### Switch
**Location**: `components/ui/switch.tsx`

```typescript
import { Switch } from '@/components/ui/switch';

<Switch checked={checked} onCheckedChange={setChecked} />
```

**Props**:
- `checked?: boolean`
- `onCheckedChange?: (checked: boolean) => void`

### Radio Group
**Location**: `components/ui/radio-group.tsx`

```typescript
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

<RadioGroup value={value} onValueChange={setValue}>
  <RadioGroupItem value="option1" />
  <RadioGroupItem value="option2" />
</RadioGroup>
```

**Components**:
- `RadioGroup` - Group container
- `RadioGroupItem` - Individual radio button

### Slider
**Location**: `components/ui/slider.tsx`

```typescript
import { Slider } from '@/components/ui/slider';

<Slider value={[value]} onValueChange={setValue} max={100} step={1} />
```

**Props**:
- `value?: number[]`
- `onValueChange?: (value: number[]) => void`
- `max?: number`
- `step?: number`

### Progress
**Location**: `components/ui/progress.tsx`

```typescript
import { Progress } from '@/components/ui/progress';

<Progress value={progress} />
```

**Props**:
- `value?: number` - Progress value (0-100)

### Badge
**Location**: `components/ui/badge.tsx`

```typescript
import { Badge } from '@/components/ui/badge';

<Badge variant="default">Label</Badge>
```

**Props**:
- `variant?: 'default' | 'secondary' | 'destructive' | 'outline'`

### Avatar
**Location**: `components/ui/avatar.tsx`

```typescript
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

**Components**:
- `Avatar` - Container
- `AvatarImage` - Image element
- `AvatarFallback` - Fallback content

### Alert
**Location**: `components/ui/alert.tsx`

```typescript
import { Alert, AlertDescription } from '@/components/ui/alert';

<Alert>
  <AlertDescription>Alert message</AlertDescription>
</Alert>
```

**Components**:
- `Alert` - Alert container
- `AlertDescription` - Alert message

### Alert Dialog
**Location**: `components/ui/alert-dialog.tsx`

```typescript
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

<AlertDialog>
  <AlertDialogTrigger>Delete</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
      <AlertDialogDescription>Are you sure?</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**Components**:
- `AlertDialog` - Root dialog
- `AlertDialogTrigger` - Trigger
- `AlertDialogContent` - Content
- `AlertDialogHeader` - Header
- `AlertDialogTitle` - Title
- `AlertDialogDescription` - Description
- `AlertDialogFooter` - Footer
- `AlertDialogAction` - Action button
- `AlertDialogCancel` - Cancel button

### Toast
**Location**: `components/ui/toast.tsx`

```typescript
import { Toast, ToastAction, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast';

<ToastProvider>
  <Toast>
    <ToastTitle>Title</ToastTitle>
    <ToastDescription>Description</ToastDescription>
    <ToastClose />
    <ToastAction altText="Action">Action</ToastAction>
  </Toast>
  <ToastViewport />
</ToastProvider>
```

**Components**:
- `Toast` - Toast container
- `ToastAction` - Action button
- `ToastClose` - Close button
- `ToastDescription` - Description
- `ToastProvider` - Context provider
- `ToastTitle` - Title
- `ToastViewport` - Viewport container

### Toaster
**Location**: `components/ui/toaster.tsx`

```typescript
import { Toaster } from '@/components/ui/toaster';

<Toaster />
```

### Sheet
**Location**: `components/ui/sheet.tsx`

```typescript
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
      <SheetDescription>Description</SheetDescription>
    </SheetHeader>
    Content
  </SheetContent>
</Sheet>
```

**Components**:
- `Sheet` - Root sheet
- `SheetTrigger` - Trigger
- `SheetContent` - Content
- `SheetHeader` - Header
- `SheetTitle` - Title
- `SheetDescription` - Description

### Drawer
**Location**: `components/ui/drawer.tsx`

```typescript
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';

<Drawer>
  <DrawerTrigger>Open</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Title</DrawerTitle>
      <DrawerDescription>Description</DrawerDescription>
    </DrawerHeader>
    Content
  </DrawerContent>
</Drawer>
```

**Components**:
- `Drawer` - Root drawer
- `DrawerTrigger` - Trigger
- `DrawerContent` - Content
- `DrawerHeader` - Header
- `DrawerTitle` - Title
- `DrawerDescription` - Description

### Table
**Location**: `components/ui/table.tsx`

```typescript
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Price</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Product</TableCell>
      <TableCell>₦100,000</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**Components**:
- `Table` - Table container
- `TableHeader` - Header section
- `TableBody` - Body section
- `TableRow` - Table row
- `TableHead` - Header cell
- `TableCell` - Data cell

### Tabs
**Location**: `components/ui/tabs.tsx`

```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

<Tabs value={value} onValueChange={setValue}>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

**Components**:
- `Tabs` - Root tabs
- `TabsList` - Tab list
- `TabsTrigger` - Tab trigger
- `TabsContent` - Tab content

### Accordion
**Location**: `components/ui/accordion.tsx`

```typescript
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>Content 1</AccordionContent>
  </AccordionItem>
</Accordion>
```

**Components**:
- `Accordion` - Root accordion
- `AccordionItem` - Accordion item
- `AccordionTrigger` - Trigger button
- `AccordionContent` - Content area

### Carousel
**Location**: `components/ui/carousel.tsx`

```typescript
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

<Carousel>
  <CarouselContent>
    <CarouselItem>Item 1</CarouselItem>
    <CarouselItem>Item 2</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

**Components**:
- `Carousel` - Root carousel
- `CarouselContent` - Content container
- `CarouselItem` - Individual item
- `CarouselPrevious` - Previous button
- `CarouselNext` - Next button

### Navigation Menu
**Location**: `components/ui/navigation-menu.tsx`

```typescript
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink>Link</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

**Components**:
- `NavigationMenu` - Root menu
- `NavigationMenuList` - Menu list
- `NavigationMenuItem` - Menu item
- `NavigationMenuTrigger` - Trigger
- `NavigationMenuContent` - Content
- `NavigationMenuLink` - Link

### Menubar
**Location**: `components/ui/menubar.tsx`

```typescript
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '@/components/ui/menubar';

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Exit</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

**Components**:
- `Menubar` - Root menubar
- `MenubarMenu` - Menu
- `MenubarTrigger` - Trigger
- `MenubarContent` - Content
- `MenubarItem` - Menu item
- `MenubarSeparator` - Separator
- `MenubarShortcut` - Shortcut

### Context Menu
**Location**: `components/ui/context-menu.tsx`

```typescript
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu';

<ContextMenu>
  <ContextMenuTrigger>Right click me</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Copy</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem>Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

**Components**:
- `ContextMenu` - Root menu
- `ContextMenuTrigger` - Trigger
- `ContextMenuContent` - Content
- `ContextMenuItem` - Menu item
- `ContextMenuSeparator` - Separator

### Dropdown Menu
**Location**: `components/ui/dropdown-menu.tsx`

```typescript
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Item 1</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Item 2</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**Components**:
- `DropdownMenu` - Root menu
- `DropdownMenuTrigger` - Trigger
- `DropdownMenuContent` - Content
- `DropdownMenuItem` - Menu item
- `DropdownMenuSeparator` - Separator

### Popover
**Location**: `components/ui/popover.tsx`

```typescript
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

<Popover>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverContent>Content</PopoverContent>
</Popover>
```

**Components**:
- `Popover` - Root popover
- `PopoverTrigger` - Trigger
- `PopoverContent` - Content

### Hover Card
**Location**: `components/ui/hover-card.tsx`

```typescript
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

<HoverCard>
  <HoverCardTrigger>Hover me</HoverCardTrigger>
  <HoverCardContent>Content</HoverCardContent>
</HoverCard>
```

**Components**:
- `HoverCard` - Root card
- `HoverCardTrigger` - Trigger
- `HoverCardContent` - Content

### Tooltip
**Location**: `components/ui/tooltip.tsx`

```typescript
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>Tooltip text</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

**Components**:
- `TooltipProvider` - Provider
- `Tooltip` - Root tooltip
- `TooltipTrigger` - Trigger
- `TooltipContent` - Content

### Toggle
**Location**: `components/ui/toggle.tsx`

```typescript
import { Toggle } from '@/components/ui/toggle';

<Toggle pressed={pressed} onPressedChange={setPressed}>
  Toggle
</Toggle>
```

**Props**:
- `pressed?: boolean`
- `onPressedChange?: (pressed: boolean) => void`

### Toggle Group
**Location**: `components/ui/toggle-group.tsx`

```typescript
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

<ToggleGroup type="single" value={value} onValueChange={setValue}>
  <ToggleGroupItem value="option1">Option 1</ToggleGroupItem>
  <ToggleGroupItem value="option2">Option 2</ToggleGroupItem>
</ToggleGroup>
```

**Components**:
- `ToggleGroup` - Group container
- `ToggleGroupItem` - Individual toggle

### Calendar
**Location**: `components/ui/calendar.tsx`

```typescript
import { Calendar } from '@/components/ui/calendar';

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-md border"
/>
```

**Props**:
- `mode?: 'single' | 'multiple' | 'range'`
- `selected?: Date | Date[] | DateRange`
- `onSelect?: (date: Date | Date[] | DateRange | undefined) => void`

### Label
**Location**: `components/ui/label.tsx`

```typescript
import { Label } from '@/components/ui/label';

<Label htmlFor="input">Label</Label>
```

**Props**: All standard label HTML attributes

### Separator
**Location**: `components/ui/separator.tsx`

```typescript
import { Separator } from '@/components/ui/separator';

<Separator />
```

**Props**:
- `orientation?: 'horizontal' | 'vertical'`
- `decorative?: boolean`

### Scroll Area
**Location**: `components/ui/scroll-area.tsx`

```typescript
import { ScrollArea } from '@/components/ui/scroll-area';

<ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
  Content
</ScrollArea>
```

### Resizable
**Location**: `components/ui/resizable.tsx`

```typescript
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={50}>Panel 1</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={50}>Panel 2</ResizablePanel>
</ResizablePanelGroup>
```

**Components**:
- `ResizablePanelGroup` - Group container
- `ResizablePanel` - Individual panel
- `ResizableHandle` - Resize handle

### Command
**Location**: `components/ui/command.tsx`

```typescript
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

<Command>
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Item 1</CommandItem>
      <CommandItem>Item 2</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

**Components**:
- `Command` - Root command
- `CommandInput` - Input field
- `CommandList` - List container
- `CommandEmpty` - Empty state
- `CommandGroup` - Group
- `CommandItem` - Individual item

### Input OTP
**Location**: `components/ui/input-otp.tsx`

```typescript
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

<InputOTP value={value} onChange={setValue}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
  </InputOTPGroup>
</InputOTP>
```

**Components**:
- `InputOTP` - Root OTP input
- `InputOTPGroup` - Group container
- `InputOTPSlot` - Individual slot

### Skeleton
**Location**: `components/ui/skeleton.tsx`

```typescript
import { Skeleton } from '@/components/ui/skeleton';

<Skeleton className="h-4 w-[250px]" />
```

### Aspect Ratio
**Location**: `components/ui/aspect-ratio.tsx`

```typescript
import { AspectRatio } from '@/components/ui/aspect-ratio';

<AspectRatio ratio={16 / 9}>
  <img src="/image.jpg" alt="Image" />
</AspectRatio>
```

**Props**:
- `ratio?: number` - Aspect ratio (width/height)

### Breadcrumb
**Location**: `components/ui/breadcrumb.tsx`

```typescript
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Products</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

**Components**:
- `Breadcrumb` - Root breadcrumb
- `BreadcrumbList` - List container
- `BreadcrumbItem` - Individual item
- `BreadcrumbLink` - Link
- `BreadcrumbPage` - Current page
- `BreadcrumbSeparator` - Separator

### Pagination
**Location**: `components/ui/pagination.tsx`

```typescript
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

**Components**:
- `Pagination` - Root pagination
- `PaginationContent` - Content container
- `PaginationItem` - Individual item
- `PaginationLink` - Page link
- `PaginationPrevious` - Previous button
- `PaginationNext` - Next button
- `PaginationEllipsis` - Ellipsis

### Chart
**Location**: `components/ui/chart.tsx`

```typescript
import { Chart } from '@/components/ui/chart';

<Chart data={data} />
```

**Props**:
- `data: any` - Chart data

### Mode Toggle
**Location**: `components/ui/mode-toggle.tsx`

```typescript
import { ModeToggle } from '@/components/ui/mode-toggle';

<ModeToggle />
```

### WhatsApp Button
**Location**: `components/ui/whatsapp-button.tsx`

```typescript
import { FloatingWhatsAppButton } from '@/components/ui/whatsapp-button';

<FloatingWhatsAppButton />
```

### Cart Indicator
**Location**: `components/ui/cart-indicator.tsx`

```typescript
import { CartIndicator } from '@/components/ui/cart-indicator';

<CartIndicator />
```

### Sonner
**Location**: `components/ui/sonner.tsx`

```typescript
import { Toaster } from '@/components/ui/sonner';

<Toaster />
```

---

## Layout Components

### Header
**Location**: `components/layout/Header.tsx`

```typescript
import { Header } from '@/components/layout/Header';

<Header />
```

### Footer
**Location**: `components/layout/Footer.tsx`

```typescript
import { Footer } from '@/components/layout/Footer';

<Footer />
```

### ThemeProvider
**Location**: `components/layout/ThemeProvider.tsx`

```typescript
import { ThemeProvider } from '@/components/layout/ThemeProvider';

<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

**Props**:
- `attribute?: string` - HTML attribute for theme class
- `defaultTheme?: string` - Default theme
- `enableSystem?: boolean` - Enable system theme detection
- `disableTransitionOnChange?: boolean` - Disable transitions on theme change

---

## Product Components

### ProductCard
**Location**: `components/products/ProductCard.tsx`

```typescript
import { ProductCard } from '@/components/products/ProductCard';

<ProductCard product={product} />
```

**Props**:
- `product: Product` - Product data to display

### ProductGrid
**Location**: `components/products/ProductGrid.tsx`

```typescript
import { ProductGrid } from '@/components/products/ProductGrid';

<ProductGrid products={products} />
```

**Props**:
- `products: Product[]` - Array of products to display

### ProductFilters
**Location**: `components/products/ProductFilters.tsx`

```typescript
import { ProductFilters } from '@/components/products/ProductFilters';

<ProductFilters 
  categories={categories}
  selectedCategory={selectedCategory}
  onCategoryChange={setSelectedCategory}
/>
```

**Props**:
- `categories: string[]` - Available categories
- `selectedCategory: string` - Currently selected category
- `onCategoryChange: (category: string) => void` - Category change handler

### ProductImageGallery
**Location**: `components/products/ProductImageGallery.tsx`

```typescript
import { ProductImageGallery } from '@/components/products/ProductImageGallery';

<ProductImageGallery images={productImages} />
```

**Props**:
- `images: string[]` - Array of image URLs

### EnquiryCartModal
**Location**: `components/products/EnquiryCartModal.tsx`

```typescript
import { EnquiryCartModal } from '@/components/products/EnquiryCartModal';

<EnquiryCartModal 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>
```

**Props**:
- `isOpen: boolean` - Modal open state
- `onClose: () => void` - Close handler

### FeaturedProducts
**Location**: `components/products/FeaturedProducts.tsx`

```typescript
import { FeaturedProducts } from '@/components/products/FeaturedProducts';

<FeaturedProducts />
```

### FloatingEnquiryButton
**Location**: `components/products/FloatingEnquiryButton.tsx`

```typescript
import { FloatingEnquiryButton } from '@/components/products/FloatingEnquiryButton';

<FloatingEnquiryButton />
```

### ProductPageClient
**Location**: `components/products/ProductPageClient.tsx`

```typescript
import { ProductPageClient } from '@/components/products/ProductPageClient';

<ProductPageClient product={product} />
```

**Props**:
- `product: Product` - Product data

### MultiImageUpload
**Location**: `components/products/MultiImageUpload.tsx`

```typescript
import { MultiImageUpload } from '@/components/products/MultiImageUpload';

<MultiImageUpload 
  images={images}
  onImagesChange={setImages}
/>
```

**Props**:
- `images: string[]` - Current images
- `onImagesChange: (images: string[]) => void` - Images change handler

---

## Admin Components

### Admin Layout Components
**Location**: `components/admin/`

Components for admin-specific layouts and navigation.

### Customer Management Components
**Location**: `components/customers/`

Components for managing customer data and relationships.

### Inventory Management Components
**Location**: `components/inventory/`

Components for managing product inventory and stock levels.

---

## Auth Components

### Auth Components
**Location**: `components/auth/`

Authentication-related components for login, registration, and user management.

---

## Home Components

### Home Components
**Location**: `components/home/`

Components specific to the home page and landing sections.

---

## Usage Guidelines

### Component Import Pattern
```typescript
// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Layout Components
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// Feature Components
import { ProductCard } from '@/components/products/ProductCard';
import { EnquiryCartModal } from '@/components/products/EnquiryCartModal';
```

### Common Props Pattern
Most components follow these common prop patterns:

1. **Children**: Components that accept children content
2. **className**: For custom styling
3. **onClick/onChange**: Event handlers
4. **disabled**: Disabled state
5. **loading**: Loading state

### Styling Guidelines
- Use Tailwind CSS classes for styling
- Use the `cn()` utility for conditional classes
- Follow the design system color palette
- Use responsive design patterns

### Accessibility
- All components include proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Focus management

### Performance
- Components are optimized for performance
- Use React.memo for expensive components
- Implement proper loading states
- Lazy load when appropriate

This component reference provides a comprehensive overview of all available components in the Authentic Furniture application. For detailed usage examples and advanced patterns, refer to the main API documentation.