import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductGallery } from "@/components/product/ProductGallery";

const images = ["/a.jpg", "/b.jpg", "/c.jpg"];

describe("ProductGallery", () => {
  it("renders the first image and all thumbnails", () => {
    render(<ProductGallery images={images} productName="Test 12V Charger" />);
    const altImg = document.querySelector("img[alt='Test 12V Charger']") as HTMLImageElement;
    expect(altImg).toHaveAttribute("src", "/a.jpg");
    expect(screen.getAllByRole("tab", { name: /image/i })).toHaveLength(3);
  });

  it("switches the main image when a thumbnail is clicked", () => {
    render(<ProductGallery images={images} productName="Test 12V Charger" />);

    fireEvent.click(screen.getByRole("tab", { name: "Image 3" }));

    const main = document.querySelector("img[alt='Test 12V Charger']") as HTMLImageElement;
    expect(main).toHaveAttribute("src", "/c.jpg");
  });

  it("navigates with previous/next buttons", () => {
    render(<ProductGallery images={images} productName="Test 12V Charger" />);

    fireEvent.click(screen.getByRole("button", { name: "Next image" }));
    let main = document.querySelector("img[alt='Test 12V Charger']") as HTMLImageElement;
    expect(main).toHaveAttribute("src", "/b.jpg");

    fireEvent.click(screen.getByRole("button", { name: "Previous image" }));
    main = document.querySelector("img[alt='Test 12V Charger']") as HTMLImageElement;
    expect(main).toHaveAttribute("src", "/a.jpg");
  });

  it("falls back to a single placeholder without thumbnails when empty", () => {
    render(<ProductGallery images={[]} productName="No images" />);
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(document.querySelector("img[alt='No images']")).toBeInTheDocument();
  });
});