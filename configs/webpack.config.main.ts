import path from "path";
import webpack from "webpack";
import TsconfigPathsPlugins from "tsconfig-paths-webpack-plugin";

const root = path.join(__dirname, "..");

const configuration: webpack.Configuration = {
  mode: "production",
  target: "electron-main",
  entry: path.join(root, "src", "main", "main.ts"),
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            compilerOptions: {
              module: "esnext",
            },
          },
        },
      },
    ],
  },
  output: {
    path: path.join(root, "dist", "main"),
    library: {
      type: "commonjs2",
    },
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    modules: [path.join(root, "src"), path.join(root, "node_modules")],
    plugins: [new TsconfigPathsPlugins()],
  },
};

export default configuration;
