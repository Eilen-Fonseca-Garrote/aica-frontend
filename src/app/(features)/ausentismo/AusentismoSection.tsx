// app/(features)/ausentismo/AusentismoSection
interface AusentismoSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function AusentismoSection({ title, children }: AusentismoSectionProps) {
  return (
    <div className="rounded-lg shadow-sm border border-gray-200">
      <div className="bg-gray-100 px-4 py-2 border-b">
        <h5 className="font-medium text-gray-700">{title}</h5>
      </div>
      {children}
    </div>
  );
}