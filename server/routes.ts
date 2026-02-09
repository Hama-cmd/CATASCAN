import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Authentication
  await setupAuth(app);
  registerAuthRoutes(app);

  // Protected Routes
  app.post(api.screenings.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.screenings.create.input.parse(req.body);
      const userId = (req.user as any).claims.sub;

      // Analyze image with OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          {
            role: "system",
            content: `You are an expert ophthalmologist assistant. Analyze the provided eye image for any potential conditions, abnormalities, or signs of disease. 
            Return the result strictly as a JSON object with the following fields:
            - condition: string (Name of the potential condition or "Healthy" or "Unclear")
            - confidence: string (High, Medium, Low)
            - description: string (Brief explanation of findings)
            - recommendation: string (Advice on next steps, e.g., "Routine checkup", "See a specialist immediately")
            - disclaimer: string (Must state this is not a medical diagnosis)
            
            If the image is not an eye, set condition to "Invalid Image" and explanation accordingly.`
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this eye image." },
              {
                type: "image_url",
                image_url: {
                  url: input.image.startsWith('data:') ? input.image : `data:image/jpeg;base64,${input.image}`,
                },
              },
            ],
          },
        ],
        response_format: { type: "json_object" },
      });

      const analysisResult = JSON.parse(response.choices[0].message.content || "{}");

      // Save to database
      const screening = await storage.createScreening({
        userId,
        imageUrl: input.image.startsWith('data:') ? input.image : `data:image/jpeg;base64,${input.image}`, // In a real app, upload to S3/Blob storage
        analysis: analysisResult,
      });

      res.status(201).json(screening);
    } catch (err) {
      console.error("Screening error:", err);
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      } else {
        res.status(500).json({ message: "Failed to process screening" });
      }
    }
  });

  app.get(api.screenings.list.path, isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const screenings = await storage.getScreeningsByUser(userId);
      res.json(screenings);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch screenings" });
    }
  });

  app.get(api.screenings.get.path, isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const screening = await storage.getScreening(Number(req.params.id));
      
      if (!screening) {
        return res.status(404).json({ message: "Screening not found" });
      }

      // Security check: ensure user owns the screening
      if (screening.userId !== userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      res.json(screening);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch screening details" });
    }
  });

  return httpServer;
}
