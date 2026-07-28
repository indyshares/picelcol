import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About eiei",
  description: "Small things, big smiles — get to know eiei, your friendly sticker and lifestyle brand.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
