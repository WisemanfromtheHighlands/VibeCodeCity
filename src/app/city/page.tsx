import type { Metadata } from "next";
import { CityClient } from "./CityClient";

export const metadata: Metadata = {
  title: "City",
  description: "Navigate a nocturnal solarpunk district — academy portals in neon on void.",
};

export default function CityPage() {
  return <CityClient />;
}
