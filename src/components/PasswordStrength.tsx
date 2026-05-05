import { useMemo } from "react";

const PasswordStrength = ({ password }: { password: string }) => {
  const { score, label, color } = useMemo(() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"];
    const colors = ["bg-destructive", "bg-destructive", "bg-warning", "bg-primary", "bg-success"];
    return { score: s, label: labels[s], color: colors[s] };
  }, [password]);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-smooth ${i < score ? color : "bg-muted"}`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
};

export default PasswordStrength;
