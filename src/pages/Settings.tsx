import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

const Settings = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="mt-1 text-muted-foreground">Manage your account and security.</p>
        </div>

        <section className="rounded-2xl border bg-card p-6 shadow-elegant md:p-8">
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">Update your personal information.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <Button
            className="mt-6 shadow-elegant"
            onClick={(e) => {
              e.preventDefault();
              toast.success("Profile updated (UI only)");
            }}
          >
            Save changes
          </Button>
        </section>

        <section className="rounded-2xl border bg-card p-6 shadow-elegant md:p-8">
          <h2 className="text-xl font-semibold">Change Password</h2>
          <p className="mt-1 text-sm text-muted-foreground">Update your password regularly to stay secure.</p>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => {
              if (next !== confirm) return toast.error("Passwords don't match");
              toast.success("Password updated (UI only)");
              setCurrent("");
              setNext("");
              setConfirm("");
            }}
          >
            Update password
          </Button>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
