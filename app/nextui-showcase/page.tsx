"use client";

import { NextUIButton } from "@/components/ui/nextui-button";
import { NextUICard, NextUICardHeader, NextUICardBody, NextUICardFooter } from "@/components/ui/nextui-card";
import { NextUIInput } from "@/components/ui/nextui-input";
import { NextUIChip } from "@/components/ui/nextui-chip";
import { NextUIAvatar } from "@/components/ui/nextui-avatar";
import { NextUITabs, NextUITabsList, NextUITabsTrigger, NextUITabsContent } from "@/components/ui/nextui-tabs";
import { NextUIDropdown, NextUIDropdownTrigger, NextUIDropdownContent, NextUIDropdownItem, NextUIDropdownSeparator } from "@/components/ui/nextui-dropdown";
import { Search, Mail, Heart, ShoppingCart, User, Settings, LogOut, Plus, Star } from "lucide-react";

export default function NextUIShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-24 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            NextUI Components Showcase
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Beautiful, modern UI components for your furniture store
          </p>
        </div>

        {/* Buttons Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Buttons</h2>
          <NextUICard variant="bordered">
            <NextUICardBody>
              <div className="space-y-6">
                {/* Variants */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Variants</h3>
                  <div className="flex flex-wrap gap-3">
                    <NextUIButton variant="solid">Solid</NextUIButton>
                    <NextUIButton variant="bordered">Bordered</NextUIButton>
                    <NextUIButton variant="light">Light</NextUIButton>
                    <NextUIButton variant="flat">Flat</NextUIButton>
                    <NextUIButton variant="ghost">Ghost</NextUIButton>
                    <NextUIButton variant="shadow">Shadow</NextUIButton>
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Sizes</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <NextUIButton size="sm">Small</NextUIButton>
                    <NextUIButton size="md">Medium</NextUIButton>
                    <NextUIButton size="lg">Large</NextUIButton>
                  </div>
                </div>

                {/* With Icons */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">With Icons</h3>
                  <div className="flex flex-wrap gap-3">
                    <NextUIButton startContent={<ShoppingCart className="w-4 h-4" />}>
                      Add to Cart
                    </NextUIButton>
                    <NextUIButton variant="bordered" endContent={<Heart className="w-4 h-4" />}>
                      Wishlist
                    </NextUIButton>
                    <NextUIButton variant="shadow" radius="full" size="sm">
                      <Plus className="w-4 h-4" />
                    </NextUIButton>
                  </div>
                </div>

                {/* Loading */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Loading State</h3>
                  <NextUIButton isLoading>Loading...</NextUIButton>
                </div>
              </div>
            </NextUICardBody>
          </NextUICard>
        </section>

        {/* Cards Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NextUICard variant="shadow" isHoverable>
              <NextUICardHeader>
                <h3 className="font-bold text-lg">Shadow Card</h3>
              </NextUICardHeader>
              <NextUICardBody>
                <p className="text-slate-600 dark:text-slate-400">
                  Hover me to see the scale animation!
                </p>
              </NextUICardBody>
            </NextUICard>

            <NextUICard variant="bordered" isHoverable>
              <NextUICardHeader>
                <h3 className="font-bold text-lg">Bordered Card</h3>
              </NextUICardHeader>
              <NextUICardBody>
                <p className="text-slate-600 dark:text-slate-400">
                  Clean and minimal design
                </p>
              </NextUICardBody>
            </NextUICard>

            <NextUICard variant="blur" isHoverable>
              <NextUICardHeader>
                <h3 className="font-bold text-lg">Blur Card</h3>
              </NextUICardHeader>
              <NextUICardBody>
                <p className="text-slate-600 dark:text-slate-400">
                  Glassmorphism effect!
                </p>
              </NextUICardBody>
            </NextUICard>
          </div>
        </section>

        {/* Inputs Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Inputs</h2>
          <NextUICard variant="bordered">
            <NextUICardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <NextUIInput 
                  label="Email" 
                  type="email"
                  variant="flat"
                  startContent={<Mail className="w-4 h-4" />}
                />
                <NextUIInput 
                  label="Search" 
                  variant="bordered"
                  endContent={<Search className="w-4 h-4" />}
                />
                <NextUIInput 
                  label="Username" 
                  variant="faded"
                />
                <NextUIInput 
                  label="Password" 
                  type="password"
                  variant="underlined"
                />
              </div>
            </NextUICardBody>
          </NextUICard>
        </section>

        {/* Chips Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Chips / Badges</h2>
          <NextUICard variant="bordered">
            <NextUICardBody>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <NextUIChip color="primary">Primary</NextUIChip>
                  <NextUIChip color="success">Success</NextUIChip>
                  <NextUIChip color="warning">Warning</NextUIChip>
                  <NextUIChip color="danger">Danger</NextUIChip>
                </div>
                <div className="flex flex-wrap gap-3">
                  <NextUIChip variant="bordered" color="primary">Bordered</NextUIChip>
                  <NextUIChip variant="light" color="success">Light</NextUIChip>
                  <NextUIChip variant="flat">Flat</NextUIChip>
                </div>
                <div className="flex flex-wrap gap-3">
                  <NextUIChip 
                    color="primary" 
                    startContent={<Star className="w-3 h-3" />}
                  >
                    With Icon
                  </NextUIChip>
                  <NextUIChip 
                    color="danger" 
                    onClose={() => alert('Closed!')}
                  >
                    Closeable
                  </NextUIChip>
                </div>
              </div>
            </NextUICardBody>
          </NextUICard>
        </section>

        {/* Avatars Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Avatars</h2>
          <NextUICard variant="bordered">
            <NextUICardBody>
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                  <NextUIAvatar size="sm" name="John Doe" />
                  <NextUIAvatar size="md" name="Jane Smith" />
                  <NextUIAvatar size="lg" name="Bob Wilson" />
                  <NextUIAvatar size="xl" name="Alice Brown" />
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <NextUIAvatar name="Online" status="online" />
                  <NextUIAvatar name="Away" status="away" />
                  <NextUIAvatar name="Busy" status="busy" />
                  <NextUIAvatar name="Offline" status="offline" />
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <NextUIAvatar name="User" bordered />
                  <NextUIAvatar name="Admin" bordered radius="md" />
                  <NextUIAvatar name="Guest" radius="sm" />
                </div>
              </div>
            </NextUICardBody>
          </NextUICard>
        </section>

        {/* Tabs Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Tabs</h2>
          <NextUICard variant="bordered">
            <NextUICardBody>
              <NextUITabs defaultValue="tab1">
                <NextUITabsList variant="solid">
                  <NextUITabsTrigger value="tab1" variant="solid">Products</NextUITabsTrigger>
                  <NextUITabsTrigger value="tab2" variant="solid">Categories</NextUITabsTrigger>
                  <NextUITabsTrigger value="tab3" variant="solid">Settings</NextUITabsTrigger>
                </NextUITabsList>
                <NextUITabsContent value="tab1">
                  <p className="text-slate-600 dark:text-slate-400">Products content goes here</p>
                </NextUITabsContent>
                <NextUITabsContent value="tab2">
                  <p className="text-slate-600 dark:text-slate-400">Categories content goes here</p>
                </NextUITabsContent>
                <NextUITabsContent value="tab3">
                  <p className="text-slate-600 dark:text-slate-400">Settings content goes here</p>
                </NextUITabsContent>
              </NextUITabs>
            </NextUICardBody>
          </NextUICard>
        </section>

        {/* Dropdown Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Dropdown</h2>
          <NextUICard variant="bordered">
            <NextUICardBody>
              <div className="flex gap-4">
                <NextUIDropdown>
                  <NextUIDropdownTrigger>
                    <NextUIButton variant="bordered">
                      Open Menu
                    </NextUIButton>
                  </NextUIDropdownTrigger>
                  <NextUIDropdownContent>
                    <NextUIDropdownItem>
                      <User className="w-4 h-4 mr-2 inline" />
                      Profile
                    </NextUIDropdownItem>
                    <NextUIDropdownItem>
                      <Settings className="w-4 h-4 mr-2 inline" />
                      Settings
                    </NextUIDropdownItem>
                    <NextUIDropdownSeparator />
                    <NextUIDropdownItem className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2 inline" />
                      Logout
                    </NextUIDropdownItem>
                  </NextUIDropdownContent>
                </NextUIDropdown>
              </div>
            </NextUICardBody>
          </NextUICard>
        </section>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-slate-600 dark:text-slate-400">
            All components are ready to use in your furniture store! 🎉
          </p>
        </div>
      </div>
    </div>
  );
}
