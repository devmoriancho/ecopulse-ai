import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { prisma } from "./db";

const googleStudio = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function runEcoPulseAgent(
  analysisId: string,
  objective: string,
  location: string,
) {
  await prisma.agentStepLog.create({
    data: {
      analysisId: analysisId,
      eventTitle: "Invoking Reasoning Engine",
      payloadDetails: `Initializing AI processing sequence for target coordinates sector: ${location}`,
    },
  });

  const response = await generateText({
    model: googleStudio("gemini-2.5-flash"),
    system: `You are an expert Kenyan climate data scientist and renewable energy engineer.
             Your task is to analyze user objectives based strictly on localized geographical factors.
             Current location framework: ${location}.
             Objective blueprint target: ${objective}.`,
    prompt: `Begin your engineering assessment sequence for the region: ${location}.`,
  });

  await prisma.agentStepLog.create({
    data: {
      analysisId: analysisId,
      eventTitle: "Compilation Finalized",
      payloadDetails:
        "Climate metrics computed successfully. Storing data report arrays.",
    },
  });

  await prisma.analysisRequest.update({
    where: { id: analysisId },
    data: { status: "COMPLETED" },
  });

  return response.text;
}
