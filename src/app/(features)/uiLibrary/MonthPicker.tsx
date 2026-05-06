"use client";

import { forwardRef, InputHTMLAttributes, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CustomMonthPickerProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

const parseMonthValue = (value: string): Date | null => {
  if (!value) return null;


  const normalized = value.match(/^\d{4}-\d{2}$/)
    ? value
    : value.match(/^\d{2}-\d{4}$/)
    ? `${value.slice(3)}-${value.slice(0, 2)}`
    : "";

  if (!normalized) return null;

  const parsed = new Date(`${normalized}-01`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export default function CustomMonthPicker({
  value,
  onChange,
  placeholder = "Seleccione mes y año",
  className,
}: CustomMonthPickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => parseMonthValue(value));

  useEffect(() => {
    setSelectedDate(parseMonthValue(value));
  }, [value]);

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      onChange(`${year}-${month}`);
    } else {
      onChange("");
    }
  };

  const MonthInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    ({ className: inputClassName, placeholder: inputPlaceholder, ...inputProps }, ref) => (
      <input
        ref={ref}
        data-testid="month-input"
        className={className ?? inputClassName}
        placeholder={placeholder ?? inputPlaceholder}
        {...inputProps}
      />
    )
  );

  MonthInput.displayName = "MonthInput";

  return (
  <DatePicker
    selected={selectedDate}
    onChange={handleChange}
    dateFormat="yyyy-MM"
    showMonthYearPicker
    maxDate={new Date()}  // ← esto bloquea meses futuros
    customInput={<MonthInput />}
  />
);
}
