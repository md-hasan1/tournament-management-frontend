"use client";
import React, { useState } from "react";
import { Plus, Edit2, Trash2, Loader } from "lucide-react";
import { confirmDelete, alertSuccess, alertError } from "@/lib/confirm";
import {
  useGetRefereesQuery,
  useCreateRefereeMutation,
  useUpdateRefereeMutation,
  useDeleteRefereeMutation,
} from "@/redux/apiHooks/referee/refereeApi";

export default function RefereePage() {
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const { data: referees = [], isLoading, error } = useGetRefereesQuery();
  const [createReferee, { isLoading: isCreating }] = useCreateRefereeMutation();
  const [updateReferee, { isLoading: isUpdating }] = useUpdateRefereeMutation();
  const [deleteReferee] = useDeleteRefereeMutation();

  const openCreateModal = () => {
    setMode("create");
    setSelectedId(null);
    setFormData({ name: "", email: "", phoneNumber: "" });
    setShowModal(true);
  };

  const openEditModal = (id: string) => {
    const r = referees.find((x) => x.id === id);
    if (!r) return;
    setMode("edit");
    setSelectedId(id);
    setFormData({ name: r.name, email: r.email, phoneNumber: r.phoneNumber });
    setShowModal(true);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async () => {
    try {
      if (mode === "create") {
        await createReferee(formData).unwrap();
      } else if (mode === "edit" && selectedId) {
        await updateReferee({
          id: selectedId,
          body: { name: formData.name, phoneNumber: formData.phoneNumber },
        }).unwrap();
      }
      setShowModal(false);
    } catch (e) {
      console.error(e);
      alert("Operation failed");
    }
  };

  const onDelete = async (id: string) => {
    const ok = await confirmDelete({
      title: "Delete Referee?",
      text: "Are you sure you want to delete this referee? This action cannot be undone.",
      confirmText: "Delete",
    });
    if (!ok) return;

    try {
      await deleteReferee(id).unwrap();
      await alertSuccess("Deleted", "Referee removed successfully.");
    } catch (e) {
      console.error(e);
      await alertError(
        "Delete failed",
        "Something went wrong while deleting. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Referee</h1>
            <p className="text-gray-400 mt-1">Add and Manage Referee</p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-[#35BACB] text-black font-bold px-6 py-3 rounded-lg hover:bg-[#A232D6] transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add Referee
          </button>
        </div>

        {/* Referee List */}
        <div className="bg-gray-900/30 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50 border-b border-gray-800">
                <tr className="text-gray-400 text-sm font-semibold uppercase tracking-wide">
                  <th className="text-left py-4 px-6">Name</th>
                  <th className="text-left py-4 px-6">Email</th>
                  <th className="text-left py-4 px-6">Phone</th>
                  <th className="text-left py-4 px-6">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="py-8 px-6" colSpan={4}>
                      <div className="flex items-center justify-center gap-2 text-gray-400">
                        <Loader className="w-5 h-5 animate-spin" /> Loading
                        referees...
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td className="py-8 px-6 text-red-400" colSpan={4}>
                      Failed to load referees.
                    </td>
                  </tr>
                ) : referees.length === 0 ? (
                  <tr>
                    <td className="py-8 px-6 text-gray-400" colSpan={4}>
                      No referees found.
                    </td>
                  </tr>
                ) : (
                  referees.map((referee) => (
                    <tr
                      key={referee.id}
                      className="border-b border-gray-800 hover:bg-gray-900/30 transition-colors"
                    >
                      <td className="py-4 px-6 font-semibold">
                        {referee.name}
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        {referee.email}
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        {referee.phoneNumber}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-3">
                          <button
                            onClick={() => openEditModal(referee.id)}
                            className="text-gray-400 hover:text-[#35BACB] transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => onDelete(referee.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Referee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-6">Add Referee</h2>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm font-semibold block mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm font-semibold block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  disabled={mode === "edit"}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm font-semibold block mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={onChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#35BACB]"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                disabled={isCreating || isUpdating}
                className="flex-1 bg-[#35BACB] hover:bg-[#A232D6] text-black font-bold py-2 rounded transition-colors"
              >
                {isCreating || isUpdating
                  ? "Saving..."
                  : mode === "create"
                    ? "Add Referee"
                    : "Update Referee"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
