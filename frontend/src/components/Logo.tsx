import { Link } from "react-router-dom";
import logoImg from "@/assets/logo.png";
import logoWhiteImg from "@/assets/logo-branca.png";

export const Logo = ({ className = "", variant = "default" }: { className?: string; variant?: "default" | "white" }) => (
  <Link to="/home" className={`flex items-center hover:opacity-90 transition-opacity p-0 ${className}`}>
    <img
      src={variant === "white" ? logoWhiteImg : logoImg}
      alt="Gabarink Logo"
      className="h-[54px] w-[120px] object-contain m-0 p-0 block"
    />
  </Link>
);
