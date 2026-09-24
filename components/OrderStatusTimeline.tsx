import { Check, CircleAlert, X } from "lucide-react";
import { orderStatusLabel } from "@/lib/orders";
import type { OrderRow } from "@/db/schema";

interface Step {
  label: string;
  state: "done" | "current" | "upcoming" | "error";
  note?: string;
}

interface Props {
  status: OrderRow["status"];
  shippingStatus?: OrderRow["shippingStatus"];
  trackingNumber?: string;
  trackingCarrier?: string;
}

export default function OrderStatusTimeline({
  status,
  shippingStatus = "awaiting_shipment",
  trackingNumber,
  trackingCarrier,
}: Props) {
  const terminal = status === "failed" || status === "refunded";

  const placed: Step = {
    label: "Order placed",
    state: status === "failed" ? "error" : "done",
  };

  const payment: Step = {
    label: status === "refunded" ? "Refunded" : "Payment confirmed",
    state:
      status === "paid" || status === "refunded"
        ? "done"
        : status === "created"
          ? "current"
          : "error",
    note:
      status === "created"
        ? "Waiting for payment to settle — you can retry from your order page if needed."
        : undefined,
  };

  const shipped: Step = {
    label: "Shipped",
    state: terminal
      ? "upcoming"
      : shippingStatus === "shipped" || shippingStatus === "delivered"
        ? "done"
        : shippingStatus === "returned"
          ? "upcoming"
          : status === "paid"
            ? "current"
            : "upcoming",
    note:
      shippingStatus === "shipped" || shippingStatus === "delivered"
        ? `On its way. ${
            trackingNumber
              ? `${trackingCarrier ? `${trackingCarrier} · ` : ""}Tracking: ${trackingNumber}`
              : "Tracking details will follow shortly."
          }`
        : status === "paid"
          ? "The studio packs each piece framed and ships within 7–10 working days."
          : undefined,
  };

  const delivered: Step = {
    label: "Delivered",
    state: terminal
      ? "upcoming"
      : shippingStatus === "delivered"
        ? "done"
        : shippingStatus === "shipped"
          ? "current"
          : "upcoming",
    note: shippingStatus === "delivered" ? "Enjoy your piece." : undefined,
  };

  const steps: Step[] = [placed, payment, shipped, delivered];
  const label = orderStatusLabel(status);

  return (
    <ol className="space-y-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <li key={step.label} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <span
                aria-hidden="true"
                className={`absolute left-3.5 top-8 h-full w-px ${
                  step.state === "done" ? "bg-accent" : "bg-foreground/15"
                }`}
              />
            )}
            <span
              className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                step.state === "done"
                  ? "border-accent bg-accent text-background"
                  : step.state === "error"
                    ? "border-foreground/25 bg-foreground/5 text-foreground/60"
                    : step.state === "current"
                      ? "border-accent bg-background text-accent ring-1 ring-accent/40"
                      : "border-foreground/20 bg-background text-foreground/30"
              }`}
            >
              {step.state === "done" ? (
                <Check size={13} strokeWidth={2.5} />
              ) : step.state === "error" ? (
                <X size={13} strokeWidth={2.5} />
              ) : step.state === "current" ? (
                <CircleAlert size={13} strokeWidth={2} />
              ) : (
                <span className="text-[10px]">{index + 1}</span>
              )}
            </span>
            <div className="pt-0.5">
              <p
                className={`text-sm ${
                  step.state === "upcoming"
                    ? "text-foreground/45"
                    : "text-foreground"
                }`}
              >
                {step.label}
              </p>
              {step.note && (
                <p className="mt-1 max-w-sm text-xs leading-relaxed text-foreground/55">
                  {step.note}
                </p>
              )}
            </div>
          </li>
        );
      })}

      {status === "failed" && (
        <p className="mt-4 border border-foreground/10 bg-foreground/5 px-4 py-3 text-xs leading-relaxed text-foreground/60">
          {label}. If the amount was deducted but the order shows failed, get in touch
          and we will look into it right away.
        </p>
      )}
      {status === "refunded" && (
        <p className="mt-4 border border-foreground/10 bg-foreground/5 px-4 py-3 text-xs leading-relaxed text-foreground/60">
          This order was refunded. If anything is unclear, write to us and we will
          sort it out.
        </p>
      )}
    </ol>
  );
}