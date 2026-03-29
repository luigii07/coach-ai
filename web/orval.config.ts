import { defineConfig } from "orval"
import "dotenv/config"

export default defineConfig({
  fetch: {
    input: `${process.env.NEXT_PUBLIC_API_URL}/swagger.json`,
    output: {
      target: "./src/lib/api/fetch-generated/index.ts",
      client: "fetch",
      prettier: true,
      override: {
        mutator: {
          path: "./src/lib/fetch.ts",
          name: "customFetch",
        },
      },
    },
  },
})
