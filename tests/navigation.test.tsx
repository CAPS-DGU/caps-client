import React from "react";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Navbar from "../src/components/NavBar";
import { Timeline } from "../src/components/CapsTimeline";
import WikiRecent from "../src/components/WIKI/WikiRecent";

const mocks = vi.hoisted(() => ({
  auth: {
    isLoggedIn: false,
    completeRegistration: true,
    user: null as null | { role: string },
  },
  recent: [] as { title: string }[],
}));
vi.mock("../src/hooks/useAuth", () => ({ useAuth: () => mocks.auth }));
vi.mock("@tanstack/react-query", () => ({
  useQuery: () => ({ data: mocks.recent, isLoading: false }),
}));

describe("navigation and recent changes", () => {
  it("orders public menu items and retains ledger visibility rules", () => {
    const { rerender } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );
    expect(
      screen
        .getAllByRole("link")
        .slice(1)
        .map((link) => link.textContent),
    ).toEqual(["소개", "캡스위키", "블로그"]);
    expect(screen.queryByRole("link", { name: "FAQ" })).toBeNull();
    mocks.auth.isLoggedIn = true;
    mocks.auth.user = { role: "MEMBER" };
    rerender(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: "장부게시판" })).toHaveAttribute(
      "href",
      "/ledger",
    );
    mocks.auth.user = { role: "NEW_MEMBER" };
    rerender(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );
    expect(screen.queryByRole("link", { name: "장부게시판" })).toBeNull();
  });

  it("renders the newest history first, including events within a year", () => {
    const { container } = render(<Timeline />);
    const years = Array.from(container.querySelectorAll(".text-2xl")).map(
      (node) => Number(node.textContent),
    );
    expect(years[0]).toBe(2026);
    expect(years).toEqual([...years].sort((a, b) => b - a));
    expect(screen.getAllByRole("listitem")[1]).toHaveTextContent(
      "7월 6개 대학",
    );
  });

  it("labels recent wiki changes and handles an empty result", () => {
    const { rerender } = render(
      <MemoryRouter>
        <WikiRecent />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: "최근 수정 내역" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("최근 수정된 문서가 없습니다."),
    ).toBeInTheDocument();
    mocks.recent = [{ title: "CAPS" }];
    rerender(
      <MemoryRouter>
        <WikiRecent />
      </MemoryRouter>,
    );
    expect(
      within(screen.getByRole("region", { name: "최근 수정 내역" })).getByRole(
        "link",
        { name: "CAPS" },
      ),
    ).toHaveAttribute("href", "/wiki/CAPS");
  });
});
