"use client"

import { useState, ReactNode } from "react"

interface Tab {
  id: string
  label: string
  content: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
}

export const Tabs = ({ tabs, defaultTab }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id)

  return (
    <div className="flex flex-col h-full">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-2 flex-1 text-center text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4 flex-1 overflow-auto">
        {tabs.map(
          (tab) =>
            activeTab === tab.id && (
              <div key={tab.id} className="w-full h-full">
                {tab.content}
              </div>
            )
        )}
      </div>
    </div>
  )
}
