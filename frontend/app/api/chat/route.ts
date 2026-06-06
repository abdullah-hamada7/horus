import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { question } = await request.json();
    
    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const apiEndpoint = process.env.RAG_API_URL;
    if (!apiEndpoint) {
      return NextResponse.json({ error: "RAG_API_URL environment variable is not configured" }, { status: 500 });
    }

    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: question }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `RAG API error: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to call RAG API" }, { status: 500 });
  }
}
