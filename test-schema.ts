import { tool, jsonSchema } from "ai";
import { z } from "zod";

const myTool = tool({
  description: "Test",
  parameters: z.object({
    search: z.string(),
    budget: z.string()
  }),
  execute: async () => {}
});

console.log(JSON.stringify(myTool.parameters, null, 2));
