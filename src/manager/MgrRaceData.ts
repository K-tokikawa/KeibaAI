import ClassPassageData from "../class/ClassPassageData";
import ClassRaceHorseData from "../class/ClassRaceHorseData";
import EntRaceHorseStudyData from "../entity/EntRaceHorseStudyData";
import EntBloodStudyData_Blood from "../entity/EntBloodStudyData_Blood";
import GetHorseIDBloodStudyData_Blood from "../querry/GetHorseIDBloodStudyData_Blood"
import PrmStudyData from "../param/PrmStudyData";
import ClassAchievementData from "../class/ClassAchievementData";
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
        strPassage: string[],
    }
    constructor(RaceData: EntRaceHorseStudyData[]) {
        this.m_RaceData = RaceData
        this.m_dic = {}
        this.m_insertDic = {strAchievement: [], data: [], strPassage: []}
    }

    public get dic(){return this.m_dic}
    public get insertDic() { return this.m_insertDic }

    async dicCreate(){
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
                    dic[HorseID] = {data: new ClassHorseData()}
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
            resolve(true)
        })
    }

    async CreateRacePredict(HorseID: number){
        return new Promise(async (resolve) =>{
            const dic = this.m_dic
            const horseData = dic[HorseID].data
            const entitys: {[num: number]: {PassageData: ClassPassageData, AchievementData: ClassAchievementData, RotationData: ClassRaceHorseData[], RaceID: number, Rank: number}} = horseData.HorseData
            for (const keynum of Object.keys(entitys)){
                const num = Number(keynum)
                const Passageentity = entitys[num].PassageData
                const Achievemententity = entitys[num].AchievementData
                const RaceHorseData = entitys[num].RotationData
                const RaceID = entitys[num].RaceID
                // Rotation
                let data = ''
                if (RaceHorseData.length > 0) {
                    for (const value of RaceHorseData){
                        if (data == ''){
                            data += `${HorseID},${RaceID}`
                        } else {
                            data += `,${value.GoalTime}`.replace('null', '')
                            data += `,${value.Venue},${value.HoldMonth},${value.Hold},${value.Day},${value.Range},${value.Ground},${value.GroundCondition},${value.Weather},${value.Pace},${value.Weight},${value.TrainerID},${value.HorseGender},${value.HorseWeight},${value.HorseNo},${value.HorseAge},${value.Remarks},${value.RaceRemarks},${value.Fluctuation},${`${value.SpurtTime}`.replace('null', '')},${value.JockeyID},${value.before}`
                        }
                    }
                    const empty = ',,,,,,,,,,,,,,,,,,,,,,'
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
                    let str = `${represent.GoalTime},${represent.Venue},${represent.Range},${represent.Weather},${represent.Ground},${represent.GroundCondition},${represent.Pace},${represent.HoldMonth},${represent.Hold},${represent.HorseNo},${represent.Day},${represent.Weight},${represent.TrainerID},${represent.HorseGender},${represent.HorseWeight},${represent.Fluctuation},${represent.JockeyID},${represent.HorseAge}`
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
                let str = `${value.GoalTime},${value.Venue},${value.Range},${value.Ground},${value.GroundCondition},${value.HoldMonth},${value.Hold},${value.Day},${value.Weather},${value.Pace},${value.HorseAge},${value.Weight},${value.TrainerID},${value.HorseGender},${value.HorseWeight},${value.HorseNo},${value.Fluctuation},${value.JockeyID}`
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
        const rows: {
            [number: number]: string[]
        } = {}
        rows[0] = []
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
                            data += `${value.GoalTime},${value.Direction},${value.Venue},${value.HoldMonth},${value.Hold},${value.Day},${value.Range},${value.Ground},${value.GroundCondition},${value.Weather},${value.Pace},${value.Weight},${value.TrainerID},${value.HorseGender},${value.HorseWeight},${value.HorseNo},${value.HorseAge},${value.Fluctuation},${value.JockeyID},${value.before}`
                        } else {
                            data += `,${value.GoalTime},${value.Venue},${value.HoldMonth},${value.Hold},${value.Day},${value.Range},${value.Ground},${value.GroundCondition},${value.Weather},${value.Pace},${value.Weight},${value.TrainerID},${value.HorseGender},${value.HorseWeight},${value.HorseNo},${value.HorseAge},${value.Remarks},${value.RaceRemarks},${value.Fluctuation},${value.SpurtTime},${value.JockeyID},${value.before}`
                        }
                    })
                    const empty = ',,,,,,,,,,,,,,,,,,,,,,'
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
                    rows[0].push(data)
                }
            })
        })
        return rows
    }

    public CreatePaceData(){
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
                let pace = ''
                const num = Number(strnum)
                const row = dic[HorseID][num]
                if (row.length > 0) {
                    row.forEach((value: ClassRaceHorseData) => {
                        if (pace == ''){
                            pace = `${value.RaceID},${value.HorseNo}`
                        } else {
                            pace += `,${value.Pace},${value.Passage1},${value.Passage2},${value.Passage3},${value.Passage4}`
                        }
                    })
                    const paceempty = ',,,,,'
                    if (row.length == 1){
                        pace = pace + paceempty + paceempty + paceempty + paceempty + paceempty + paceempty
                    }
                    if (row.length == 2){
                        pace = pace + paceempty + paceempty + paceempty + paceempty + paceempty
                    }
                    if (row.length == 3){
                        pace = pace + paceempty + paceempty + paceempty + paceempty
                    }
                    if (row.length == 4){
                        pace = pace + paceempty + paceempty + paceempty
                    }
                    if (row.length == 5){
                        pace = pace + paceempty + paceempty
                    }
                    if (row.length == 6){
                        pace = pace + paceempty
                    }
                    rows.push(pace)
                }
            })
        })
        return rows
    }
}

