"use client"

import Image from "next/image"
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils"

export function Header() {
    const { setTheme, resolvedTheme, theme } = useTheme();
    const isDark = (theme === "dark") || (resolvedTheme === "dark");
    const toggle = () => { setTheme(isDark ? "light" : "dark"); };

    return (
        <div className="flex justify-between items-center text-center">
            <div className={`font-bold text-2xl leading-7 text-left text-gray-900 dark:text-white`}>
                OpenQASM 3.0 Playground
            </div>

            <div className="flex gap-1">
                <button
                    title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                    onClick={toggle}
                    className={cn(
                        "flex items-center justify-center rounded",
                        "w-8 h-8",
                        "bg-white text-gray-600 hover:bg-gray-50",
                        "dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-yellow-400",
                    )}
                    aria-label="Toggle dark mode"
                >
                    {isDark ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                            />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                    )}
                </button>

                <a
                    title="View on GitHub"
                    href="https://github.com/itsubaki/qasm-playground"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                        "flex items-center justify-center rounded",
                        "w-8 h-8",
                        "bg-background",
                        "dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white",
                    )}
                    aria-label="View source on GitHub"
                >
                    <Image
                        src={isDark ? "/github-mark-white.svg" : "/github-mark.svg"}
                        alt="GitHub"
                        width={24}
                        height={24}
                    />
                </a>
            </div>
        </div>
    )
}
