import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import WikiDocument from "../src/components/WIKI/WikiDocument";
import WikiEditor from "../src/components/WIKI/WikiEditor";

describe("shared wiki renderer", () => {
  it("preserves formatting, links, frames and safe inline HTML but removes executable HTML", () => {
    const { container } = render(
      <WikiDocument
        content={
          '== 제목 ==\n||굵게|| [[캡스|CAPS]]\n((설명))\n<span style="color:red">빨강</span><img src="x" onerror="alert(1)"><script>alert(2)</script><a href="javascript:alert(1)">나쁜 링크</a>'
        }
      />,
    );
    expect(screen.getByText("굵게").tagName).toBe("B");
    expect(screen.getByRole("link", { name: "캡스" })).toHaveAttribute(
      "href",
      "/wiki/CAPS",
    );
    expect(container.querySelector(".wiki-frame")).toHaveTextContent("설명");
    expect(screen.getByText("빨강")).toHaveStyle({ color: "rgb(255, 0, 0)" });
    expect(container.querySelector("script,[onerror],[onclick]")).toBeNull();
    expect(screen.getByText("나쁜 링크")).not.toHaveAttribute("href");
  });

  it("updates the preview without navigating redirect documents and saves raw wiki syntax", async () => {
    const onSave = vi.fn();
    render(
      <WikiEditor initialContent={{ content: "기존 내용" }} onSave={onSave} />,
    );
    const input = screen.getByRole("textbox", { name: "위키 내용" });
    fireEvent.change(input, {
      target: { value: "#다른문서\n||새 내용|| {{설명}}" },
    });
    const preview = screen.getByRole("region", { name: "미리보기" });
    expect(within(preview).getByText("새 내용").tagName).toBe("B");
    expect(within(preview).getByText("#다른문서")).toBeInTheDocument();
    expect(
      within(preview).getAllByRole("link", { name: "[1]" })[0],
    ).toHaveAttribute("href", "#preview-comment-1");
    await userEvent.click(
      screen.getByRole("button", { name: "수정", exact: true }),
    );
    expect(onSave).toHaveBeenCalledWith("#다른문서\n||새 내용|| {{설명}}");
  });

  it("supports keyboard focus, Escape and desktop hover without blocking navigation", async () => {
    render(<WikiDocument content="본문 {{각주 설명}}" />);
    const link = screen.getAllByRole("link", { name: "[1]" })[0];
    await userEvent.tab();
    expect(screen.getByRole("tooltip")).toHaveTextContent("각주 설명");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).toBeNull();
    await userEvent.hover(link);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(fireEvent.click(link)).toBe(true);
  });

  it("shows a footnote on first touch, follows on second, dismisses outside, and isolates instances", async () => {
    render(
      <>
        <WikiDocument content="본문 {{각주 설명}}" />
        <WikiDocument content="다른 본문 {{다른 각주}}" idPrefix="preview-" />
      </>,
    );
    const link = screen.getAllByRole("link", { name: "[1]" })[0];
    await userEvent.pointer({ keys: "[TouchA>]", target: link });
    expect(fireEvent.click(link)).toBe(false);
    expect(screen.getByRole("tooltip")).toHaveTextContent("각주 설명");
    expect(fireEvent.click(link)).toBe(true);
    expect(screen.queryByRole("tooltip")).toBeNull();
    expect(fireEvent.click(link)).toBe(false);
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole("tooltip")).toBeNull();
    expect(document.querySelectorAll("#comment-1")).toHaveLength(1);
    expect(document.querySelectorAll("#preview-comment-1")).toHaveLength(1);
  });
});
