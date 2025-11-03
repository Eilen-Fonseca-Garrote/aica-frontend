"use client"

import { ChevronUp } from "lucide-react"
import { ReactNode } from "react"

interface ToggleSectionProps {
  title: string
  sectionKey: string
  expandedSections: Record<string, boolean>
  toggleSection: (section: string) => void
  color?: "teal" | "green"
  children: ReactNode
}

export default function ToggleSection({
  title,
  sectionKey,
  expandedSections,
  toggleSection,
  color = "teal",
  children,
}: ToggleSectionProps) {
  const bgColor =
    color === "teal"
      ? "bg-teal-600 hover:bg-teal-700"
      : "bg-green-600 hover:bg-green-700"

  return (
    <div className={`${color === "teal" ? "bg-teal-600" : "bg-green-600"} rounded overflow-hidden`}>
      <button
        onClick={() => toggleSection(sectionKey)}
        className={`w-full px-4 py-3 flex items-center justify-between text-white transition-colors ${bgColor}`}
      >
        <span className="font-medium">{title}</span>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <span className="text-2xl font-light">+</span>
        )}
      </button>

      {expandedSections[sectionKey] && (
        <div className="bg-white p-4 text-gray-700">{children}</div>
      )}
    </div>
  )
}
