"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-16 h-8 bg-slate-200 rounded-full" />;
  }

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative inline-flex h-9 w-16 items-center rounded-full px-1 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${isDark ? "bg-slate-800" : "bg-amber-100"
        }`}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>

      {/* Sun Icon (Left) */}
      <motion.div
        className="absolute left-2 z-10"
        animate={{
          scale: isDark ? 0.5 : 1,
          opacity: isDark ? 0.5 : 1,
          rotate: isDark ? -45 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <Sun className="h-4 w-4 text-amber-500 fill-amber-500" />
      </motion.div>

      {/* Moon Icon (Right) */}
      <motion.div
        className="absolute right-2 z-10"
        animate={{
          scale: isDark ? 1 : 0.5,
          opacity: isDark ? 1 : 0.5,
          rotate: isDark ? 0 : 45,
        }}
        transition={{ duration: 0.3 }}
      >
        <Moon className="h-4 w-4 text-blue-400 fill-blue-400" />
      </motion.div>

      {/* Sliding Circle */}
      <motion.div
        className="h-7 w-7 rounded-full bg-white shadow-md z-20 flex items-center justify-center"
        layout
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30,
        }}
        animate={{
          x: isDark ? 28 : 0,
        }}
      >
        <motion.div
          animate={{
            rotate: isDark ? 360 : 0,
          }}
          transition={{ duration: 0.5 }}
        >
          {isDark ? (
            <Moon className="h-4 w-4 text-slate-900" />
          ) : (
            <Sun className="h-4 w-4 text-amber-500" />
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  );
}