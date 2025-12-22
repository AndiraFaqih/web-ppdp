// components/SummaryDashboard.jsx
import { useEffect, useMemo, useRef } from "react";
import Chart from "chart.js/auto";

const DEFAULT_STATUS = "Belum Tindak Lanjut";

const pct = (n, total) => {
  if (!total) return "0%";
  return `${Math.round((n / total) * 100)}%`;
};

// ✅ plugin untuk gambar persen di pie
const piePercentLabelsPlugin = {
  id: "piePercentLabels",
  afterDatasetsDraw(chart) {
    const { ctx, data } = chart;
    const dataset = data?.datasets?.[0];
    if (!dataset) return;

    const values = dataset.data || [];
    const total = values.reduce((a, b) => a + Number(b || 0), 0);
    if (!total) return;

    const meta = chart.getDatasetMeta(0);
    if (!meta?.data?.length) return;

    ctx.save();
    ctx.font = "700 12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    meta.data.forEach((arc, i) => {
      const v = Number(values[i] || 0);
      if (!v) return;

      const percent = Math.round((v / total) * 100);
      if (percent <= 0) return;

      const bg = Array.isArray(dataset.backgroundColor)
        ? String(dataset.backgroundColor[i] || "")
        : "";
      // teks hitam untuk slice abu-abu, putih untuk lainnya
      ctx.fillStyle = bg.toLowerCase().includes("c9c9c9") ? "#111827" : "#ffffff";

      const p = arc.getCenterPoint ? arc.getCenterPoint() : arc.tooltipPosition();
      ctx.fillText(`${percent}%`, p.x, p.y);
    });

    ctx.restore();
  },
};

export default function SummaryDashboard({ rows = [] }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const stats = useMemo(() => {
    const total = rows.length;

    const norm = (r) =>
      String(r?.statusLabel || DEFAULT_STATUS).trim().toLowerCase();

    // ✅ "belum sesuai" harus tetap kebaca walau ditolak / dll (pokoknya ada kata itu)
    const isBelumSesuai = (r) => norm(r).includes("belum sesuai");

    // ✅ belum tindak lanjut = default status
    const isBelumTindak = (r) => norm(r) === DEFAULT_STATUS.toLowerCase();

    // ✅ sesuai apapun (pending/approved) = statusLabel diawali "sesuai"
    const isSesuaiAny = (r) => norm(r).startsWith("sesuai");

    // ✅ pending approval
    const isPending = (r) =>
      isSesuaiAny(r) && norm(r).includes("pending");

    // ✅ approved (support: "Sesuai" atau mengandung "approved")
    const isApproved = (r) => {
      const s = norm(r);
      return s === "sesuai" || (isSesuaiAny(r) && s.includes("approved"));
    };

    const belumTindak = rows.filter(isBelumTindak).length;
    const belumSesuai = rows.filter(isBelumSesuai).length;

    // pending & approved harus eksklusif, dan harus dari "sesuai..."
    const approved = rows.filter(isApproved).length;
    const pending = rows.filter((r) => isPending(r) && !isApproved(r)).length;

    return {
      total,
      belumTindak,
      belumSesuai,
      pending,
      approved,
      pBelumTindak: pct(belumTindak, total),
      pBelumSesuai: pct(belumSesuai, total),
      pPending: pct(pending, total),
      pApproved: pct(approved, total),
    };
  }, [rows]);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "pie",
      data: {
        labels: [
          "Belum Tindak Lanjut",
          "Belum Sesuai",
          "Pending Approval",
          "Approved",
        ],
        datasets: [
          {
            data: [stats.belumTindak, stats.belumSesuai, stats.pending, stats.approved],
            // bebas warna, aku tetap pakai yang mirip sebelumnya
            backgroundColor: ["#c9c9c9ff", "#EF4444", "#F59E0B", "#3ba23dff"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" },
          tooltip: { enabled: false },
        },
      },
      plugins: [piePercentLabelsPlugin],
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
      chartRef.current = null;
    };
  }, [stats.belumTindak, stats.belumSesuai, stats.pending, stats.approved]);

  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* KIRI */}
        <div className="space-y-4 lg:col-span-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              Total Rekomendasi
            </div>
            <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {stats.total}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              Approved
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.approved}
              </div>
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                {stats.pApproved}
              </div>
            </div>
          </div>

          {/* ✅ tambahan card */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              Pending Approval
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.pending}
              </div>
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                {stats.pPending}
              </div>
            </div>
          </div>
        </div>

        {/* TENGAH */}
        <div className="lg:col-span-6">
          <div className="h-full rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              Rekomendasi berdasarkan Status
            </div>
            <div className="mt-3 h-[240px]">
              <canvas ref={canvasRef} />
            </div>
          </div>
        </div>

        {/* KANAN */}
        <div className="space-y-4 lg:col-span-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              Rekomendasi Belum Sesuai
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.belumSesuai}
              </div>
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                {stats.pBelumSesuai}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              Rekomendasi Belum Tindak Lanjut
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.belumTindak}
              </div>
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                {stats.pBelumTindak}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
