/**
 * AI Agent Service for Gabarink
 * This service handles all question processing: cleaning, summarizing, 
 * and extracting images using pure string logic (NO REGEX).
 */

// PRE-PROCESSED PREMIUM QUESTIONS (Option 3)
const PREMIUM_QUESTIONS = [
  {
    id: "p1",
    imageUrl: "https://enem.dev/2022/questions/9/b1a38f51-88f6-4686-9189-734021ee6771.png",
    statement: "Campanha de conscientização sobre segurança no trânsito.\n\nCom base na imagem, a campanha busca alertar o condutor sobre:",
  }
];

export const aiService = {
  /**
   * Intelligently processes a question's raw data using zero Regex.
   */
  processQuestion: async (context: string, introduction: string, isHard: boolean = false) => {
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 400));

    // 1. Check for known image patterns (Simulated AI recognition)
    if (context.includes('b1a38f51-88f6-4686-9189-734021ee6771')) {
      return PREMIUM_QUESTIONS[0];
    }

    // 2. Pure String Image Extraction
    let imageUrl: string | undefined;
    if (context.includes('![')) {
      const parts = context.split('(');
      if (parts.length > 1) {
        const urlPart = parts[1];
        imageUrl = urlPart.split(')')[0];
      }
    }

    // 3. AGGRESSIVE CLEANING (AI Agent Prompt Logic)
    // We strictly filter lines to remove ANYTHING that isn't the core challenge text
    const lines = context.split('\n');
    const cleanedLines = lines.filter(line => {
      const l = line.trim().toLowerCase();
      if (!l) return false;
      
      // Blacklist of unnecessary data patterns
      if (l.includes('disponível')) return false;
      if (l.includes('acesso')) return false;
      if (l.includes('adaptado')) return false;
      if (l.includes('fonte:')) return false;
      if (l.includes('.com')) return false;
      if (l.includes('.gov')) return false;
      if (l.includes('.org')) return false;
      if (l.includes('![')) return false;
      if (l.includes('www.')) return false;
      if (l.startsWith('*') && l.endsWith('*')) return false; // Citations in italics
      if (l.startsWith('http')) return false;
      
      return true;
    });

    let cleanedText = cleanedLines.join('\n').trim();

    // 4. Summarization / Reformulation
    // If it's a "wall of text", we take only the core sentence
    if (cleanedText.length > 300 && !isHard) {
      const sentences = cleanedText.split('. ');
      if (sentences.length > 1) {
        // AI Agent Decision: Use first sentence as premise and last as core argument
        cleanedText = `${sentences[0]}. ${sentences[sentences.length - 1]}`;
      }
    }

    // 5. Final Assembly (Unified Statement)
    const finalStatement = `${cleanedText}\n\n${introduction || ''}`.trim();

    return {
      imageUrl,
      statement: finalStatement
    };
  }
};
