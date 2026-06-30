import { Check } from "lucide-react";

const tiers = [
  { name: "Hobby", price: "$0", features: ["1 project", "Community support"], highlighted: false },
  {
    name: "Pro",
    price: "$19",
    features: ["Unlimited projects", "Priority support", "Team sync"],
    highlighted: true,
  },
  {
    name: "Team",
    price: "$49",
    features: ["Everything in Pro", "SSO", "Audit log"],
    highlighted: false,
  },
];

export function DemoPricing() {
  return (
    <section
      data-elementation-component="DemoPricing"
      data-elementation-file="components/playground/demo-pricing.tsx"
      data-elementation-line="13"
      className="pricing border-t px-6 py-16"
    >
      <h2 className="pricing-title text-center text-2xl font-semibold tracking-tight">
        Simple, transparent pricing
      </h2>
      <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`pricing-card rounded-xl border p-6 ${
              tier.highlighted ? "border-primary shadow-sm" : ""
            }`}
          >
            <div className="text-muted-foreground text-sm font-medium">{tier.name}</div>
            <div className="mt-2 text-3xl font-bold">
              {tier.price}
              <span className="text-muted-foreground text-base font-normal">/mo</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="text-primary size-4" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={`mt-6 w-full rounded-md px-4 py-2 text-sm font-medium ${
                tier.highlighted ? "bg-primary text-primary-foreground" : "border"
              }`}
            >
              Choose {tier.name}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
