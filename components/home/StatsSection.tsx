"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, motion } from "framer-motion";

function Counter({
    value,
    direction = "up",
}: {
    value: number;
    direction?: "up" | "down";
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(direction === "down" ? value : 0);
    const springValue = useSpring(motionValue, {
        damping: 100,
        stiffness: 100,
    });
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(direction === "down" ? 0 : value);
        }
    }, [motionValue, isInView, value, direction]);

    useEffect(() => {
        springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Intl.NumberFormat("en-US").format(
                    Number(latest.toFixed(0))
                );
            }
        });
    }, [springValue]);

    return <span ref={ref} />;
}

export function StatsSection() {
    return (
        <section className="py-12 bg-white dark:bg-slate-950">
            <div className="w-full px-4 sm:px-6 lg:px-12 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:divide-x divide-slate-200 dark:divide-slate-800">
                    <motion.div
                        className="p-4 flex flex-col items-center cursor-default"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <div className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2 tabular-nums group-hover:text-blue-600 transition-colors">
                            <Counter value={20} />+
                        </div>
                        <div className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            Years in the Industry
                        </div>
                    </motion.div>
                    <motion.div
                        className="p-4 flex flex-col items-center cursor-default"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <div className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2 tabular-nums group-hover:text-blue-600 transition-colors">
                            <Counter value={1000} />+
                        </div>
                        <div className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            Businesses Furnished
                        </div>
                    </motion.div>
                    <motion.div
                        className="p-4 flex flex-col items-center cursor-default"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <div className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2 tabular-nums group-hover:text-blue-600 transition-colors">
                            <Counter value={100000} />+
                        </div>
                        <div className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            Pcs Sold
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
