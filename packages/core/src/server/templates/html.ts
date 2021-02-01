import { Template } from "../../../types";

const template: Template = ({
  html,
  scripts,
  head,
  htmlAttributes,
  bodyAttributes,
}) => `<!doctype html>
    <html ${htmlAttributes || ""}>
      <head>
        <meta charset="utf-8">
        <meta name="generator" content="Frontity">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${head ? head.join("\n") : ""}
      </head>
      <body ${bodyAttributes || ""}>
        <div id="root">${html}</div>
        ${scripts.join("\n") || ""}
      </body>
    </html>`;

export default template;
