const tailwindColors = {
  "bg-orange-500": "#f97316",
  "bg-violet-500": "#8b5cf6",
  "bg-red-500": "#ef4444",
  "bg-blue-500": "#3b82f6",
  "bg-green-500": "#22c55e",
  "bg-yellow-500": "#eab308",
  "bg-purple-500": "#a855f7",
  "bg-pink-500": "#ec4899",
  "bg-indigo-500": "#6366f1",
  "bg-teal-500": "#14b8a6",
  "bg-cyan-500": "#06b6d4",
  "bg-lime-500": "#84cc16",
  "bg-emerald-500": "#10b981",
  "bg-rose-500": "#f43f5e",
  "bg-fuchsia-500": "#d946ef",
  "bg-sky-500": "#0ea5e9",
  "bg-amber-500": "#f59e0b",
  "bg-gray-500": "#6b7280",
};

export const getHexColor = (tailwindClassName) => {
  return tailwindColors[tailwindClassName] || "#000000"; // Default to black if not found
};