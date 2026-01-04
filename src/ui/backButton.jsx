import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function BackButton({
  label = "Back",
  className = "",
}) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      aria-label="Go back"
      className={`
        inline-flex items-center gap-1.5
        rounded-md border border-gray-300
        bg-white px-3 py-1.5
        font-medium text-gray-700
        transition-all duration-200
        hover:bg-gray-50 hover:shadow-sm
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
        ${className}
      `}
    >
      <ArrowLeft className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}
