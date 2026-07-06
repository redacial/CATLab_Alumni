import type { Metadata } from "next";
import AnimeCraft from "@/components/AnimeCraft";

export const metadata: Metadata = {
  title: "SakuraCraft 🌸 — CATLab Network",
  description:
    "An anime-inspired Minecraft-style voxel world: sakura groves, torii gates, and falling petals.",
};

export default function AnimeCraftPage() {
  return <AnimeCraft />;
}
