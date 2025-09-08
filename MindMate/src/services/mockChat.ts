// Mock chat service for MindMate
// Replace this with real API integration in the future

export async function sendMockMessage(userMessage: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses = [
        "I'm here for you. Tell me more about what you're experiencing.",
        "That sounds really tough. How are you coping with these feelings?",
        "I understand this is difficult. Would you like to try some calming exercises?",
        "It's completely okay to feel this way. You're not alone in this.",
        "Thank you for sharing that with me. How can I best support you right now?",
        "Your feelings are valid. Have you tried any relaxation techniques?",
        "I'm glad you reached out. What would help you feel more supported?",
        "It takes courage to share these feelings. I'm here to listen.",
        "You're taking an important step by talking about this. How can I help?",
        "I hear you. Sometimes just expressing these thoughts can be helpful."
      ];
      resolve(responses[Math.floor(Math.random() * responses.length)]);
    }, 800);
  });
}

export function checkForCrisisKeywords(message: string): boolean {
  const crisisKeywords = [
    'suicide', 'kill myself', 'end my life', 'self-harm', 'hurt myself',
    'hopeless', 'worthless', 'give up', "can't go on", 'want to die',
    'suicidal', 'self harm', 'ending it', 'not worth living'
  ];
  
  const lowerMessage = message.toLowerCase();
  return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
}
