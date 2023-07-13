import ClassRaceData from "./ClassRaceData";

export default class ClassachievementData {
    private m_represent: ClassRaceData
    private m_achievements: {[ID:number]: ClassRaceData | null}
    constructor(represent: ClassRaceData) {
        this.m_represent = represent
        this.m_achievements = {}
        this.constructorachievements()
    }

    public updateAchievement(data: ClassRaceData) {
        this.m_achievements[data.ID] = data
    }
    public getIDAchievementData(ID: number) {
        if (this.m_achievements[ID] != undefined) {
            return this.m_achievements[ID]
        } else {
            return null
        }
    }
    public get represent() { return this.m_represent}
    public get achievements() { return this.m_achievements}

    private constructorachievements(){
        this.m_achievements[ClassachievementData.ID1] = null
        this.m_achievements[ClassachievementData.ID4] = null
        this.m_achievements[ClassachievementData.ID5] = null
        this.m_achievements[ClassachievementData.ID6] = null
        this.m_achievements[ClassachievementData.ID8] = null
        this.m_achievements[ClassachievementData.ID12] = null
        this.m_achievements[ClassachievementData.ID13] = null
        this.m_achievements[ClassachievementData.ID14] = null
        this.m_achievements[ClassachievementData.ID15] = null
        this.m_achievements[ClassachievementData.ID16] = null
        this.m_achievements[ClassachievementData.ID20] = null
        this.m_achievements[ClassachievementData.ID21] = null
        this.m_achievements[ClassachievementData.ID22] = null
        this.m_achievements[ClassachievementData.ID23] = null
        this.m_achievements[ClassachievementData.ID24] = null
        this.m_achievements[ClassachievementData.ID25] = null
        this.m_achievements[ClassachievementData.ID28] = null
        this.m_achievements[ClassachievementData.ID32] = null
        this.m_achievements[ClassachievementData.ID40] = null
        this.m_achievements[ClassachievementData.ID41] = null
        this.m_achievements[ClassachievementData.ID42] = null
        this.m_achievements[ClassachievementData.ID43] = null
        this.m_achievements[ClassachievementData.ID44] = null
        this.m_achievements[ClassachievementData.ID48] = null
        this.m_achievements[ClassachievementData.ID49] = null
        this.m_achievements[ClassachievementData.ID50] = null
        this.m_achievements[ClassachievementData.ID51] = null
        this.m_achievements[ClassachievementData.ID54] = null
        this.m_achievements[ClassachievementData.ID55] = null
        this.m_achievements[ClassachievementData.ID56] = null
        this.m_achievements[ClassachievementData.ID58] = null
        this.m_achievements[ClassachievementData.ID59] = null
        this.m_achievements[ClassachievementData.ID61] = null
        this.m_achievements[ClassachievementData.ID65] = null
        this.m_achievements[ClassachievementData.ID66] = null
        this.m_achievements[ClassachievementData.ID67] = null
        this.m_achievements[ClassachievementData.ID68] = null
        this.m_achievements[ClassachievementData.ID69] = null
        this.m_achievements[ClassachievementData.ID70] = null
        this.m_achievements[ClassachievementData.ID71] = null
        this.m_achievements[ClassachievementData.ID72] = null
        this.m_achievements[ClassachievementData.ID73] = null
        this.m_achievements[ClassachievementData.ID74] = null
        this.m_achievements[ClassachievementData.ID75] = null
        this.m_achievements[ClassachievementData.ID77] = null
        this.m_achievements[ClassachievementData.ID78] = null
        this.m_achievements[ClassachievementData.ID79] = null
        this.m_achievements[ClassachievementData.ID80] = null
        this.m_achievements[ClassachievementData.ID81] = null
        this.m_achievements[ClassachievementData.ID82] = null
        this.m_achievements[ClassachievementData.ID83] = null
        this.m_achievements[ClassachievementData.ID84] = null
        this.m_achievements[ClassachievementData.ID85] = null
        this.m_achievements[ClassachievementData.ID86] = null
        this.m_achievements[ClassachievementData.ID87] = null
        this.m_achievements[ClassachievementData.ID88] = null
        this.m_achievements[ClassachievementData.ID89] = null
        this.m_achievements[ClassachievementData.ID90] = null
        this.m_achievements[ClassachievementData.ID91] = null
        this.m_achievements[ClassachievementData.ID92] = null
        this.m_achievements[ClassachievementData.ID93] = null
        this.m_achievements[ClassachievementData.ID94] = null
        this.m_achievements[ClassachievementData.ID95] = null
        this.m_achievements[ClassachievementData.ID96] = null
        this.m_achievements[ClassachievementData.ID97] = null
        this.m_achievements[ClassachievementData.ID98] = null
        this.m_achievements[ClassachievementData.ID99] = null
        this.m_achievements[ClassachievementData.ID101] = null
        this.m_achievements[ClassachievementData.ID102] = null
        this.m_achievements[ClassachievementData.ID105] = null
        this.m_achievements[ClassachievementData.ID106] = null
        this.m_achievements[ClassachievementData.ID107] = null
        this.m_achievements[ClassachievementData.ID108] = null
        this.m_achievements[ClassachievementData.ID109] = null
        this.m_achievements[ClassachievementData.ID110] = null
        this.m_achievements[ClassachievementData.ID113] = null
        this.m_achievements[ClassachievementData.ID114] = null
        this.m_achievements[ClassachievementData.ID115] = null
        this.m_achievements[ClassachievementData.ID116] = null
        this.m_achievements[ClassachievementData.ID117] = null
        this.m_achievements[ClassachievementData.ID118] = null
        this.m_achievements[ClassachievementData.ID119] = null
        this.m_achievements[ClassachievementData.ID120] = null
        this.m_achievements[ClassachievementData.ID121] = null
        this.m_achievements[ClassachievementData.ID122] = null
        this.m_achievements[ClassachievementData.ID123] = null
        this.m_achievements[ClassachievementData.ID125] = null
        this.m_achievements[ClassachievementData.ID126] = null
        this.m_achievements[ClassachievementData.ID127] = null
        this.m_achievements[ClassachievementData.ID129] = null
        this.m_achievements[ClassachievementData.ID130] = null
        this.m_achievements[ClassachievementData.ID131] = null
        this.m_achievements[ClassachievementData.ID132] = null
        this.m_achievements[ClassachievementData.ID133] = null
        this.m_achievements[ClassachievementData.ID134] = null
        this.m_achievements[ClassachievementData.ID135] = null
        this.m_achievements[ClassachievementData.ID136] = null
        this.m_achievements[ClassachievementData.ID140] = null
        this.m_achievements[ClassachievementData.ID141] = null
        this.m_achievements[ClassachievementData.ID144] = null
        this.m_achievements[ClassachievementData.ID145] = null
        this.m_achievements[ClassachievementData.ID146] = null
        this.m_achievements[ClassachievementData.ID148] = null
        this.m_achievements[ClassachievementData.ID149] = null
        this.m_achievements[ClassachievementData.ID150] = null
        this.m_achievements[ClassachievementData.ID152] = null
        this.m_achievements[ClassachievementData.ID153] = null
        this.m_achievements[ClassachievementData.ID154] = null
        this.m_achievements[ClassachievementData.ID155] = null
        this.m_achievements[ClassachievementData.ID156] = null
        this.m_achievements[ClassachievementData.ID157] = null
        this.m_achievements[ClassachievementData.ID160] = null
        this.m_achievements[ClassachievementData.ID161] = null
        this.m_achievements[ClassachievementData.ID162] = null
        this.m_achievements[ClassachievementData.ID163] = null
        this.m_achievements[ClassachievementData.ID164] = null
        this.m_achievements[ClassachievementData.ID167] = null
        this.m_achievements[ClassachievementData.ID171] = null
        this.m_achievements[ClassachievementData.ID172] = null
        this.m_achievements[ClassachievementData.ID173] = null
        this.m_achievements[ClassachievementData.ID175] = null
        this.m_achievements[ClassachievementData.ID176] = null
        this.m_achievements[ClassachievementData.ID177] = null
        this.m_achievements[ClassachievementData.ID178] = null
        this.m_achievements[ClassachievementData.ID179] = null
        this.m_achievements[ClassachievementData.ID180] = null
        this.m_achievements[ClassachievementData.ID181] = null
        this.m_achievements[ClassachievementData.ID182] = null
        this.m_achievements[ClassachievementData.ID183] = null
        this.m_achievements[ClassachievementData.ID184] = null
        this.m_achievements[ClassachievementData.ID185] = null
        this.m_achievements[ClassachievementData.ID186] = null
        this.m_achievements[ClassachievementData.ID187] = null
        this.m_achievements[ClassachievementData.ID188] = null
        this.m_achievements[ClassachievementData.ID191] = null
        this.m_achievements[ClassachievementData.ID195] = null
        this.m_achievements[ClassachievementData.ID196] = null
        this.m_achievements[ClassachievementData.ID197] = null
        this.m_achievements[ClassachievementData.ID199] = null
        this.m_achievements[ClassachievementData.ID200] = null
        this.m_achievements[ClassachievementData.ID201] = null
        this.m_achievements[ClassachievementData.ID203] = null
        this.m_achievements[ClassachievementData.ID204] = null
        this.m_achievements[ClassachievementData.ID205] = null
        this.m_achievements[ClassachievementData.ID206] = null
        this.m_achievements[ClassachievementData.ID211] = null
        this.m_achievements[ClassachievementData.ID212] = null
        this.m_achievements[ClassachievementData.ID213] = null
        this.m_achievements[ClassachievementData.ID214] = null
        this.m_achievements[ClassachievementData.ID215] = null
        this.m_achievements[ClassachievementData.ID216] = null
        this.m_achievements[ClassachievementData.ID219] = null
        this.m_achievements[ClassachievementData.ID220] = null
        this.m_achievements[ClassachievementData.ID221] = null
        this.m_achievements[ClassachievementData.ID222] = null
        this.m_achievements[ClassachievementData.ID223] = null
        this.m_achievements[ClassachievementData.ID224] = null
        this.m_achievements[ClassachievementData.ID225] = null
        this.m_achievements[ClassachievementData.ID227] = null
        this.m_achievements[ClassachievementData.ID235] = null
        this.m_achievements[ClassachievementData.ID239] = null
        this.m_achievements[ClassachievementData.ID240] = null
        this.m_achievements[ClassachievementData.ID241] = null
        this.m_achievements[ClassachievementData.ID242] = null
        this.m_achievements[ClassachievementData.ID243] = null
        this.m_achievements[ClassachievementData.ID247] = null
        this.m_achievements[ClassachievementData.ID251] = null
        this.m_achievements[ClassachievementData.ID255] = null
        this.m_achievements[ClassachievementData.ID256] = null
        this.m_achievements[ClassachievementData.ID257] = null
        this.m_achievements[ClassachievementData.ID258] = null
        this.m_achievements[ClassachievementData.ID259] = null
        this.m_achievements[ClassachievementData.ID260] = null
        this.m_achievements[ClassachievementData.ID262] = null
        this.m_achievements[ClassachievementData.ID266] = null
        this.m_achievements[ClassachievementData.ID267] = null
        this.m_achievements[ClassachievementData.ID268] = null
        this.m_achievements[ClassachievementData.ID269] = null
        this.m_achievements[ClassachievementData.ID270] = null
        this.m_achievements[ClassachievementData.ID271] = null
        this.m_achievements[ClassachievementData.ID272] = null
        this.m_achievements[ClassachievementData.ID273] = null
        this.m_achievements[ClassachievementData.ID274] = null
        this.m_achievements[ClassachievementData.ID275] = null
        this.m_achievements[ClassachievementData.ID276] = null
        this.m_achievements[ClassachievementData.ID278] = null
        this.m_achievements[ClassachievementData.ID279] = null
        this.m_achievements[ClassachievementData.ID280] = null
        this.m_achievements[ClassachievementData.ID281] = null
        this.m_achievements[ClassachievementData.ID282] = null
        this.m_achievements[ClassachievementData.ID283] = null
        this.m_achievements[ClassachievementData.ID284] = null
        this.m_achievements[ClassachievementData.ID285] = null
        this.m_achievements[ClassachievementData.ID286] = null
        this.m_achievements[ClassachievementData.ID287] = null
        this.m_achievements[ClassachievementData.ID288] = null
        this.m_achievements[ClassachievementData.ID290] = null
        this.m_achievements[ClassachievementData.ID291] = null
        this.m_achievements[ClassachievementData.ID292] = null
        this.m_achievements[ClassachievementData.ID293] = null
        this.m_achievements[ClassachievementData.ID294] = null
        this.m_achievements[ClassachievementData.ID295] = null
        this.m_achievements[ClassachievementData.ID298] = null
        this.m_achievements[ClassachievementData.ID299] = null
        this.m_achievements[ClassachievementData.ID300] = null
        this.m_achievements[ClassachievementData.ID301] = null
        this.m_achievements[ClassachievementData.ID302] = null
        this.m_achievements[ClassachievementData.ID303] = null
        this.m_achievements[ClassachievementData.ID304] = null
        this.m_achievements[ClassachievementData.ID306] = null
        this.m_achievements[ClassachievementData.ID307] = null
        this.m_achievements[ClassachievementData.ID308] = null
        this.m_achievements[ClassachievementData.ID309] = null
        this.m_achievements[ClassachievementData.ID310] = null
        this.m_achievements[ClassachievementData.ID311] = null
        this.m_achievements[ClassachievementData.ID314] = null
        this.m_achievements[ClassachievementData.ID315] = null
        this.m_achievements[ClassachievementData.ID316] = null
        this.m_achievements[ClassachievementData.ID317] = null
        this.m_achievements[ClassachievementData.ID318] = null
        this.m_achievements[ClassachievementData.ID319] = null
        this.m_achievements[ClassachievementData.ID320] = null
        this.m_achievements[ClassachievementData.ID321] = null
        this.m_achievements[ClassachievementData.ID322] = null
        this.m_achievements[ClassachievementData.ID326] = null
        this.m_achievements[ClassachievementData.ID332] = null
        this.m_achievements[ClassachievementData.ID333] = null
        this.m_achievements[ClassachievementData.ID339] = null
        this.m_achievements[ClassachievementData.ID340] = null
        this.m_achievements[ClassachievementData.ID341] = null
        this.m_achievements[ClassachievementData.ID343] = null
        this.m_achievements[ClassachievementData.ID344] = null
        this.m_achievements[ClassachievementData.ID347] = null
        this.m_achievements[ClassachievementData.ID348] = null
        this.m_achievements[ClassachievementData.ID349] = null
        this.m_achievements[ClassachievementData.ID351] = null
        this.m_achievements[ClassachievementData.ID352] = null
        this.m_achievements[ClassachievementData.ID353] = null
        this.m_achievements[ClassachievementData.ID355] = null
        this.m_achievements[ClassachievementData.ID356] = null
        this.m_achievements[ClassachievementData.ID357] = null
        this.m_achievements[ClassachievementData.ID358] = null
        this.m_achievements[ClassachievementData.ID359] = null
        this.m_achievements[ClassachievementData.ID360] = null
        this.m_achievements[ClassachievementData.ID361] = null
        this.m_achievements[ClassachievementData.ID363] = null
        this.m_achievements[ClassachievementData.ID364] = null
        this.m_achievements[ClassachievementData.ID365] = null
        this.m_achievements[ClassachievementData.ID367] = null
        this.m_achievements[ClassachievementData.ID368] = null
        this.m_achievements[ClassachievementData.ID369] = null
        this.m_achievements[ClassachievementData.ID371] = null
        this.m_achievements[ClassachievementData.ID372] = null
        this.m_achievements[ClassachievementData.ID375] = null
        this.m_achievements[ClassachievementData.ID376] = null
        this.m_achievements[ClassachievementData.ID377] = null
        this.m_achievements[ClassachievementData.ID378] = null
        this.m_achievements[ClassachievementData.ID379] = null
        this.m_achievements[ClassachievementData.ID380] = null
        this.m_achievements[ClassachievementData.ID381] = null
        this.m_achievements[ClassachievementData.ID382] = null
        this.m_achievements[ClassachievementData.ID383] = null
        this.m_achievements[ClassachievementData.ID384] = null
        this.m_achievements[ClassachievementData.ID391] = null
        this.m_achievements[ClassachievementData.ID392] = null
        this.m_achievements[ClassachievementData.ID395] = null
        this.m_achievements[ClassachievementData.ID402] = null
        this.m_achievements[ClassachievementData.ID406] = null
        this.m_achievements[ClassachievementData.ID407] = null
        this.m_achievements[ClassachievementData.ID410] = null
        this.m_achievements[ClassachievementData.ID417] = null
        this.m_achievements[ClassachievementData.ID436] = null
        this.m_achievements[ClassachievementData.ID440] = null
        this.m_achievements[ClassachievementData.ID441] = null
        this.m_achievements[ClassachievementData.ID448] = null
        this.m_achievements[ClassachievementData.ID452] = null
        this.m_achievements[ClassachievementData.ID453] = null
        this.m_achievements[ClassachievementData.ID456] = null
        this.m_achievements[ClassachievementData.ID472] = null
        this.m_achievements[ClassachievementData.ID476] = null
        this.m_achievements[ClassachievementData.ID477] = null
        this.m_achievements[ClassachievementData.ID483] = null
        this.m_achievements[ClassachievementData.ID488] = null
        this.m_achievements[ClassachievementData.ID492] = null
        this.m_achievements[ClassachievementData.ID495] = null
        this.m_achievements[ClassachievementData.ID499] = null
        this.m_achievements[ClassachievementData.ID508] = null
        this.m_achievements[ClassachievementData.ID536] = null
        this.m_achievements[ClassachievementData.ID585] = null
    }
    private static ID1: number
    private static ID4: number
    private static ID5: number
    private static ID6: number
    private static ID8: number
    private static ID12: number
    private static ID13: number
    private static ID14: number
    private static ID15: number
    private static ID16: number
    private static ID20: number
    private static ID21: number
    private static ID22: number
    private static ID23: number
    private static ID24: number
    private static ID25: number
    private static ID28: number
    private static ID32: number
    private static ID40: number
    private static ID41: number
    private static ID42: number
    private static ID43: number
    private static ID44: number
    private static ID48: number
    private static ID49: number
    private static ID50: number
    private static ID51: number
    private static ID54: number
    private static ID55: number
    private static ID56: number
    private static ID58: number
    private static ID59: number
    private static ID61: number
    private static ID65: number
    private static ID66: number
    private static ID67: number
    private static ID68: number
    private static ID69: number
    private static ID70: number
    private static ID71: number
    private static ID72: number
    private static ID73: number
    private static ID74: number
    private static ID75: number
    private static ID77: number
    private static ID78: number
    private static ID79: number
    private static ID80: number
    private static ID81: number
    private static ID82: number
    private static ID83: number
    private static ID84: number
    private static ID85: number
    private static ID86: number
    private static ID87: number
    private static ID88: number
    private static ID89: number
    private static ID90: number
    private static ID91: number
    private static ID92: number
    private static ID93: number
    private static ID94: number
    private static ID95: number
    private static ID96: number
    private static ID97: number
    private static ID98: number
    private static ID99: number
    private static ID101: number
    private static ID102: number
    private static ID105: number
    private static ID106: number
    private static ID107: number
    private static ID108: number
    private static ID109: number
    private static ID110: number
    private static ID113: number
    private static ID114: number
    private static ID115: number
    private static ID116: number
    private static ID117: number
    private static ID118: number
    private static ID119: number
    private static ID120: number
    private static ID121: number
    private static ID122: number
    private static ID123: number
    private static ID125: number
    private static ID126: number
    private static ID127: number
    private static ID129: number
    private static ID130: number
    private static ID131: number
    private static ID132: number
    private static ID133: number
    private static ID134: number
    private static ID135: number
    private static ID136: number
    private static ID140: number
    private static ID141: number
    private static ID144: number
    private static ID145: number
    private static ID146: number
    private static ID148: number
    private static ID149: number
    private static ID150: number
    private static ID152: number
    private static ID153: number
    private static ID154: number
    private static ID155: number
    private static ID156: number
    private static ID157: number
    private static ID160: number
    private static ID161: number
    private static ID162: number
    private static ID163: number
    private static ID164: number
    private static ID167: number
    private static ID171: number
    private static ID172: number
    private static ID173: number
    private static ID175: number
    private static ID176: number
    private static ID177: number
    private static ID178: number
    private static ID179: number
    private static ID180: number
    private static ID181: number
    private static ID182: number
    private static ID183: number
    private static ID184: number
    private static ID185: number
    private static ID186: number
    private static ID187: number
    private static ID188: number
    private static ID191: number
    private static ID195: number
    private static ID196: number
    private static ID197: number
    private static ID199: number
    private static ID200: number
    private static ID201: number
    private static ID203: number
    private static ID204: number
    private static ID205: number
    private static ID206: number
    private static ID211: number
    private static ID212: number
    private static ID213: number
    private static ID214: number
    private static ID215: number
    private static ID216: number
    private static ID219: number
    private static ID220: number
    private static ID221: number
    private static ID222: number
    private static ID223: number
    private static ID224: number
    private static ID225: number
    private static ID227: number
    private static ID235: number
    private static ID239: number
    private static ID240: number
    private static ID241: number
    private static ID242: number
    private static ID243: number
    private static ID247: number
    private static ID251: number
    private static ID255: number
    private static ID256: number
    private static ID257: number
    private static ID258: number
    private static ID259: number
    private static ID260: number
    private static ID262: number
    private static ID266: number
    private static ID267: number
    private static ID268: number
    private static ID269: number
    private static ID270: number
    private static ID271: number
    private static ID272: number
    private static ID273: number
    private static ID274: number
    private static ID275: number
    private static ID276: number
    private static ID278: number
    private static ID279: number
    private static ID280: number
    private static ID281: number
    private static ID282: number
    private static ID283: number
    private static ID284: number
    private static ID285: number
    private static ID286: number
    private static ID287: number
    private static ID288: number
    private static ID290: number
    private static ID291: number
    private static ID292: number
    private static ID293: number
    private static ID294: number
    private static ID295: number
    private static ID298: number
    private static ID299: number
    private static ID300: number
    private static ID301: number
    private static ID302: number
    private static ID303: number
    private static ID304: number
    private static ID306: number
    private static ID307: number
    private static ID308: number
    private static ID309: number
    private static ID310: number
    private static ID311: number
    private static ID314: number
    private static ID315: number
    private static ID316: number
    private static ID317: number
    private static ID318: number
    private static ID319: number
    private static ID320: number
    private static ID321: number
    private static ID322: number
    private static ID326: number
    private static ID332: number
    private static ID333: number
    private static ID339: number
    private static ID340: number
    private static ID341: number
    private static ID343: number
    private static ID344: number
    private static ID347: number
    private static ID348: number
    private static ID349: number
    private static ID351: number
    private static ID352: number
    private static ID353: number
    private static ID355: number
    private static ID356: number
    private static ID357: number
    private static ID358: number
    private static ID359: number
    private static ID360: number
    private static ID361: number
    private static ID363: number
    private static ID364: number
    private static ID365: number
    private static ID367: number
    private static ID368: number
    private static ID369: number
    private static ID371: number
    private static ID372: number
    private static ID375: number
    private static ID376: number
    private static ID377: number
    private static ID378: number
    private static ID379: number
    private static ID380: number
    private static ID381: number
    private static ID382: number
    private static ID383: number
    private static ID384: number
    private static ID391: number
    private static ID392: number
    private static ID395: number
    private static ID402: number
    private static ID406: number
    private static ID407: number
    private static ID410: number
    private static ID417: number
    private static ID436: number
    private static ID440: number
    private static ID441: number
    private static ID448: number
    private static ID452: number
    private static ID453: number
    private static ID456: number
    private static ID472: number
    private static ID476: number
    private static ID477: number
    private static ID483: number
    private static ID488: number
    private static ID492: number
    private static ID495: number
    private static ID499: number
    private static ID508: number
    private static ID536: number
    private static ID585: number
}