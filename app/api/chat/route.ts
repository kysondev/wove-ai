import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.POE_API_KEY,
  baseURL: "https://api.poe.com/v1",
});

export async function POST(req: NextRequest) {
  try {
    const { message, image, conversationHistory } = await req.json();

    if (!message && !image) {
      return NextResponse.json(
        { error: "Message or image is required" },
        { status: 400 }
      );
    }

    let messages: any[] = [];
    
    if (conversationHistory && conversationHistory.length > 0) {
      messages = conversationHistory.map((msg: any) => {
        if (msg.image) {
          return {
            role: msg.role,
            content: [
              { type: "text", text: msg.content || "" },
              { type: "image_url", image_url: { url: msg.image } }
            ]
          };
        }
        return {
          role: msg.role,
          content: msg.content || ""
        };
      });
    }

    if (image) {
      const currentMessage = {
        role: "user" as const,
        content: [
          { type: "text", text: message || "Please analyze this image and provide fashion advice." },
          { type: "image_url", image_url: { url: image } }
        ]
      };
      messages.push(currentMessage);
    } else {
      messages.push({ role: "user", content: message });
    }

    const stream = await openai.chat.completions.create({
      model: "Wove-5",
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
