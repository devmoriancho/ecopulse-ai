import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, stepCountIs } from "ai";
import { prisma } from "./db";
import { fetchRegionalClimateData, searchPolicyContext } from "./tools";

const googleStudio = createGoogleGenerativeAI({
  apiKey:
    process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const geminiModel = process.env.GEMINI_MODEL ?? "gemini-3.8-flash";

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
    model: googleStudio.interactions(geminiModel),
    stopWhen: stepCountIs(6),
    tools: {
      searchWeb: searchPolicyContext,
      fetchWeather: fetchRegionalClimateData,
    },
    system: `You are an expert Kenyan climate data scientist and renewable energy engineer.
             Your task is to analyze user objectives based strictly on localized geographical factors.
             Current location framework: ${location}.
             Objective blueprint target: ${objective}.`,
    prompt: `Begin your engineering assessment sequence for the region: ${location}.`,
  });

  if (response.steps) {
    for (const step of response.steps) {
      if (step.toolCalls && step.toolCalls.length > 0) {
        for (const call of step.toolCalls) {
          await prisma.agentStepLog.create({
            data: {
              analysisId: analysisId,
              eventTitle: `Tool Executed: ${call.toolName}`,
              payloadDetails: `Arguments processed: ${JSON.stringify(call.input)}`,
            },
          });
        }
      }
    }
  }

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
