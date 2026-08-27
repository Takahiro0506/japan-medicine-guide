import { getConsultOptions } from "@/lib/data";
import { ConsultFlow } from "./ConsultFlow";

export const dynamic = "force-static";

export default async function ConsultPage() {
  const options = await getConsultOptions();
  return <ConsultFlow options={options} />;
}
