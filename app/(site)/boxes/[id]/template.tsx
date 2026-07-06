"use client";

import { motion } from "framer-motion";

// Fades the box page content in while sliding down into place on every
// navigation to a box page.
export default function BoxPageTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
