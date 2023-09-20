import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";
import dotenv from "dotenv";
dotenv.config();

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
    },
    {
      file: pkg.module,
      format: "es",
    },
  ],
  external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {}), "react/jsx-runtime"],
  plugins: [
    typescript({
      typescript: require("typescript"),
    }),
  ],
};
