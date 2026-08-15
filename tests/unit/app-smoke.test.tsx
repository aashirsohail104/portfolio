import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "@/app";

describe("App smoke", () => {
  it("renders the home route without throwing", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/Premium battery chargers/i)).toBeTruthy();
    });
  });

  it("renders the catalog route without throwing", async () => {
    render(
      <MemoryRouter initialEntries={["/catalog"]}>
        <App />
      </MemoryRouter>
    );
    await waitFor(
      () => {
        expect(screen.getByRole("heading", { name: "Catalog" })).toBeTruthy();
      },
      { timeout: 5000 }
    );
  });
});
