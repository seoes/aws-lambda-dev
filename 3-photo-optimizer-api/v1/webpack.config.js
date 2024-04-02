const path = require("path");
const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    mode: slsw.lib.webpack.isLocal ? "development" : "production",
    entry: slsw.lib.entries,
    devtool: "source-map",
    resolve: {
        extensions: [".mjs", ".json", ".ts", ".js"],
    },
    output: {
        libraryTarget: "commonjs2",
        path: path.join(__dirname, ".webpack"),
        filename: "[name].js",
    },
    target: "node",
    // externals: [/aws-sdk/],
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: "/node_modules/",
            },
        ],
    },
    stats: true,
};
