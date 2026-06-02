import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth, type AuthUser } from "@/lib/auth";
import { Shield, Users, LogOut, Database } from "lucide-react";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("yuvro-auth-user");
      if (!raw) throw redirect({ to: "/admin/login" });
      const u = JSON.parse(raw) as AuthUser;
      if (u.role !== "admin") throw redirect({ to: "/admin/login" });
    } catch (e) {
      throw e;
    }
  },
  component: AdminDashboard,
});

function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<Array<{ email: string; name: string }>>([]);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("yuvro-users") || "{}") as Record<string, { name: string }>;
      setUsers(Object.entries(raw).map(([email, v]) => ({ email, name: v.name })));
    } catch {/* */}
  }, []);

  const logout = () => { signOut(); navigate({ to: "/" }); };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <header className="border-b border-white/10 bg-[#0B1020]">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-violet-600 font-mono text-xs"><Shield className="h-3.5 w-3.5" /></div>
            <span>Yuvro Admin</span>
          </Link>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="text-white/60">{user?.name}</span>
            <button onClick={logout} className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-white/5 px-3 py-1.5 hover:bg-white/10">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-white/60">Demo admin view — registered users stored in this browser.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Stat icon={Users} label="Registered users" value={users.length.toString()} />
          <Stat icon={Database} label="Active labs" value="4" />
          <Stat icon={Shield} label="Role" value="Administrator" />
        </div>

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-6 py-4">
            <h2 className="font-semibold">Registered users</h2>
          </div>
          {users.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-white/50">No users registered yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-white/40">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.email} className="border-t border-white/5">
                    <td className="px-6 py-3">{u.name}</td>
                    <td className="px-6 py-3 text-white/70">{u.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-2 text-xs text-white/50"><Icon className="h-4 w-4" />{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
