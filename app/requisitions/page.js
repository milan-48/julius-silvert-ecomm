import { RequisitionsIndexClient } from "@/components/requisitions/RequisitionsIndexClient";

export const metadata = {
  title: "Requisition lists | Julius Silvert",
  description: "Create and manage requisition lists for ordering later.",
};

export default function RequisitionsPage() {
  return <RequisitionsIndexClient />;
}
