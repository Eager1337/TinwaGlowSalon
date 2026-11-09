import { useState } from "react";
import { ArrowUpRight, Download, Flower2, ShieldCheck, LogOut } from "lucide-react";
import { authClient } from "../lib/auth";
import { useEnquiries, useUpdateEnquiry } from "../queries/enquiries";

type Enquiry = {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: string;
  notes: string;
  createdAt: string;
};
const sample: Enquiry[] = [
  {
    id: "DEMO-01",
    name: "Sample client A",
    phone: "Not a real number",
    service: "Massage & relaxation",
    date: new Date().toISOString().slice(0, 10),
    time: "Afternoon",
    status: "New",
    notes: "Interested in a relaxation massage.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "DEMO-02",
    name: "Sample client B",
    phone: "Not a real number",
    service: "Manicure & pedicure",
    date: new Date().toISOString().slice(0, 10),
    time: "Morning",
    status: "Contacted",
    notes: "Please share available nail finishes.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "DEMO-03",
    name: "Sample client C",
    phone: "Not a real number",
    service: "Men’s grooming",
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    time: "Afternoon",
    status: "Confirmed",
    notes: "Haircut and beard grooming.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "DEMO-04",
    name: "Sample client D",
    phone: "Not a real number",
    service: "Facial & skincare",
    date: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    time: "Evening",
    status: "New",
    notes: "Please share facial treatment options.",
    createdAt: new Date().toISOString(),
  },
];
const statuses = ["New", "Contacted", "Confirmed", "Completed", "Cancelled"] as const;

export default function Studio({ demo = false }: { demo?: boolean }) {
  const { data: session, isPending } = authClient.useSession();
  const list = useEnquiries(!demo && !!session, session?.user.id || '');
  const update = useUpdateEnquiry();
  const [rows, setRows] = useState(sample);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All enquiries");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const data = demo ? rows : list.data || [];
  const filtered = data.filter(
    (r) =>
      (status === "All enquiries" || status === r.status) &&
      [r.name, r.service, r.phone, r.id].join(" ").toLowerCase().includes(search.toLowerCase()),
  );
  function download() {
    const esc = (v: string) => '"' + v.replace(/"/g, '""').replace(/^[=+@-]/, "'$&") + '"';
    const csv = [
      [
        "Reference",
        "Name",
        "Phone",
        "Treatment",
        "Preferred date",
        "Preferred time",
        "Status",
        "Notes",
      ],
      ...filtered.map((r) => [r.id, r.name, r.phone, r.service, r.date, r.time, r.status, r.notes]),
    ]
      .map((row) => row.map(esc).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = demo ? "tinwa-demo-enquiries.csv" : "tinwa-enquiries.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="studio">
      <header className="studio-header">
        <a className="brand" href="/">
          <Flower2 size={35} strokeWidth={1} />
          <span>
            Tinwa <i>Glow</i>
            <small>THE OWNER STUDIO</small>
          </span>
        </a>
        <div>
          <a href="/">
            View website <ArrowUpRight size={12} style={{ display: "inline" }} />
          </a>
          {!demo && session && (
            <button
              onClick={async () => {
                await authClient.signOut();
              }}
              aria-label="Sign out"
            >
              <LogOut size={17} />
            </button>
          )}
        </div>
      </header>
      {!demo && isPending ? (
        <div className="empty">Checking your session…</div>
      ) : !demo && !session ? (
        <div className="owner-login">
          <span className="eyebrow">PRIVATE OWNER ACCESS</span>
          <h2>
            Your glow.
            <br />
            <em>Your business.</em>
          </h2>
          <p>
            Real enquiries are only available to salon-approved owner accounts. Access is not yet
            assigned for this sales demo.
          </p>
          <button
            className="button primary full"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setError("");
              try {
                const r = await authClient.managedAuth.signIn({ provider: "google" });
                if (r.error) setError(r.error.message || "Sign-in failed");
              } catch {
                setError("Google sign-in could not be completed.");
              } finally {
                setBusy(false);
              }
            }}
          >
            Continue with Google <ArrowUpRight size={16} />
          </button>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setError("");
              try {
                const r = await authClient.signIn.email({ email, password });
                if (r.error) setError(r.error.message || "Sign-in failed");
              } catch {
                setError("Unable to sign in. Please try again.");
              } finally {
                setBusy(false);
              }
            }}
          >
            <label>
              Email
              <input
                type="email"
                    aria-label="Owner email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                    aria-label="Owner password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button className="button outline full" disabled={busy}>
              {busy ? "Signing in…" : "Sign in with email"}
            </button>
          </form>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <p className="small" style={{ marginTop: 20 }}>
            No owner login yet?{" "}
            <a href="/studio" style={{ textDecoration: "underline" }}>
              Explore the sample dashboard
            </a>
            . Email accounts must be provisioned by the developer; public registration is disabled.
          </p>
        </div>
      ) : (
        <div className="studio-body">
          <div className="studio-title">
            <div>
              <span className="eyebrow">THE OWNER STUDIO</span>
              <h1>
                A clearer view.
                <br />
                <em>A smoother day.</em>
              </h1>
            </div>
            <button className="button outline" onClick={download} disabled={!filtered.length}>
              <Download size={16} /> Export {demo ? "sample " : ""}CSV
            </button>
          </div>
          {demo && (
            <div className="demo-banner">
              <ShieldCheck size={22} />
              <span>
                <strong>Interactive sales demonstration.</strong> These are fictional enquiries, not
                actual customers. Status changes last until this page is refreshed.{" "}
                <a href="/owner" style={{ textDecoration: "underline" }}>
                  Real owner access
                </a>
              </span>
            </div>
          )}
          {!demo && list.isLoading && <div className="empty">Loading private enquiries…</div>}
          {!demo && list.isError ? (
            <div className="error" role="alert">
              {list.error.message} Your account needs salon-owner approval before any customer data
              can be shown.
            </div>
          ) : (
            <>
              <div className="studio-stats">
                {[
                  ["Total enquiries", data.length],
                  ["Awaiting response", data.filter((r) => r.status === "New").length],
                  ["Confirmed", data.filter((r) => r.status === "Confirmed").length],
                  ["Completed", data.filter((r) => r.status === "Completed").length],
                ].map(([label, n]) => (
                  <div className="studio-stat" key={label}>
                    <small>{label}</small>
                    <strong>{n}</strong>
                  </div>
                ))}
              </div>
              <div className="studio-toolbar">
                <input
                  aria-label="Search enquiries"
                  placeholder="Search name, treatment or reference…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  aria-label="Filter enquiry status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>All enquiries</option>
                  {statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              {update.isError && (
                <p className="error" role="alert">
                  Could not save this status. {update.error.message}
                </p>
              )}
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>CLIENT</th>
                      <th>TREATMENT</th>
                      <th>PREFERRED VISIT</th>
                      <th>STATUS</th>
                      <th>FOLLOW UP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <strong>{r.name}</strong>
                          <small>{r.id}</small>
                          <small>{r.phone}</small>
                        </td>
                        <td>
                          {r.service}
                          <small title={r.notes}>
                            {r.notes.length > 45 ? r.notes.slice(0, 45) + "…" : r.notes}
                          </small>
                        </td>
                        <td>
                          {new Date(r.date + "T12:00:00Z").toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          <small>{r.time} preference</small>
                        </td>
                        <td>
                          <select
                            className="status-select"
                            aria-label={`Status for ${r.name}`}
                            value={r.status}
                            disabled={update.isPending}
                            onChange={(e) => {
                              const value = e.target.value as (typeof statuses)[number];
                              if (demo)
                                setRows(
                                  rows.map((item) =>
                                    item.id === r.id ? { ...item, status: value } : item,
                                  ),
                                );
                              else update.mutate({ id: r.id, status: value });
                            }}
                          >
                            {statuses.map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          {demo ? (
                            <span className="small">Sample only</span>
                          ) : (
                            <a
                              className="text-link"
                              href={`https://wa.me/${r.phone.replace(/\D/g, "").replace(/^0/, "232")}?text=${encodeURIComponent(`Hello ${r.name}, this is Tinwa Glow following up on your ${r.service} request (${r.id}).`)}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              WhatsApp <ArrowUpRight size={14} />
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!filtered.length && <p className="empty">No enquiries match this view.</p>}
              </div>
              <p className="small" style={{ marginTop: 20 }}>
                A status records your team’s workflow. Changing it does not send messages, reserve
                resources or notify a customer.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
