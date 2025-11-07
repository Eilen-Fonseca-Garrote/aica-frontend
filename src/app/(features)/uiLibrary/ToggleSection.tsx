"use client"

import { ChevronUp } from "lucide-react"
import { ReactNode, useState } from "react"

interface ToggleSectionProps {
  title: string
  color?: "teal" | "green"
  defaultExpanded?: boolean
  children: ReactNode
}

export default function ToggleSection({
  title,
  color = "teal",
  defaultExpanded = false,
  children,
}: ToggleSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  const bgColor =
    color === "teal"
      ? "bg-teal-600 hover:bg-teal-700"
      : "bg-green-600 hover:bg-green-700"

  return (
    <div
      className={`${
        color === "teal" ? "bg-teal-600" : "bg-green-600"
      } rounded overflow-hidden`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full px-4 py-3 flex items-center justify-between text-white transition-colors ${bgColor}`}
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
