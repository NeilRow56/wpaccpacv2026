"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockTemplates, Template } from "@/lib/mock";
import { CheckCircle, Filter, Search } from "lucide-react";
import { useState } from "react";
import { TemplateCard } from "./_components/template-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const router = useRouter();
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
    router.push(`/dashboard/templates/${template.id}`);
  };

  const HandlePreview = (template: Template) => {
    setPreviewTemplate(template);
  };
  return (
    <div className="p-6 soace-y-6">
      {/*  Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Template Gallery</h1>
        <p className="text-gray-400">
          {" "}
          Get started quickly with pre-built templates
        </p>
      </div>

      {/*  Template filters */}
      <div className="flex items-center space-x-4 bg-[#121826] p-4 rounded-lg border-[#1E293B]">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#1E293B] border-[#334155] text-gray-400"
          />
        </div>
        <div className="flex items-center space-x-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-green-500 hover:green-600 text-black"
                  : "border-[#334155] text-gray-300 hover:bg[#1E293B] hover:text-white"
              }
            >
              {category === "all" ? "All" : category}
            </Button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <Badge variant="outline" className="border-[#334155] text-gray-400">
            {filteredTemplates.length} template
            {filteredTemplates.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </div>
      {/*  Template Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTemplates?.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onUseTemplate={handleUseTemplate}
              onPreview={HandlePreview}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            No templates found
          </h3>
          <p className="text-gray-400">
            Try adjusting your search criteria or gategory filters
          </p>
        </div>
      )}
      {/*  Preview Dialog */}
      <Dialog
        open={!!previewTemplate}
        onOpenChange={() => setPreviewTemplate(null)}
      >
        <DialogContent className="bg-[#121826] border-[#1E293B] text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center space-x-3">
              <span className="text-3xl">
                {previewTemplate &&
                  previewTemplate.icon === "CreditCard" &&
                  "💳"}
                {previewTemplate && previewTemplate.icon === "Mail" && "📧"}
                {previewTemplate && previewTemplate.icon === "Webhook" && "📎"}
                {previewTemplate && previewTemplate.icon === "FileText" && "📝"}
              </span>
              <span>{previewTemplate?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              <span>{previewTemplate?.description}</span>
            </DialogDescription>
          </DialogHeader>
          {previewTemplate && (
            <div className=" space-y-3 mt-6">
              <div>
                <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
                  Worlflow Steps
                </h4>
                <div className="space-y-3">
                  {previewTemplate?.steps.map((step, index) => (
                    <div
                      className="flex items-center space-x-3 bg-[#1E293B] rounded-lg"
                      key={index}
                    >
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-400">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{step}</div>
                      </div>

                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  ))}
                </div>
                <div className="flex space-x-3 mt-2">
                  <Button
                    onClick={() => {
                      handleUseTemplate(previewTemplate);
                      setPreviewTemplate(null);
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-black font-medium"
                  >
                    Use this Template
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPreviewTemplate(null)}
                    className="border-[#334155] border text-gray-300 bg-[#121826] hover:bg-[#1E293B] hover:text-white"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
