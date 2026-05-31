"use client"

import { ChevronUp } from "lucide-react"
import { ReactNode, useState } from "react"

interface ToggleSectionProps {
  title: string
  color?: "teal" | "green" | "blue"
  variant?: "filled" | "minimal"
  defaultExpanded?: boolean
  children: ReactNode
}

const ToggleSection = ({
  title,
  variant = "filled",
  defaultExpanded = false,
  children,
}: ToggleSectionProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded)

  if (variant === "minimal") {
    return (
      <div className="rounded border border-gray-200 overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-4 py-3 flex items-center justify-between bg-[var(--app-primary-color)] text-white transition-colors hover:bg-[var(--app-primary-hover)] focus:outline-none"
        >
          <span className="font-semibold">{title}</span>
          {expanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <span className="text-2xl font-light">+</span>
          )}
        </button>

        {expanded && (
          <div className="bg-white p-4 text-gray-700 transition-all duration-300 ease-in-out border-t border-gray-200">
            {children}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-[var(--app-primary-color)] rounded">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-white transition-colors hover:bg-[var(--app-primary-hover)]"
      >
        <span className="font-medium">{title}</span>
        {expanded ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <span className="text-2xl font-light">+</span>
        )}
      </button>

      {expanded && (
        <div className="bg-white p-4 text-gray-700 transition-all duration-300 ease-in-out">
          {children}
        </div>
      )}
    </div>
  )
}

export default ToggleSection
