import log from '@kaetram/common/util/log';

import type World from '../game/world';
import type Player from '../game/entity/character/player/player';

interface TerritoryBid {
    guildIdentifier: string;
    guildName: string;
    amount: number;
    bidder: string; // username of who placed the bid
    timestamp: number;
}

interface Territory {
    id: string;
    name: string;
    owner: string; // guild identifier
    ownerName: string; // guild display name
    taxRate: number; // percentage (0-20, default 10)
    totalTaxCollected: number;
    currentBids: TerritoryBid[];
    lastResetTime: number;
}

export default class Territories {
    // 6 warp city territories
    private territories: Map<string, Territory> = new Map();
    private resetInterval!: NodeJS.Timeout;

    // Territory definitions matching warp cities
    private static readonly TERRITORY_DEFINITIONS = [
        { id: 'mudwich', name: 'Mudwich' },
        { id: 'lakesworld', name: 'Lakesworld' },
        { id: 'ppirateland', name: 'Pirate Land' },
        { id: 'desertcastle', name: 'Desert Castle' },
        { id: 'snowvillage', name: 'Snow Village' },
        { id: 'magictemple', name: 'Magic Temple' }
    ];

    public constructor(private world: World) {
        this.initialize();
        this.startDailyReset();
    }

    private initialize(): void {
        for (let def of Territories.TERRITORY_DEFINITIONS)
            this.territories.set(def.id, {
                id: def.id,
                name: def.name,
                owner: '',
                ownerName: '',
                taxRate: 10,
                totalTaxCollected: 0,
                currentBids: [],
                lastResetTime: Date.now()
            });
    }

    /**
     * Place a bid for a territory using guild gold.
     * @param player The player placing the bid.
     * @param territoryId The id of the territory to bid on.
     * @param amount The amount of gold to bid.
     */

    public placeBid(player: Player, territoryId: string, amount: number): void {
        let territory = this.territories.get(territoryId);

        if (!territory) return player.notify('Invalid territory.');
        if (!player.guild) return player.notify('You must be in a guild to bid.');
        if (amount < 1000) return player.notify('Minimum bid is 1,000 gold.');
        if (!player.inventory.hasItem('gold', amount)) return player.notify('Not enough gold.');

        // Remove gold from player
        player.inventory.removeItem('gold', amount);

        // Check for existing bid from same guild
        let existingBid = territory.currentBids.find((b) => b.guildIdentifier === player.guild);

        if (existingBid) {
            existingBid.amount += amount;
            existingBid.timestamp = Date.now();
            existingBid.bidder = player.username;
        } else
            territory.currentBids.push({
                guildIdentifier: player.guild,
                guildName: player.guild, // Will be resolved from guild data
                amount,
                bidder: player.username,
                timestamp: Date.now()
            });

        // Sort bids by amount descending
        territory.currentBids.sort((a, b) => b.amount - a.amount);

        player.notify(`Bid of ${amount} gold placed for ${territory.name}!`);
        log.info(`[Territory] ${player.username} bid ${amount} gold for ${territory.name}`);
    }

    /**
     * Calculate tax on a store transaction.
     * @param territoryId The territory where the transaction occurs.
     * @param amount The transaction amount.
     * @returns The tax amount and owning guild identifier.
     */

    public calculateTax(territoryId: string, amount: number): { tax: number; guild: string } {
        let territory = this.territories.get(territoryId);

        if (!territory || !territory.owner) return { tax: 0, guild: '' };

        let tax = Math.floor(amount * (territory.taxRate / 100));

        territory.totalTaxCollected += tax;

        return { tax, guild: territory.owner };
    }

    /**
     * Get territory info for display.
     * @param territoryId The territory id to look up.
     * @returns The territory data or undefined.
     */

    public getTerritoryInfo(territoryId: string): Territory | undefined {
        return this.territories.get(territoryId);
    }

    /**
     * Get all territories.
     * @returns Array of all territory data.
     */

    public getAllTerritories(): Territory[] {
        return [...this.territories.values()];
    }

    /**
     * Daily reset - highest bidder wins territory.
     */

    private processDailyReset(): void {
        for (let [, territory] of this.territories) {
            if (territory.currentBids.length > 0) {
                let [winningBid] = territory.currentBids; // Already sorted by amount

                territory.owner = winningBid.guildIdentifier;
                territory.ownerName = winningBid.guildName;

                log.info(
                    `[Territory] ${territory.name} claimed by guild ${winningBid.guildName} with bid of ${winningBid.amount} gold`
                );
            }

            // Reset bids
            territory.currentBids = [];
            territory.lastResetTime = Date.now();
            territory.totalTaxCollected = 0;
        }
    }

    /**
     * Start the daily reset timer (midnight KST = 15:00 UTC).
     */

    private startDailyReset(): void {
        let now = new Date(),
            nextReset = new Date(now);

        nextReset.setUTCHours(15, 0, 0, 0); // Midnight KST

        if (now >= nextReset) nextReset.setUTCDate(nextReset.getUTCDate() + 1);

        let msUntilReset = nextReset.getTime() - now.getTime();

        setTimeout(() => {
            this.processDailyReset();

            // Set interval for every 24 hours after first reset
            this.resetInterval = setInterval(() => this.processDailyReset(), 24 * 60 * 60 * 1000);
        }, msUntilReset);

        log.info(
            `[Territory] Daily reset scheduled in ${Math.floor(msUntilReset / 1000 / 60)} minutes`
        );
    }

    /**
     * Cleanup timers on shutdown.
     */

    public stop(): void {
        if (this.resetInterval) clearInterval(this.resetInterval);
    }
}
