const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,
  },
  pages: {
    index: {
      // entry for the page
      entry: "src/main.js",
      template: "public/index.html",
      filename: "index.html",
      title: "HealthcareGoWhere &vert; The right Healthcare, anywhere.",
    },
  },
});
