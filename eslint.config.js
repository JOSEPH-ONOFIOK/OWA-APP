import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  { ignores: ["public/sw.js", "public/sw.js.map"] },
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default eslintConfig;
