"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CustomDatePickerProps {
  value: string;
  onChange: (v: string) => void;
  pickerType?: "day" | "month";
  placeholder?: string;
  className?: string;
}

export default function CustomDatePicker({
  value,
  onChange,
  pickerType = "day",
  placeholder = "Select date",
  className,
}: CustomDatePickerProps) {
  // Convert string value to Date
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(pickerType === "month" ? `${value}-01` : value) : null
  );

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);

    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");

      if (pickerType === "month") {
        onChange(`${year}-${month}`);
      } else {
        const day = String(date.getDate()).padStart(2, "0");
        onChange(`${year}-${month}-${day}`);
      }
    } else {
      onChange("");
    }
  };

  const PickerInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    ({ className: inputClassName, placeholder: inputPlaceholder, ...inputProps }, ref) => (
      <input
        ref={ref}
        data-testid={pickerType === "month" ? "month-input" : "date-input"}
        className={className ?? inputClassName}
        placeholder={placeholder ?? inputPlaceholder}
        {...inputProps}
      />
    )
  );

  PickerInput.displayName = "PickerInput";

  return (
    <DatePicker
      selected={selectedDate}
      onChange={handleChange}
      dateFormat={pickerType === "month" ? "yyyy-MM" : "yyyy-MM-dd"}
      showMonthYearPicker={pickerType === "month"}
      customInput={<PickerInput />}
    />
  );
}
