import { Button } from "@/components/ui/Button";
import { useCommerce } from "@/context/CommerceContext";

export function WishlistButton({
  productId,
  size = "md",
  className = "",
}: {
  productId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const { wishlist, showToast } = useCommerce();
  const active = wishlist.has(productId);

  return (
    <Button
      variant="outline"
      size={size}
      className={className}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      onClick={() => {
        wishlist.toggle(productId);
        showToast(
          active ? "Removed from wishlist" : "Added to wishlist",
          active ? "info" : "success"
        );
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" />
      </svg>
    </Button>
  );
}