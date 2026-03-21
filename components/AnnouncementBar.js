import Link from "next/link";
import { ANNOUNCEMENT } from "@/lib/constants";

export function AnnouncementBar() {
  return (
    <div
      className="py-2.5"
      style={{ backgroundColor: "var(--surface-announcement)" }}
    >
      <div className="site-container flex flex-wrap items-center justify-between gap-2">
        <p className="text-announcement text-center sm:text-left">
          {ANNOUNCEMENT.greeting} - Let us know if you need{" "}
          <Link
            href={ANNOUNCEMENT.helpLink}
            className="underline underline-offset-2 transition-opacity hover:opacity-90"
            style={{ color: "var(--text-inverse)" }}
          >
            help
          </Link>{" "}
          with your order.
        </p>
        <Link
          href={ANNOUNCEMENT.orderGuideLink}
          className="text-announcement whitespace-nowrap transition-opacity hover:opacity-90"
          style={{ color: "var(--text-inverse)" }}
        >
          My Order Guide
        </Link>
      </div>
    </div>
  );
}
