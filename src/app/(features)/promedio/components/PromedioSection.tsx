interface PromedioSectionProps {
  title: string;
  children: React.ReactNode;
}

const PromedioSection = ({ title, children }: PromedioSectionProps) => {
  return (
    <div className="rounded-lg shadow-sm border border-gray-200">
      <div className="bg-[#0a8ca8] px-4 py-2 border-b border-[#08778f]">
        <h5 className="font-semibold text-white">{title}</h5>
      </div>
      {children}
    </div>
  );
}

export default PromedioSection
