"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CustomMonthPickerProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CustomMonthPicker({
  value,
  onChange,
  placeholder = "Seleccione mes y año",
  className,
}: CustomMonthPickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(`${value}-01`) : null
  );

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
      customInput={<MonthInput />}
    />
  );
}
