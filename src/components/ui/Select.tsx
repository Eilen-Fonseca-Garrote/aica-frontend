import type { ReactNode, SelectHTMLAttributes } from "react"

interface Option {
  label: string
  value: string
  disabled?: boolean
}

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  options?: ReadonlyArray<Option>
  children?: ReactNode
}

const BASE_CLASS_NAME =
  "w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#0a8ca8]/40 text-black"

const Select = ({
  options,
  children,
  className,
  ...props
}: SelectProps) => {
  const selectClassName = className
    ? `${BASE_CLASS_NAME} ${className}`
    : BASE_CLASS_NAME

  return (
    <select className={selectClassName} {...props}>
      {options
        ? options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))
        : children}
    </select>
  )
}

export default Select
