import ClassAchievementData from "./ClassAchievementData"
import ClassPassageData from "./ClassPassageData"
import ClassRaceHorseData from "./ClassRaceHorseData"
export default class ClassHorseData{
    private m_JockeyData:number
    private m_BloodData: number
    private m_BloodPredict: number | null
    private m_JockeyPredict: number | null
    private m_RaceIDNumPairs: {
        [RaceID: number]: {
            num: number,
            HorseNo: number
        }
    } = {}
    private m_HorseData: {
        [num: number]: {
            PassageData: ClassPassageData, AchievementData: ClassAchievementData, RotationData: ClassRaceHorseData[], RaceID: number, Rank: number
        }}
    private m_Predict:{
        [num: number]: {
            AptitudePredict: number| null, AchievementPredict: number| null, RotationPredict: number| null, RaceID: number, Rank: number
        }}
    constructor(JockeyData: number, BloodData: number, BloodPredict: number | null, JockeyPredict: number | null, RaceID: number, num: number, HorseNo: number) {
        this.m_JockeyData = JockeyData
        this.m_BloodData = BloodData
        this.m_BloodPredict = BloodPredict
        this.m_JockeyPredict = JockeyPredict
        this.m_RaceIDNumPairs[RaceID] = {num: num, HorseNo: HorseNo}
        this.m_HorseData = {}
        this.m_Predict = {}
    }
    public getNum(RaceID: number) { return this.m_RaceIDNumPairs[RaceID].num }
    public getHorseNo(RaceID: number) { return this.m_RaceIDNumPairs[RaceID].HorseNo }
    public setHorseData(num: number, PassageData: ClassPassageData, AchievementData: ClassAchievementData, RotationData: ClassRaceHorseData[], RaceID: number, Rank: number){
        this.m_HorseData[num] = {
            PassageData: PassageData, AchievementData: AchievementData, RotationData: RotationData, RaceID: RaceID, Rank: Rank
        }
    }
    public setHorsePredict(num: number,AptitudePredict: number| null, AchievementPredict: number| null, RotationPredict: number| null, RaceID: number, Rank: number){
        this.m_Predict[num] = {
            AptitudePredict: AptitudePredict, AchievementPredict: AchievementPredict, RotationPredict: RotationPredict, RaceID: RaceID, Rank: Rank
        }
    }
    public get JockeyData() { return this.m_JockeyData}
    public get BloodData() { return this.m_BloodData}
    public get BloodPredict() { return this.m_BloodPredict }
    public get JockeyPredict() { return this.m_JockeyPredict }
    public get HorseData() { return this.m_HorseData}
    public get PredictData() { return this.m_Predict}
}