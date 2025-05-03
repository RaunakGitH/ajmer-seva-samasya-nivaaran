
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDarkMode = theme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDarkMode ? "light" : "dark")}
      className="ml-2"
    >
      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  );
}
