import { getRecentAnalyses } from "@/lib/agent/db";
import { startClimateAnalysis } from "./actions/agent";
import { AgentStepLog } from "@/generated/prisma/browser";

export default async function DashboardPage() {
  const analyses = await getRecentAnalyses();
  const activeRecord = analyses[0];
  async function handleFormSubmit(formData: FormData) {
    "use server";
    const location = formData.get("location") as string;
    const objective = formData.get("objective") as string;

    if (!location || !objective) return;
    await startClimateAnalysis(location, objective);
  }

  return (
    <main className="min-h-screen p-6 max-w-7xl mx-auto space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border-subtle">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-main">
            EcoPulse AI
          </h1>
          <p className="text-text-muted mt-1">Smart climate and energy help</p>
        </div>
        <div className="flex gap-3">
          <span className="px-3 py-1.5 rounded-md text-xs font-medium bg-bg-surface border border-border-subtle text-text-muted flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${activeRecord?.status === "RUNNING" ? "bg-status-running animate-pulse" : "bg-text-accent"}`}
            />
            {activeRecord?.status === "RUNNING" ? "Working" : "Ready"}
          </span>
        </div>
      </header>

      <section className="p-6 rounded-xl bg-bg-surface border border-border-subtle">
        <h2 className="text-sm font-semibold tracking-wider uppercase text-text-muted mb-4">
          Start a new check
        </h2>
        <form
          action={handleFormSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
        >
          <div className="flex flex-col space-y-2">
            <label className="text-xs text-text-muted font-medium">Place</label>
            <input
              name="location"
              placeholder="E.g., Nairobi, Kenya"
              required
              className="h-10 px-3 rounded bg-bg-terminal border border-border-subtle text-sm text-text-main focus:outline-none focus:border-brand-primary"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-xs text-text-muted font-medium">
              What do you want to check?
            </label>
            <input
              name="objective"
              placeholder="E.g., Evaluate solar pump viability"
              required
              className="h-10 px-3 rounded bg-bg-terminal border border-border-subtle text-sm text-text-main focus:outline-none focus:border-brand-primary"
            />
          </div>
          <button
            type="submit"
            className="h-10 px-4 rounded bg-brand-primary text-text-main text-sm font-medium hover:bg-opacity-90 transition cursor-pointer"
          >
            Start check
          </button>
        </form>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-bg-surface border border-border-subtle">
          <p className="text-sm font-medium text-text-muted">Place</p>
          <h3 className="text-2xl font-bold mt-2 text-text-accent">
            {activeRecord ? activeRecord.targetLocation : "--"}
          </h3>
        </div>
        <div className="p-6 rounded-xl bg-bg-surface border border-border-subtle">
          <p className="text-sm font-medium text-text-muted">Status</p>
          <h3 className="text-2xl font-bold mt-2 text-text-main">
            {activeRecord
              ? activeRecord.status === "RUNNING"
                ? "Working"
                : activeRecord.status
              : "No check yet"}
          </h3>
        </div>
        <div className="p-6 rounded-xl bg-bg-surface border border-border-subtle">
          <p className="text-sm font-medium text-text-muted">Activity</p>
          <h3 className="text-2xl font-bold mt-2 text-brand-secondary">
            {activeRecord
              ? `${activeRecord.activityLogs.length} updates`
              : "No updates"}
          </h3>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-6">
          <div className="p-6 h-300px rounded-xl bg-bg-surface border border-border-subtle flex flex-col items-center justify-center text-center">
            <p className="text-text-muted font-medium">What you asked for</p>
            <p className="text-xs text-text-muted mt-3 max-w-md italic border border-dashed border-border-subtle p-3 rounded">
              {activeRecord
                ? activeRecord.userObjective
                : "Nothing has been entered yet."}
            </p>
          </div>
        </section>
        <aside className="p-6 rounded-xl bg-bg-terminal border border-border-subtle flex flex-col min-h-300px">
          <h2 className="text-sm font-semibold tracking-wider uppercase text-text-muted mb-4">
            Updates
          </h2>
          <div className="space-y-4 font-mono text-xs overflow-y-auto max-h-220px">
            {activeRecord && activeRecord.activityLogs.length > 0 ? (
              activeRecord.activityLogs.map((log: AgentStepLog) => (
                <div
                  key={log.id}
                  className="border-l-2 border-brand-primary pl-2 space-y-1"
                >
                  <p className="text-text-accent font-semibold">
                    🔄 [{log.eventTitle}]
                  </p>
                  <p className="text-text-muted text-[11px] leading-relaxed">
                    {log.payloadDetails}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-text-muted italic">
                ✨ No updates yet. Start a check to see them here.
              </p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
