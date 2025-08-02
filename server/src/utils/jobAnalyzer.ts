import { callGroqLLM } from "../../src/groqClient";
import { ResumeAnalysis } from "types/applicant.types";

/**
 * Type definition for the response structure from the LLM.
 */


/**
 * @param rawText Raw string from LLM
 * @returns Parsed ResumeAnalysis JSON or throws error
 */
function extractJsonFromLLMResponse(rawText: string): ResumeAnalysis {
  const jsonMatch = rawText.match(/\{[\s\S]*\}$/); // Match JSON-like block at the end
  if (!jsonMatch) {
    throw new Error("No JSON found in the response");
  }
  return JSON.parse(jsonMatch[0]);
}

/**
 * Analyzes how well a resume matches a job description using an LLM.
 * @param jobDescription Job description string
 * @param resumeText Plain text resume content
 * @returns Structured ResumeAnalysis result
 */
export async function analyzeResumeJobFit(
  jobDescription: string,
  resumeText: string
): Promise<ResumeAnalysis | { error: string; raw: string }> {
  const prompt = `
You are a strict JSON-only resume analysis bot. Your ONLY job is to return structured JSON based on the resume and job description.

DO NOT include:
- Any explanations
- <think> tags
- Markdown
- Extra commentary

Input:

Job Description:
"""
${jobDescription}
"""

Resume:
"""
${resumeText}
"""

Respond ONLY in this exact JSON format:
{
  "name": string,
  "education": [string],
  "projects": [string],
  "resumeScore": number, // Out of 5
  "keyQualificationsMatched": [string],
  "skillsNotBackedByExperience": [string],
  "suitableJobRoles": [string],
  "recommendations": {
    "strengthenTechnicalAlignment": [string],
    "highlightEngineeringPrinciples": [string],
    "improveResumeStructure": [string],
    "tailorSummary": [string],
    "addMetricsToProjects": [string]
  },
  "finalNotes": string
}

Important Rules:
1. 'resumeScore' must be a number from 0 to 5 (inclusive)
2. DO NOT include trailing commas in arrays or objects
3. Wrap all string values in double quotes
4. Start your response with '{' and end with '}'
5. DO NOT include commentary before or after the JSON
`;

  try {
    const result = await callGroqLLM(prompt);
    const parsed = extractJsonFromLLMResponse(result);
    return parsed;
  } catch (error: any) {
    console.error("Failed to parse structured response:", error);
    return { error: "Parsing failed", raw: error.message };
  }
}
