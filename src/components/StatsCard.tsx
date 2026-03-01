import { ElementType } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ElementType;
  trend?: {
    value: number;
    isUp: boolean;
  };
  colorClassName?: string;
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  colorClassName = "text-blue-600 bg-blue-50",
}: StatsCardProps) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorClassName}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span
            className={`font-medium ${trend.isUp ? "text-emerald-600" : "text-red-500"}`}
          >
            {trend.isUp ? "+" : "-"}
            {Math.abs(trend.value)}%
          </span>
          <span className="text-slate-400 ml-2">from last month</span>
        </div>
      )}
    </div>
  );
};
