import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY });

const responseCache = new Map<string, any>();

async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, i))
      );
    }
  }
  throw new Error("Max retries exceeded");
}

// Generate a hint
export async function generateHint(
  challengeId: string,
  challengeTitle: string,
  challengeDescription: string,
  userAttempts: number,
  challengeType: string
): Promise<string> {
  const cacheKey = `hint-${challengeId}-${userAttempts}`;

  if (responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey);
  }

  try {
    const prompt = `You are a helpful coding tutor. A student is working on this challenge:

Title: ${challengeTitle}
Description: ${challengeDescription}
Type: ${challengeType}
Attempts so far: ${userAttempts}

Provide a helpful hint that guides them toward the solution WITHOUT giving away the answer directly. 
The hint should be encouraging and educational. Keep it under 100 words.`;

    const response = await withRetry(() =>
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      })
    );
    const hint =
      response.text || "Try breaking down the problem into smaller steps.";

    responseCache.set(cacheKey, hint);
    return hint;
  } catch (error) {
    console.error("Error generating hint:", error);
    return "Think about the problem step by step. What data structure would be most efficient here?";
  }
}

// Evaluate solution
export async function evaluateSolution(
  challengeTitle: string,
  challengeDescription: string,
  userSolution: string,
  challengeType: string
): Promise<{
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}> {
  try {
    const prompt = `Evaluate this coding solution and respond ONLY with valid JSON (no markdown, no extra text):

Challenge: ${challengeTitle}
Description: ${challengeDescription}

Solution:
${userSolution}

Provide evaluation as JSON:
{"score": 85, "feedback": "Brief feedback", "strengths": ["strength1", "strength2"], "improvements": ["improvement1", "improvement2"]}`;

    const response = await withRetry(() =>
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      })
    );
    const text = response.text;

    // Clean up response (remove markdown code blocks if present)
    const cleanText = (text ?? "")
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const parsed = JSON.parse(cleanText);

    return {
      score: parsed.score || 50,
      feedback: parsed.feedback || "Good effort!",
      strengths: parsed.strengths || [],
      improvements: parsed.improvements || [],
    };
  } catch (error) {
    console.error("Error evaluating solution:", error);
    return {
      score: 50,
      feedback: "Unable to evaluate at this time.",
      strengths: [],
      improvements: [],
    };
  }
}

// Generate practice problem
export async function generatePracticeProblem(
  weakTopic: string,
  difficulty: "easy" | "medium" | "hard"
): Promise<{
  title: string;
  description: string;
  type: string;
  hints: string[];
  expectedApproach: string;
}> {
  try {
    const prompt = `Create a ${difficulty} coding challenge about ${weakTopic}. Respond ONLY with valid JSON:

{"title": "Challenge title", "description": "Problem with examples", "type": "code", "hints": ["hint1", "hint2"], "expectedApproach": "Solution approach"}`;

    const response = await withRetry(() =>
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      })
    );
    const text = response.text;
    const cleanText = (text ?? "")
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const parsed = JSON.parse(cleanText);

    return {
      title: parsed.title || "Practice Problem",
      description: parsed.description || "Solve this problem.",
      type: parsed.type || "code",
      hints: parsed.hints || [],
      expectedApproach: parsed.expectedApproach || "",
    };
  } catch (error) {
    console.error("Error generating practice problem:", error);
    throw new Error("Failed to generate practice problem");
  }
}

export function clearAICache() {
  responseCache.clear();
}
