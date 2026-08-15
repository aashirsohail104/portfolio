import { Button } from "@/components/ui/Button";
import { useCommerce } from "@/context/CommerceContext";
import { COMPARE_MAX } from "@/lib/logic/compare";

export function CompareToggle({
  productId,
  size = "sm",
  label,
  className = "",
}: {
  productId: string;
  size?: "sm" | "md";
  label?: string;
  className?: string;
}) {
  const { compare, showToast } = useCommerce();
  const active = compare.has(productId);

  return (
    <Button
      variant="outline"
      size={size}
      className={className}
      aria-pressed={active}
      aria-label={active ? "Remove from compare" : "Add to compare"}
      onClick={() => {
        if (!active && compare.items.length >= COMPARE_MAX) {
          showToast("Compare list is full. Remove one first.", "error");
          return;
        }
        if (active) compare.remove(productId);
        else compare.add(productId);
        showToast(
          active ? "Removed from compare" : "Added to compare",
          active ? "info" : "success"
        );
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M4 6h16M8 12h8m-5 6h2" />
      </svg>
      {label && <span>{label}</span>}
    </Button>
  );
}