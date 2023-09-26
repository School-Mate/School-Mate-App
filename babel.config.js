module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@": "./src",
            "@hooks": "./src/hooks",
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@utils": "./src/utils",
            "@navigator": "./src/navigator",
            "@types": "./src/types",
            "@lib": "./src/lib",
            "@assets": "./assets",
          },
        },
      ],
    ],
  };
};
