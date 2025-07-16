import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export const ai = {
  async generate(options: { model: string; prompt: string; system?: string }) {
    const model = genAI.getGenerativeModel({ model: options.model });
    
    const fullPrompt = options.system 
      ? `${options.system}\n\n${options.prompt}`
      : options.prompt;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    
    return {
      text: response.text()
    };
  }
}; 