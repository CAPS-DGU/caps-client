// orval.config.cjs
module.exports = {
  capsApi: {
    input: {
      target: "./openapi.patched.json", // generated from scripts/fetch-openapi.mjs + scripts/patch-openapi.mjs
    },
    output: {
      target: "src/api/generated/capsApi.ts", // 생성될 파일
      client: "react-query", // axios + react-query 훅 같이 생성
      prettier: true,
      override: {
        mutator: {
          // Orval 전용 axios 클라이언트
          path: "src/utils/orvalClient.ts",
          name: "orvalClient",
        },
      },
    },
  },
};