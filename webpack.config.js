const path = require("node:path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
		plugins: [new TsconfigPathsPlugin()],
		alias: {
			"@components": path.resolve(__dirname, "src/components/"),
			"@utils": path.resolve(__dirname, "src/lib/utils/"),
		},
	},
	// other configurations...
};
