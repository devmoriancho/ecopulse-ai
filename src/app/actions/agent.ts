"use server";

import { prisma } from "@/lib/agent/db";
import { runEcoPulseAgent } from "@/lib/agent/engine";
import { revalidatePath } from "next/cache";

export async function startClimateAnalysis(
  location: string,
  objective: string,
) {
  const request = await prisma.analysisRequest.create({
    data: {
      targetLocation: location,
      userObjective: objective,
      status: "RUNNING",
    },
  });

  await prisma.agentStepLog.create({
    data: {
      analysisId: request.id,
      eventTitle: "Initializing Engine Pipeline",
      payloadDetails: `EcoPulse AI actively tracking boundaries for context region: ${location}`,
    },
  });

  revalidatePath("/");

  try {
    const reportText = await runEcoPulseAgent(request.id, objective, location);

    await prisma.climateReport.create({
      data: {
        analysisId: request.id,
        markdownBody: reportText,
        metricsSummary: {},
      },
    });
  } catch (error) {
    await prisma.analysisRequest.update({
      where: { id: request.id },
      data: { status: "FAILED" },
    });

    await prisma.agentStepLog.create({
      data: {
        analysisId: request.id,
        eventTitle: "Engine Execution Failure",
        payloadDetails:
          error instanceof Error
            ? error.message
            : "An unknown runtime calculation error occurred.",
      },
    });
  }

  revalidatePath("/");

  return request.id;
}
