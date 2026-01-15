/**
 * Configuration des couleurs centralisée
 * Utilise les couleurs primaires et secondaires du tailwind.config.js
 */

export const COLORS = {
  // Couleurs primaires (rouge)
  primary: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#e74c3c",
    700: "#dc2626",
    800: "#991b1b",
    900: "#7f1d1d",
  },
  // Couleurs secondaires (gris)
  secondary: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
};

export const TAILWIND_CLASSES = {
  // Cart - Gradient avec couleurs primaires et secondaires
  cart: {
    gradient: "from-primary-600 to-secondary-700",
    button: "bg-primary-600 hover:bg-primary-700",
    text: "text-primary-600",
    badge: "bg-red-500",
    hover: "hover:bg-primary-100",
  },
  // Favorites - Accent plus doux avec rouge et gris
  favorites: {
    gradient: "from-primary-500 to-secondary-600",
    button: "bg-primary-600 hover:bg-primary-700",
    text: "text-primary-600",
    badge: "bg-primary-50 text-primary-600",
    active: "bg-primary-600 text-white",
    inactive: "bg-white text-secondary-600 hover:bg-secondary-100",
  },
};

// Mappages pour classes Tailwind
export const getColorClass = (colorName, shade = 500) => {
  const colorMap = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    red: "bg-red",
    gray: "bg-gray",
  };

  return `${colorMap[colorName]}-${shade}`;
};

export default COLORS;
