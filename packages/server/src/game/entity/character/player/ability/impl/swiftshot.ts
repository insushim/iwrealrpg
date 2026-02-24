import Ability from '../ability';

import { Modules } from '@kaetram/common/network';

import type Player from '../../player';

export default class SwiftShot extends Ability {
    public constructor(level: number, quickSlot = -1) {
        super('swiftshot', level, quickSlot);

        this.onDeactivate((player: Player) => {
            player.setDualistsMark(false);
            player.status.remove(Modules.Effects.AccuracyBuff);
        });
    }

    /**
     * Override for the superclass activate implementation. Grants the player
     * increased attack speed and accuracy simultaneously.
     * @param player The player we are applying swift shot to.
     */

    public override activate(player: Player): boolean {
        if (super.activate(player)) {
            player.setDualistsMark(true);
            player.status.add(Modules.Effects.AccuracyBuff);
        }

        return false;
    }
}
