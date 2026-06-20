"use client";
import {
  useGetSeriesQuery,
  useUpdateSeriesPricingMutation,
} from "@/redux/apiHooks/tournament/tournamentApi";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

interface SeriesConfig {
  displayName: string;
  type: string;
  icon: string;
  borderColor: string;
  buttonColor: string;
  textColor: string;
}

const seriesConfig: Record<string, SeriesConfig> = {
  "Proving Series": {
    displayName: "Proving Series",
    type: "PROVING",
    icon: "/target-01 (1).png",
    borderColor: "border-[#35BACB]",
    buttonColor: "bg-[#35BACB]",
    textColor: "text-black",
  },
  "Crown Series": {
    displayName: "Crown Series",
    type: "CROWN",
    icon: "/champion.png",
    borderColor: "border-[#FF006E]",
    buttonColor: "bg-[#FF006E]",
    textColor: "text-white",
  },
  "Royal Cup": {
    displayName: "Royal Cup",
    type: "ROYAL",
    icon: "/Frame 2147231276.png",
    borderColor: "border-[#FF6B35]",
    buttonColor: "bg-[#FF6B35]",
    textColor: "text-white",
  },
};

export default function UpdatePricingPage() {
  const [filterSeries, setFilterSeries] = useState("Proving Series");
  const [editingFees, setEditingFees] = useState<
    Record<string, { youthFee: string; adultFee: string }>
  >({});
  const [updateMessage, setUpdateMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const seriesType = seriesConfig[filterSeries].type;
  const { data, isLoading, error } = useGetSeriesQuery(seriesType);
  const seriesData = data?.data;
  const [updateSeriesPricing, { isLoading: isUpdating }] =
    useUpdateSeriesPricingMutation();

  const displaySeries = useMemo(() => {
    if (!seriesData || seriesData.length === 0) return null;
    return seriesData[0];
  }, [seriesData]);

  // Use fetched data if not yet initialized for this series
  const currentEdit = useMemo(() => {
    if (editingFees[filterSeries]) {
      return editingFees[filterSeries];
    }
    if (displaySeries) {
      return {
        youthFee: String(displaySeries.youthFee),
        adultFee: String(displaySeries.adultFee),
      };
    }
    return { youthFee: "", adultFee: "" };
  }, [editingFees, filterSeries, displaySeries]);

  const handleYouthFeeChange = (value: string) => {
    setEditingFees((prev) => ({
      ...prev,
      [filterSeries]: {
        ...(prev[filterSeries] || currentEdit),
        youthFee: value,
      },
    }));
  };

  const handleAdultFeeChange = (value: string) => {
    setEditingFees((prev) => ({
      ...prev,
      [filterSeries]: {
        ...(prev[filterSeries] || currentEdit),
        adultFee: value,
      },
    }));
  };

  const handleUpdate = async () => {
    if (!displaySeries) return;

    try {
      setUpdateMessage(null);
      await updateSeriesPricing({
        id: displaySeries.id,
        youthFee: parseInt(currentEdit.youthFee),
        adultFee: parseInt(currentEdit.adultFee),
      }).unwrap();

      setUpdateMessage({
        type: "success",
        text: `${filterSeries} pricing updated successfully!`,
      });
      setTimeout(() => setUpdateMessage(null), 3000);
    } catch (err) {
      setUpdateMessage({
        type: "error",
        text: `Failed to update ${filterSeries} pricing.`,
      });
      console.error("Update error:", err);
    }
  };
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2">TOURNAMENTS</h1>
          <p className="text-gray-400">
            Manage tournament events and registrations
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8">
          {Object.keys(seriesConfig).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterSeries(tab)}
              className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-colors ${
                filterSeries === tab
                  ? `${seriesConfig[tab].buttonColor} ${seriesConfig[tab].textColor}`
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Message Alert */}
        {updateMessage && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              updateMessage.type === "success"
                ? "bg-green-900/30 border border-green-700 text-green-300"
                : "bg-red-900/30 border border-red-700 text-red-300"
            }`}
          >
            {updateMessage.text}
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader className="w-8 h-8 animate-spin text-[#35BACB]" />
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-700 text-red-300 p-6 rounded-lg">
              Failed to load series data. Please try again.
            </div>
          ) : displaySeries ? (
            <div
              className={`border-2 rounded-xl p-8 bg-gray-900/50 ${seriesConfig[filterSeries].borderColor} max-w-md`}
            >
              <div className="mb-4 flex justify-center">
                <Image
                  src={seriesConfig[filterSeries].icon}
                  alt={filterSeries}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>

              <h2 className="text-3xl font-bold mb-8 text-center">
                {filterSeries}
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-gray-400 block mb-2">Youth Fee</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">$</span>
                    <input
                      type="number"
                      value={currentEdit.youthFee}
                      onChange={(e) => handleYouthFeeChange(e.target.value)}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 block mb-2">Adult Fee</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">$</span>
                    <input
                      type="number"
                      value={currentEdit.adultFee}
                      onChange={(e) => handleAdultFeeChange(e.target.value)}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className={`w-full ${seriesConfig[filterSeries].buttonColor} ${
                  seriesConfig[filterSeries].textColor
                } font-bold py-3 rounded-lg hover:opacity-90 transition-opacity text-lg disabled:opacity-50 flex items-center justify-center gap-2`}
              >
                {isUpdating && <Loader className="w-4 h-4 animate-spin" />}
                {isUpdating ? "Updating..." : "Update"}
              </button>
            </div>
          ) : (
            <div className="bg-gray-900/50 border border-gray-700 text-gray-300 p-6 rounded-lg">
              No series data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
