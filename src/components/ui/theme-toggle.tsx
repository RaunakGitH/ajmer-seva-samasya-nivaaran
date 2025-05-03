
import { Button } from "@/components/ui/button";
import { Sun } from "lucide-react";

export function ThemeToggle() {
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Light mode"
      className="ml-2"
      disabled
    >
      <Sun className="w-5 h-5" />
    </Button>
  );
}
