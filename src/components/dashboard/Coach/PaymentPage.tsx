/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useMemo, useState } from "react";
import { useGetPaymentsQuery } from "@/redux/apiHooks/payments/paymentsApi";
import { CheckCircle, Clock } from "lucide-react";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatMoney(amount: number) {
  return `$${amount.toFixed(2)}`;
}

export default function CoachPaymentsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {
    data: payment,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetPaymentsQuery({ page, limit });

  const meta = payment?.meta;
  const rows = payment?.data ?? [];

  const totalPages = useMemo(() => {
    if (!meta) return 1;
    return Math.max(1, Math.ceil(meta.total / meta.limit));
  }, [meta]);

  const totalSpentThisPage = useMemo(() => {
    // counts only non-zero amounts on the current page
    return rows.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  }, [rows]);

  const tournamentsPaidThisPage = useMemo(() => {
    // optional: treat amount > 0 as "tournament paid" (bundle credits are 0)
    return rows.filter(
      (p) => (Number(p.amount) || 0) > 0 && p.status === "PAID",
    ).length;
  }, [rows]);

  const pendingPaymentsThisPage = useMemo(() => {
    // your API sample shows status "PAID" only, but this is ready for "PENDING"
    return rows
      .filter((p) => p.status === "PENDING")
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  }, [rows]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">PAYMENTS</h1>
          <p className="text-gray-400">Payment transaction history</p>
        </div>

        {/* Controls */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="text-sm text-gray-400">
            {meta ? (
              <>
                Showing page{" "}
                <span className="text-white font-semibold">{meta.page}</span> of{" "}
                <span className="text-white font-semibold">{totalPages}</span> •
                Total{" "}
                <span className="text-white font-semibold">{meta.total}</span>{" "}
                transactions
                {isFetching ? (
                  <span className="ml-2 text-[#35BACB]">Updating…</span>
                ) : null}
              </>
            ) : (
              <span>—</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400">Rows</label>
            <select
              value={limit}
              onChange={(e) => {
                setPage(1);
                setLimit(Number(e.target.value));
              }}
              className="bg-black/30 border border-[#35BACB]/30 text-white rounded px-3 py-2 text-sm"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <button
                disabled={!canPrev || isLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-2 rounded border border-[#35BACB]/30 text-white disabled:opacity-40 hover:bg-[#35BACB]/10"
              >
                Prev
              </button>
              <button
                disabled={!canNext || isLoading}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-2 rounded border border-[#35BACB]/30 text-white disabled:opacity-40 hover:bg-[#35BACB]/10"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-6">
            TRANSACTION HISTORY
          </h2>

          <div className="border border-[#35BACB]/30 rounded-lg overflow-hidden bg-black/20 backdrop-blur">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#35BACB]/30 bg-black/40">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-400">
                      DATE
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-400">
                      DESCRIPTION
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-400">
                      AMOUNT
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-400">
                      STATUS
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    <tr>
                      <td className="px-6 py-6 text-gray-400" colSpan={4}>
                        Loading payments…
                      </td>
                    </tr>
                  ) : isError ? (
                    <tr>
                      <td className="px-6 py-6 text-red-400" colSpan={4}>
                        Failed to load payments.
                        <div className="text-xs text-gray-500 mt-1">
                          {typeof error === "object"
                            ? JSON.stringify(error)
                            : String(error)}
                        </div>
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td className="px-6 py-6 text-gray-400" colSpan={4}>
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    rows.map((p) => {
                      const isPaid = p.status === "PAID";
                      return (
                        <tr
                          key={p.id}
                          className="border-b border-[#35BACB]/10 hover:bg-[#35BACB]/5 transition-colors"
                        >
                          <td className="px-6 py-4 text-gray-400 font-medium">
                            {formatDate(p.createdAt)}
                          </td>

                          <td className="px-6 py-4 text-white">
                            {p.description}
                          </td>

                          <td className="px-6 py-4 text-white font-bold">
                            {formatMoney(Number(p.amount) || 0)}
                          </td>

                          <td className="px-6 py-4">
                            {isPaid ? (
                              <div className="flex items-center gap-2 border border-green-500/30 bg-green-500/10 w-fit px-3 py-1 rounded">
                                <CheckCircle
                                  size={18}
                                  className="text-green-500"
                                />
                                <span className="text-green-400 font-bold text-sm">
                                  Paid
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 border border-yellow-500/30 bg-yellow-500/10 w-fit px-3 py-1 rounded">
                                <Clock size={18} className="text-yellow-500" />
                                <span className="text-yellow-400 font-bold text-sm">
                                  Pending
                                </span>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Page numbers (optional) */}
          {meta && totalPages > 1 ? (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
              <span>
                Page <span className="text-white font-semibold">{page}</span> /{" "}
                <span className="text-white font-semibold">{totalPages}</span>
              </span>
            </div>
          ) : null}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-[#35BACB]/30 rounded-lg p-8 bg-black/20 backdrop-blur">
            <div className="text-sm font-bold text-gray-400 mb-2">
              TOTAL SPENT (THIS PAGE)
            </div>
            <div className="text-4xl font-bold text-white">
              {formatMoney(totalSpentThisPage)}
            </div>
          </div>

          <div className="border border-[#35BACB]/30 rounded-lg p-8 bg-black/20 backdrop-blur">
            <div className="text-sm font-bold text-gray-400 mb-2">
              TOURNAMENTS PAID (THIS PAGE)
            </div>
            <div className="text-4xl font-bold text-white">
              {tournamentsPaidThisPage}
            </div>
          </div>

          <div className="border border-[#35BACB]/30 rounded-lg p-8 bg-black/20 backdrop-blur">
            <div className="text-sm font-bold text-gray-400 mb-2">
              PENDING PAYMENTS (THIS PAGE)
            </div>
            <div className="text-4xl font-bold text-white">
              {formatMoney(pendingPaymentsThisPage)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
