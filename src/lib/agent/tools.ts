import { z } from "zod";

export const searchPolicyContext = {
  description:
    "Search the web for regional grid regulations, agricultural policies, and climate initiatives.",
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "The specific search query focused on regional climate or energy policies.",
      ),
  }),
  execute: async ({ query }: { query: string }) => {
    try {
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: process.env.TAVILY_API_KEY,
          query: `${query} Kenya climate energy policy`,
          max_results: 3,
        }),
      });

      if (!response.ok) throw new Error("Tavily API communication fault");
      const data = await response.json();

      return {
        success: true,
        data: JSON.stringify(data.results),
      };
    } catch {
      return {
        success: false,
        data: "Failed web context gathering sequence.",
      };
    }
  },
};

export const fetchRegionalClimateData = {
  description:
    "Fetch real-time and historical solar irradiance and weather metrics for a specific coordinate zone.",
  inputSchema: z.object({
    latitude: z
      .number()
      .describe("The precise decimal latitude coordinate of the target area."),
    longitude: z
      .number()
      .describe("The precise decimal longitude coordinate of the target area."),
  }),
  execute: async ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=solar_radiation_sum,rain_sum&timezone=auto`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Weather API connection failure");

      const data = await response.json();
      const avgSolarRadiation = data.daily?.solar_radiation_sum
        ? (
            data.daily.solar_radiation_sum.reduce(
              (a: number, b: number) => a + b,
              0,
            ) /
            7 /
            3.6
          ).toFixed(2)
        : "0";

      const totalRainfall = data.daily?.rain_sum
        ? data.daily.rain_sum
            .reduce((a: number, b: number) => a + b, 0)
            .toFixed(1)
        : "0";

      return {
        success: true,
        metrics: {
          solarIrradiance: `${avgSolarRadiation} kWh/m²/day`,
          averageRainfall: `${totalRainfall} mm`,
          lat: latitude,
          lng: longitude,
        },
      };
    } catch {
      return {
        success: false,
        metrics: {
          solarIrradiance: "0 kWh/m²/day",
          averageRainfall: "0 mm",
          lat: latitude,
          lng: longitude,
        },
      };
    }
  },
};
