import assert from "node:assert/strict";
import test from "node:test";
import { sanitizeValue } from "../src/utils/sanitize.js";

test("sanitizeValue strips unsafe characters and blocked object keys", () => {
  const sanitized = sanitizeValue({
    title: "  <Launch Party>  ",
    nested: {
      "__proto__": {
        polluted: true,
      },
      note: "Hello    world",
    },
    tags: ["<vip>", " open "],
  });

  assert.deepEqual(sanitized, {
    title: "Launch Party",
    nested: {
      note: "Hello world",
    },
    tags: ["vip", "open"],
  });
});
