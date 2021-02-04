import React from "react";
import TestRenderer from "react-test-renderer";
import GooglePublisherTag from "../google-publisher-tag";

describe("GooglePublisherTag", () => {
  test("should use `id` as the container ID if data is not specified", () => {
    const gpt = TestRenderer.create(
      <GooglePublisherTag
        id="gpt-id-123"
        unit="/1234567/sport/"
        size={[320, 100]}
      />
    ).toJSON();

    expect(gpt).toMatchInlineSnapshot(`
      <div
        css={
          Object {
            "map": undefined,
            "name": "w9ytu2",
            "next": undefined,
            "styles": "
              min-width: 320px;
              min-height: 100px;
            ",
            "toString": [Function],
          }
        }
        id="gpt-id-123"
      />
    `);
  });

  test("should append `link` to the container ID if data is specified", () => {
    const gpt = TestRenderer.create(
      <GooglePublisherTag
        id="gpt-id-123"
        unit="/1234567/sport/"
        size={[320, 100]}
        data={{ link: "/2020/08/post-with-long-link/" }}
      />
    ).toJSON();

    expect(gpt).toMatchInlineSnapshot(`
      <div
        css={
          Object {
            "map": undefined,
            "name": "w9ytu2",
            "next": undefined,
            "styles": "
              min-width: 320px;
              min-height: 100px;
            ",
            "toString": [Function],
          }
        }
        id="gpt-id-123_2020_08_post-with-long-link"
      />
    `);
  });

  test("should render the container with the minimum size", () => {
    const gpt = TestRenderer.create(
      <GooglePublisherTag
        id="gpt-id-123"
        unit="/1234567/sport/"
        size={[
          [320, 100],
          [300, 600],
        ]}
      />
    ).toJSON();

    expect(gpt).toMatchInlineSnapshot(`
      <div
        css={
          Object {
            "map": undefined,
            "name": "xhftkh",
            "next": undefined,
            "styles": "
              min-width: 300px;
              min-height: 100px;
            ",
            "toString": [Function],
          }
        }
        id="gpt-id-123"
      />
    `);
  });
});
