import Link from "next/link";
import { ANNOUNCEMENT } from "@/lib/constants";

export function AnnouncementBar() {
  return (
    <div
      className="hidden py-2 sm:block sm:py-2.5"
      style={{ backgroundColor: "var(--surface-announcement)" }}
    >
      <div className="site-container flex max-w-full flex-col items-center gap-1.5 text-center sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2 sm:text-left">
        <p className="text-announcement max-w-full">
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
          className="text-announcement shrink-0 whitespace-nowrap transition-opacity hover:opacity-90"
          style={{ color: "var(--text-inverse)" }}
        >
          My Order Guide
        </Link>
      </div>
    </div>
  );
}
