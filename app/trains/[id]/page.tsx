// app/trains/[id]/page.tsx
import { notFound } from "next/navigation";
import {
  FaTrain,
  FaClock,
  FaMapMarkerAlt,
  FaArrowRight,
  FaCalendarAlt,
} from "react-icons/fa";
import { Metadata } from "next";
import Image from "next/image";
import {
  calculateDuration,
  generateTrainFAQ,
  generateTrainStructuredData,
  getPopularRoutesFromStation,
  getPopularTravelArticles,
  getTrainData,
} from "./component";

export const runtime = 'edge';



export default async function TrainDetailsPage({ params }: any) {
  const { id } = await params;
  const trainData = await getTrainData(id);

  if (!trainData) {
    notFound();
  }

  const { trainData: train, scheduleData, operatingDays, offDays } = trainData;
  const firstStop = scheduleData[0];
  const lastStop = scheduleData[scheduleData.length - 1];
  const duration = calculateDuration(
    firstStop.depart_time,
    lastStop.arrive_time,
  );

  // Get additional data for related sections
  const fromStationRoutes = await getPopularRoutesFromStation(
    train.begin || "",
    8,
  );

  const majorStops = scheduleData
    .slice(1, 6)
    .map((s: any) => s.station_name)
    .join(", ");

  return (
    <div className="min-h-screen w-screen md:w-full py-8 md:px-4">
      {generateTrainStructuredData(train, firstStop, lastStop)}
      <div className="w-full px-4 sm:px-6 lg:px-8 overflow-x-auto">
        {/* ================= H1 SECTION ================= */}
        <div className="text-center mb-10 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Train Number {train.train_code} from {train.begin} to {train.end} –
            Complete Timetable & Travel Duration
          </h1>

          <p className="text-lg text-gray-700 mb-3">
            Train Number {train.train_code} operates between {train.begin} and{" "}
            {train.end}, stopping at {scheduleData.length} stations across
            Thailand.
          </p>

          <p className="text-gray-600">
            Departure from {train.begin} at {firstStop.depart_time} and arrival
            in {train.end} at {lastStop.arrive_time}. Total journey time is
            approximately <strong>{duration}</strong>. Major stops include{" "}
            {majorStops}.
          </p>
        </div>

        <Image
          src="/thai-train.jpg"
          alt="Thailand Railway Train Journey"
          width={400}
          height={200}
          className="mx-auto my-8"
        />

        {/* ================= ROUTE OVERVIEW ================= */}
        <div className="mt-12 mb-12">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Train {train.train_code} Route Overview
            </h2>

            {/* Route Timeline */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
              {/* Departure Card */}
              <div className="flex-1 bg-red-50 rounded-xl p-6 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start mb-3">
                  <FaMapMarkerAlt className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm uppercase tracking-wide text-red-600 font-semibold">
                    Departure
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900">{train.begin}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Departs at {firstStop.depart_time}
                </p>
              </div>

              {/* Middle Line */}
              <div className="hidden md:flex flex-col items-center flex-none px-4">
                <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-green-400 rounded-full"></div>
                <span className="text-xs text-gray-500 mt-2">
                  Direct Railway Route
                </span>
              </div>

              {/* Arrival Card */}
              <div className="flex-1 bg-green-50 rounded-xl p-6 text-center md:text-right">
                <div className="flex items-center justify-center md:justify-end mb-3">
                  <span className="text-sm uppercase tracking-wide text-green-600 font-semibold">
                    Arrival
                  </span>
                  <FaMapMarkerAlt className="h-5 w-5 text-green-500 ml-2" />
                </div>
                <p className="text-xl font-bold text-gray-900">{train.end}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Arrives at {lastStop.arrive_time}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-8"></div>

            {/* Duration + Operating Info */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center text-gray-700">
                <FaClock className="mr-3 text-blue-600 text-lg" />
                <div>
                  <p className="text-sm text-gray-500">Estimated Travel Time</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {duration}
                  </p>
                </div>
              </div>

              <div className="text-center md:text-right">
                <p className="text-sm text-gray-500 mb-1">Operating Schedule</p>
                <span className="inline-block px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full">
                  {operatingDays?.length === 7
                    ? "Runs Daily (7 Days a Week)"
                    : operatingDays?.join(", ") || "Daily"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= FULL TIMETABLE ================= */}
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Full Timetable for Train No. {train.train_code}
          </h2>

          <p className="text-gray-600 mb-6">
            Below is the complete station-by-station schedule including arrival
            and departure times for Train {train.train_code} from {train.begin}{" "}
            to {train.end}.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Station
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Arrival
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Departure
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {scheduleData?.map((stop: any, index: number) => (
                  <tr
                    key={index}
                    className={
                      stop.station_name === train.begin ||
                      stop.station_name === train.end
                        ? "bg-blue-50"
                        : ""
                    }
                  >
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {stop.station_name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {stop.arrive_time || "-"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {stop.depart_time || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operating Days */}
        {operatingDays && (
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="flex items-center">
              <FaCalendarAlt className="h-5 w-5 text-gray-400" />
              <h3 className="ml-2 text-sm font-medium text-gray-900">
                Operating Days: {operatingDays.join(", ")}
              </h3>
            </div>
          </div>
        )}


        {generateTrainFAQ(train, scheduleData, operatingDays, duration)}

        {/* ================= RELATED SECTIONS ================= */}


        {/* Popular Routes From Start Station */}
        {fromStationRoutes.length > 0 && (
          <section className="max-w-6xl mx-auto mt-12">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-4">
                <FaTrain className="text-green-600" />
                <span className="text-green-600">
                  Popular Routes from {train.begin}
                </span>
              </h2>
              <p className="text-gray-600 mt-2">
                Discover frequently travelled routes departing from{" "}
                {train.begin}. These railway connections link major destinations
                across Thailand.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fromStationRoutes.map((route: any, index: number) => (
                <a
                  key={`from-route-${index}`}
                  href={`/stations/${train.begin?.toLowerCase().replace(/\s+/g, "-")}/${route.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-green-300 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4 text-green-600 mb-2">
                    <FaTrain className="text-sm" />
                    <span className="text-sm font-medium">
                      {train.begin} → {route.name}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 group-hover:text-green-600 font-semibold">
                    View Train Schedule
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Direct route • Multiple daily options
                    {route.slug.includes("express") &&
                      " • Express service available"}
                    {route.slug.includes("rapid") && " • Rapid trains"}
                  </p>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
