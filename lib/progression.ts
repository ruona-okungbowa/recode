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

const XP_REWARDS = {
  easy: 50,
  medium: 100,
  hard: 150,
};

// Bonus multipliers
const MULTIPLIERS = {
  firstAttempt: 1.5,
  perfectScore: 1.25,
  noHints: 1.2,
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

export const calculateXPForNextLevel = (currentXP: number): number => {
  const currentLevel = calculateLevel(currentXP);
  const nextLevelXP = currentLevel * XP_PER_LEVEL;
  return nextLevelXP - currentXP;
};

/**
 * Calculate XP progress percentage for current level
 */
export const calculateLevelProgress = (currentXP: number): number => {
  const currentLevel = calculateLevel(currentXP);
  const levelStartXP = (currentLevel - 1) * XP_PER_LEVEL;
  const xpInCurrentLevel = currentXP - levelStartXP;
  return (xpInCurrentLevel / XP_PER_LEVEL) * 100;
};

/**
 * Check if user leveled up after gaining XP
 */
export const checkLevelUp = (
  oldXP: number,
  newXP: number
): { leveledUp: boolean; oldLevel: number; newLevel: number } => {
  const oldLevel = calculateLevel(oldXP);
  const newLevel = calculateLevel(newXP);

  return {
    leveledUp: newLevel > oldLevel,
    oldLevel,
    newLevel,
  };
};

export const checkRankUp = (
  oldLevel: number,
  newLevel: number
): { rankedUp: boolean; oldRank: string; newRank: string } => {
  const oldRank = calculateRank(oldLevel);
  const newRank = calculateRank(newLevel);

  return {
    rankedUp: oldRank !== newRank,
    oldRank,
    newRank,
  };
};

export const getNextRankInfo = (
  currentLevel: number
): { nextRank: string; levelRequired: number; levelsToGo: number } => {
  const currentRank = calculateRank(currentLevel);

  const rankThresholds: Record<string, number> = {
    "F-Rank": 1,
    "E-Rank": 11,
    "D-Rank": 21,
    "C-Rank": 31,
    "B-Rank": 41,
    "A-Rank": 51,
    "S-Rank": 61,
    Monarch: 71,
  };

  const ranks = Object.keys(rankThresholds);
  const currentRankIndex = ranks.indexOf(currentRank);

  if (currentRankIndex === ranks.length - 1) {
    // Already at max rank
    return {
      nextRank: "Monarch",
      levelRequired: 71,
      levelsToGo: 0,
    };
  }
  const nextRank = ranks[currentRankIndex + 1];
  const levelRequired = rankThresholds[nextRank];

  return {
    nextRank,
    levelRequired,
    levelsToGo: levelRequired - currentLevel,
  };
};

// Check if domain should be unlocked
export const isDomainUnlocked = (
  domainRank: string,
  userLevel: number
): boolean => {
  const rankLevels: Record<string, number> = {
    "F-Rank": 1,
    "E-Rank": 11,
    "D-Rank": 21,
    "C-Rank": 31,
    "B-Rank": 41,
    "A-Rank": 51,
  };
  return userLevel >= (rankLevels[domainRank] || 999);
};

export const getRankColor = (rank: string): string => {
  const colors: Record<string, string> = {
    "F-Rank": "#9CA3AF", // gray
    "E-Rank": "#10B981", // green
    "D-Rank": "#3B82F6", // blue
    "C-Rank": "#8B5CF6", // purple
    "B-Rank": "#F59E0B", // amber
    "A-Rank": "#EF4444", // red
    "S-Rank": "#F59E0B", // gold
    Monarch: "#FFD700", // gold
  };

  return colors[rank] || colors["F-Rank"];
};
