import test from "node:test";
import assert from "node:assert/strict";
import { normalizeWikiPathname, wikiHref } from "../src/utils/wikiUrl.ts";

test("legacy plus paths normalize before lookup, including edit and history", () => {
  for (const prefix of ["/wiki/", "/wiki/edit/", "/wiki/history/"]) {
    assert.equal(normalizeWikiPathname(prefix + "CU+2843+캡스"), prefix + "CU%202843%20캡스");
  }
});
test("canonical paths, literal encoded plus and unrelated routes stay unchanged", () => {
  for (const path of ["/wiki/CU%202843", "/wiki/C%2B%2B", "/blog/A+B"]) {
    assert.equal(normalizeWikiPathname(path), path);
  }
});
test("wiki links encode spaces and reserved characters without double encoding", () => {
  assert.equal(wikiHref("CU 2843 캡스"), "/wiki/CU%202843%20%EC%BA%A1%EC%8A%A4");
  assert.equal(wikiHref("C++"), "/wiki/C%2B%2B");
  assert.equal(wikiHref("A?B%"), "/wiki/A%3FB%25");
  assert.equal(wikiHref("CAPS 홈페이지#c4"), "/wiki/CAPS%20%ED%99%88%ED%8E%98%EC%9D%B4%EC%A7%80#c4");
});
