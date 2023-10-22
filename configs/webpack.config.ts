import "webpack-dev-server";
import path from "path";
import webpack from "webpack";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TsconfigPathsPlugins from "tsconfig-paths-webpack-plugin";

const isDev = process.env.NODE_ENV === "development";
const root = path.join(__dirname, "..");

const configuration: webpack.Configuration = {
  devtool: isDev ? "inline-source-map" : false,
  mode: isDev ? "development" : "production",
  target: ["web", "electron-renderer"],
  entry: path.join(root, "src", "client", "index.tsx"),
  output: {
    path: path.join(root, "dist", "public"),
    publicPath: isDev ? "/" : "./",
    filename: "main.js",
  },
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
      {
        test: /\.s?(c|a)ss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
            },
          },
          "sass-loader",
          "postcss-loader",
        ],
        include: /\.module\.s?(c|a)ss$/,
      },
      {
        test: /\.s?css$/,
        use: ["style-loader", "css-loader", "sass-loader", "postcss-loader"],
        exclude: /\.module\.s?(c|a)ss$/,
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    modules: [path.join(root, "src"), path.join(root, "node_modules")],
    plugins: [new TsconfigPathsPlugins()],
  },
  plugins: [
    ...(isDev ? [new ReactRefreshWebpackPlugin()] : []),
    new HtmlWebpackPlugin({
      filename: "index.html",
      favicon: path.join(root, "src", "public", "favicon.ico"),
      template: path.join(root, "src", "public", "index.html"),
    }),
  ],
  ...(isDev
    ? {
        devServer: {
          historyApiFallback: true,
          proxy: {
            "/api": "http://localhost:1212",
            "/websocket": {
              target: "ws://localhost:1212",
              ws: true,
            },
          },
        },
      }
    : {}),
};

export default configuration;
