"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

interface Props {
  className?: string;
  iconSize?: number;
}

export function ThemeToggle({ className = "", iconSize = 16 }: Props) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setDark(isDark);
  }

  return (
    <button
      onClick={toggle}
      title={dark ? "Modo claro" : "Modo oscuro"}
      className={className}
    >
      {dark ? <Sun size={iconSize} /> : <Moon size={iconSize} />}
    </button>
  );
}
