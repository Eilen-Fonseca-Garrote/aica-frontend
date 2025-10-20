import React from "react"

export function Table({ children }: { children: React.ReactNode }) {
  return <table className="w-full border-collapse">{children}</table>
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead className="bg-gray-100">{children}</thead>
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>
}

export function TableRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tr className={className}>{children}</tr>
}

export function TableHead({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={`text-left px-4 py-2 ${className}`}>{children}</th>
}

export function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-2 border-t">{children}</td>
}
