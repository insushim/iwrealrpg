import Ability from '../ability';

import type Player from '../../player';

export default class Haste extends Ability {
    public constructor(level: number, quickSlot = -1) {
        super('haste', level, quickSlot);

        this.onDeactivate((player: Player) => {
            player.setRunning(false);
            player.setDualistsMark(false);
        });
    }

    /**
     * Override for the superclass activate implementation. Grants the player
     * increased movement speed and attack speed simultaneously.
     * @param player The player we are applying haste to.
     */

    public override activate(player: Player): boolean {
        if (super.activate(player)) {
            player.setRunning(true);
            player.setDualistsMark(true);
        }

        return false;
    }
}
