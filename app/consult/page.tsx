import type { Metadata } from "next";
import { getConsultOptions } from "@/lib/data";
import { ConsultFlow } from "./ConsultFlow";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Ask the pharmacist",
  description:
    "Answer three quick questions to make a Japanese card describing your symptoms, to show the pharmacist at the counter.",
  alternates: { canonical: "/consult" },
};

export default async function ConsultPage() {
  const options = await getConsultOptions();
  return <ConsultFlow options={options} />;
}
