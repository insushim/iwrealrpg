import { Modules } from '@kaetram/common/network';

import type Player from './player';
import type { StatisticsData } from '@kaetram/common/types/statistics';

export default class Statistics {
    private milestones = [10, 50, 100, 500, 1000, 5000, 10_000];

    public pvpKills = 0;
    public pvpDeaths = 0;
    public mobKills: { [key: string]: number } = {};
    public mobExamines: string[] = [];
    public resources: { [key: string]: number } = {};
    public drops: { [key: string]: number } = {};

    public creationTime = this.getTime(); // Time of game's creation.
    public totalTimePlayed = 0; // Total time played in milliseconds.
    public averageTimePlayed = 0;
    public lastLogin = this.getTime();
    public loginCount = 1;

    // MMORPG systems
    public karma = 0; // Positive = grinder, Negative = PKer
    public title = ''; // Currently equipped title
    public unlockedTitles: string[] = [];
    public killStreak = 0; // Current consecutive mob kills without dying
    public bestKillStreak = 0;
    public loginStreak = 0; // Consecutive daily logins
    public lastLoginDate = ''; // YYYY-MM-DD
    public totalGoldEarned = 0;

    // Class variables for calculating login time, etc.
    public loginTime = this.getTime(); // Time when player logged in.

    public constructor(private player: Player) {}

    /**
     * Loads the statistics data from the database.
     * @param data Contains the statistics data.
     */

    public load(data: StatisticsData): void {
        this.pvpKills = data.pvpKills || this.pvpKills;
        this.pvpDeaths = data.pvpDeaths || this.pvpDeaths;
        this.mobKills = data.mobKills || this.mobKills;
        this.mobExamines = data.mobExamines || this.mobExamines;
        this.resources = data.resources || this.resources;
        this.drops = data.drops || this.drops;

        this.creationTime = data.creationTime || this.creationTime;
        this.totalTimePlayed = data.totalTimePlayed || this.totalTimePlayed;
        this.averageTimePlayed = data.averageTimePlayed || this.averageTimePlayed;
        this.lastLogin = data.lastLogin || this.lastLogin;
        this.loginCount = data.loginCount + 1 || this.loginCount;

        // MMORPG systems
        this.karma = data.karma || this.karma;
        this.title = data.title || this.title;
        this.unlockedTitles = data.unlockedTitles || this.unlockedTitles;
        this.killStreak = data.killStreak || this.killStreak;
        this.bestKillStreak = data.bestKillStreak || this.bestKillStreak;
        this.loginStreak = data.loginStreak || this.loginStreak;
        this.lastLoginDate = data.lastLoginDate || this.lastLoginDate;
        this.totalGoldEarned = data.totalGoldEarned || this.totalGoldEarned;
    }

    /**
     * Handles a player harvesting a resource from a skill. When a player successfully
     * cuts a tree, mines a rock, or fishes, this function is called to handle the
     * statistics for that skill. When we reach one of the milestones, we finish the
     * achievement for that milestone.
     * @param skill The skill that the player is harvesting from.
     */

    public handleSkill(skill: Modules.Skills): void {
        // Skip foraging since we don't have any achievements for it.
        if (skill === Modules.Skills.Foraging) return;

        // Get the skill name and the intervals for the milestones.
        let skillName = Modules.Skills[skill].toLowerCase();

        if (!(skillName in this.resources)) this.resources[skillName] = 0;

        // Increment the skill's resource count.
        this.resources[skillName]++;

        // Check if we have reached a milestone and award an achievement if we have.
        if (this.milestones.includes(this.resources[skillName]))
            this.player.achievements.get(`${skillName}${this.resources[skillName]}`)?.finish();
    }

    /**
     * Appends a mob kill onto the statistics. A mob is killed by a player
     * when they deal the primary amount of damage on the damage table.
     * Also updates karma (positive) and kill streak.
     * @param key The key of the mob that was killed.
     */

    public addMobKill(key: string): void {
        if (!(key in this.mobKills)) this.mobKills[key] = 0;

        this.mobKills[key]++;

        // Increase karma for mob kills (capped at 10000)
        this.karma = Math.min(10_000, this.karma + 1);

        // Update kill streak
        this.killStreak++;

        if (this.killStreak > this.bestKillStreak) this.bestKillStreak = this.killStreak;
    }

    /**
     * Called when the player kills another player (PK).
     * Heavily penalizes karma.
     */

    public addPvpKarma(): void {
        this.karma = Math.max(-10_000, this.karma - 50);
    }

    /**
     * Called when the player dies. Resets kill streak.
     */

    public handleDeath(): void {
        this.killStreak = 0;
    }

    /**
     * Calculates the total number of mob kills across all mob types.
     * @returns The total number of mobs killed.
     */

    public getTotalMobKills(): number {
        let total = 0;

        for (let key in this.mobKills) total += this.mobKills[key];

        return total;
    }

    /**
     * Gets the name colour based on karma.
     * Blue shades for positive karma (grinders), red shades for negative (PKers).
     * @returns A CSS colour string or empty string for default.
     */

    public getNameColour(): string {
        if (this.karma <= -200) return 'rgb(255, 0, 0)'; // Deep red (악명 높은 PK)
        if (this.karma <= -100) return 'rgb(255, 80, 80)'; // Red
        if (this.karma <= -50) return 'rgb(255, 140, 100)'; // Orange-red
        if (this.karma >= 500) return 'rgb(50, 130, 255)'; // Deep blue (전설의 사냥꾼)
        if (this.karma >= 200) return 'rgb(80, 170, 255)'; // Blue
        if (this.karma >= 100) return 'rgb(130, 200, 255)'; // Light blue
        return ''; // Default white
    }

    /**
     * Gets the karma tier name for display purposes.
     * @returns A Korean title describing the player's karma tier.
     */

    public getKarmaTier(): string {
        if (this.karma <= -200) return '악명 높은 살인자';
        if (this.karma <= -100) return '위험한 무법자';
        if (this.karma <= -50) return '무법자';
        if (this.karma >= 500) return '전설의 수호자';
        if (this.karma >= 200) return '용맹한 사냥꾼';
        if (this.karma >= 100) return '숙련된 사냥꾼';
        if (this.karma >= 50) return '모험가';
        return '여행자';
    }

    /**
     * Processes daily login streak. Call during player welcome.
     * @returns The login streak reward tier (0 = no reward, 1-7 for consecutive days).
     */

    public processLoginStreak(): number {
        let today = new Date().toISOString().slice(0, 10), // YYYY-MM-DD
            yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

        if (this.lastLoginDate === today) return 0; // Already logged in today

        if (this.lastLoginDate === yesterday) this.loginStreak++;
        else this.loginStreak = 1; // Reset streak

        this.lastLoginDate = today;

        // Cap at 30
        if (this.loginStreak > 30) this.loginStreak = 30;

        return this.loginStreak;
    }

    /**
     * Checks and unlocks titles based on player achievements.
     * @param level The player's combat level.
     * @returns Array of newly unlocked title keys.
     */

    public checkTitleUnlocks(level: number): string[] {
        let newTitles: string[] = [],
            totalMobs = this.getTotalMobKills(),
            checks: [string, boolean][] = [
                ['초보 모험가', level >= 5],
                ['숙련된 전사', level >= 20],
                ['베테랑 영웅', level >= 40],
                ['전설의 용사', level >= 60],
                ['학살자', totalMobs >= 1000],
                ['몬스터 헌터', totalMobs >= 5000],
                ['전장의 지배자', totalMobs >= 10_000],
                ['결투사', this.pvpKills >= 10],
                ['챔피언', this.pvpKills >= 50],
                ['불사신', this.bestKillStreak >= 100],
                ['연속 처치왕', this.bestKillStreak >= 500],
                ['단골 손님', this.loginCount >= 30],
                ['상주 주민', this.loginCount >= 100],
                ['개근상', this.loginStreak >= 7],
                ['한 달 개근', this.loginStreak >= 30],
                ['수호자', this.karma >= 500],
                ['무법자', this.karma <= -200]
            ];

        for (let [title, condition] of checks)
            if (condition && !this.unlockedTitles.includes(title)) {
                this.unlockedTitles.push(title);
                newTitles.push(title);
            }

        return newTitles;
    }

    /**
     * Handles examining a mob and rewarding the appropriate achievement.
     * @param key The key of the mob that was examined.
     */

    public addMobExamine(key: string): void {
        if (this.mobExamines.includes(key)) return;

        this.mobExamines.push(key);

        // Handle achievements for each milestone
        switch (this.mobExamines.length) {
            case 10: {
                return this.player.achievements.get('examiner10').finish();
            }

            case 25: {
                return this.player.achievements.get('examiner25').finish();
            }

            case 50: {
                return this.player.achievements.get('examiner50').finish();
            }
        }
    }

    /**
     * Adds a drop to the player's statistics. This is called when a player
     * receives a drop and we are incrementing the amount of items they have
     * received of that type.
     * @param key The key of the item that was dropped.
     * @param count (Optional) The amount of items that were dropped.
     */

    public addDrop(key: string, count = 1): void {
        if (!(key in this.drops)) this.drops[key] = count;

        this.drops[key] += count;
    }

    /**
     * Calculates the average time played by the player. Think of this as adding
     * every amount of time the player has been logged in together and dividing
     * by the amount of logins. e.g. (login1Time + login2Time + login3Time) / 3
     *
     * NewAverage = (OldAverage * (LoginCount - 1) + NewTime) / LoginCount
     */

    public calculateAverageTimePlayed(): void {
        let timePlayed = Date.now() - this.loginTime;

        this.averageTimePlayed =
            this.averageTimePlayed === 0
                ? timePlayed
                : Math.floor(
                      (this.averageTimePlayed * (this.loginCount - 1) + timePlayed) /
                          this.loginCount
                  );
    }

    /**
     * Serializes all of the player's statistic data into a single object.
     * @returns A StatisticsData object.
     */

    public serialize(): StatisticsData {
        // Serializing also gets treated as a logging out event, so we calculate stuff here.
        this.lastLogin = this.getTime();
        this.totalTimePlayed += Date.now() - this.loginTime; // add time played to total time played.
        this.calculateAverageTimePlayed();

        return {
            pvpKills: this.pvpKills,
            pvpDeaths: this.pvpDeaths,
            mobKills: this.mobKills,
            mobExamines: this.mobExamines,
            resources: this.resources,
            drops: this.drops,
            creationTime: this.creationTime,
            totalTimePlayed: this.totalTimePlayed,
            averageTimePlayed: this.averageTimePlayed,
            lastLogin: this.lastLogin,
            loginCount: this.loginCount,
            cheater: this.player.isCheater(),
            karma: this.karma,
            title: this.title,
            unlockedTitles: this.unlockedTitles,
            killStreak: this.killStreak,
            bestKillStreak: this.bestKillStreak,
            loginStreak: this.loginStreak,
            lastLoginDate: this.lastLoginDate,
            totalGoldEarned: this.totalGoldEarned
        };
    }

    /**
     * Gets the UNIX epoch time in seconds. This is because storing seconds
     * is easier for the database (as it can cause later down the line.)
     * @returns The current UNIX epoch time in seconds.
     */

    private getTime(): number {
        return Math.floor(Date.now() / 1000);
    }
}
