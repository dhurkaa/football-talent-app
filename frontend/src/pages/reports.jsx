import React, { useEffect, useMemo, useState } from "react";
import { HiClipboardCheck, HiExclamation, HiSparkles } from "react-icons/hi";
import Card from "../components/common/Card";
import Loading from "../components/common/Loading";
import { reportAPI } from "../services/api";

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const response = await reportAPI.getAll();
      setReports(response.data);
      setLoading(false);
    };

    fetchReports();
  }, []);

  const stats = useMemo(
    () => [
      { label: "Reports in queue", value: reports.length, icon: HiClipboardCheck },
      { label: "Priority targets", value: reports.filter((report) => report.score >= 8).length, icon: HiSparkles },
      { label: "Needs follow-up", value: reports.filter((report) => report.score < 6).length, icon: HiExclamation }
    ],
    [reports]
  );

  if (loading) {
    return <Loading text="Loading scout reports..." />;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-white">
            Scout <span className="gradient-text">Reports</span>
          </h1>
          <p className="mt-2 text-dark-400">Every report on this page belongs to the currently signed-in user.</p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="glass-card p-5">
              <item.icon className="mb-3 h-5 w-5 text-primary-400" />
              <p className="text-sm text-dark-400">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        {reports.length ? (
          <div className="grid grid-cols-1 gap-6">
            {reports.map((report) => (
              <Card key={report.id} className="p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-300">{report.verdict}</span>
                      <span className="text-sm text-dark-400">{new Date(report.date).toLocaleDateString("en-GB")}</span>
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-white">{report.player}</h2>
                    <p className="mt-1 text-sm text-dark-400">
                      {report.club} · {report.roleFit} · by {report.author}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-dark-300">{report.summary}</p>
                  </div>

                  <div className="min-w-[180px] rounded-2xl border border-white/5 bg-dark-900/50 p-5 text-center">
                    <p className="text-xs uppercase tracking-wider text-dark-400">Scout score</p>
                    <p className="mt-2 text-4xl font-bold text-white">{report.score}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                    <p className="text-xs uppercase tracking-wider text-amber-300">Primary risk</p>
                    <p className="mt-2 text-sm leading-relaxed text-dark-300">{report.risks}</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                    <p className="text-xs uppercase tracking-wider text-emerald-300">Recommendation</p>
                    <p className="mt-2 text-sm leading-relaxed text-dark-300">{report.recommendation}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6">
            <p className="text-sm text-dark-400">No scout reports yet. Once you log real evaluations, they will show up here instead of placeholder content.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Reports;
