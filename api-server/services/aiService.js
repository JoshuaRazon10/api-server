export async function getAIResponse(text) {
  try {
    // In a real app, you'd call OpenAI or Gemini here
    return "Remember to pause, breathe, and take things one step at a time.";
  } catch (error) {
    return "AI service unavailable. Please take care of yourself.";
  }
}