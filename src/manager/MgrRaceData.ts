import ClassPassageData from "../class/ClassPassageData";
import ClassRaceHorseData from "../class/ClassRaceHorseData";
import EntRaceHorseStudyData from "../entity/EntRaceHorseStudyData";
import EntBloodStudyData_Blood from "../entity/EntBloodStudyData_Blood";
import GetHorseIDBloodStudyData_Blood from "../querry/GetHorseIDBloodStudyData_Blood"
import PrmStudyData from "../param/PrmStudyData";
import ClassAchievementData from "../class/ClassAchievementData";
import { PythonShell } from "python-shell";
import ClassHorseData from "../class/ClassHorseData";
import simpleProgress from "../ProgressBar";

export default class MgrRaceData{
    private m_RaceData: EntRaceHorseStudyData[]
    private m_dic: {
        [HorseID: number]: {
            data: ClassHorseData
        }
    }
    private m_insertDic: {
        strAchievement: string[],
        data: string[],
        strPassage: string[]
    }
    constructor(RaceData: EntRaceHorseStudyData[]) {
        this.m_RaceData = RaceData
        this.m_dic = {}
        this.m_insertDic = {strAchievement: [], data: [], strPassage: []}

    }

    public get dic(){return this.m_dic}
    public get insertDic() { return this.m_insertDic }

    async dicCreate(valueblood: {[ID: number]: string}){
        return new Promise (async (resolve) => {
            const dic = this.m_dic
            console.log('start')
            const ProgressBar = simpleProgress()
            const progress = ProgressBar(this.m_RaceData.length, 20, 'Blood_Jockey')
            for(const row of this.m_RaceData) {
                progress(1)
                const data = new ClassRaceHorseData(
                    row,
                    0
                )
                const Rank = row.Rank
                const RaceID = row.RaceID
                const HorseID = row.HorseID
                const num = row.num
                const HorseNo = row.HorseNo
                // Jockey
                const dicHorse = dic[HorseID]
                if (dicHorse == undefined) {
                    // const JockeyData = `Jockey,0,${row.JockeyID},${row.HorseGender},${row.Venue},${row.Range},${row.Ground},${row.GroundCondition},${row.HorseNo},${row.Age},${row.HoldMonth},${row.Weather},${row.Popularity},${row.Weight},${row.Hold},${row.Day},${row.Round}`
                    // // Blood
                    // const blood = valueblood[HorseID]
                    // const BloodData = `blood,0,${row.Range},${row.Venue},${row.Ground},${row.GroundCondition},${row.HorseGender},${row.Weight},${row.Age},${blood}`
                    // const [Blood, Jockey] = await Promise.all([
                    //         Predict(BloodData, 'blood'),
                    //         Predict(JockeyData, 'jockey')
                    //     ])
                    dic[HorseID] = {data: new ClassHorseData()}
                    // dic[HorseID] = {data: new ClassHorseData(1, 1)}
                }
                const horseData = dic[HorseID].data
                const PassageData = new ClassPassageData(data)
                const AchievementData = new ClassAchievementData(data)
                horseData.setRaceIDnumPairs(RaceID, num, HorseNo)
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
            const predictprogress = ProgressBar(Object.keys(dic).length, 20, 'predict')
            let HorseIDs: number[] = []
            for (const keyHorseID of Object.keys(dic)){
                predictprogress(1)
                const HorseID = Number(keyHorseID)
                HorseIDs.push(HorseID)
                if (HorseIDs.length % 5 == 0){
                    await Promise.all([
                        this.CreateRacePredict(valueblood, HorseIDs[0]),
                        this.CreateRacePredict(valueblood, HorseIDs[1]),
                        this.CreateRacePredict(valueblood, HorseIDs[2]),
                        this.CreateRacePredict(valueblood, HorseIDs[3]),
                        this.CreateRacePredict(valueblood, HorseIDs[4]),
                    ])
                    HorseIDs = [] // 再度初期化
                }
            }
            // あまり
            for (const id of HorseIDs) {
                await this.CreateRacePredict(valueblood, id)
            }
            resolve(true)
        })
    }

    async CreateRacePredict(valueblood: {[ID: number]: string}, HorseID: number){
        return new Promise(async (resolve) =>{
            const dic = this.m_dic
            const horseData = dic[HorseID].data
            const blood = valueblood[HorseID]
            const entitys: {[num: number]: {PassageData: ClassPassageData, AchievementData: ClassAchievementData, RotationData: ClassRaceHorseData[], RaceID: number, Rank: number}} = horseData.HorseData
            for (const keynum of Object.keys(entitys)){
                const num = Number(keynum)
                const Passageentity = entitys[num].PassageData
                const Achievemententity = entitys[num].AchievementData
                const RaceHorseData = entitys[num].RotationData
                const RaceID = entitys[num].RaceID
                const Rank = entitys[num].Rank
                // Rotation
                let data = ''
                if (RaceHorseData.length > 0) {
                    let a = 0
                    for (const value of RaceHorseData){
                        a++
                        if (data == ''){
                            // data += `${HorseID},${RaceID}${value.Direction},${value.Venue},${value.HoldMonth},${value.Hold},${value.Day},${value.Range},${value.Ground},${value.GroundCondition},${value.Weather},${value.Weight},${value.TrainerID},${value.HorseGender},${value.HorseWeight},${value.HorseNo},${value.HorseAge},${value.Fluctuation},${value.JockeyID},${value.before}`
                            data += `${HorseID},${RaceID}`
                            // data += `HorseID bigint,RaceID bigint`
                        } else {
                            data += `,${value.GoalTime}`.replace('null', '')
                            data += `,${value.Venue},${value.HoldMonth},${value.Hold},${value.Day},${value.Range},${value.Ground},${value.GroundCondition},${value.Weather},${value.Weight},${value.TrainerID},${value.HorseGender},${value.HorseWeight},${value.HorseNo},${value.HorseAge},${value.Fluctuation},${value.JockeyID},${value.before}`
                            // data += `,GoalTime_${a} decomal(18, 0),Venue_${a} bigint, HoldMonth_${a} int,Hold_${a} int,Day_${a} int,Range_${a} int,Ground_${a} int,GroundCondition_${a} int,Weather_${a} int,Weight_${a} int,TrainerID_${a} int,HorseGender_${a} int,HorseWeight_${a} int,HorseNo_${a} int,HorseAge_${a} int,Fluctuation_${a} int,JockeyID_${a} int,before_${a}`
                        }
                    }
                    // const empty = ',None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None'
                    // const empty = ',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null'
                    const empty = ',,,,,,,,,,,,,,,,,,'
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
                    // data = 'rotation,0,' + data
                }
    
                // aptitude
                const represent = Passageentity.represent
                // let strPassage = `${HorseID},${RaceID}${represent.Venue},${represent.Range},${represent.Weather}.${represent.Ground},${represent.GroundCondition},${represent.HoldMonth},${represent.Hold},${represent.HorseNo},${represent.Day},${represent.Weight},${represent.TrainerID},${represent.HorseGender},${represent.HorseWeight},${represent.Fluctuation},${represent.JockeyID},${represent.HorseAge},`
                let strPassage = `${HorseID},${RaceID}`
                // strPassage += blood
                // let strPassage = `HorseID bigint,RaceID bigint,`
                // strPassage += `FID,MID,FFID,FMID,MFID,MMID,FFFID,FFMID,FMFID,FMMID,MFFID,MFMID,MMFID,MMMID,FFFFID,FFFMID,FFFFFID,FFFFMID,FFFMFID,FFFMMID,FFFFFFID,FFFFFMID,FFFFMFID,FFFFMMID,FFFMFFID,FFFMFMID,FFFMMFID,FFFMMMID,FFMFID,FFMMID,FFMFFID,FFMFMID,FFMMFID,FFMMMID,FFMFFFID,FFMFFMID,FFMFMFID,FFMFMMID,FFMMFFID,FFMMFMID,FFMMMFID,FFMMMMID,FMFFID,FMFMID,FMFFFID,FMFFMID,FMFMFID,FMFMMID,FMFFFFID,FMFFFMID,FMFFMFID,FMFFMMID,FMFMFFID,FMFMFMID,FMFMMFID,FMFMMMID,FMMFID,FMMMID,FMMFFID,FMMFMID,FMMMFID,FMMMMID,FMMFFFID,FMMFFMID,FMMFMFID,FMMFMMID,FMMMFFID,FMMMFMID,FMMMMFID,FMMMMMID,MFFFID,MFFMID,MFFFFID,MFFFMID,MFFMFID,MFFMMID,MFFFFFID,MFFFFMID,MFFFMFID,MFFFMMID,MFFMFFID,MFFMFMID,MFFMMFID,MFFMMMID,MFMFID,MFMMID,MFMFFID,MFMFMID,MFMMFID,MFMMMID,MFMFFFID,MFMFFMID,MFMFMFID,MFMFMMID,MFMMFFID,MFMMFMID,MFMMMFID,MFMMMMID,MMFFID,MMFMID,MMFFFID,MMFFMID,MMFMFID,MMFMMID,MMFFFFID,MMFFFMID,MMFFMFID,MMFFMMID,MMFMFFID,MMFMFMID,MMFMMFID,MMFMMMID,MMMFID,MMMMID,MMMFFID,MMMFMID,MMMMFID,MMMMMID,MMMFFFID,MMMFFMID,MMMFMFID,MMMFMMID,MMMMFFID,MMMMFMID,MMMMMFID,MMMMMMID,FID1,FID2,FID3,FID4,FID5,FID6,FID7,FID8,FID9,FID10,FID11,FID12,FID13,FID14,FID15,FID16,FID17,FID18,FID19,FID20,FID21,FID22,FID23,FID24,FID25,FID26,FID27,FID28,FID29,FID30,FID31,FID32,FID33,FID34,FID35,FID36,FID37,FID38,FID39,FID40,FID41,FID42,FID43,FID44,FID45,FID46,FID47,FID48,FID49,FID50,FID51,FID52,FID53,FID54,FID55,FID56,FID57,FID58,FID59,FID60,FID61,FID62,FID63,FID64,FID65,FID66,FID67,FID68,FID69,FID70,FID71,FID72,FID73,FID74,FID75,FID76,FID77,FID78,FID79,FID80,FID81,FID82,FID83,FID84,FID85,FID86,FID87,MFSID1,MFSID2,MFSID3,MFSID4,MFSID5,MFSID6,MFSID7,MFSID8,MFSID9,MFSID10,MFSID11,MFSID12,MFSID13,MFSID14,MFSID15,MFSID16,MFSID17,MFSID18,MFSID19,MFSID20,MFSID21,MFSID22,MFSID23,MFSID24,MFSID25,MFSID26,MFSID27,MFSID28,MFSID29,MFSID30,MFSID31,MFSID32,MFSID33,MFSID34,MFSID35,MFSID36,MFSID37,MFSID38,MFSID39,MFSID40,MFSID41,MFSID42,MFSID43,MFSID44,MFSID45,MFSID46,MFSID47,MFSID48,MFSID49,MFSID50,MFSID51,MFSID52,MFSID53,MFSID54,MFSID55,MFSID56,MFSID57,MFSID58,MFSID59,MFSID60,MFSID61,MFSID62,MFSID63,MFSID64,MFSID65,MFSID66,MFSID67,MFSID68,MFSID69,MFSID70,MFSID71,MFSID72,MFSID73,MFSID74,MFSID75,MFSID76,MFSID77,MFSID78,MFSID79,MFSID80,MFSID81,MFSID82,MFSID83,MFSID84,MFSID85,MFSID86,MFSID87,MMFSID1,MMFSID2,MMFSID3,MMFSID4,MMFSID5,MMFSID6,MMFSID7,MMFSID8,MMFSID9,MMFSID10,MMFSID11,MMFSID12,MMFSID13,MMFSID14,MMFSID15,MMFSID16,MMFSID17,MMFSID18,MMFSID19,MMFSID20,MMFSID21,MMFSID22,MMFSID23,MMFSID24,MMFSID25,MMFSID26,MMFSID27,MMFSID28,MMFSID29,MMFSID30,MMFSID31,MMFSID32,MMFSID33,MMFSID34,MMFSID35,MMFSID36,MMFSID37,MMFSID38,MMFSID39,MMFSID40,MMFSID41,MMFSID42,MMFSID43,MMFSID44,MMFSID45,MMFSID46,MMFSID47,MMFSID48,MMFSID49,MMFSID50,MMFSID51,MMFSID52,MMFSID53,MMFSID54,MMFSID55,MMFSID56,MMFSID57,MMFSID58,MMFSID59,MMFSID60,MMFSID61,MMFSID62,MMFSID63,MMFSID64,MMFSID65,MMFSID66,MMFSID67,MMFSID68,MMFSID69,MMFSID70,MMFSID71,MMFSID72,MMFSID73,MMFSID74,MMFSID75,MMFSID76,MMFSID77,MMFSID78,MMFSID79,MMFSID80,MMFSID81,MMFSID82,MMFSID83,MMFSID84,MMFSID85,MMFSID86,MMFSID87`
                for (const row of this.m_RaceData) {
                    // Passage
                    if (row.HorseID == HorseID) {
                        if (row.HoldDay.getTime() < Passageentity.represent.HoldDay.getTime()){
                            Passageentity.addPassage1(row.Passage1)
                            Passageentity.addPassage2(row.Passage2)
                            Passageentity.addPassage3(row.Passage3)
                            Passageentity.addPassage4(row.Passage4)
                        }
                    }
                    if (row.HorseID == HorseID) {
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
                // strPassage += `,AveragePassage1,AveragePassage2,AveragePassage3,AveragePassage4`
                strPassage += `,${Passageentity.AveragePassage1},${Passageentity.AveragePassage2},${Passageentity.AveragePassage3},${Passageentity.AveragePassage4}`
                // strPassage = 'aptitude,0,' + strPassage
                // Acievement
    
                const value = entitys[num].AchievementData.represent
                const achievements = entitys[num].AchievementData.achievements
                // let strAchievement = `${HorseID},${RaceID},${value.Venue},${value.Range},${value.Ground},${value.HorseAge},${value.GroundCondition},${value.HoldMonth},${value.Hold},${value.Day},${value.Weather},${value.Weight},${value.TrainerID},${value.HorseGender},${value.HorseWeight},${value.HorseNo},${value.Fluctuation},${value.JockeyID}`
                let strAchievement = `${HorseID},${RaceID}`
                // let strAchievement = `HorseID,RaceID`
                for (const key of Object.keys(achievements)){
                    const id = Number(key)
                    const achievement = achievements[id]
                    // strAchievement += `,GoalTime_${id} decimal(18,0),Weight_${id} bigint,before_${id} bigint`
                    if (achievement == null || achievement.GoalTime == null) {
                        // const empty = `,None,None,None`
                        // const empty = `,null,null,null`
                        const empty = `,,,`
                        strAchievement += empty
                    } else {
                        strAchievement += `,${achievement.GoalTime},${achievement.Weight},${achievement.before}`
                    }
                }
                // strAchievement = 'achievement,0,' + strAchievement
                this.m_insertDic.strAchievement.push(strAchievement)
                this.m_insertDic.data.push(data)
                this.m_insertDic.strPassage.push(strPassage)
                // const [Achievement, Rotation, Aptitude] = await Promise.all([
                //     Predict(strAchievement),
                //     Predict(data),
                //     Predict(strPassage)
                // ])
                // const [Achievement, Rotation, Aptitude] = [HorseID, HorseID * 10, HorseID*100]
                // horseData.setHorsePredict(num, Aptitude, Achievement, Rotation, RaceID, Rank)
            }
            resolve(true)
        })
    }
    async CreateAptitudeData(){
        const rows: string[] = []
        const dic: {
            [HorseID: number]: {
                [num: number]: ClassPassageData
            }
        } = {}
        this.m_RaceData.forEach((row: EntRaceHorseStudyData) => {
            const data = new ClassRaceHorseData(
                row,
                0
            )
            const HorseID = row.HorseID
            const num = row.num
            if (dic[HorseID] == undefined) {
                dic[HorseID] = []
            }
            
            const PassageData = new ClassPassageData(data)
            dic[HorseID][num] = PassageData
            
        })

        let p = Promise.resolve()
        const HorseID = this.m_RaceData.map(x => x.HorseID)
        const param = new PrmStudyData(0, 0, HorseID)
        const sql = new GetHorseIDBloodStudyData_Blood(param)
        const valueblood = await sql.Execsql() as EntBloodStudyData_Blood[]
        Object.keys(dic).forEach(async (keyHorseID) => {
            p = p.then(async() => {
                const HorseID = Number(keyHorseID)
                const x: EntBloodStudyData_Blood = valueblood.find(x =>x.HorseID == HorseID) as EntBloodStudyData_Blood
                const blood = `,${x.FID},${x.MID},${x.FFID},${x.FMID},${x.MFID},${x.MMID},${x.FFFID},${x.FFMID},${x.FMFID},${x.FMMID},${x.MFFID},${x.MFMID},${x.MMFID},${x.MMMID},${x.FFFFID},${x.FFFMID},${x.FFFFFID},${x.FFFFMID},${x.FFFMFID},${x.FFFMMID},${x.FFFFFFID},${x.FFFFFMID},${x.FFFFMFID},${x.FFFFMMID},${x.FFFMFFID},${x.FFFMFMID},${x.FFFMMFID},${x.FFFMMMID},${x.FFMFID},${x.FFMMID},${x.FFMFFID},${x.FFMFMID},${x.FFMMFID},${x.FFMMMID},${x.FFMFFFID},${x.FFMFFMID},${x.FFMFMFID},${x.FFMFMMID},${x.FFMMFFID},${x.FFMMFMID},${x.FFMMMFID},${x.FFMMMMID},${x.FMFFID},${x.FMFMID},${x.FMFFFID},${x.FMFFMID},${x.FMFMFID},${x.FMFMMID},${x.FMFFFFID},${x.FMFFFMID},${x.FMFFMFID},${x.FMFFMMID},${x.FMFMFFID},${x.FMFMFMID},${x.FMFMMFID},${x.FMFMMMID},${x.FMMFID},${x.FMMMID},${x.FMMFFID},${x.FMMFMID},${x.FMMMFID},${x.FMMMMID},${x.FMMFFFID},${x.FMMFFMID},${x.FMMFMFID},${x.FMMFMMID},${x.FMMMFFID},${x.FMMMFMID},${x.FMMMMFID},${x.FMMMMMID},${x.MFFFID},${x.MFFMID},${x.MFFFFID},${x.MFFFMID},${x.MFFMFID},${x.MFFMMID},${x.MFFFFFID},${x.MFFFFMID},${x.MFFFMFID},${x.MFFFMMID},${x.MFFMFFID},${x.MFFMFMID},${x.MFFMMFID},${x.MFFMMMID},${x.MFMFID},${x.MFMMID},${x.MFMFFID},${x.MFMFMID},${x.MFMMFID},${x.MFMMMID},${x.MFMFFFID},${x.MFMFFMID},${x.MFMFMFID},${x.MFMFMMID},${x.MFMMFFID},${x.MFMMFMID},${x.MFMMMFID},${x.MFMMMMID},${x.MMFFID},${x.MMFMID},${x.MMFFFID},${x.MMFFMID},${x.MMFMFID},${x.MMFMMID},${x.MMFFFFID},${x.MMFFFMID},${x.MMFFMFID},${x.MMFFMMID},${x.MMFMFFID},${x.MMFMFMID},${x.MMFMMFID},${x.MMFMMMID},${x.MMMFID},${x.MMMMID},${x.MMMFFID},${x.MMMFMID},${x.MMMMFID},${x.MMMMMID},${x.MMMFFFID},${x.MMMFFMID},${x.MMMFMFID},${x.MMMFMMID},${x.MMMMFFID},${x.MMMMFMID},${x.MMMMMFID},${x.MMMMMMID},${x.FID1},${x.FID2},${x.FID3},${x.FID4},${x.FID5},${x.FID6},${x.FID7},${x.FID8},${x.FID9},${x.FID10},${x.FID11},${x.FID12},${x.FID13},${x.FID14},${x.FID15},${x.FID16},${x.FID17},${x.FID18},${x.FID19},${x.FID20},${x.FID21},${x.FID22},${x.FID23},${x.FID24},${x.FID25},${x.FID26},${x.FID27},${x.FID28},${x.FID29},${x.FID30},${x.FID31},${x.FID32},${x.FID33},${x.FID34},${x.FID35},${x.FID36},${x.FID37},${x.FID38},${x.FID39},${x.FID40},${x.FID41},${x.FID42},${x.FID43},${x.FID44},${x.FID45},${x.FID46},${x.FID47},${x.FID48},${x.FID49},${x.FID50},${x.FID51},${x.FID52},${x.FID53},${x.FID54},${x.FID55},${x.FID56},${x.FID57},${x.FID58},${x.FID59},${x.FID60},${x.FID61},${x.FID62},${x.FID63},${x.FID64},${x.FID65},${x.FID66},${x.FID67},${x.FID68},${x.FID69},${x.FID70},${x.FID71},${x.FID72},${x.FID73},${x.FID74},${x.FID75},${x.FID76},${x.FID77},${x.FID78},${x.FID79},${x.FID80},${x.FID81},${x.FID82},${x.FID83},${x.FID84},${x.FID85},${x.FID86},${x.FID87},${x.MFSID1},${x.MFSID2},${x.MFSID3},${x.MFSID4},${x.MFSID5},${x.MFSID6},${x.MFSID7},${x.MFSID8},${x.MFSID9},${x.MFSID10},${x.MFSID11},${x.MFSID12},${x.MFSID13},${x.MFSID14},${x.MFSID15},${x.MFSID16},${x.MFSID17},${x.MFSID18},${x.MFSID19},${x.MFSID20},${x.MFSID21},${x.MFSID22},${x.MFSID23},${x.MFSID24},${x.MFSID25},${x.MFSID26},${x.MFSID27},${x.MFSID28},${x.MFSID29},${x.MFSID30},${x.MFSID31},${x.MFSID32},${x.MFSID33},${x.MFSID34},${x.MFSID35},${x.MFSID36},${x.MFSID37},${x.MFSID38},${x.MFSID39},${x.MFSID40},${x.MFSID41},${x.MFSID42},${x.MFSID43},${x.MFSID44},${x.MFSID45},${x.MFSID46},${x.MFSID47},${x.MFSID48},${x.MFSID49},${x.MFSID50},${x.MFSID51},${x.MFSID52},${x.MFSID53},${x.MFSID54},${x.MFSID55},${x.MFSID56},${x.MFSID57},${x.MFSID58},${x.MFSID59},${x.MFSID60},${x.MFSID61},${x.MFSID62},${x.MFSID63},${x.MFSID64},${x.MFSID65},${x.MFSID66},${x.MFSID67},${x.MFSID68},${x.MFSID69},${x.MFSID70},${x.MFSID71},${x.MFSID72},${x.MFSID73},${x.MFSID74},${x.MFSID75},${x.MFSID76},${x.MFSID77},${x.MFSID78},${x.MFSID79},${x.MFSID80},${x.MFSID81},${x.MFSID82},${x.MFSID83},${x.MFSID84},${x.MFSID85},${x.MFSID86},${x.MFSID87},${x.MMFSID1},${x.MMFSID2},${x.MMFSID3},${x.MMFSID4},${x.MMFSID5},${x.MMFSID6},${x.MMFSID7},${x.MMFSID8},${x.MMFSID9},${x.MMFSID10},${x.MMFSID11},${x.MMFSID12},${x.MMFSID13},${x.MMFSID14},${x.MMFSID15},${x.MMFSID16},${x.MMFSID17},${x.MMFSID18},${x.MMFSID19},${x.MMFSID20},${x.MMFSID21},${x.MMFSID22},${x.MMFSID23},${x.MMFSID24},${x.MMFSID25},${x.MMFSID26},${x.MMFSID27},${x.MMFSID28},${x.MMFSID29},${x.MMFSID30},${x.MMFSID31},${x.MMFSID32},${x.MMFSID33},${x.MMFSID34},${x.MMFSID35},${x.MMFSID36},${x.MMFSID37},${x.MMFSID38},${x.MMFSID39},${x.MMFSID40},${x.MMFSID41},${x.MMFSID42},${x.MMFSID43},${x.MMFSID44},${x.MMFSID45},${x.MMFSID46},${x.MMFSID47},${x.MMFSID48},${x.MMFSID49},${x.MMFSID50},${x.MMFSID51},${x.MMFSID52},${x.MMFSID53},${x.MMFSID54},${x.MMFSID55},${x.MMFSID56},${x.MMFSID57},${x.MMFSID58},${x.MMFSID59},${x.MMFSID60},${x.MMFSID61},${x.MMFSID62},${x.MMFSID63},${x.MMFSID64},${x.MMFSID65},${x.MMFSID66},${x.MMFSID67},${x.MMFSID68},${x.MMFSID69},${x.MMFSID70},${x.MMFSID71},${x.MMFSID72},${x.MMFSID73},${x.MMFSID74},${x.MMFSID75},${x.MMFSID76},${x.MMFSID77},${x.MMFSID78},${x.MMFSID79},${x.MMFSID80},${x.MMFSID81},${x.MMFSID82},${x.MMFSID83},${x.MMFSID84},${x.MMFSID85},${x.MMFSID86},${x.MMFSID87}`
                const entitys: {[num: number]: ClassPassageData} = dic[HorseID]
                Object.keys(entitys).forEach(keynum => {
                    const num = Number(keynum)
                    const entity = entitys[num]
                    const represent = entity.represent
                    let str = `${represent.GoalTime},${represent.Venue},${represent.Range},${represent.Weather}.${represent.Ground},${represent.GroundCondition},${represent.HoldMonth},${represent.Hold},${represent.HorseNo},${represent.Day},${represent.Weight},${represent.TrainerID},${represent.HorseGender},${represent.HorseWeight},${represent.Fluctuation},${represent.JockeyID},${represent.HorseAge}`
                    str += blood
                    this.m_RaceData.forEach((row: EntRaceHorseStudyData) => {
                        if (row.HorseID == HorseID) {
                            if (row.HoldDay.getTime() < entity.represent.HoldDay.getTime()){
                                entity.addPassage1(row.Passage1)
                                entity.addPassage2(row.Passage2)
                                entity.addPassage3(row.Passage3)
                                entity.addPassage4(row.Passage4)
                            }
                        }
                    })
                    str += `,${entity.AveragePassage1},${entity.AveragePassage2},${entity.AveragePassage3},${entity.AveragePassage4}`
                    rows.push(str)
                })
            })
        })
        await p
        return rows
    }

    CreateAchievementData(){
        const dic: {
            [HorseID: number]: {
                [num: number]: ClassAchievementData
            }
        } = {}
        this.m_RaceData.forEach((row: EntRaceHorseStudyData) => {
            const data = new ClassRaceHorseData(
                row,
                0
                )
                const HorseID = row.HorseID
                const num = row.num
            if (dic[HorseID] == undefined) {
                dic[HorseID] = []
            }
            const AchievementData = new ClassAchievementData(data)
            dic[HorseID][num] = AchievementData
    
        })
        const rows: string[] = []
        Object.keys(dic).forEach(keyHorseID => {
            const HorseID = Number(keyHorseID)
            const entitys: {[num: number]: ClassAchievementData} = dic[HorseID]
            Object.keys(entitys).forEach(keynum => {
                const num = Number(keynum)
                const entity = entitys[num]
                this.m_RaceData.forEach((row: EntRaceHorseStudyData) => {
                    if (row.HorseID == HorseID) {
                        if (row.HoldDay.getTime() < entity.represent.HoldDay.getTime()){
                            const before = row.before == null ? 0 :(row.HoldDay.getTime() - entity.represent.HoldDay.getTime()) / 86400000
                            const data = new ClassRaceHorseData(
                                row,
                                before
                            )
                            const AchievementData = entity.getIDAchievementData(data.ID)
                            if (AchievementData == null) {
                                entity.updateAchievement(data)
                            } else if(AchievementData.GoalTime > data.GoalTime) {
                                entity.updateAchievement(data)
                            } else {
                                // なにもなし
                            }
                        }
                    }
                })
            })
            const empty = `,,,`
            Object.keys(entitys).forEach(key => {
                const num = Number(key)
                const value = entitys[num].represent
                const achievements = entitys[num].achievements
                let str = `${value.GoalTime},${value.Venue},${value.Range},${value.Ground},${value.HorseAge},${value.GroundCondition},${value.HoldMonth},${value.Hold},${value.Day},${value.Weather},${value.Weight},${value.TrainerID},${value.HorseGender},${value.HorseWeight},${value.HorseNo},${value.Fluctuation},${value.JockeyID}`
                Object.keys(achievements).forEach(key => {
                    const id = Number(key)
                    const achievement = achievements[id]
                    if (achievement == null) {
                        str = str + empty
                    } else {
                        str = str + `,${achievement.GoalTime},${achievement.Weight},${achievement.before}`
                    }
                })
                rows.push(str)
            })
        })
        return rows
    }

    CreateRotationData(){
        const dic: {
            [horseID: number]:{[num: number]: ClassRaceHorseData[]}
        } = { }
        const rows: string[] = []
        this.m_RaceData.forEach((row: EntRaceHorseStudyData) => {
            const before = row.before == null ? 0 :(row.before.getTime() - row.HoldDay.getTime()) / 86400000
            const data = new ClassRaceHorseData(
                row,
                before
            )
            const num = row.num
            const HorseID = row.HorseID
            if (dic[HorseID] == undefined) {
                dic[HorseID] = []
            }
            if (dic[HorseID][num] == undefined){
                dic[HorseID][num] = []
            }
            dic[HorseID][num].push(data)
    
            if (num - 1 > 0) {
                dic[HorseID][num - 1].push(data)
            }
            if (num - 2 > 0) {
                dic[HorseID][num - 2].push(data)
            }
            if (num - 3 > 0) {
                dic[HorseID][num - 3].push(data)
            }
            if (num - 4 > 0) {
                dic[HorseID][num - 4].push(data)
            }
            if (num - 5 > 0) {
                dic[HorseID][num - 5].push(data)
            }
        })
        Object.keys(dic).forEach(strkey => {
            const HorseID = Number(strkey)
            Object.keys(dic[HorseID]).forEach(strnum =>{
                let data = ''
                const num = Number(strnum)
                const row = dic[HorseID][num]
                if (row.length > 1) {
                    row.forEach((value: ClassRaceHorseData) => {
                        if (data == ''){
                            data += `${value.GoalTime},${value.Direction},${value.Venue},${value.HoldMonth},${value.Hold},${value.Day},${value.Range},${value.Ground},${value.GroundCondition},${value.Weather},${value.Weight},${value.TrainerID},${value.HorseGender},${value.HorseWeight},${value.HorseNo},${value.HorseAge},${value.Fluctuation},${value.JockeyID},${value.before}`
                        } else {
                            data += `,${value.GoalTime},${value.Venue},${value.HoldMonth},${value.Hold},${value.Day},${value.Range},${value.Ground},${value.GroundCondition},${value.Weather},${value.Weight},${value.TrainerID},${value.HorseGender},${value.HorseWeight},${value.HorseNo},${value.HorseAge},${value.Fluctuation},${value.JockeyID},${value.before}`
                        }
                    })
                    const empty = ',,,,,,,,,,,,,,,,,,'
                    if (row.length == 2){
                        data = data + empty + empty + empty + empty
                    }
                    if (row.length == 3){
                        data = data + empty + empty + empty
                    }
                    if (row.length == 4){
                        data = data + empty + empty
                    }
                    if (row.length == 5){
                        data = data + empty
                    }
                    rows.push(data)
                }
            })
        })
        return rows
    }
}
function Predict(data: string, name=''): Promise<number | null>{
    return new Promise((resolve, reject) => {
        const shell = new PythonShell('./src/python/predict.py')
        const datarow = data.split(',')
        const datas = datarow.map(x => {return x == 'null' ? 'None': x})
        shell.send(`${datas}`)
        let result: number| null = null
        shell.on('message', async function(message){
            result = Number(message.replace('[', '').replace(']', ''))
            resolve(result)
        })
    })

}
