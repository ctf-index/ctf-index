import { getJson } from "serpapi";

// Walkthrough Search
export async function POST(req: Request) {
  try {
    const { topic, totalWanted } = await req.json();

    if (!topic) {
      return Response.json(
        { success: false, error: "Missing 'topic' in request body" },
        { status: 400 },
      );
    }

    const resultCount = Math.min(Math.max(totalWanted ?? 10, 1), 30); // max results 30
    const allResults: any[] = [];
    const pageSize = 10;
    const pagesNeeded = Math.ceil(resultCount / pageSize);
    console.log("start:");

    for (let page = 0; page < pagesNeeded; page++) {
      console.log("entered");
      const response = await getJson({
        engine: "google",
        api_key: process.env.SERP_API_KEY,
        q: topic,
        start: page * pageSize,
      });

      const pageResults = response.organic_results ?? [];
      allResults.push(...pageResults);

      if (pageResults.length < pageSize) break; // no more results available
    }

    const results = allResults.slice(0, resultCount).map((item: any) => ({
      title: item.title,
      description: item.snippet ?? "",
      link: item.link,
      source: "web",
    }));

    return Response.json(
      {
        success: true,
        message: "Web search result fetched successfully",
        Length: allResults.length,
        Results: results,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("SerpApi search failed:", error);

    return Response.json(
      {
        success: false,
        error: "Web search failed",
        details: error.message ?? "Unknown error",
      },
      { status: 500 },
    );
  }
}
