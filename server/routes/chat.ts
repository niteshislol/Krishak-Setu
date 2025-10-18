import { RequestHandler } from "express";
import type { ChatRequestBody, ChatResponse, ChatMessage } from "@shared/api";

function lastUserMessage(messages: ChatMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i].content || "";
  }
  return "";
}

function isHindi(str: string) {
  return /[\u0900-\u097F]/.test(str);
}
function isHinglish(str: string) {
  if (isHindi(str)) return false;
  return /(kya|kyu|kyon|hai|nahi|kaise|kr|krna|aap|mera|tum|mitti|kheti|fasal|beej|zamin)/i.test(str);
}

function generateLocalReply(input: string): string {
  const raw = input || "";
  const q = raw.toLowerCase();
  if (!q.trim()) return "I didn't catch any question. Please ask your doubt again.";

  const inHindi = isHindi(raw) || isHinglish(raw);

  if (inHindi) {
    if (/(hello|hi|namaste|hey|namaskar)/.test(q)) {
      return isHindi(raw)
        ? "नमस्ते! मैं आपका कृषि सहायक हूँ। मिट्टी विश्लेषण, फसल सुझाव या ऐप से जुड़े सवाल पूछें।"
        : "Namaste! Main aapka krishi sahayak hoon. Mitti vishleshan, fasal sujhav ya app se jude sawaal poochiye.";
    }
    if (/(soil|mitti|report|upload)/.test(q)) {
      return isHindi(raw)
        ? "मिट्टी रिपोर्ट अपलोड करने के लिए Analyze सेक्शन में जाएँ और Upload पर क्लिक करें।"
        : "Mitti report upload karne ke liye Analyze section me jaiye aur Upload par click kijiye.";
    }
    if (/(ph|nitrogen|phosphorus|potassium|npk)/.test(q)) {
      return isHindi(raw)
        ? "pH अम्लीय/क्षारीयता बताता है। NPK संतुलन ज़रूरी है; कमी होने पर उप��ुक्त उर्वरक दें।"
        : "pH amliya/ksariya batata hai. NPK santulan zaroori hai; kami hone par uchit urvarak dein.";
    }
    if (/(which crop|konsi fasal|best crop|recommend)/.test(q)) {
      return isHindi(raw)
        ? "आपकी मिट्टी के आधार पर गेहूँ, मक्का, टमाटर या सोयाबीन उपयुक्त हो सकते हैं।"
        : "Aapki mitti ke aadhar par gehun, makka, tamatar ya soyabean upyukt ho sakte hain.";
    }
    if (/(how|kaise|help|guide|use)/.test(q)) {
      return isHindi(raw)
        ? "कदम: 1) वेबसाइट खोलें 2) Analyze में Upload करें 3) रिपोर्ट चुनें 4) सुझाव देखें"
        : "Kadamein: 1) Website kholen 2) Analyze me Upload karein 3) Report chunen 4) Sujhav dekhein";
    }
    return isHindi(raw)
      ? "धन्यवाद! व्यक्तिगत सुझाव के लिए अपनी रिपोर्ट अपलोड करें।"
      : "Dhanyavaad! Vyaktigat sujhav ke liye apni report upload karein.";
  }

  if (/(hello|hi|namaste|hey)/.test(q)) {
    return "Hello! I'm your Krishak Setu assistant. Ask me anything about soil analysis, crop recommendations, or how to use the app.";
  }
  if (/(soil|report|upload)/.test(q)) {
    return "You can upload your soil report in the Analyze section. Click the Upload button on the home page, then drop your file. I'll estimate metrics and give crop and fertilizer suggestions.";
  }
  if (/(ph|nitrogen|phosphorus|potassium|npk)/.test(q)) {
    return "pH indicates acidity/alkalinity. Balanced NPK is important: low N → consider urea; low P → DAP; low K → MOP. Our analyzer will compute precise needs from your report.";
  }
  if (/(which crop|what crop|best crop|recommendations?)/.test(q)) {
    return "Based on your soil metrics, suitable crops may include wheat, maize, tomato, or soybean. Upload a report to get a personalized list and fertilizer plan.";
  }
  if (/(how|help|guide|use)/.test(q)) {
    return "Guide: 1) Open the website 2) Click Upload in the Analyze section 3) Select your soil report 4) Review insights and recommendations 5) Download or share.";
  }
  return "Thanks! I've noted your question. For a tailored answer, upload your soil report in the Analyze section. Meanwhile, you can ask about pH, NPK, crops, or how to use the app.";
}

async function callGemini(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || "";
  const model = "gemini-pro";
  if (!apiKey) return "Gemini API not configured. Please add GEMINI_API_KEY.";

  const systemPrompt =
    "You are Krishak Setu, an agriculture assistant. Always reply in the SAME language as the last user message. If the message is in Hindi (Devanagari), reply in Hindi. If it is Hindi written in Latin letters (Hinglish), reply in Hindi but keep Latin script. Keep answers concise and helpful.";

  const conversationHistory = messages
    .map((m) => `${m.role === "assistant" ? "Assistant" : "User"}: ${m.content}`)
    .join("\n");

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${systemPrompt}\n\nConversation:\n${conversationHistory}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  };

  console.log("Calling Gemini API with model:", model);
  console.log("API Key present:", !!apiKey);

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  console.log("Gemini response status:", resp.status);

  if (!resp.ok) {
    const txt = await resp.text().catch(() => "");
    console.error("Gemini error response:", txt);
    throw new Error(`Gemini error ${resp.status}: ${txt}`);
  }

  const data: any = await resp.json();
  console.log("Gemini response data:", JSON.stringify(data, null, 2));

  const out = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return out || "I couldn't produce a response right now.";
}

export const handleChat: RequestHandler = async (req, res) => {
  try {
    const body = (req.body || {}) as ChatRequestBody;
    const msgs = body.messages || [];

    // If Gemini is configured, use it; else local reply
    const hasGemini = !!process.env.GEMINI_API_KEY;
    const reply = hasGemini ? await callGemini(msgs) : generateLocalReply(lastUserMessage(msgs));

    const response: ChatResponse = { reply };
    res.status(200).json(response);
  } catch (e) {
    console.error("Chat error:", e);
    const errorMsg = e instanceof Error ? e.message : String(e);
    res.status(200).json({ reply: `Error: ${errorMsg}` });
  }
};
