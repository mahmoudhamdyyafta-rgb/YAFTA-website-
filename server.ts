import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client with standard telemetry headers
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini SDK successfully initialized on server.");
  } else {
    console.warn("GEMINI_API_KEY is not defined in environment variables. Falling back to mock responses.");
  }
} catch (err) {
  console.error("Failed to initialize Gemini SDK:", err);
}

// Full-Stack API Route for Business Intelligence & Analysis
app.post("/api/gemini/analyze", async (req, res) => {
  const { action, data } = req.body;

  if (!action) {
    return res.status(400).json({ error: "Action is required" });
  }

  // Fallback mock responses if API key is not present (ensures full resilience)
  if (!ai) {
    let mockText = "";
    if (action === "sales") {
      mockText = "تحليل مبيعات يافطة المباشر:\n\n- تم رصد زيادة في معدل التعاقدات الجديدة بنسبة 18.5% مقارنة بالشهر السابق.\n- نوصي بتوسيع نطاق الإنتاج والتركيز على لوحات الحروف البارزة المضيئة.\n\nتوصيات:\n1. زيادة حملات الترويج الرقمي للكلادينج ولوحات ليد.\n2. تنسيق مواعيد تسليم المواد لتجنب حدوث أي اختناقات فنية في الورش.";
    } else if (action === "profits") {
      mockText = "تحليل الأرباح وصافي الهامش:\n\n- تم تحقيق صافي ربح بمعدل 38.9% على مشاريع لوحات الأكريليك والواجهات المعدنية.\n- الهامش الحالي في النطاق الصحي والمستهدف.\n\nتوصيات:\n1. تخفيض التكاليف التشغيلية للمشتريات عبر عقود التوريد المجمعة.\n2. تقديم أسعار تشجيعية للعملاء الدائمين لضمان ولاء العقود.";
    } else if (action === "inventory") {
      mockText = "تنبؤ المخزون وحركة المواد:\n\n- لوح الأكريليك ومحولات الليد 12 فولت تقترب من حد الأمان.\n- معدل السحب الأخير يشير إلى نفاذ هذه الخامات خلال 12 يوماً.\n\nتوصيات:\n1. إرسال طلب توريد عاجل للمورد المعتمد Al-Rowad Plastics.\n2. إعادة تقييم حد الأمان لقطع الغيار والمحولات لرفعه بنسبة 15%.";
    } else {
      mockText = "بناءً على تحليلات يافطة الذكية:\n\nيُنصح بتركيز الجهود التسويقية على قطاع الواجهات والكلادينج لارتفاع هوامش أرباحه بنسبة ١٢٪ مقارنة باللافتات البسيطة، والعمل على سداد رصيد الموردين البالغ ٤٥,٧٠٠ ج.م لضمان استمرارية خصم الحجم.";
    }
    return res.json({ response: mockText });
  }

  try {
    let prompt = "";
    let systemInstruction = "You are YAFTA Business Intelligence Advisor, a world-class SaaS enterprise copilot specializing in signage, digital printing, cladding facades, and manufacturing workshops. Generate highly analytical, structured, and professional insights. Provide responses in Arabic if possible, or bilingual (Arabic and English) to fit our luxurious branding.";

    if (action === "sales") {
      prompt = `Analyze this sales and lead pipeline data: ${JSON.stringify(data)}. Provide a breakdown of monthly performance, lead conversion efficiency, and forecast next month's sales velocity. Keep it highly detailed and formatted.`;
    } else if (action === "profits") {
      prompt = `Review this profit margin ledger: ${JSON.stringify(data)}. Identify areas of revenue leakage, evaluate net profit sustainability, and suggest pricing adjustments to optimize our 38.9% margin.`;
    } else if (action === "inventory") {
      prompt = `Forecast inventory consumption rates using this warehouse log: ${JSON.stringify(data)}. Highlight low-stock warning items (especially Acrylic, LED Modules, Transformers) and provide a smart procurement schedule.`;
    } else if (action === "pricing") {
      prompt = `Based on these calculator parameters (Width, Height, Materials, Cost, Install, Printing): ${JSON.stringify(data)}, recommend an optimal, highly competitive pricing model that guarantees at least a 35% net profit margin.`;
    } else if (action === "quotation") {
      prompt = `Draft a premium business quotation for: ${JSON.stringify(data)}. Include a beautiful, descriptive summary, material descriptions, and structured payment terms suited for enterprise procurement.`;
    } else if (action === "summary") {
      prompt = `Summarize this comprehensive financial report and active projects log: ${JSON.stringify(data)}. Synthesize a C-level executive summary highlighting top-line growth, outstanding balances, and risk factors.`;
    } else {
      prompt = `Provide business optimization advice for: ${JSON.stringify(data)}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ response: response.text });
  } catch (error: any) {
    console.error("Gemini API call failed:", error);
    res.status(500).json({ error: error.message || "Internal AI Server Error" });
  }
});

// Serve Frontend Vite bundle wrapped in async startServer
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`YAFTA Operating System fully booted on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
