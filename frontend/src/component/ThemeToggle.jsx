import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <div className="icon-wrapper">
        {theme === "light" ? (
          <Moon size={18} className="theme-icon moon-icon" />
        ) : (
          <Sun size={18} className="theme-icon sun-icon" />
        )}
      </div>
    </button>
  );
}

export default ThemeToggle;
