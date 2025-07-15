const path = require("path");

module.exports = {
    mode: "production",
    entry: "./src/script.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "script.js",
        library: {
            type: "commonjs2",
        },
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    target: "node",
    externals: {
        k6: "commonjs k6",
        "k6/http": "commonjs k6/http",
        "k6/crypto": "commonjs k6/crypto",
        "k6/data": "commonjs k6/data",
        "k6/encoding": "commonjs k6/encoding",
        "k6/execution": "commonjs k6/execution",
        "k6/html": "commonjs k6/html",
        "k6/metrics": "commonjs k6/metrics",
        "k6/options": "commonjs k6/options",
        "k6/ws": "commonjs k6/ws",
    },
};
