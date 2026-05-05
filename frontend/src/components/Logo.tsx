import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 font-bold text-lg">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-hero shadow-elegant">
      <ShieldCheck className="h-5 w-5 text-primary-foreground" />
    </div>
    <span className="gradient-text">SecureAuth</span>
  </Link>
);

export default Logo;
