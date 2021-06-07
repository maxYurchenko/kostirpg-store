const path = require("path");
const R = require("ramda");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const {
  setEntry,
  addRule,
  addPlugin,
  appendExtensions,
  prependExtensions
} = require("./util/compose");
const env = require("./util/env");

const isProd = env.prod;

// ----------------------------------------------------------------------------
// Base config
// ----------------------------------------------------------------------------

const config = {
  context: path.join(__dirname, "/src/main/resources/assets"),
  entry: {},
  output: {
    path: path.join(__dirname, "/build/resources/main/assets"),
    filename: "[name].js"
  },
  resolve: {
    extensions: []
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: false
          }
        }
      })
    ],
    splitChunks: {
      minSize: 30000
    }
  },
  plugins: [],
  mode: env.type,
  devtool: isProd ? false : "inline-source-map"
};

// ----------------------------------------------------------------------------
// JavaScript loaders
// ----------------------------------------------------------------------------

// TYPESCRIPT
function addTypeScriptSupport(cfg) {
  const rule = {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    loader: "ts-loader",
    options: {
      configFile: "src/main/resources/assets/tsconfig.client.json"
    }
  };

  return R.pipe(
    setEntry("ts/bundle", "./ts/main.ts"),
    addRule(rule),
    prependExtensions([".tsx", ".ts", ".json"])
  )(cfg);
}

// ----------------------------------------------------------------------------
// CSS loaders
// ----------------------------------------------------------------------------

const createDefaultCssLoaders = () => [
  {
    loader: MiniCssExtractPlugin.loader,
    options: { publicPath: "../" }
  },
  {
    loader: "css-loader",
    options: { sourceMap: !isProd, importLoaders: 1, url: false }
  },
  { loader: "postcss-loader", options: { sourceMap: !isProd } }
];

const createCssPlugin = () =>
  new MiniCssExtractPlugin({
    filename: "./styles/bundle.css",
    chunkFilename: "[id].css"
  });

// SASS & SCSS
function addSassSupport(cfg) {
  const rule = {
    test: /\.s[ac]ss$/i,
    use: [
      ...createDefaultCssLoaders(),
      { loader: "sass-loader", options: { sourceMap: !isProd } }
    ]
  };

  const plugin = createCssPlugin();

  return R.pipe(
    addRule(rule),
    addPlugin(plugin),
    appendExtensions([".scss", ".css"])
  )(cfg);
}

// ----------------------------------------------------------------------------
// Resource loaders
// ----------------------------------------------------------------------------

// FONTS IN CSS
function addFontSupport(cfg) {
  const rule = {
    test: /\.(eot|woff|woff2|ttf|svg)$/,
    use: "file-loader?name=fonts/[name].[ext]"
  };

  return R.pipe(addRule(rule))(cfg);
}

// ----------------------------------------------------------------------------
// Result config
// ----------------------------------------------------------------------------

module.exports = R.pipe(
  addTypeScriptSupport,
  addSassSupport,
  addFontSupport
)(config);
