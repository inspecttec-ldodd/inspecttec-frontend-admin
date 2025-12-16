import * as fs from "node:fs";
import * as path from "node:path";
import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";
import { ReactRefreshRspackPlugin } from "@rspack/plugin-react-refresh";
import { TanStackRouterRspack } from "@tanstack/router-plugin/rspack";
import * as dotenv from "dotenv";

// Load environment files
const loadEnvFiles = (): void => {
    const NODE_ENV = process.env.NODE_ENV || "development";
    const envFiles = [
        `.env.${NODE_ENV}.local`,
        `.env.${NODE_ENV}`,
        ".env.local",
        ".env",
    ];

    for (const envFile of envFiles) {
        const envPath = path.resolve(process.cwd(), envFile);
        if (fs.existsSync(envPath)) {
            dotenv.config({ path: envPath });
        }
    }
};

loadEnvFiles();

const isDev = process.env.NODE_ENV === "development";
const useHttps = process.env.HTTPS === "true";

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ["chrome >= 87", "edge >= 88", "firefox >= 78", "safari >= 14"];

export default defineConfig({
    context: __dirname,
    entry: {
        main: "./src/main.tsx",
    },
    output: {
        filename: isDev ? "[name].js" : "[name].[contenthash:8].js",
        chunkFilename: isDev
            ? "[name].chunk.js"
            : "[name].[contenthash:8].chunk.js",
        assetModuleFilename: isDev
            ? "[name][ext]"
            : "[name].[contenthash:8][ext]",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@apps": path.resolve(__dirname, "src/apps"),
            "@assets": path.resolve(__dirname, "src/assets"),
            "@components": path.resolve(__dirname, "src/components"),
            "@hooks": path.resolve(__dirname, "src/hooks"),
            "@lib": path.resolve(__dirname, "src/lib"),
            "@routes": path.resolve(__dirname, "src/routes"),
            "@services": path.resolve(__dirname, "src/services"),
            "@stores": path.resolve(__dirname, "src/stores"),
            "@types": path.resolve(__dirname, "src/types"),
            "@config": path.resolve(__dirname, "src/config"),
        },
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|jpeg|gif|svg|webp)$/i,
                type: "asset",
            },
            {
                test: /\.(jsx?|tsx?)$/,
                use: [
                    {
                        loader: "builtin:swc-loader",
                        options: {
                            jsc: {
                                parser: {
                                    syntax: "typescript",
                                    tsx: true,
                                },
                                transform: {
                                    react: {
                                        runtime: "automatic",
                                        development: isDev,
                                        refresh: isDev,
                                    },
                                },
                            },
                            env: { targets },
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ["postcss-loader"],
                type: "css",
            },
        ],
    },
    devServer: {
        historyApiFallback: {
            disableDotRule: true,
            index: "/",
        },
        host: "0.0.0.0", //allows access from local network
        port: 3031, // CHANGED PORT TO AVOID CONFLICT
        open: true,
        hot: true,
        ...(useHttps && {
            server: {
                type: "https",
                options: {
                    // If you have custom certificate files, specify them here:
                    // key: fs.readFileSync(path.join(__dirname, 'certs/server.key')),
                    // cert: fs.readFileSync(path.join(__dirname, 'certs/server.cert')),
                    // Otherwise, webpack-dev-server will generate a self-signed certificate
                },
            },
        }),
    },
    plugins: [
        TanStackRouterRspack({ target: "react", autoCodeSplitting: true }),
        new rspack.HtmlRspackPlugin({
            template: "./index.html",
            publicPath: "/",
        }),
        new rspack.DefinePlugin({
            "process.env.REACT_APP_API_BASE_URL": JSON.stringify(
                process.env.REACT_APP_API_BASE_URL,
            ),
            "process.env.REACT_APP_AZURE_AD_CLIENT_ID": JSON.stringify(
                process.env.REACT_APP_AZURE_AD_CLIENT_ID,
            ),
            "process.env.REACT_APP_AZURE_AD_TENANT_ID": JSON.stringify(
                process.env.REACT_APP_AZURE_AD_TENANT_ID,
            ),
            "process.env.REACT_APP_REDIRECT_URI": JSON.stringify(
                process.env.REACT_APP_REDIRECT_URI,
            ),
            "process.env.REACT_APP_SCOPES": JSON.stringify(
                process.env.REACT_APP_SCOPES,
            ),
            "process.env.REACT_APP_APPINSIGHTS_CONNECTION_STRING": JSON.stringify(
                process.env.REACT_APP_APPINSIGHTS_CONNECTION_STRING,
            ),
            "process.env.NODE_ENV": JSON.stringify(
                process.env.NODE_ENV,
            ),
        }),
        isDev ? new ReactRefreshRspackPlugin() : null,
    ].filter(Boolean),
    optimization: {
        minimizer: [
            new rspack.SwcJsMinimizerRspackPlugin(),
            new rspack.LightningCssMinimizerRspackPlugin({
                minimizerOptions: { targets },
            }),
        ],
    },
    experiments: {
        css: true,
    },
});
