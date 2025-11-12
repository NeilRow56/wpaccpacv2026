"use client";

import { mockTemplates, Template } from "@/lib/mock";
import { useState } from "react";

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  // Create a new array from the categories in lib/mock.ts
  const categories = [
    "all",
    ...Array.from(new Set(mockTemplates.map((t) => t.category))),
  ];

  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;

    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (template: Template) => {
    console.log("");
  };
  return <div>Templates Page</div>;
}
