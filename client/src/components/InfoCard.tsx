import { ReactNode } from "react";

interface InfoCardProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  highlight?: boolean;
  description?: string;
}

export default function InfoCard({
  label,
  value,
  icon,
  highlight = false,
  description,
}: InfoCardProps) {
  return (
    <div
      className={`p-6 rounded-lg border transition-all duration-200 ${
        highlight
          ? "bg-gradient-to-br from-emerald-50 to-emerald-25 border-emerald-200 shadow-md"
          : "bg-white border-gray-200 shadow-sm hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
          <div className="text-currency text-gray-900">{value}</div>
          {description && (
            <p className="text-xs text-gray-500 mt-2">{description}</p>
          )}
        </div>
        {icon && <div className="ml-4 text-emerald-600">{icon}</div>}
      </div>
    </div>
  );
}
