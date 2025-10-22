
import React, { ChangeEvent } from "react"

interface Option {
  label: string;
  value: string;
}

type SelectProps = {
  value: string
  onValueChangeAction: (value: string) => void
  children: React.ReactNode
}

type SelectTriggerProps = {
  children: React.ReactNode
  className?: string
  onClickAction: () => void
  label?: string
}

type SelectValueProps = {
  value?: string
  placeholder?: string
}

type SelectContentProps = {
  children: React.ReactNode
  isOpen: boolean
}

type SelectItemProps = {
  value: string
  children: React.ReactNode
  onSelectAction: (value: string) => void
}

export function Select({ value, onValueChangeAction, children }: SelectProps) {
  return <div className="relative w-full">{children}</div>
}

export function SelectTrigger({ children, className, onClickAction, label = "Selector de opciones" }: SelectTriggerProps) {
  return (
    <button
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded="false"
      aria-label={label}
      title={label}
      onClick={onClickAction}
      className={`w-full border px-3 py-2 rounded bg-white text-left ${className}`}
    >
      {children}
    </button>
  )
}

export function SelectValue({ value, placeholder = "Seleccionar" }: SelectValueProps) {
  return <span className="text-gray-700">{value || placeholder}</span>
}

export function SelectContent({ children, isOpen }: SelectContentProps) {
  if (!isOpen) return null
  return (
    <ul
      role="listbox"
      className="absolute z-10 mt-1 w-full rounded border bg-white shadow-lg max-h-60 overflow-auto"
    >
      {children}
    </ul>
  )
}

export function SelectItem({ value, children, onSelectAction }: SelectItemProps) {
  return (
    <li
      role="option"
      aria-selected="false"
      onClick={() => onSelectAction(value)}
      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
    >
      {children}
    </li>
  )
}