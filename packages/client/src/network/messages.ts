import { Packets } from '@kaetram/common/network';

import type App from '../app';
import type {
    AbilityPacketCallback,
    AchievementPacketCallback,
    AnimationPacketCallback,
    BlinkPacketCallback,
    BubblePacketCallback,
    CameraPacketCallback,
    ChatPacketCallback,
    CombatPacketCallback,
    CommandPacketCallback,
    ContainerPacketCallback,
    CountdownPacketCallback,
    CraftingPacketCallback,
    DeathPacketCallback,
    DespawnPacketCallback,
    EffectPacketCallback,
    EnchantPacketCallback,
    EntityListPacketCallback,
    EquipmentPacketCallback,
    ExperiencePacketCallback,
    FriendsPacketCallback,
    GuildPacketCallback,
    HandshakePacketCallback,
    HealPacketCallback,
    InterfacePacketCallback,
    LootBagPacketCallback,
    MapPacketCallback,
    MinigamePacketCallback,
    MovementPacketCallback,
    MusicPacketCallback,
    NetworkPacketCallback,
    NotificationPacketCallback,
    NPCPacketCallback,
    OverlayPacketCallback,
    PointerPacketCallback,
    PointsPacketCallback,
    PoisonPacketCallback,
    PVPPacketCallback,
    QuestPacketCallback,
    QuizPacketCallback,
    RankPacketCallback,
    ResourcePacketCallback,
    RespawnPacketCallback,
    SkillPacketCallback,
    SpawnPacketCallback,
    StorePacketCallback,
    SyncPacketCallback,
    TeleportPacketCallback,
    TradePacketCallback,
    UpdatePacketCallback,
    WelcomePacketCallback
} from '@kaetram/common/types/messages/outgoing';
import type { ConnectedPacketCallback } from '@kaetram/common/network/impl/connected';

export default class Messages {
    private messages: (() => ((...data: never[]) => void) | undefined)[] = [];

    private connectedCallback?: ConnectedPacketCallback;
    private handshakeCallback?: HandshakePacketCallback;
    private welcomeCallback?: WelcomePacketCallback;
    private mapCallback?: MapPacketCallback;
    private spawnCallback?: SpawnPacketCallback;
    private equipmentCallback?: EquipmentPacketCallback;
    private entityListCallback?: EntityListPacketCallback;
    private syncCallback?: SyncPacketCallback;
    private movementCallback?: MovementPacketCallback;
    private teleportCallback?: TeleportPacketCallback;
    private despawnCallback?: DespawnPacketCallback;
    private combatCallback?: CombatPacketCallback;
    private animationCallback?: AnimationPacketCallback;
    private pointsCallback?: PointsPacketCallback;
    private networkCallback?: NetworkPacketCallback;
    private chatCallback?: ChatPacketCallback;
    private commandCallback?: CommandPacketCallback;
    private containerCallback?: ContainerPacketCallback;
    private abilityCallback?: AbilityPacketCallback;
    private questCallback?: QuestPacketCallback;
    private achievementCallback?: AchievementPacketCallback;
    private notificationCallback?: NotificationPacketCallback;
    private blinkCallback?: BlinkPacketCallback;
    private healCallback?: HealPacketCallback;
    private experienceCallback?: ExperiencePacketCallback;
    private deathCallback?: DeathPacketCallback;
    private musicCallback?: MusicPacketCallback;
    private npcCallback?: NPCPacketCallback;
    private respawnCallback?: RespawnPacketCallback;
    private tradeCallback?: TradePacketCallback;
    private enchantCallback?: EnchantPacketCallback;
    private guildCallback?: GuildPacketCallback;
    private pointerCallback?: PointerPacketCallback;
    private pvpCallback?: PVPPacketCallback;
    private poisonCallback?: PoisonPacketCallback;
    private storeCallback?: StorePacketCallback;
    private overlayCallback?: OverlayPacketCallback;
    private cameraCallback?: CameraPacketCallback;
    private bubbleCallback?: BubblePacketCallback;
    private skillCallback?: SkillPacketCallback;
    private updateCallback?: UpdatePacketCallback;
    private minigameCallback?: MinigamePacketCallback;
    private effectCallback?: EffectPacketCallback;
    private friendsCallback?: FriendsPacketCallback;
    private rankCallback?: RankPacketCallback;
    private craftingCallback?: CraftingPacketCallback;
    private interfaceCallback?: InterfacePacketCallback;
    private lootBagCallback?: LootBagPacketCallback;
    private countdownCallback?: CountdownPacketCallback;
    private resourceCallback?: ResourcePacketCallback;
    private quizCallback?: QuizPacketCallback;

    /**
     * Do not clutter up the Socket class with callbacks,
     * have this class here until a better method arises in my head.
     *
     * This class should not have any complex functionality, its main
     * role is to provide organization for packets and increase readability
     *
     * Please respect the order of the Packets Enum and arrange functions
     * accordingly.
     */
    public constructor(private app: App) {
        this.messages[Packets.Connected] = () => this.connectedCallback;
        this.messages[Packets.Handshake] = () => this.handshakeCallback;
        this.messages[Packets.Welcome] = () => this.welcomeCallback;
        this.messages[Packets.Spawn] = () => this.spawnCallback;
        this.messages[Packets.Equipment] = () => this.equipmentCallback;
        this.messages[Packets.List] = () => this.entityListCallback;
        this.messages[Packets.Sync] = () => this.syncCallback;
        this.messages[Packets.Movement] = () => this.movementCallback;
        this.messages[Packets.Teleport] = () => this.teleportCallback;
        this.messages[Packets.Despawn] = () => this.despawnCallback;
        this.messages[Packets.Combat] = () => this.combatCallback;
        this.messages[Packets.Animation] = () => this.animationCallback;
        this.messages[Packets.Points] = () => this.pointsCallback;
        this.messages[Packets.Network] = () => this.networkCallback;
        this.messages[Packets.Chat] = () => this.chatCallback;
        this.messages[Packets.Command] = () => this.commandCallback;
        this.messages[Packets.Container] = () => this.containerCallback;
        this.messages[Packets.Ability] = () => this.abilityCallback;
        this.messages[Packets.Quest] = () => this.questCallback;
        this.messages[Packets.Achievement] = () => this.achievementCallback;
        this.messages[Packets.Notification] = () => this.notificationCallback;
        this.messages[Packets.Blink] = () => this.blinkCallback;
        this.messages[Packets.Heal] = () => this.healCallback;
        this.messages[Packets.Experience] = () => this.experienceCallback;
        this.messages[Packets.Death] = () => this.deathCallback;
        this.messages[Packets.Music] = () => this.musicCallback;
        this.messages[Packets.NPC] = () => this.npcCallback;
        this.messages[Packets.Respawn] = () => this.respawnCallback;
        this.messages[Packets.Trade] = () => this.tradeCallback;
        this.messages[Packets.Enchant] = () => this.enchantCallback;
        this.messages[Packets.Guild] = () => this.guildCallback;
        this.messages[Packets.Pointer] = () => this.pointerCallback;
        this.messages[Packets.PVP] = () => this.pvpCallback;
        this.messages[Packets.Poison] = () => this.poisonCallback;
        this.messages[Packets.Store] = () => this.storeCallback;
        this.messages[Packets.Map] = () => this.mapCallback;
        this.messages[Packets.Overlay] = () => this.overlayCallback;
        this.messages[Packets.Camera] = () => this.cameraCallback;
        this.messages[Packets.Bubble] = () => this.bubbleCallback;
        this.messages[Packets.Skill] = () => this.skillCallback;
        this.messages[Packets.Update] = () => this.updateCallback;
        this.messages[Packets.Minigame] = () => this.minigameCallback;
        this.messages[Packets.Effect] = () => this.effectCallback;
        this.messages[Packets.Friends] = () => this.friendsCallback;
        this.messages[Packets.Rank] = () => this.rankCallback;
        this.messages[Packets.Crafting] = () => this.craftingCallback;
        this.messages[Packets.Interface] = () => this.interfaceCallback;
        this.messages[Packets.LootBag] = () => this.lootBagCallback;
        this.messages[Packets.Countdown] = () => this.countdownCallback;
        this.messages[Packets.Resource] = () => this.resourceCallback;
        this.messages[Packets.Quiz] = () => this.quizCallback;
    }

    /**
     * Parses through the data and calls the appropriate callback.
     * @param data Packet data containing packet opcode and data.
     */

    public handleData(data: [Packets, ...never[]]): void {
        let packet = data.shift()!,
            message = this.messages[packet]();

        if (message && typeof message === 'function')
            message.call(this, ...(data as unknown[] as never[]));
    }

    /**
     * Packet data received in an array format calls `handleData`
     * for each iteration of packet data.
     * @param data Packet data array.
     */

    public handleBulkData(data: [Packets, ...never[]][]): void {
        for (let info of data) this.handleData(info);
    }

    /**
     * Handles the close event when the connection is closed. The reason passed determines
     * what error we display to the user.
     * @param reason UTF8 reason received from the server.
     */

    public handleCloseReason(reason: string): void {
        this.app.toggleLogin(false);

        switch (reason) {
            case 'worldfull': {
                this.app.sendError('서버가 현재 가득 찼습니다!');
                break;
            }

            case 'error': {
                this.app.sendError('서버에서 오류가 발생했습니다!');
                break;
            }

            case 'banned': {
                this.app.sendError('계정이 비활성화되었습니다!');
                break;
            }

            case 'disabledregister': {
                this.app.sendError('현재 회원가입이 비활성화되어 있습니다.');
                break;
            }

            case 'development': {
                this.app.sendError('게임이 현재 개발 모드입니다.');
                break;
            }

            case 'disallowed': {
                this.app.sendError('서버가 현재 접속을 허용하지 않습니다!');
                break;
            }

            case 'maintenance': {
                this.app.sendError('WordQuest Online이 현재 점검 중입니다.');
                break;
            }

            case 'userexists': {
                this.app.sendError('이미 사용 중인 사용자 이름입니다.');
                break;
            }

            case 'emailexists': {
                this.app.sendError('이미 사용 중인 이메일 주소입니다.');
                break;
            }

            case 'invalidinput': {
                this.app.sendError('잘못된 입력입니다. 특수문자를 사용하지 마세요.');
                break;
            }

            case 'swappedworlds': {
                this.app.sendError('최근에 서버를 변경했습니다. 15초 후에 다시 시도하세요.');
                break;
            }

            case 'loggedin': {
                this.app.sendError('이미 접속 중인 플레이어입니다!');
                break;
            }

            case 'invalidlogin': {
                this.app.sendError('사용자 이름 또는 비밀번호가 올바르지 않습니다.');
                break;
            }

            case 'toofast': {
                this.app.sendError('로그인 시도가 너무 빠릅니다. 잠시 후 다시 시도하세요.');
                break;
            }

            case 'timeout': {
                this.app.sendError('오랫동안 활동이 없어 연결이 끊겼습니다.');
                break;
            }

            case 'updated': {
                this.app.sendError('게임이 업데이트되었습니다. 브라우저 캐시를 지워주세요.');
                break;
            }

            case 'cheating': {
                this.app.sendError(`클라이언트-서버 동기화 오류가 발생했습니다.`);
                break;
            }

            case 'lost': {
                this.app.sendError('서버 연결이 끊겼습니다.');
                break;
            }

            case 'toomany': {
                this.app.sendError('같은 IP에서 너무 많은 기기가 연결되어 있습니다.');
                break;
            }

            case 'ratelimit': {
                this.app.sendError('패킷 전송 속도가 너무 빠릅니다.');
                break;
            }

            case 'invalidpassword': {
                this.app.sendError('비밀번호가 올바르지 않습니다.');
                break;
            }

            default: {
                this.app.sendError('알 수 없는 오류가 발생했습니다. 버그로 신고해 주세요.');
                break;
            }
        }
    }

    /**
     * Packet callbacks.
     */

    public onConnected(callback: ConnectedPacketCallback): void {
        this.connectedCallback = callback;
    }

    public onHandshake(callback: HandshakePacketCallback): void {
        this.handshakeCallback = callback;
    }

    public onWelcome(callback: WelcomePacketCallback): void {
        this.welcomeCallback = callback;
    }

    public onSpawn(callback: SpawnPacketCallback): void {
        this.spawnCallback = callback;
    }

    public onEquipment(callback: EquipmentPacketCallback): void {
        this.equipmentCallback = callback;
    }

    public onEntityList(callback: EntityListPacketCallback): void {
        this.entityListCallback = callback;
    }

    public onSync(callback: SyncPacketCallback): void {
        this.syncCallback = callback;
    }

    public onMovement(callback: MovementPacketCallback): void {
        this.movementCallback = callback;
    }

    public onTeleport(callback: TeleportPacketCallback): void {
        this.teleportCallback = callback;
    }

    public onDespawn(callback: DespawnPacketCallback): void {
        this.despawnCallback = callback;
    }

    public onCombat(callback: CombatPacketCallback): void {
        this.combatCallback = callback;
    }

    public onAnimation(callback: AnimationPacketCallback): void {
        this.animationCallback = callback;
    }

    public onPoints(callback: PointsPacketCallback): void {
        this.pointsCallback = callback;
    }

    public onNetwork(callback: NetworkPacketCallback): void {
        this.networkCallback = callback;
    }

    public onChat(callback: ChatPacketCallback): void {
        this.chatCallback = callback;
    }

    public onCommand(callback: CommandPacketCallback): void {
        this.commandCallback = callback;
    }

    public onContainer(callback: ContainerPacketCallback): void {
        this.containerCallback = callback;
    }

    public onAbility(callback: AbilityPacketCallback): void {
        this.abilityCallback = callback;
    }

    public onQuest(callback: QuestPacketCallback): void {
        this.questCallback = callback;
    }

    public onAchievement(callback: AchievementPacketCallback): void {
        this.achievementCallback = callback;
    }

    public onNotification(callback: NotificationPacketCallback): void {
        this.notificationCallback = callback;
    }

    public onBlink(callback: BlinkPacketCallback): void {
        this.blinkCallback = callback;
    }

    public onHeal(callback: HealPacketCallback): void {
        this.healCallback = callback;
    }

    public onExperience(callback: ExperiencePacketCallback): void {
        this.experienceCallback = callback;
    }

    public onDeath(callback: DeathPacketCallback): void {
        this.deathCallback = callback;
    }

    public onMusic(callback: MusicPacketCallback): void {
        this.musicCallback = callback;
    }

    public onNPC(callback: NPCPacketCallback): void {
        this.npcCallback = callback;
    }

    public onRespawn(callback: RespawnPacketCallback): void {
        this.respawnCallback = callback;
    }

    public onTrade(callback: TradePacketCallback): void {
        this.tradeCallback = callback;
    }

    public onEnchant(callback: EnchantPacketCallback): void {
        this.enchantCallback = callback;
    }

    public onGuild(callback: GuildPacketCallback): void {
        this.guildCallback = callback;
    }

    public onPointer(callback: PointerPacketCallback): void {
        this.pointerCallback = callback;
    }

    public onPVP(callback: PVPPacketCallback): void {
        this.pvpCallback = callback;
    }

    public onPoison(callback: PoisonPacketCallback): void {
        this.poisonCallback = callback;
    }

    public onStore(callback: StorePacketCallback): void {
        this.storeCallback = callback;
    }

    public onMap(callback: MapPacketCallback): void {
        this.mapCallback = callback;
    }

    public onOverlay(callback: OverlayPacketCallback): void {
        this.overlayCallback = callback;
    }

    public onCamera(callback: CameraPacketCallback): void {
        this.cameraCallback = callback;
    }

    public onBubble(callback: BubblePacketCallback): void {
        this.bubbleCallback = callback;
    }

    public onSkill(callback: SkillPacketCallback): void {
        this.skillCallback = callback;
    }

    public onUpdate(callback: UpdatePacketCallback): void {
        this.updateCallback = callback;
    }

    public onMinigame(callback: MinigamePacketCallback): void {
        this.minigameCallback = callback;
    }

    public onEffect(callback: EffectPacketCallback): void {
        this.effectCallback = callback;
    }

    public onFriends(callback: FriendsPacketCallback): void {
        this.friendsCallback = callback;
    }

    public onRank(callback: RankPacketCallback): void {
        this.rankCallback = callback;
    }

    public onCrafting(callback: CraftingPacketCallback): void {
        this.craftingCallback = callback;
    }

    public onInterface(callback: InterfacePacketCallback): void {
        this.interfaceCallback = callback;
    }

    public onLootBag(callback: LootBagPacketCallback): void {
        this.lootBagCallback = callback;
    }

    public onCountdown(callback: CountdownPacketCallback): void {
        this.countdownCallback = callback;
    }

    public onResource(callback: ResourcePacketCallback): void {
        this.resourceCallback = callback;
    }

    public onQuiz(callback: QuizPacketCallback): void {
        this.quizCallback = callback;
    }
}
