import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/AuthLayout";
import { authApi } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const RESEND_COOLDOWN = 45;

const maskEmail = (email: string) => {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const masked = name.length <= 2 ? name[0] + "*" : name[0] + "***" + name.slice(-1);
  return `${masked}@${domain}`;
};

const VerifyOtp = () => {
  const { pendingEmail, login, setPendingEmail } = useAuth();
  const navigate = useNavigate();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  if (!pendingEmail) return <Navigate to="/register" replace />;

  const handleChange = (i: number, val: string) => {
    const v = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(6).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const verify = async () => {
    const otp = digits.join("");
    if (otp.length !== 6) {
      toast.error("Please enter all 6 digits.");
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.verifyOtp({ email: pendingEmail, otp });
      const { token, user } = res.data || {};
      if (token && user) {
        login(token, user);
        setPendingEmail(null);
        toast.success("Email verified!");
        navigate("/dashboard");
      } else {
        toast.error("Verification failed.");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Invalid or expired OTP.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (cooldown > 0) return;
    setResending(true);
    try {
      await authApi.resendOtp({ email: pendingEmail });
      toast.success("OTP resent successfully");
      setCooldown(RESEND_COOLDOWN);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to resend OTP.";
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={`We sent a code to ${maskEmail(pendingEmail)}`}
    >
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent">
            <MailCheck className="h-7 w-7 text-accent-foreground" />
          </div>
        </div>

        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="h-14 w-12 rounded-xl border bg-background text-center text-2xl font-semibold transition-smooth focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            />
          ))}
        </div>

        <Button onClick={verify} className="w-full shadow-elegant" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify OTP"}
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Didn't get the code? </span>
          <button
            onClick={resend}
            disabled={cooldown > 0 || resending}
            className="font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : resending ? "Sending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyOtp;
