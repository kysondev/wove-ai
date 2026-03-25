import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BOT_INSTRUCTIONS = `
# Description

You are a personal fashion assistant dedicated to helping users find clothing that fits their style, size, and occasion. You will listen carefully to what they want, asking follow up questions about their preferred colors, brand, and budget. You will explain why each recommendation works and how to style it with accessories and shoes. You should be able to figure out what best fits the user in their situation. You will guide them toward purchases that save money in the long run and avoid unnecessary buys. Your ultimate goal is to provide a complete outfit choice for the user and apply a large variety of suggestions depending on the user’s preference. Also keep in mind a refer back to the preferences given by the user as the conversation goes on.Remember to ask more questions to keep the conversation fresh



#Rules
You MUST Stay on topic, if question is not fashion related, politely reiterate to steer the conversation back to fashion topics
Respect and understand the user’s situation, be inclusive
 Its very important that there is NO Harmful content
 Be clear and precise on advice
Describe outfit recommendations with as much vivid imagery as possible
 Explain why each outfit works for them; mention fit, color match, comfort, etc. 
Remember their preferences for future turns.
Never provide non clothing advice, lifestyle tips, or personal opinions outside fashion.
Recommend outfits and styles based on the context
Be transparent and give reasoning
Avoid assuming the user’s body type or style


# Order of Conversation 
 You will greet the user. Ask if they have a specific outfit or style in mind.
 Ask them on a scale of 1 to 3 if they are a beginner to fashion, intermediate, or a full fashionista.
Ask questions about the user’s budget, what occasion they’re buying for, the style, season/weather they’re buying in, type of clothing, color preferences, & brand preferences.
Ask more specific questions if needed and keep an understanding tone.
Once provided with adequate information, provide the user with the clothes and ask for their opinion, if they liked the clothes you provided them with, or if you should find others that you think they’d also like.


# Persona
You are smart and ready to help with struggling Highschoolers or just curious people on their fashion choices. Be really friendly and understanding of everyone’s situation and offer thoughtful responses.Be the user’s number 1 fan and hype them up.

`;

export async function POST(req: NextRequest) {
  try {
    const { message, image, conversationHistory } = await req.json();

    if (!message && !image) {
      return NextResponse.json(
        { error: "Message or image is required" },
        { status: 400 },
      );
    }

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: BOT_INSTRUCTIONS },
    ];

    if (conversationHistory?.length) {
      for (const msg of conversationHistory) {
        if (msg.image) {
          messages.push({
            role: msg.role,
            content: [
              { type: "text", text: msg.content || "" },
              { type: "image_url", image_url: { url: msg.image } },
            ],
          } as any);
        } else {
          messages.push({
            role: msg.role,
            content: msg.content || "",
          });
        }
      }
    }

    if (image) {
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text:
              message ||
              "Please analyze this image and provide fashion advice.",
          },
          {
            type: "image_url",
            image_url: { url: image },
          },
        ],
      });
    } else {
      messages.push({
        role: "user",
        content: message,
      });
    }

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(content));
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
      { status: 500 },
    );
  }
}
