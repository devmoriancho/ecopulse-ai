"use server";

import { prisma } from "@/lib/agent/db";
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
      eventTitle: "Starting check",
      payloadDetails: `EcoPulse AI is checking ${location}.`,
    },
  });

  revalidatePath("/");

  return request.id;
}
