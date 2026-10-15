import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getRecentAnalyses } from "../lib/agent/db";
import { startClimateAnalysis } from "./actions/agent";
import { revalidatePath } from "next/cache";
import SolarChart from "../components/features/climate-agent/SolarChart";

interface ActivityLog {
  id: string;
  eventTitle: string;
  payloadDetails: string;
}

interface AnalysisRecord {
  id: string;
  targetLocation: string;
  userObjective: string;
  status: string;
  activityLogs: ActivityLog[];
  finalReport?: {
    markdownBody: string;
  } | null;
}

export default async function DashboardPage() {
  const analyses = await getRecentAnalyses();
  const activeRecord = (
    analyses && analyses.length > 0 ? analyses[0] : null
  ) as AnalysisRecord | null;

  async function handleFormSubmit(formData: FormData) {
    "use server";
    const location = formData.get("location") as string;
    const objective = formData.get("objective") as string;

    if (!location || !objective) return;

    await startClimateAnalysis(location, objective);
    revalidatePath("/");
  }

  return (
    <main className="min-h-screen p-6 max-w-7xl mx-auto space-y-6 bg-#0B0F17">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-800">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            EcoPulse AI
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Smart climate and energy help
          </p>
        </div>
        <div className="flex gap-3">
          <span className="px-3 py-1.5 rounded-md text-xs font-medium bg-[#161C2A] border border-gray-800 text-gray-400 flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                activeRecord?.status === "RUNNING"
                  ? "bg-emerald-500 animate-pulse"
                  : "bg-gray-500"
              }`}
            />
            {activeRecord?.status === "RUNNING" ? "Working" : "Ready"}
          </span>
        </div>
      </header>

      {/* Form Input Box */}
      <section className="p-6 rounded-xl bg-[#161C2A] border border-gray-800">
        <h2 className="text-sm font-semibold tracking-wider uppercase text-gray-400 mb-4">
          Start a new check
        </h2>
        <form
          action={handleFormSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
        >
          <div className="flex flex-col space-y-2">
            <label className="text-xs text-gray-400 font-medium">Place</label>
            <input
              name="location"
              placeholder="E.g., Nairobi, Kenya"
              required
              className="h-10 px-3 rounded bg-[#0B0F17] border border-gray-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-xs text-gray-400 font-medium">
              What do you want to check?
            </label>
            <input
              name="objective"
              placeholder="E.g., Evaluate solar pump viability"
              required
              className="h-10 px-3 rounded bg-[#0B0F17] border border-gray-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="h-10 px-4 rounded bg-emerald-500 text-[#0B0F17] text-sm font-semibold hover:bg-emerald-400 transition cursor-pointer"
          >
            Start check
          </button>
        </form>
      </section>

      {/*  Overview Rows */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-[#161C2A] border border-gray-800">
          <p className="text-sm font-medium text-gray-400">Place</p>
          <h3 className="text-2xl font-bold mt-2 text-emerald-400">
            {activeRecord ? activeRecord.targetLocation : "--"}
          </h3>
        </div>
        <div className="p-6 rounded-xl bg-[#161C2A] border border-gray-800">
          <p className="text-sm font-medium text-gray-400">Status</p>
          <h3 className="text-2xl font-bold mt-2 text-white">
            {activeRecord
              ? activeRecord.status === "RUNNING"
                ? "Working"
                : activeRecord.status
              : "No check yet"}
          </h3>
        </div>
        <div className="p-6 rounded-xl bg-[#161C2A] border border-gray-800">
          <p className="text-sm font-medium text-gray-400">Activity</p>
          <h3 className="text-2xl font-bold mt-2 text-emerald-500">
            {activeRecord
              ? `${activeRecord.activityLogs.length} updates`
              : "No updates"}
          </h3>
        </div>
      </section>

      {/* Main Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-[#161C2A] border border-gray-800 flex flex-col space-y-4">
            <span className="text-sm font-semibold tracking-wider uppercase text-gray-400">
              Target Core Analytics Report
            </span>
            <div className="w-full text-left text-sm text-gray-200 leading-relaxed prose prose-invert max-w-none space-y-4 overflow-y-auto h-300px p-4 bg-[#0B0F17] rounded border border-gray-800">
              {activeRecord && activeRecord.finalReport ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {activeRecord.finalReport.markdownBody}
                </ReactMarkdown>
              ) : activeRecord ? (
                <p className="text-xs text-gray-400 italic">
                  🔄 AI Engine pipeline active for objective: &quot;
                  {activeRecord.userObjective}&quot;. Final climate text report
                  compiling in background arrays...
                </p>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  ✨ System standby sequence. Awaiting execution trigger
                  parameter payloads to compile report structures...
                </p>
              )}
            </div>
          </div>

          {/* Dynamic Chart  Card */}
          <div className="p-6 rounded-xl bg-[#161C2A] border border-gray-800 flex flex-col space-y-4">
            <span className="text-sm font-semibold tracking-wider uppercase text-gray-400">
              Regional Solar Radiation Index
            </span>
            <div className="flex-1 min-h-300px bg-[#0B0F17] rounded border border-gray-800 p-4 flex flex-col justify-between">
              <SolarChart status={activeRecord?.status} />

              <p className="text-xs text-center text-gray-400 font-medium mt-2">
                {activeRecord?.status === "COMPLETED"
                  ? "⚡ Live historical solar radiation dataset array mapped (kWh/m²/day)."
                  : "📈 Displaying regional baseline index matrix context."}
              </p>
            </div>
          </div>
        </section>

        {/* Activity Log */}
        <aside className="p-6 rounded-xl bg-[#0B0F17] border border-gray-800 flex flex-col min-h-300px">
          <h2 className="text-sm font-semibold tracking-wider uppercase text-gray-400 mb-4">
            Updates
          </h2>
          <div className="space-y-4 font-mono text-xs overflow-y-auto max-h-320px">
            {activeRecord && activeRecord.activityLogs.length > 0 ? (
              activeRecord.activityLogs.map((log: ActivityLog) => (
                <div
                  key={log.id}
                  className="border-l-2 border-emerald-500 pl-2 space-y-1"
                >
                  <p className="text-emerald-400 font-semibold">
                    🔄 [{log.eventTitle}]
                  </p>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    {log.payloadDetails}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">
                ✨ No updates yet. Start a check to see them here.
              </p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
