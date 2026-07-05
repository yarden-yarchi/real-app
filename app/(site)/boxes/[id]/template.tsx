"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useBoxTransition } from "@/app/components/BoxTransition";

// Fades the box page in over the dark cover when arriving through the
// hero-stack transition; renders normally otherwise.
export default function BoxPageTemplate({ children }: { children: React.ReactNode }) {
  const { active, finish } = useBoxTransition();
  const cameFromTransition = useRef(active).current;
  const [done, setDone] = useState(!cameFromTransition);

  return (
    <motion.div
      initial={cameFromTransition ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={done ? "" : "relative z-[110] bg-background"}
      onAnimationComplete={() => {
        if (!done) {
          finish();
          setDone(true);
        }
      }}
    >
      {children}
    </motion.div>
  );
}
