
import React, { createContext, useContext, useEffect, useRef, useState } from "react"

type SelectContextType = {
  value: string
  onValueChange?: (value: string) => void
  isOpen?: boolean
  setOpen?: (open: boolean) => void
}

const SelectContext = createContext<SelectContextType | undefined>(undefined)

type SelectProps = {
  value: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

type SelectTriggerProps = {
  children: React.ReactNode
  className?: string
  onClickAction?: () => void
  label?: string
}

type SelectValueProps = {
  value?: string
  placeholder?: string
}

type SelectContentProps = {
  children: React.ReactNode
  isOpen?: boolean
}

type SelectItemProps = {
  value: string
  children: React.ReactNode
  onSelectAction?: (value: string) => void
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  // Close on outside click
  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      const el = ref.current
      if (!el) return
      if (e.target instanceof Node && !el.contains(e.target)) {
        setIsOpen(false)
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false)
    }

    document.addEventListener("click", handleDocClick)
    document.addEventListener("keydown", handleEsc)
    return () => {
      document.removeEventListener("click", handleDocClick)
      document.removeEventListener("keydown", handleEsc)
    }
  }, [])

  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setOpen: setIsOpen }}>
      <div ref={ref} className="relative w-full">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ children, className = "", onClickAction, label = "Selector de opciones" }: SelectTriggerProps) {
  const ctx = useContext(SelectContext)

  function handleClick(e?: React.MouseEvent) {
    // call any provided handler
    if (onClickAction) onClickAction()
    // toggle internal open state
    if (ctx?.setOpen) ctx.setOpen(!ctx.isOpen)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (ctx?.setOpen) ctx.setOpen(!ctx.isOpen)
    }
    if (onClickAction && (e.key === "Enter" || e.key === " ")) {
      // if consumer provided an onClickAction we already called it via pointer; keep parity for keyboard
      onClickAction()
    }
  }

  return (
    <button
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={ctx?.isOpen ? true : false}
      aria-label={label}
      title={label}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`w-full border px-3 py-2 rounded bg-white text-left ${className}`}
    >
      {children}
    </button>
  )
}

export function SelectValue({ value, placeholder = "Seleccionar" }: SelectValueProps) {
  const ctx = useContext(SelectContext)
  const display = value ?? ctx?.value
  return <span className="text-gray-700">{display || placeholder}</span>
}

export function SelectContent({ children, isOpen }: SelectContentProps) {
  const ctx = useContext(SelectContext)
  const open = isOpen ?? ctx?.isOpen
  if (!open) return null
  return (
    <ul
      role="listbox"
      aria-label="Options"
      className="absolute z-10 mt-1 w-full rounded border bg-white shadow-lg max-h-60 overflow-auto"
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape") ctx?.setOpen?.(false)
      }}
    >
      {children}
    </ul>
  )
}

export function SelectItem({ value, children, onSelectAction }: SelectItemProps) {
  const ctx = useContext(SelectContext)

  function handleClick() {
    // first, call context handler if present
    if (ctx?.onValueChange) ctx.onValueChange(value)
    // then, call local callback if provided
    if (onSelectAction) onSelectAction(value)
    // close the dropdown
    ctx?.setOpen?.(false)
  }

  return (
    <li
      role="option"
      aria-selected={false}
      onClick={handleClick}
      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
    >
      {children}
    </li>
  )
}