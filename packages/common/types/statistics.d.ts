export interface StatisticsData {
    pvpKills: number;
    pvpDeaths: number;
    mobKills: { [key: string]: number };
    mobExamines: string[];
    resources: { [key: string]: number };
    drops: { [key: string]: number };

    creationTime: number;
    totalTimePlayed: number;
    averageTimePlayed: number;
    lastLogin: number;
    loginCount: number;

    cheater: boolean;

    // MMORPG systems
    karma: number; // Positive = good (mob grinder), Negative = bad (PKer)
    title: string; // Currently equipped title
    unlockedTitles: string[]; // All unlocked titles
    killStreak: number; // Current consecutive mob kills without dying
    bestKillStreak: number; // Best ever kill streak
    loginStreak: number; // Consecutive daily logins
    lastLoginDate: string; // YYYY-MM-DD format for daily login tracking
    totalGoldEarned: number; // Lifetime gold earned
}
