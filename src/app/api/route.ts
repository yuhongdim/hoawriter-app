import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.HOA_API_KEY;

// --- 最终更新：对接 xinghuapi.com ---
const BASE_URL = "https://xinghuapi.com/v1"; 

export async function POST(request: NextRequest) {
  if (!API_KEY) {
    console.error("Server Error: HOA_API_KEY is not set in environment variables.");
    return NextResponse.json(
      { error: "Server configuration error: Missing API Key." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const {
      violationType,
      communityName,
      homeownerAddress,
      dateOfViolation,
      specificDetails,
    } = body;

    if (!violationType || !communityName || !homeownerAddress || !dateOfViolation) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = `You are a professional HOA legal assistant specializing in drafting violation notices. Generate a formal, professional, and neighbor-friendly violation letter based on the following information:

**Violation Type:** ${violationType}
**Community Name:** ${communityName}
**Homeowner's Address:** ${homeownerAddress}
**Date of Violation:** ${dateOfViolation}
**Additional Details:** ${specificDetails || "None provided"}

**Requirements:**
1. Use a professional but polite and respectful tone
2. Follow standard business letter format with proper date, address, salutation, body, and closing
3. Clearly state the violation and reference relevant HOA rules or covenants (you may use general references)
4. Provide a reasonable timeline for correction (e.g., 14-30 days)
5. Include information about potential consequences if not resolved, but frame it constructively
6. Add a disclaimer stating this is a courtesy notice and encourage open communication
7. End with contact information placeholder for the HOA board/management
8. Keep the tone neighborly and solution-focused rather than punitive

Generate the complete letter now:`;

    const aiResponse = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json();
      console.error("AI API Error:", errorData);
      return NextResponse.json(
        { error: `AI API Error: ${errorData.error?.message || "Unknown error"}` },
        { status: aiResponse.status }
      );
    }

    const aiData = await aiResponse.json();
    const generatedLetter = aiData.choices?.[0]?.message?.content;

    if (!generatedLetter) {
      console.error("Could not find generated letter in AI response:", aiData);
      return NextResponse.json(
        { error: "Failed to parse letter content from AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      letter: generatedLetter.trim(),
    });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}