"use client";
import React, { useMemo, useState } from "react";
import { useGetPaymentsQuery } from "@/redux/apiHooks/payments/paymentsApi";
import { Loader } from "lucide-react";

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, error } = useGetPaymentsQuery({ page, limit });

  const transactions = useMemo(() => data?.data ?? [], [data]);
  const meta = data?.meta ?? { total: 0, page: 1, limit };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return iso;
    }
  };

  const formatAmount = (amount: number) =>
    amount.toLocaleString(undefined, { style: "currency", currency: "USD" });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">PAYMENTS</h1>
        <p className="text-gray-400 mb-8">Payment transaction history</p>

        {/* Transaction Table */}
        <div className="bg-gray-900/30 border border-gray-800 rounded-xl overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50 border-b border-gray-800">
                <tr className="text-gray-400 text-sm font-semibold uppercase tracking-wide">
                  <th className="text-left py-4 px-6">Date</th>
                  <th className="text-left py-4 px-6">Description</th>
                  <th className="text-left py-4 px-6">Amount</th>
                  <th className="text-left py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="py-8 px-6" colSpan={4}>
                      <div className="flex items-center justify-center gap-2 text-gray-400">
                        <Loader className="w-5 h-5 animate-spin" /> Loading
                        payments...
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td className="py-8 px-6 text-red-400" colSpan={4}>
                      Failed to load payments.
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td className="py-8 px-6 text-gray-400" colSpan={4}>
                      No payments found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-gray-800 hover:bg-gray-900/30 transition-colors"
                    >
                      <td className="py-4 px-6 text-gray-300">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="py-4 px-6 font-semibold">
                        {transaction.description}
                      </td>
                      <td className="py-4 px-6 font-bold">
                        {formatAmount(transaction.amount)}
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-green-500 bg-[#0E2216] border border-[#0B4422] py-1 px-3 rounded-sm font-semibold">
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {!isLoading && meta.total > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Page {meta.page} of{" "}
              {Math.max(1, Math.ceil(meta.total / meta.limit))}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 border border-gray-700 rounded-lg text-white disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={meta.page >= Math.ceil(meta.total / meta.limit)}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 border border-gray-700 rounded-lg text-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
