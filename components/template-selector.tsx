"use client"

import { TEMPLATES, type TemplateId } from "@/lib/pdf-templates"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface TemplateSelectorProps {
  value: TemplateId
  onChange: (value: TemplateId) => void
}

export function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {TEMPLATES.map((template) => (
        <button
          key={template.id}
          type="button"
          onClick={() => onChange(template.id)}
          className={cn(
            "relative rounded-lg border-2 p-2 text-left transition-all hover:border-primary/50",
            value === template.id
              ? "border-primary bg-primary/5"
              : "border-border bg-background"
          )}
        >
          {/* Selection indicator */}
          {value === template.id && (
            <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
              <Check className="h-3 w-3 text-primary-foreground" />
            </div>
          )}

          {/* Template Preview */}
          <div className="aspect-[8.5/11] rounded border bg-white mb-2 overflow-hidden">
            <TemplatePreview template={template} />
          </div>

          {/* Template Info */}
          <div className="space-y-0.5">
            <p className="text-sm font-medium">{template.name}</p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {template.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}

function TemplatePreview({ template }: { template: (typeof TEMPLATES)[0] }) {
  const { primary, secondary, accent } = template.previewColors

  // Different preview layouts for each template
  switch (template.id) {
    case "classic":
      return (
        <div className="h-full p-2 flex flex-col" style={{ fontSize: "4px" }}>
          {/* Header */}
          <div className="border-b pb-1 mb-1" style={{ borderColor: "#000" }}>
            <div className="h-2 w-12 rounded-sm mb-0.5" style={{ backgroundColor: primary }} />
            <div className="h-1 w-8 rounded-sm mb-1" style={{ backgroundColor: secondary }} />
            <div className="flex gap-1">
              <div className="h-0.5 w-4 rounded-sm" style={{ backgroundColor: accent }} />
              <div className="h-0.5 w-4 rounded-sm" style={{ backgroundColor: accent }} />
            </div>
          </div>
          {/* Sections */}
          <div className="flex-1 space-y-1">
            <div>
              <div className="h-1 w-10 rounded-sm mb-0.5 border-b" style={{ borderColor: accent, color: primary }} />
              <div className="h-0.5 w-full rounded-sm" style={{ backgroundColor: "#e5e7eb" }} />
              <div className="h-0.5 w-3/4 rounded-sm mt-0.5" style={{ backgroundColor: "#e5e7eb" }} />
            </div>
            <div>
              <div className="h-1 w-8 rounded-sm mb-0.5 border-b" style={{ borderColor: accent }} />
              <div className="flex flex-wrap gap-0.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-1 w-3 rounded-sm bg-gray-100" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )

    case "modern":
      return (
        <div className="h-full p-2 flex flex-col" style={{ fontSize: "4px" }}>
          {/* Header with accent border */}
          <div className="border-b-2 pb-1 mb-1" style={{ borderColor: accent }}>
            <div className="h-2.5 w-14 rounded-sm mb-0.5" style={{ backgroundColor: primary }} />
            <div className="h-1 w-8 rounded-sm mb-1" style={{ backgroundColor: accent }} />
            <div className="flex gap-1">
              <div className="h-0.5 w-4 rounded-sm" style={{ backgroundColor: secondary }} />
              <div className="h-0.5 w-4 rounded-sm" style={{ backgroundColor: secondary }} />
            </div>
          </div>
          {/* Sections */}
          <div className="flex-1 space-y-1">
            <div>
              <div className="h-1 w-6 rounded-sm mb-0.5" style={{ backgroundColor: accent }} />
              <div className="h-0.5 w-full rounded-sm" style={{ backgroundColor: "#e5e7eb" }} />
            </div>
            <div>
              <div className="h-1 w-5 rounded-sm mb-0.5" style={{ backgroundColor: accent }} />
              <div className="flex flex-wrap gap-0.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-1.5 w-4 rounded-full" style={{ backgroundColor: "#eff6ff" }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )

    case "minimal":
      return (
        <div className="h-full p-3 flex flex-col items-center" style={{ fontSize: "4px" }}>
          {/* Centered Header */}
          <div className="text-center mb-2">
            <div className="h-1.5 w-12 rounded-sm mb-0.5 mx-auto" style={{ backgroundColor: primary }} />
            <div className="h-0.5 w-8 rounded-sm mx-auto" style={{ backgroundColor: secondary }} />
          </div>
          {/* Minimal sections */}
          <div className="w-full space-y-1">
            <div className="border-b" style={{ borderColor: "#e5e5e5" }}>
              <div className="h-0.5 w-4 rounded-sm mb-1" style={{ backgroundColor: accent }} />
            </div>
            <div className="h-0.5 w-full rounded-sm" style={{ backgroundColor: "#e5e7eb" }} />
            <div className="border-b" style={{ borderColor: "#e5e5e5" }}>
              <div className="h-0.5 w-6 rounded-sm mb-1 mt-1" style={{ backgroundColor: accent }} />
            </div>
            <div className="flex flex-wrap gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-0.5 w-3" style={{ color: secondary }}>
                  <div className="h-full w-full rounded-sm" style={{ backgroundColor: secondary }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    case "executive":
      return (
        <div className="h-full flex flex-col" style={{ fontSize: "4px" }}>
          {/* Dark Header */}
          <div className="p-2" style={{ backgroundColor: primary }}>
            <div className="h-2 w-12 rounded-sm mb-0.5 bg-white" />
            <div className="h-1 w-8 rounded-sm" style={{ backgroundColor: accent }} />
          </div>
          {/* Content */}
          <div className="p-2 flex-1 space-y-1">
            <div>
              <div className="h-1 w-10 rounded-sm mb-0.5 border-b-2" style={{ borderColor: accent, color: primary }} />
              <div className="h-0.5 w-full rounded-sm" style={{ backgroundColor: "#e5e7eb" }} />
            </div>
            <div>
              <div className="h-1 w-8 rounded-sm mb-0.5 border-b-2" style={{ borderColor: accent }} />
              <div className="flex flex-wrap gap-0.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-1 w-4 rounded-sm border-l-2" style={{ borderColor: accent, backgroundColor: "#f3f4f6" }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )

    case "creative":
      return (
        <div className="h-full flex" style={{ fontSize: "4px" }}>
          {/* Sidebar */}
          <div className="w-1/3 p-1.5" style={{ backgroundColor: primary }}>
            <div className="h-1.5 w-full rounded-sm mb-0.5 bg-white/90" />
            <div className="h-0.5 w-3/4 rounded-sm mb-2" style={{ backgroundColor: accent }} />
            <div className="space-y-1">
              <div className="h-0.5 w-full rounded-sm bg-white/60" />
              <div className="h-0.5 w-3/4 rounded-sm bg-white/60" />
              <div className="flex flex-wrap gap-0.5 mt-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-1 w-3 rounded-full" style={{ backgroundColor: accent }} />
                ))}
              </div>
            </div>
          </div>
          {/* Main Content */}
          <div className="flex-1 p-1.5 space-y-1">
            <div>
              <div className="h-1 w-6 rounded-sm mb-0.5 border-b-2" style={{ borderColor: "#e9d5ff", color: primary }} />
              <div className="h-0.5 w-full rounded-sm" style={{ backgroundColor: "#e5e7eb" }} />
            </div>
            <div>
              <div className="h-1 w-8 rounded-sm mb-0.5 border-b-2" style={{ borderColor: "#e9d5ff" }} />
              <div className="space-y-0.5">
                <div className="h-0.5 w-full rounded-sm" style={{ backgroundColor: "#e5e7eb" }} />
                <div className="h-0.5 w-3/4 rounded-sm" style={{ backgroundColor: "#e5e7eb" }} />
              </div>
            </div>
          </div>
        </div>
      )

    default:
      return null
  }
}
