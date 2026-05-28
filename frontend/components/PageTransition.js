"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }) {
    const pathname = usePathname();
    const [visible, setVisible] = useState(true);
    const [display, setDisplay] = useState(children);

    useEffect(() => {
        setVisible(false);
        const t = setTimeout(() => {
            setDisplay(children);
            setVisible(true);
        }, 180);
        return () => clearTimeout(t);
    }, [pathname]);

    return (
        <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.25s ease, transform 0.25s ease",
        }}>
            {display}
        </div>
    );
}