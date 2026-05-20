import React from "react";
import { motion } from "framer-motion";
import Card from "../common/Card";

const RecentActivity = ({ title = "Recent Activity", items = [] }) => {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <button className="text-sm text-primary-300 hover:text-primary-200">View All</button>
      </div>
      <div className="space-y-4">
        {items.map((activity, index) => (
          <motion.div
            key={`${activity.text}-${index}`}
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className="flex items-center gap-4 rounded-xl p-4 transition-colors duration-300 hover:bg-white/5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary-500/20 bg-primary-500/10">
              <activity.icon className="h-5 w-5 text-primary-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-white">{activity.text}</p>
              <p className="text-xs text-dark-400">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;
