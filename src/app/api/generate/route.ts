import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export const runtime = "edge";

const responseSchema = z.object({
  simpleNorwegian: z
    .string()
    .describe("The concept explained in very simple Norwegian (CEFR A2/B1 level). Short sentences."),
  nativeTranslation: z
    .string()
    .describe("The full explanation translated into the user's native language"),
  analogy: z
    .string()
    .describe("A relatable real-world analogy appropriate for teenagers/young adults"),
  quiz: z.object({
    question: z
      .string()
      .describe("A multiple-choice question to test understanding"),
    options: z
      .array(z.string())
      .length(3)
      .describe("Three answer options (1 correct, 2 wrong)"),
    correctAnswer: z
      .string()
      .describe("The correct answer (must match one of the options exactly)"),
  }),
});

const systemPrompt = `You are an expert pedagogical assistant for students learning Norwegian.
Your goal is to explain complex academic concepts simply.

When the user provides a "Concept" and a "Native Language":
1.  **Explanation:** Explain the concept in very simple Norwegian (CEFR level A2/B1). Use short sentences.
2.  **Translation:** Translate the *explanation* (not just the word) into the user's selected Native Language accurately.
3.  **Analogy:** Create a relatable, real-world analogy appropriate for a teenager/young adult.
4.  **Quiz:** Create one multiple-choice question with 3 options (1 correct, 2 wrong) to test understanding.

Return the data strictly as a JSON object.`;

export async function POST(req: Request) {
  try {
    const { term, language } = await req.json();

    if (!term || !language) {
      return Response.json(
        { error: "Missing term or language" },
        { status: 400 }
      );
    }

    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: responseSchema,
      system: systemPrompt,
      prompt: `Concept: "${term}"
Native Language: ${language}`,
    });

    return Response.json(result.object);
  } catch (error) {
    console.error("Error generating response:", error);
    return Response.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
