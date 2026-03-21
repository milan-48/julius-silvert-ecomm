import { RequisitionDetailClient } from "@/components/requisitions/RequisitionDetailClient";

export const metadata = {
  title: "Requisition list | Julius Silvert",
  description: "View and manage a saved requisition list.",
};

export default async function RequisitionDetailPage({ params }) {
  const { id } = await params;
  return <RequisitionDetailClient listId={String(id ?? "")} />;
}
