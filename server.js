import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import OpenAI from "openai";

const app = express();
const upload = multer({ dest: "tmp/" });
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());

app.post("/verify", upload.single("image"), async (req, res) => {
  const image = fs.readFileSync(req.file.path);

  try {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [{
        role: "user",
        content: [
          {
            type: "input_text",
            text: `
Analyse cette image.
Réponds STRICTEMENT en JSON :
{
  "is_funko_box": true/false,
  "license": "demon_slayer" | "other" | "unknown",
  "detected_number": number | null,
  "confidence": 0.0 à 1.0
}`
          },
          {
            type: "input_image",
            image_base64: image.toString("base64")
          }
        ]
      }]
    });

    const result = JSON.parse(response.output_text);
    res.json(result);

  } catch (err) {
    res.status(500).json({ error: "AI error" });
  } finally {
    fs.unlinkSync(req.file.path);
  }
});

app.listen(3000, () => {
  console.log("IA server running on http://localhost:3000");
});

