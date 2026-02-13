
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  gradient?: string;
  iconBg?: string;
  iconColor?: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({
  title,
  value,
  icon,
  gradient = "from-blue-50 to-blue-100/50",
  iconBg = "bg-blue-500/20",
  iconColor = "text-blue-600",
  subtitle,
  trend,
}: StatCardProps) => {
  return (
    <>
      <div className="stat-card h-100">
        <div className="details">
          <p className="title">{title}</p>
          <p className="count">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {subtitle && <p className="sub-title">{subtitle}</p>}
        </div>
        {icon && <div className="icon">{icon}</div>}{" "}
      </div>
    </>
  );
};

export default StatCard;
