import { useEffect, useState } from "react";
import { Mail, Shield, User as UserIcon, Activity, KeyRound, Sparkles } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { authApi, User } from "@/services/api";

const Dashboard = () => {
  const { user: ctxUser } = useAuth();
  const [user, setUser] = useState<User | null>(ctxUser);

  useEffect(() => {
    authApi
      .profile()
      .then((res) => setUser(res.data))
      .catch(() => {});
  }, []);

  const name = user?.fullName || user?.name || "there";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {name.split(" ")[0]} </h1>
          <p className="mt-1 text-muted-foreground">Here's an overview of your account.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Activity, label: "Status", value: "Active" },
            { icon: KeyRound, label: "Auth Method", value: "JWT + OTP" },
            { icon: Sparkles, label: "Plan", value: "Free" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl border bg-card p-6 shadow-elegant">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{label}</p>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-elegant md:p-8">
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">Your account information.</p>
          <div className="mt-6 flex items-start gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl gradient-hero text-2xl font-bold text-primary-foreground shadow-elegant">
              {name[0].toUpperCase()}
            </div>
            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              <Field icon={UserIcon} label="Full Name" value={user?.fullName || user?.name || "—"} />
              <Field icon={Mail} label="Email" value={user?.email || "—"} />
              <Field icon={Shield} label="Role" value={user?.role || "User"} />
              <Field icon={KeyRound} label="User ID" value={user?.id || "—"} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const Field = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="rounded-xl border bg-background p-4">
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Icon className="h-3.5 w-3.5" /> {label}
    </div>
    <p className="mt-1 truncate font-medium">{value}</p>
  </div>
);

export default Dashboard;
