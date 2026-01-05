
// Local mock data for design feedback (no external APIs)
const designFeedbacks = [
  "This design evokes a serene atmosphere, blending lilac hues with masterfully balanced compositions.",
  "Beautifully executed work with a strong sense of color harmony and visual flow.",
  "The delicate lavender tones create a dreamy, ethereal quality that captivates the viewer.",
  "A stunning demonstration of how purple gradients can transform ordinary designs into extraordinary experiences.",
  "The subtle interplay between light and shadow in this lilac palette is simply breathtaking.",
  "This piece showcases exceptional mastery of color theory with its soft violet transitions.",
  "The dreamy aesthetic is enhanced by thoughtful composition and harmonious lilac undertones.",
  "A perfect balance of modern minimalism and soft lavender elegance."
];

const dailyInspirations = [
  "Let the softness of lavender clouds guide your next gradient transition.",
  "Explore the delicate balance between deep violet shadows and ethereal lilac highlights.",
  "Today's inspiration: Create something that feels like a gentle lilac breeze.",
  "Transform your canvas with the subtle warmth of purple dawn.",
  "Design with the tranquility of lavender fields at twilight.",
  "Let your creativity bloom like rare violet flowers in spring.",
  "Embrace the mystical allure of deep purple and soft lilac combinations.",
  "Find harmony in the gentle gradients between twilight violet and morning lavender."
];

export const getDesignFeedback = async (title: string, tags: string[]): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const randomIndex = Math.floor(Math.random() * designFeedbacks.length);
  return designFeedbacks[randomIndex];
};

export const getDailyInspiration = async (): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const randomIndex = Math.floor(Math.random() * dailyInspirations.length);
  return dailyInspirations[randomIndex];
};
