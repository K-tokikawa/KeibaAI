import ClassAchievementData from "./ClassAchievementData"
import ClassPassageData from "./ClassPassageData"
import ClassRaceHorseData from "./ClassRaceHorseData"
export default class ClassHorseData{
    private m_JockeyData:number
    private m_BloodData: number
    private m_RaceID: number
    private m_Rank: number
    private m_BloodPredict: number | null
    private m_JockeyPredict: number | null
    private m_HorseData: {
        [num: number]: {
            PassageData: ClassPassageData, AchievementData: ClassAchievementData, RotationData: ClassRaceHorseData[],

        }}
    private m_Predict:{
        [num: number]: {
            AptitudePredict: number| null, AchievementPredict: number| null, RotationPredict: number| null
        }}
    constructor(JockeyData: number, BloodData: number, RaceID: number, Rank: number, BloodPredict: number | null, JockeyPredict: number | null) {
        this.m_JockeyData = JockeyData
        this.m_BloodData = BloodData
        this.m_RaceID = RaceID
        this.m_Rank = Rank
        this.m_BloodPredict = BloodPredict
        this.m_JockeyPredict = JockeyPredict
        this.m_HorseData = {}
        this.m_Predict = {}
    }
    public setHorseData(num: number, PassageData: ClassPassageData, AchievementData: ClassAchievementData, RotationData: ClassRaceHorseData[]){
        this.m_HorseData[num] = {
            PassageData: PassageData, AchievementData: AchievementData, RotationData: RotationData
        }
    }
    public setHorsePredict(num: number,AptitudePredict: number| null, AchievementPredict: number| null, RotationPredict: number| null){
        this.m_Predict[num] = {
            AptitudePredict: AptitudePredict, AchievementPredict: AchievementPredict, RotationPredict: RotationPredict
        }
    }
    public get JockeyData() { return this.m_JockeyData}
    public get BloodData() { return this.m_BloodData}
    public get RaceID() { return this.m_RaceID}
    public get Rank() { return this.m_Rank}
    public get BloodPredict() { return this.m_BloodPredict }
    public get JockeyPredict() { return this.m_JockeyPredict }
    public get HorseData() { return this.m_HorseData}
}