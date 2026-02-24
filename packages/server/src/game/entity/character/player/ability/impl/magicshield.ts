import Ability from '../ability';

import { Modules } from '@kaetram/common/network';

import type Player from '../../player';

export default class MagicShield extends Ability {
    public constructor(level: number, quickSlot = -1) {
        super('magicshield', level, quickSlot);

        this.onDeactivate((player: Player) => {
            player.status.remove(Modules.Effects.ThickSkin);
            player.status.remove(Modules.Effects.DefenseBuff);
        });
    }

    /**
     * Override for the superclass activate implementation. Grants the player
     * damage reduction and defense buff simultaneously.
     * @param player The player we are applying magic shield to.
     */

    public override activate(player: Player): boolean {
        if (super.activate(player)) {
            player.status.add(Modules.Effects.ThickSkin);
            player.status.add(Modules.Effects.DefenseBuff);
        }

        return false;
    }
}
