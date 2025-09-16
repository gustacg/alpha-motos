import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="gap-2"
      title={theme === "light" ? "Modo escuro" : "Modo claro"}
    >
      {theme === "light" ? (
        <>
          <Moon className="h-4 w-4" />
          <span className="hidden sm:inline">Escuro</span>
        </>
      ) : (
        <>
          <Sun className="h-4 w-4" />
          <span className="hidden sm:inline">Claro</span>
        </>
      )}
    </Button>
  );
}