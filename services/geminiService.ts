import { GoogleGenAI } from "@google/genai";
import { GeneratedImage } from "../types";

// Hardcoded API Key as requested
const API_KEY = 'AIzaSyAbqxwCyQkv8FLU1JZ14IWNbO46GgVTMOk';

// Helper to convert File to Base64
const fileToPart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Step 1: Analyze the input (text/images) to create a structured summary for the image prompt.
 * We use Gemini 2.5 Flash for this as it's fast and good at extraction.
 */
export const analyzeContext = async (
  topic: string,
  subject: string,
  grade: string,
  text: string,
  files: File[]
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const imageParts = await Promise.all(files.map(fileToPart));
  
  const prompt = `
    Analyze the provided content (text and/or images). 
    I need to create an educational infographic for the topic: "${topic}" (Subject: ${subject}, Grade: ${grade}).
    
    Task: Extract the key concepts, facts, and visual ideas from the content provided. 
    Summarize them into 4-6 concise, visually descriptable bullet points. 
    Focus on what should be visualized (diagrams, icons, short text labels).
    
    If there is very little content provided, generate relevant educational content for this specific grade and topic yourself.
    
    Output Format: Plain text, bullet points only.
  `;

  const contents = [
    { text: prompt },
    ...(text ? [{ text: `Context Text: ${text}` }] : []),
    ...imageParts
  ];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: contents as any }, // Cast to avoid strict typing issues with mixed parts
  });

  return response.text || "Create a general educational infographic about this topic.";
};

/**
 * Step 2: Generate the images using Gemini 3 Pro Image Preview.
 */
export const generateInfographics = async (
  topic: string,
  subject: string,
  grade: string,
  summary: string
): Promise<GeneratedImage[]> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const modelName = 'gemini-3-pro-image-preview';
  
  const title = `${topic}, ${subject} ${grade}`;
  const basePrompt = `
    Create a high-quality, professional educational infographic.
    
    HEADLINE/TITLE MUST BE EXACTLY: "${title}"
    
    Content to visualize based on this summary:
    ${summary}
    
    Design requirements:
    - Clear, legible text hierarchy.
    - Educational style suitable for ${grade} students.
    - Use icons, diagrams, and illustrations to explain concepts.
  `;

  // We will run these in parallel
  const tasks = [
    // 1. Horizontal 16:9
    (async () => {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [{ text: basePrompt + "\n\nFormat: Landscape aspect ratio (16:9). Modern, colorful, engaging layout." }]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
            imageSize: "2K" // High quality
          }
        }
      });
      return processImageResponse(response, 'horizontal', 'Horizontal Color');
    })(),

    // 2. Vertical A4 (Using 3:4 as proxy for A4)
    (async () => {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [{ text: basePrompt + "\n\nFormat: Portrait aspect ratio (3:4). Clean vertical poster layout. Rich colors." }]
        },
        config: {
          imageConfig: {
            aspectRatio: "3:4",
            imageSize: "2K"
          }
        }
      });
      return processImageResponse(response, 'vertical', 'Vertical Color (A4)');
    })(),

    // 3. Vertical A4 Black & White / Line Art
    (async () => {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [{ text: basePrompt + "\n\nFormat: Portrait aspect ratio (3:4). STYLE: Black and white line art, coloring book style, vector outlines, white background, no shading, high contrast. Ready for printing and coloring." }]
        },
        config: {
          imageConfig: {
            aspectRatio: "3:4",
            imageSize: "2K"
          }
        }
      });
      return processImageResponse(response, 'lineart', 'Vertical Line Art (B&W)');
    })()
  ];

  const results = await Promise.all(tasks);
  // Filter out any potential nulls if generation failed (though we throw errors usually)
  return results.filter(Boolean) as GeneratedImage[];
};

const processImageResponse = (response: any, type: GeneratedImage['type'], description: string): GeneratedImage | null => {
  // Iterate through parts to find the image
  const candidates = response.candidates;
  if (!candidates || candidates.length === 0) return null;

  const parts = candidates[0].content.parts;
  for (const part of parts) {
    if (part.inlineData) {
      const base64 = part.inlineData.data;
      const mimeType = part.inlineData.mimeType || 'image/png';
      return {
        id: crypto.randomUUID(),
        url: `data:${mimeType};base64,${base64}`,
        type,
        description
      };
    }
  }
  return null;
};
