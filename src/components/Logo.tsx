import { Link } from "react-router-dom";
import logoImg from "@/assets/logo.png";
import logoWhiteImg from "@/assets/logo-branca.png";

export const Logo = ({ className = "", variant = "default" }: { className?: string; variant?: "default" | "white" }) => (
  <Link to="/" className={`flex items-center gap-1 ${className}`}>
    <img src={variant === "white" ? logoWhiteImg : logoImg} alt="Gabarink Logo" className="h-11 w-11 object-contain" width={44} height={44} />
  </Link>
);
