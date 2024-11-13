const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    // Modify the default HtmlWebpackPlugin to set the title dynamically
    config.plugin("html").tap((args) => {
      args[0].title = "SN Beauty"; // Set the default title here
      return args;
    });
  },
});
