import { IDocument } from "@/types/api.types";

export type ExpiryStatus = "active" | "approaching" | "expired" | "no_expiry";

export interface ExpiryInfo {
  status: ExpiryStatus;
  daysLeft: number | null;
  label: string;
}

/**
 * Calculate the expiry status and days remaining for a document.
 *
 * - "no_expiry": document marked as does_not_expire or no expiry_date
 * - "active": more than 30 days until expiry (green)
 * - "approaching": 30 days or fewer until expiry (yellow/orange)
 * - "expired": expiry date has passed (red)
 */
export function getDocumentExpiryInfo(doc: IDocument): ExpiryInfo {
  if (doc.does_not_expire || !doc.expiry_date) {
    return { status: "no_expiry", daysLeft: null, label: "Valid" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(doc.expiry_date);
  expiry.setHours(0, 0, 0, 0);

  const diffMs = expiry.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return {
      status: "expired",
      daysLeft,
      label: `Expired ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? "s" : ""} ago`,
    };
  }

  if (daysLeft <= 30) {
    return {
      status: "approaching",
      daysLeft,
      label: `Expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`,
    };
  }

  return {
    status: "active",
    daysLeft,
    label: `Expires in ${daysLeft} days`,
  };
}

/**
 * Get the badge variant for an expiry status.
 */
export function getExpiryBadgeVariant(status: ExpiryStatus): string {
  switch (status) {
    case "active":
      return "completed"; // green
    case "approaching":
      return "due"; // yellow
    case "expired":
      return "destructive"; // red
    case "no_expiry":
      return "success"; // green
    default:
      return "default";
  }
}

/**
 * Get a display label for the expiry status badge.
 */
export function getExpiryBadgeLabel(status: ExpiryStatus): string {
  switch (status) {
    case "active":
      return "Active";
    case "approaching":
      return "Expiring Soon";
    case "expired":
      return "Expired";
    case "no_expiry":
      return "Valid";
    default:
      return "";
  }
}
