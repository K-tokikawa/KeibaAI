import ClassPassageData from "../class/ClassPassageData";
import ClassRaceHorseData from "../class/ClassRaceHorseData";
import EntRaceHorseStudyData from "../entity/EntRaceHorseStudyData";
import EntBloodStudyData_Blood from "../entity/EntBloodStudyData";
import GetHorseIDBloodStudyData_Blood from "../querry/GetHorseIDBloodStudyData_Blood"
import PrmStudyData from "../param/PrmStudyData";
import ClassAchievementData from "../class/ClassAchievementData";
import ClassHorseData from "../class/ClassHorseData";
import simpleProgress from "../ProgressBar";
import EntTrainingData from "../entity/EntTrainingData";

export default class MgrRaceData{
    private m_RaceData: EntRaceHorseStudyData[]
    private m_TariningData: EntTrainingData[]
    private m_dic: {
        [HorseID: number]: {
            data: ClassHorseData
        }
    }
    private m_TrainigDic: {
        [HorseID: number]: {
            [RaceID: number]: {
                data: EntTrainingData
            }
        }
    }
    private m_insertDic: {
        strAchievement: string[],
        data: string[],
        strPassage: string[],
    }
    constructor(
        RaceData: EntRaceHorseStudyData[],
        TrainingData: EntTrainingData[]
    ) {
        this.m_RaceData = RaceData
        this.m_TariningData = TrainingData
        this.m_dic = {}
        this.m_TrainigDic = {}
        this.m_insertDic = {strAchievement: [], data: [], strPassage: []}
    }

    public get dic(){return this.m_dic}
    public get insertDic() { return this.m_insertDic }

    async dicCreate(){
        this.CreateTrainingDic()
        const dic = this.m_dic
        for(const row of this.m_RaceData) {
            const data = new ClassRaceHorseData(
                row,
                0
            )
            const Rank = row.Rank
            const RaceID = row.RaceID
            const HorseID = row.HorseID
            const num = row.num
            const HorseNo = row.HorseNo

            const dicHorse = dic[HorseID]
            if (dicHorse == undefined) {
                dic[HorseID] = {data: new ClassHorseData()}
            }
            const horseData = dic[HorseID].data
            horseData.setRaceIDnumPairs(RaceID, num, HorseNo)

            const PassageData = new ClassPassageData(data)
            const AchievementData = new ClassAchievementData(data)
            horseData.setHorseData(num, PassageData, AchievementData, [], RaceID, Rank)
            horseData.HorseData[num].RotationData.push(data)

            if (num - 1 > 0) {
                horseData.HorseData[num - 1].RotationData.push(data)
            }
            if (num - 2 > 0) {
                horseData.HorseData[num - 2].RotationData.push(data)
            }
            if (num - 3 > 0) {
                horseData.HorseData[num - 3].RotationData.push(data)
            }
            if (num - 4 > 0) {
                horseData.HorseData[num - 4].RotationData.push(data)
            }
            if (num - 5 > 0) {
                horseData.HorseData[num - 5].RotationData.push(data)
            }
        }

        let HorseIDs: number[] = []
        for (const keyHorseID of Object.keys(dic)){

            const HorseID = Number(keyHorseID)
            HorseIDs.push(HorseID)
            if (HorseIDs.length % 5 == 0){
                await Promise.all([
                    this.CreateRacePredict(HorseIDs[0]),
                    this.CreateRacePredict(HorseIDs[1]),
                    this.CreateRacePredict(HorseIDs[2]),
                    this.CreateRacePredict(HorseIDs[3]),
                    this.CreateRacePredict(HorseIDs[4]),
                ])
                HorseIDs = [] // 再度初期化
            }
        }
        // あまり
        for (const id of HorseIDs) {
            await this.CreateRacePredict(id)
        }
    }
    CreateTrainingDic(){
        for(var row of this.m_TariningData){
            var HorseID = row.HorseID
            var RaceID = row.RaceID
            if (this.m_TrainigDic[HorseID] == undefined) {
                this.m_TrainigDic[HorseID] = {
                    [RaceID]:{
                        data: row
                    }
                }
            } else {
                this.m_TrainigDic[HorseID][RaceID] = {
                    data: row
                }
            }
        }
    }
    async CreateRacePredict(HorseID: number){
        const dic = this.m_dic
        const horseData = dic[HorseID].data
        const entitys: {[num: number]: {PassageData: ClassPassageData, AchievementData: ClassAchievementData, RotationData: ClassRaceHorseData[], RaceID: number, Rank: number}} = horseData.HorseData
        for (const keynum of Object.keys(entitys)){
            const num = Number(keynum)
            const Passageentity = entitys[num].PassageData
            const Achievemententity = entitys[num].AchievementData
            const RaceHorseData = entitys[num].RotationData
            const RaceID = entitys[num].RaceID
            const TrainingData = this.m_TrainigDic[HorseID][RaceID].data
            // Rotation
            let data = ''
            if (RaceHorseData.length > 0) {
                for (const value of RaceHorseData){
                    if (data == ''){
                        data += `${HorseID},${RaceID}`
                    } else {
                        data += `,${value.GoalTime}`.replace('null', '')
                        data += `,${value.Venue},${value.HoldMonth},${value.Hold},${value.Day},${value.Range},${value.Ground},${value.GroundCondition},${value.Weather},${value.Weight},${value.TrainerID},${value.HorseGender},${value.HorseWeight},${value.HorseNo},${value.HorseAge},${value.Remarks},${value.RaceRemarks},${value.Fluctuation},${`${value.SpurtTime}`.replace('null', '')},${value.JockeyID},${value.interval},${TrainingData.Cource},${TrainingData.Condition},${TrainingData.RapTime1},${TrainingData.RapTime2},${TrainingData.RapTime3},${TrainingData.RapTime4},${TrainingData.RapTime5},${TrainingData.TrainingLoad}`
                    }
                }
                const empty = ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,'

                if (RaceHorseData.length == 1){
                    data = data + empty + empty + empty + empty + empty
                }
                if (RaceHorseData.length == 2){
                    data = data + empty + empty + empty + empty
                }
                if (RaceHorseData.length == 3){
                    data = data + empty + empty + empty
                }
                if (RaceHorseData.length == 4){
                    data = data + empty + empty
                }
                if (RaceHorseData.length == 5){
                    data = data + empty
                }
            }

            // aptitude
            let strPassage = `${HorseID},${RaceID}`
            for (const row of this.m_RaceData) {
                // Passage
                if (row.HorseID == HorseID) {
                    // 予測したいレースより前の日付の情報を保持していく
                    if (row.HoldDay.getTime() < Passageentity.represent.HoldDay.getTime()){
                        Passageentity.addPassage1(row.Passage1)
                        Passageentity.addPassage2(row.Passage2)
                        Passageentity.addPassage3(row.Passage3)
                        Passageentity.addPassage4(row.Passage4)
                    }
                }

                if (row.HorseID == HorseID) {
                    // 予測したいレースより前の日付の情報を保持していく
                    if (row.HoldDay.getTime() < Achievemententity.represent.HoldDay.getTime()){
                        const before = row.before == null ? 0 :(row.HoldDay.getTime() - Achievemententity.represent.HoldDay.getTime()) / 86400000
                        const data = new ClassRaceHorseData(
                            row,
                            before
                        )
                        const AchievementData = Achievemententity.getIDAchievementData(data.ID)
                        if (AchievementData == null) {
                            Achievemententity.updateAchievement(data)
                        } else if(AchievementData.GoalTime > data.GoalTime) {
                            Achievemententity.updateAchievement(data)
                        } else {
                            // なにもなし
                        }
                    }
                }
            }
            strPassage += `,${Passageentity.AveragePassage1},${Passageentity.AveragePassage2},${Passageentity.AveragePassage3},${Passageentity.AveragePassage4}`

            // Acievement
            const achievements = entitys[num].AchievementData.achievements
            let strAchievement = `${HorseID},${RaceID}`
            for (const key of Object.keys(achievements)){
                const id = Number(key)
                const achievement = achievements[id]
                if (achievement == null || achievement.GoalTime == null) {
                    const empty = `,,,`
                    strAchievement += empty
                } else {
                    strAchievement += `,${achievement.GoalTime},${achievement.Weight},${achievement.before}`
                }
            }
            this.m_insertDic.strAchievement.push(strAchievement)
            this.m_insertDic.data.push(data)
            this.m_insertDic.strPassage.push(strPassage)
        }
    }
}

