import React from "react";
import { motion } from "framer-motion";
import { GiSoccerBall } from "react-icons/gi";

const Loading = ({ text = "Loading..." }) => {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center gap-5">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
        <GiSoccerBall className="w-12 h-12 text-primary-500" />
      </motion.div>
      <motion.p
        animate={{ opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        className="text-sm font-medium text-dark-400"
      >
        {text}
      </motion.p>
    </div>
  );
};

export default Loading;
