import Ability from '../ability';

import { Modules } from '@kaetram/common/network';

import type Player from '../../player';

export default class WarCry extends Ability {
    public constructor(level: number, quickSlot = -1) {
        super('warcry', level, quickSlot);

        this.onDeactivate((player: Player) => {
            player.status.remove(Modules.Effects.StrengthBuff);
            player.status.remove(Modules.Effects.AccuracyBuff);
        });
    }

    /**
     * Override for the superclass activate implementation. Grants the player
     * increased attack power and accuracy simultaneously.
     * @param player The player we are applying war cry to.
     */

    public override activate(player: Player): boolean {
        if (super.activate(player)) {
            player.status.add(Modules.Effects.StrengthBuff);
            player.status.add(Modules.Effects.AccuracyBuff);
        }

        return false;
    }
}
