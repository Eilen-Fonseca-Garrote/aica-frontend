import { ChangeEvent } from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  value: string;
  options: Option[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default function Select({ value, options, onChange }: SelectProps) {
  return (
    <select
      className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#0a8ca8]/40 text-black"
      value={value}
      onChange={onChange}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
