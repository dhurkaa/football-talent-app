import React from "react";
import StatCard from "../common/StatCard";

const QuickStats = ({ stats = [] }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={`${stat.label}-${index}`} {...stat} />
      ))}
    </div>
  );
};

export default QuickStats;
