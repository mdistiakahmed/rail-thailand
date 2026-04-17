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

export const runtime = 'edge';



export default async function TrainDetailsPage({ params }: any) {
  const { id } = await params;

  return (
    <div>
      <h1>Train Details</h1>
    </div>
  );
}
