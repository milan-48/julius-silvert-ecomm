import { redirect } from "next/navigation";

/** Same as Stock count — use `/stockcount` for editing + PIN save. */
export default function DevInventoryPage() {
  redirect("/stockcount");
}
