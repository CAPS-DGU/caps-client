import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import WikiEngine from "../src/components/WIKI/WikiEngine";

const auth = vi.hoisted(() => ({ isLoggedIn: false }));
vi.mock("../src/hooks/useAuth", () => ({ useAuth: () => auth }));

describe("wiki document actions", () => {
  it("hides both protected actions from guests and shows them after login", () => {
    const view = (
      <MemoryRouter>
        <WikiEngine DocTitle="긴 문서 제목" content="본문" />
      </MemoryRouter>
    );
    const { rerender } = render(view);
    expect(screen.getByText("본문")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "수정", exact: true }),
    ).toBeNull();
    expect(
      screen.queryByRole("link", { name: "수정 내역", exact: true }),
    ).toBeNull();
    auth.isLoggedIn = true;
    rerender(
      <MemoryRouter>
        <WikiEngine DocTitle="긴 문서 제목" content="본문" />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("link", { name: "수정", exact: true }),
    ).toHaveAttribute("href", "/wiki/edit/긴 문서 제목");
    expect(
      screen.getByRole("link", { name: "수정 내역", exact: true }),
    ).toHaveAttribute("href", "/wiki/history/긴 문서 제목");
    auth.isLoggedIn = false;
    rerender(
      <MemoryRouter>
        <WikiEngine DocTitle="긴 문서 제목" content="본문" />
      </MemoryRouter>,
    );
    expect(
      screen.queryByRole("link", { name: "수정 내역", exact: true }),
    ).toBeNull();
  });

  it("does not show document actions for a missing document, even when logged in", () => {
    auth.isLoggedIn = true;
    render(
      <MemoryRouter>
        <WikiEngine
          DocTitle="없는 문서"
          content="문서가 없습니다."
          notFoundFlag
        />
      </MemoryRouter>,
    );
    expect(
      screen.queryByRole("link", { name: "수정", exact: true }),
    ).toBeNull();
    expect(
      screen.queryByRole("link", { name: "수정 내역", exact: true }),
    ).toBeNull();
  });
});
