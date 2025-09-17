"use client";

import { useEffect, useState } from "react";
import { getAllSpaces, createSpace, updateSpace, deleteSpace, createSubcategory, updateSubcategory, deleteSubcategory } from "@/lib/categories";
import { Space, Subcategory } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Home, Briefcase, Building, TreePine } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminSpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [isSpaceDialogOpen, setIsSpaceDialogOpen] = useState(false);
  const [isSubcategoryDialogOpen, setIsSubcategoryDialogOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<Space | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>("");
  
  const [spaceFormData, setSpaceFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "Home",
    sort_order: 0,
    is_active: true,
  });

  const [subcategoryFormData, setSubcategoryFormData] = useState({
    space_id: "",
    name: "",
    slug: "",
    description: "",
    icon: "Table",
    sort_order: 0,
    is_active: true,
  });

  const iconOptions = [
    { value: "Home", label: "Home", icon: Home },
    { value: "Briefcase", label: "Office", icon: Briefcase },
    { value: "Building", label: "Commercial", icon: Building },
    { value: "TreePine", label: "Outdoor", icon: TreePine },
    { value: "Sofa", label: "Sofa", icon: Home },
    { value: "Bed", label: "Bed", icon: Home },
    { value: "Archive", label: "Cabinet", icon: Home },
    { value: "Table", label: "Table", icon: Home },
    { value: "GraduationCap", label: "Chair", icon: Home },
    { value: "Users", label: "Conference", icon: Home },
    { value: "Armchair", label: "Armchair", icon: Home },
    { value: "Sun", label: "Pool", icon: Home },
  ];

  useEffect(() => {
    loadSpaces();
  }, []);

  const loadSpaces = async () => {
    try {
      setLoading(true);
      const spacesData = await getAllSpaces();
      setSpaces(spacesData);
    } catch (error) {
      console.error("Error loading spaces:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetSpaceForm = () => {
    setSpaceFormData({
      name: "",
      slug: "",
      description: "",
      icon: "Home",
      sort_order: 0,
      is_active: true,
    });
    setEditingSpace(null);
  };

  const resetSubcategoryForm = () => {
    setSubcategoryFormData({
      space_id: "",
      name: "",
      slug: "",
      description: "",
      icon: "Table",
      sort_order: 0,
      is_active: true,
    });
    setEditingSubcategory(null);
  };

  const handleSpaceEdit = (space: Space) => {
    setEditingSpace(space);
    setSpaceFormData({
      name: space.name,
      slug: space.slug,
      description: space.description || "",
      icon: space.icon || "Home",
      sort_order: space.sort_order,
      is_active: space.is_active,
    });
    setIsSpaceDialogOpen(true);
  };

  const handleSubcategoryEdit = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setSubcategoryFormData({
      space_id: subcategory.space_id,
      name: subcategory.name,
      slug: subcategory.slug,
      description: subcategory.description || "",
      icon: subcategory.icon || "Table",
      sort_order: subcategory.sort_order,
      is_active: subcategory.is_active,
    });
    setIsSubcategoryDialogOpen(true);
  };

  const handleSpaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spaceFormData.name.trim()) return;

    try {
      setSavingId(editingSpace?.id || "new");
      
      if (editingSpace) {
        const updatedSpace = await updateSpace(editingSpace.id, spaceFormData);
        if (updatedSpace) {
          setSpaces(spaces.map(space => space.id === editingSpace.id ? updatedSpace : space));
        }
      } else {
        const newSpace = await createSpace(spaceFormData);
        if (newSpace) {
          setSpaces([...spaces, newSpace]);
        }
      }
      
      setIsSpaceDialogOpen(false);
      resetSpaceForm();
    } catch (error) {
      console.error("Error saving space:", error);
    } finally {
      setSavingId(null);
    }
  };

  const handleSubcategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subcategoryFormData.name.trim() || !subcategoryFormData.space_id) return;

    try {
      setSavingId(editingSubcategory?.id || "new");
      
      if (editingSubcategory) {
        const updatedSubcategory = await updateSubcategory(editingSubcategory.id, subcategoryFormData);
        if (updatedSubcategory) {
          // Robustly move/update subcategory across spaces if space changed
          setSpaces(prev => {
            // Remove from all spaces first
            const removed = prev.map(space => ({
              ...space,
              subcategories: (space.subcategories || []).filter(sub => sub.id !== updatedSubcategory.id)
            }));
            // Insert into target space
            return removed.map(space => {
              if (space.id === updatedSubcategory.space_id) {
                const nextSubs = [...(space.subcategories || []), updatedSubcategory]
                  .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
                return { ...space, subcategories: nextSubs };
              }
              return space;
            });
          });
        }
      } else {
        const newSubcategory = await createSubcategory(subcategoryFormData);
        if (newSubcategory) {
          // Add the subcategory to the spaces array
          setSpaces(prev => prev.map(space => {
            if (space.id === newSubcategory.space_id) {
              const nextSubs = [...(space.subcategories || []), newSubcategory]
                .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
              return { ...space, subcategories: nextSubs };
            }
            return space;
          }));
        }
      }
      
      setIsSubcategoryDialogOpen(false);
      resetSubcategoryForm();
    } catch (error) {
      console.error("Error saving subcategory:", error);
    } finally {
      setSavingId(null);
    }
  };

  const handleSpaceDelete = async (spaceId: string) => {
    if (!confirm("Are you sure you want to delete this space? This will also delete all its subcategories.")) return;

    try {
      setSavingId(spaceId);
      const success = await deleteSpace(spaceId);
      if (success) {
        setSpaces(spaces.filter(space => space.id !== spaceId));
      }
    } catch (error) {
      console.error("Error deleting space:", error);
    } finally {
      setSavingId(null);
    }
  };

  const handleSubcategoryDelete = async (subcategoryId: string, spaceId: string) => {
    if (!confirm("Are you sure you want to delete this subcategory?")) return;

    try {
      setSavingId(subcategoryId);
      const success = await deleteSubcategory(subcategoryId);
      if (success) {
        setSpaces(spaces.map(space => {
          if (space.id === spaceId) {
            return {
              ...space,
              subcategories: space.subcategories?.filter(sub => sub.id !== subcategoryId) || []
            };
          }
          return space;
        }));
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    } finally {
      setSavingId(null);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading spaces...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Spaces & Categories</h1>
          <p className="text-muted-foreground mt-2">
            Manage your product spaces and subcategories
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isSpaceDialogOpen} onOpenChange={setIsSpaceDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetSpaceForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Space
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingSpace ? "Edit Space" : "Add New Space"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSpaceSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="space-name">Space Name</Label>
                  <Input
                    id="space-name"
                    value={spaceFormData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setSpaceFormData({
                        ...spaceFormData,
                        name,
                        slug: generateSlug(name)
                      });
                    }}
                    placeholder="e.g., Home, Office, Outdoor"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="space-slug">Slug</Label>
                  <Input
                    id="space-slug"
                    value={spaceFormData.slug}
                    onChange={(e) => setSpaceFormData({...spaceFormData, slug: e.target.value})}
                    placeholder="e.g., home, office, outdoor"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="space-description">Description</Label>
                  <Textarea
                    id="space-description"
                    value={spaceFormData.description}
                    onChange={(e) => setSpaceFormData({...spaceFormData, description: e.target.value})}
                    placeholder="Brief description of this space"
                  />
                </div>
                <div>
                  <Label htmlFor="space-icon">Icon</Label>
                  <Select
                    value={spaceFormData.icon}
                    onValueChange={(value) => setSpaceFormData({...spaceFormData, icon: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center space-x-2">
                              <IconComponent className="w-4 h-4" />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="space-sort">Sort Order</Label>
                  <Input
                    id="space-sort"
                    type="number"
                    value={spaceFormData.sort_order}
                    onChange={(e) => setSpaceFormData({...spaceFormData, sort_order: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="space-active"
                    checked={spaceFormData.is_active}
                    onCheckedChange={(checked) => setSpaceFormData({...spaceFormData, is_active: checked})}
                  />
                  <Label htmlFor="space-active">Active</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsSpaceDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={savingId === (editingSpace?.id || "new")}>
                    {savingId === (editingSpace?.id || "new") ? "Saving..." : editingSpace ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isSubcategoryDialogOpen} onOpenChange={setIsSubcategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={resetSubcategoryForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Subcategory
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingSubcategory ? "Edit Subcategory" : "Add New Subcategory"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubcategorySubmit} className="space-y-4">
                <div>
                  <Label htmlFor="subcategory-space">Space</Label>
                  <Select
                    value={subcategoryFormData.space_id}
                    onValueChange={(value) => setSubcategoryFormData({...subcategoryFormData, space_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a space" />
                    </SelectTrigger>
                    <SelectContent>
                      {spaces.map((space) => (
                        <SelectItem key={space.id} value={space.id}>
                          {space.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subcategory-name">Subcategory Name</Label>
                  <Input
                    id="subcategory-name"
                    value={subcategoryFormData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setSubcategoryFormData({
                        ...subcategoryFormData,
                        name,
                        slug: generateSlug(name)
                      });
                    }}
                    placeholder="e.g., Sofa Sets, Office Chairs"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subcategory-slug">Slug</Label>
                  <Input
                    id="subcategory-slug"
                    value={subcategoryFormData.slug}
                    onChange={(e) => setSubcategoryFormData({...subcategoryFormData, slug: e.target.value})}
                    placeholder="e.g., sofa-sets, office-chairs"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subcategory-description">Description</Label>
                  <Textarea
                    id="subcategory-description"
                    value={subcategoryFormData.description}
                    onChange={(e) => setSubcategoryFormData({...subcategoryFormData, description: e.target.value})}
                    placeholder="Brief description of this subcategory"
                  />
                </div>
                <div>
                  <Label htmlFor="subcategory-icon">Icon</Label>
                  <Select
                    value={subcategoryFormData.icon}
                    onValueChange={(value) => setSubcategoryFormData({...subcategoryFormData, icon: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center space-x-2">
                              <IconComponent className="w-4 h-4" />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subcategory-sort">Sort Order</Label>
                  <Input
                    id="subcategory-sort"
                    type="number"
                    value={subcategoryFormData.sort_order}
                    onChange={(e) => setSubcategoryFormData({...subcategoryFormData, sort_order: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="subcategory-active"
                    checked={subcategoryFormData.is_active}
                    onCheckedChange={(checked) => setSubcategoryFormData({...subcategoryFormData, is_active: checked})}
                  />
                  <Label htmlFor="subcategory-active">Active</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsSubcategoryDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={savingId === (editingSubcategory?.id || "new")}>
                    {savingId === (editingSubcategory?.id || "new") ? "Saving..." : editingSubcategory ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-6">
        {spaces.map((space) => {
          const IconComponent = getIconComponent(space.icon || 'Home');
          return (
            <Card key={space.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                    <div>
                      <CardTitle className="text-xl">{space.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{space.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={space.is_active ? "default" : "secondary"}>
                      {space.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSpaceEdit(space)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSpaceDelete(space.id)}
                      disabled={savingId === space.id}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {space.subcategories?.map((subcategory) => {
                    const SubIconComponent = getIconComponent(subcategory.icon || 'Table');
                    return (
                      <div key={subcategory.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <SubIconComponent className="w-4 h-4 text-slate-600" />
                          <div>
                            <div className="font-medium">{subcategory.name}</div>
                            <div className="text-sm text-muted-foreground">{subcategory.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={subcategory.is_active ? "default" : "secondary"}>
                            {subcategory.is_active ? "Active" : "Inactive"}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSubcategoryEdit(subcategory)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSubcategoryDelete(subcategory.id, space.id)}
                            disabled={savingId === subcategory.id}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Helper function to get icon component
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    'Home': Home,
    'Briefcase': Briefcase,
    'Building': Building,
    'TreePine': TreePine,
    'Sofa': Home,
    'Bed': Home,
    'Archive': Home,
    'Table': Home,
    'GraduationCap': Home,
    'Users': Home,
    'Armchair': Home,
    'Sun': Home,
  };
  return iconMap[iconName] || Home;
};
