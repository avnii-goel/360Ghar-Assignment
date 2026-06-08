const TEXT_MODELS = [
  "nvidia/nemotron-nano-12b-v2-vl:free",
  "openrouter/free",
];

async function callOpenRouter(messages) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("Missing VITE_OPENROUTER_API_KEY in .env");

  for (const model of TEXT_MODELS) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://360ghar.vercel.app",
          "X-Title": "360 Ghar"
        },
        body: JSON.stringify({ model, max_tokens: 300, messages })
      });

      const rawText = await response.text();

      if (!response.ok) {
        console.warn(`Model ${model} failed (${response.status}), trying next...`);
        continue;
      }

      const data = JSON.parse(rawText);
      const content = data?.choices?.[0]?.message?.content;

      // If model returned null content (image model picked by router), skip it
      if (!content || typeof content !== "string") {
        console.warn(`Model ${model} returned non-text content, trying next...`);
        continue;
      }

      console.log(`✅ Used model: ${model}`);
      return content.trim();

    } catch (err) {
      console.warn(`Error with model ${model}:`, err.message);
      continue;
    }
  }

  throw new Error("All models failed or returned non-text responses.");
}

export async function parseSearchQuery(naturalQuery) {
  try {
    const result = await callOpenRouter([
      {
        role: "system",
        content: `You are a real estate search parser for an Indian property platform (Gurgaon/NCR).
Extract structured filters from the user's natural language query.
Return ONLY valid JSON — no explanation, no markdown, no code fences.

JSON shape:
{
  "bhk": number | null,
  "minPrice": number | null,
  "maxPrice": number | null,
  "sectors": string[],
  "amenities": string[],
  "preferences": string[],
  "minArea": number | null,
  "facing": string | null,
  "summary": string
}

Rules:
- Prices in lakhs (e.g. "80 lakhs" = 80, "1 crore" = 100)
- amenities: map to these tags only: ["gym", "school_nearby", "metro", "sunlight", "park", "pool", "security"]
- summary: 1 sentence rephrasing the query in second person
- Unmentioned fields = null or []`
      },
      { role: "user", content: naturalQuery }
    ]);

    // Extract only the JSON object — ignore any text the model prepends or appends
    const jsonStart = result.indexOf("{");
    const jsonEnd = result.lastIndexOf("}");
    
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error("No JSON object found in response:", result);
      return null;
    }
    
    const jsonString = result.slice(jsonStart, jsonEnd + 1);
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("parseSearchQuery failed:", err);
    return null;
  }
}

export async function generatePropertySummary(property, userQuery) {
  try {
    const propertyDescription = `
      ${property.bhk}BHK, ${property.area} sq ft
      Location: ${property.sector}, ${property.locality}
      Price: ${property.priceLabel}
      Facing: ${property.facing}, Floor ${property.floor}/${property.totalFloors}
      Amenities: ${property.amenities.join(", ")}
      Match reasons: ${property.matchReasons.join(", ")}
    `.trim();

    return await callOpenRouter([
      {
        role: "system",
        content: `You are a concierge AI for 360 Ghar, a premium Indian real estate platform.
Write exactly 2–3 sentences explaining why this property matches the user's search.
Be warm, specific, and personal. Mention concrete details that address the user's query.
Do NOT start with "This property". No generic filler. Return only the sentences.`
      },
      {
        role: "user",
        content: `User searched: "${userQuery}"\n\nProperty:\n${propertyDescription}`
      }
    ]);
  } catch (err) {
    console.error("generatePropertySummary failed:", err);
    return "Could not generate summary — please try again.";
  }
}
