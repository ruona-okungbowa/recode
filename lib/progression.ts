// Progress from each level logic
export const XP_PER_LEVEL = 100;

// Different Ranks
export const RANKS = {
  "F-Rank": { minLevel: 1, maxLevel: 10 },
  "E-Rank": { minLevel: 10, maxLevel: 20 },
  "D-Rank": { minLevel: 21, maxLevel: 30 },
  "C-Rank": { minLevel: 31, maxLevel: 40 },
  "B-Rank": { minLevel: 41, maxLevel: 50 },
  "A-Rank": { minLevel: 51, maxLevel: 60 },
  "S-Rank": { minLevel: 61, maxLevel: 70 },
  Monarch: { minLevel: 71, maxLevel: 999 },
};

// Calculate level from XP
export const calculateLevel = (currentXP: number): number => {
  return Math.floor(currentXP / XP_PER_LEVEL) + 1;
};

export const calculateRank = (level: number): string => {
  if (level <= 10) return "F-Rank";
  if (level <= 20) return "E-Rank";
  if (level <= 30) return "D-Rank";
  if (level <= 40) return "C-Rank";
  if (level <= 50) return "B-Rank";
  if (level <= 60) return "A-Rank";
  if (level <= 70) return "S-Rank";
  return "Monarch";
};

// Get XP needed for next level
export const getXPForNextLevel = (currentXP: number): number => {
  const currentLevel = calculateLevel(currentXP);
  return currentLevel * XP_PER_LEVEL;
};

// Get XP progress percentage for current level
export const getXPProgress = (currentXP: number): number => {
  const currentLevel = calculateLevel(currentXP);
  const xpInCurrentLevel = currentXP - (currentLevel - 1) * XP_PER_LEVEL;
  return (xpInCurrentLevel / XP_PER_LEVEL) * 100;
};

// Check if domain should be unlocked
export const isDomainUnlocked = (
  domainRank: string,
  userLevel: number
): boolean => {
  const rankLevels = {
    "F-Rank": 1,
    "E-Rank": 11,
    "D-Rank": 21,
    "C-Rank": 31,
    "B-Rank": 41,
    "A-Rank": 51,
  };
  return userLevel >= (rankLevels[domainRank] || 999);
};
