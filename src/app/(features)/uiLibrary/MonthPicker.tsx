"use client";

import { useState } from "react";
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

  return (
    <DatePicker
      selected={selectedDate}
      onChange={handleChange}
      dateFormat="yyyy-MM"
      showMonthYearPicker
      className={className}
      placeholderText={placeholder}
    />
  );
}
