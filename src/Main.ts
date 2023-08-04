import GetBloodStudyData from "./querry/GetBloodStudyData"
import PrmStudyData from "./param/PrmStudyData"
import FileUtil from "./FileUtil"
import EntBloodStudyData from "./entity/EntBloodStudyData"
import EntStudyDataCount from "./entity/EntStudyDataCount"
import GetBloodStudyDataCount from "./querry/GetBloodStudyDataCount"
import GetJockeyStudyDataCount from "./querry/GetJockeyStudyDataCount"
import GetJockeyStudyData from "./querry/GetJockeyStudyData"
import EntJockeyStudyData from "./entity/EntJockeyStudyData"
import GetBloodStudyData_Blood from "./querry/GetBloodStudyData_Blood"
import EntBloodStudyData_Blood from "./entity/EntBloodStudyData_Blood"
import GetBloodStudyDataCount_Blood from "./querry/GetBloodStudyDataCount_Blood"
import GetRaceHorseStudyDataMinMax from "./querry/GetRaceHorseStudyDataMinMax"
import EntStudyDataMinMax from "./entity/EntStudyDataMinMax"
import GetRaceHorseStudyData from "./querry/GetRaceHorseStudyData"
import EntRaceHorseStudyData from "./entity/EntRaceHorseStudyData"
import GetRaceInfomationMinMax from "./querry/GetRaceInfomationDataMinMax"
import GetRaceInfomationData from "./querry/GetRaceInfomationData"
import EntRaceInfomationData from "./entity/EntRaceInfomationData"
import GetRaceHorseInfomationData from "./querry/GetRaceHorseInfomationData"
import EntRaceHorseInfomationData from "./entity/EntRaceHorseInfomationData"
import MgrRaceData from "./manager/MgrRaceData"
import GetHorseIDBloodStudyData_Blood from "./querry/GetHorseIDBloodStudyData_Blood"
import GetRaceHorsePredictData from "./querry/GetRaceHorsePredictData"
import BulkInsert from "./querry/BulkInsert"
import GetHorseIDsCount from "./querry/GetHorseIDsCount"
import GetHorseIDs from "./querry/GetHorseIDs"
import EntHorseIDsData from "./entity/EntHorseIDsData"
import GetAptitudeData from "./querry/GetAptitudeData"
import EntAptitudeData from "./entity/EntAptitudeData"
import GetAchievementData from "./querry/GetAchievementData"
import EntAchievementData from "./entity/EntAchievementData"
import GetRotationData from "./querry/GetRotationData"
import EntRotationData from "./entity/EntRotationData"
import { PythonShell } from "python-shell"
import simpleProgress, { multiProgress } from "./ProgressBar"
import DeletePredictRecord from "./querry/DeletePredictRecord"
import GetPaceData from "./querry/GetPaceData"
import EntPaceData from "./entity/EntPaceData"

const blood_prt = 1
const Jockey = 2
const blood = 3
const Rotation = 4
const Achievement = 5
const Aptitude = 6
const predict = 7
const totalling = 8
const pacerecord = 9
const pace = 10
main(predict)

async function main(mode: number) {
    const shell = new PythonShell('./src/python/whilepredict.py')
    let ID = 0
    ID++
    const valuenum = 100
    let Count: EntStudyDataCount[] = []
    let minmax: EntStudyDataMinMax[] = []
    let sql: GetBloodStudyDataCount | GetJockeyStudyDataCount | GetBloodStudyDataCount_Blood | GetRaceHorseStudyDataMinMax | GetRaceInfomationMinMax
    let loop = 1
    let min = 0
    let max = 0
    switch (mode) {
        case 1:
            sql = new GetBloodStudyDataCount()
            Count = await sql.Execsql() as EntStudyDataCount[]
            break
        case 2:
            sql = new GetJockeyStudyDataCount()
            Count = await sql.Execsql() as EntStudyDataCount[]
            break
        case 3:
            sql = new GetBloodStudyDataCount_Blood()
            Count = await sql.Execsql() as EntStudyDataCount[]
            console.log(Count)
            break
        case 4:
        case 5:
        case 6:
        case 9:
            sql = new GetRaceHorseStudyDataMinMax()
            minmax = await sql.Execsql() as EntStudyDataMinMax[]
            break
        case 7:
        case 10:
            sql = new GetRaceInfomationMinMax()
            minmax = await sql.Execsql() as EntStudyDataMinMax[]
            break
        case 8:
            sql = new GetHorseIDsCount()
            Count = await sql.Execsql() as EntStudyDataCount[]
            break
    }
    const Datanum = Count[0]?.Count
    switch (mode){
        case 1:
        case 2:
        case 3:
        case 8:
        if (Datanum >= valuenum) {
                loop = Math.ceil(Datanum / valuenum)
            }
            break
        case 4:
        case 5:
        case 6:
        case 7:
        case 9:
        case 10:
            min = minmax[0].min
            max = minmax[0].max
            const Horsecount = max - min + 1
            loop = Math.ceil(Horsecount / valuenum)
            break

    }
    let count = 0
    do {
        let bolstart = false
        bolstart = count >= 80
        if (bolstart) {

            let Start = count == 0 ? 1 : + valuenum * count + 1
            let Finish = valuenum * (count + 1)
            if (count + 1 == loop) {
                Finish = Datanum
            }
            if (mode == 4 || mode == 5 || mode == 6 || mode == 9 || mode == 10) {
                Start = count == 0 ? min : min + valuenum * count
                Finish = Start + valuenum - 1
            }
            let param = new PrmStudyData(Start, Finish)
            if (mode == 9) {
                param = new PrmStudyData(Start, Finish,null,[],[],false)
            }

            let rows: string[] = []
            let sql: GetBloodStudyData | GetJockeyStudyData | GetBloodStudyData_Blood | GetRaceHorseStudyData | GetRaceInfomationData | GetHorseIDs | GetPaceData
            let value: EntBloodStudyData[] | EntJockeyStudyData[] | EntBloodStudyData_Blood[] | EntRaceHorseStudyData[] | EntRaceInfomationData[] | EntHorseIDsData[] | EntPaceData[]
            let filePath = ""
            switch (mode){
                case 1:
                    sql = new GetBloodStudyData(param)
                    value = await sql.Execsql() as EntBloodStudyData[]
                    console.log(`${count}`)
                    rows = value.map(x => { return `${x.time},${x.Range},${x.Venue},${x.Ground},${x.GroundCondition},${x.Weight},${x.Age},${x.F_ID_1},${x.F_ID_2},${x.F_ID_3},${x.F_ID_4},${x.F_ID_5},${x.F_ID_6},${x.F_ID_7},${x.F_ID_8},${x.F_ID_9},${x.F_ID_10},${x.F_ID_11},${x.F_ID_12},${x.F_ID_13},${x.F_ID_14},${x.F_ID_15},${x.F_ID_16},${x.F_ID_17},${x.F_ID_18},${x.F_ID_19},${x.F_ID_20},${x.F_ID_21},${x.F_ID_22},${x.F_ID_23},${x.F_ID_24},${x.F_ID_25},${x.F_ID_26},${x.F_ID_27},${x.F_ID_28},${x.F_ID_29},${x.F_ID_30},${x.F_ID_31},${x.F_ID_32},${x.F_ID_33},${x.F_ID_34},${x.F_ID_35},${x.F_ID_36},${x.F_ID_37},${x.F_ID_38},${x.F_ID_39},${x.F_ID_40},${x.F_ID_41},${x.F_ID_42},${x.F_ID_43},${x.F_ID_44},${x.F_ID_45},${x.F_ID_46},${x.F_ID_47},${x.F_ID_48},${x.F_ID_49},${x.F_ID_50},${x.F_ID_51},${x.F_ID_52},${x.F_ID_53},${x.F_ID_54},${x.F_ID_55},${x.F_ID_56},${x.F_ID_57},${x.F_ID_58},${x.F_ID_59},${x.F_ID_60},${x.F_ID_61},${x.F_ID_62},${x.F_ID_63},${x.F_ID_64},${x.F_ID_65},${x.F_ID_66},${x.F_ID_67},${x.F_ID_68},${x.F_ID_69},${x.F_ID_70},${x.F_ID_71},${x.F_ID_72},${x.F_ID_73},${x.F_ID_74},${x.F_ID_75},${x.F_ID_76},${x.F_ID_77},${x.F_ID_78},${x.F_ID_79},${x.F_ID_80},${x.F_ID_81},${x.F_ID_82},${x.F_ID_83},${x.F_ID_84},${x.F_ID_85},${x.F_ID_86},${x.F_ID_87},${x.M_FS_ID_1},${x.M_FS_ID_2},${x.M_FS_ID_3},${x.M_FS_ID_4},${x.M_FS_ID_5},${x.M_FS_ID_6},${x.M_FS_ID_7},${x.M_FS_ID_8},${x.M_FS_ID_9},${x.M_FS_ID_10},${x.M_FS_ID_11},${x.M_FS_ID_12},${x.M_FS_ID_13},${x.M_FS_ID_14},${x.M_FS_ID_15},${x.M_FS_ID_16},${x.M_FS_ID_17},${x.M_FS_ID_18},${x.M_FS_ID_19},${x.M_FS_ID_20},${x.M_FS_ID_21},${x.M_FS_ID_22},${x.M_FS_ID_23},${x.M_FS_ID_24},${x.M_FS_ID_25},${x.M_FS_ID_26},${x.M_FS_ID_27},${x.M_FS_ID_28},${x.M_FS_ID_29},${x.M_FS_ID_30},${x.M_FS_ID_31},${x.M_FS_ID_32},${x.M_FS_ID_33},${x.M_FS_ID_34},${x.M_FS_ID_35},${x.M_FS_ID_36},${x.M_FS_ID_37},${x.M_FS_ID_38},${x.M_FS_ID_39},${x.M_FS_ID_40},${x.M_FS_ID_41},${x.M_FS_ID_42},${x.M_FS_ID_43},${x.M_FS_ID_44},${x.M_FS_ID_45},${x.M_FS_ID_46},${x.M_FS_ID_47},${x.M_FS_ID_48},${x.M_FS_ID_49},${x.M_FS_ID_50},${x.M_FS_ID_51},${x.M_FS_ID_52},${x.M_FS_ID_53},${x.M_FS_ID_54},${x.M_FS_ID_55},${x.M_FS_ID_56},${x.M_FS_ID_57},${x.M_FS_ID_58},${x.M_FS_ID_59},${x.M_FS_ID_60},${x.M_FS_ID_61},${x.M_FS_ID_62},${x.M_FS_ID_63},${x.M_FS_ID_64},${x.M_FS_ID_65},${x.M_FS_ID_66},${x.M_FS_ID_67},${x.M_FS_ID_68},${x.M_FS_ID_69},${x.M_FS_ID_70},${x.M_FS_ID_71},${x.M_FS_ID_72},${x.M_FS_ID_73},${x.M_FS_ID_74},${x.M_FS_ID_75},${x.M_FS_ID_76},${x.M_FS_ID_77},${x.M_FS_ID_78},${x.M_FS_ID_79},${x.M_FS_ID_80},${x.M_FS_ID_81},${x.M_FS_ID_82},${x.M_FS_ID_83},${x.M_FS_ID_84},${x.M_FS_ID_85},${x.M_FS_ID_86},${x.M_FS_ID_87},${x.MM_FS_ID_1},${x.MM_FS_ID_2},${x.MM_FS_ID_3},${x.MM_FS_ID_4},${x.MM_FS_ID_5},${x.MM_FS_ID_6},${x.MM_FS_ID_7},${x.MM_FS_ID_8},${x.MM_FS_ID_9},${x.MM_FS_ID_10},${x.MM_FS_ID_11},${x.MM_FS_ID_12},${x.MM_FS_ID_13},${x.MM_FS_ID_14},${x.MM_FS_ID_15},${x.MM_FS_ID_16},${x.MM_FS_ID_17},${x.MM_FS_ID_18},${x.MM_FS_ID_19},${x.MM_FS_ID_20},${x.MM_FS_ID_21},${x.MM_FS_ID_22},${x.MM_FS_ID_23},${x.MM_FS_ID_24},${x.MM_FS_ID_25},${x.MM_FS_ID_26},${x.MM_FS_ID_27},${x.MM_FS_ID_28},${x.MM_FS_ID_29},${x.MM_FS_ID_30},${x.MM_FS_ID_31},${x.MM_FS_ID_32},${x.MM_FS_ID_33},${x.MM_FS_ID_34},${x.MM_FS_ID_35},${x.MM_FS_ID_36},${x.MM_FS_ID_37},${x.MM_FS_ID_38},${x.MM_FS_ID_39},${x.MM_FS_ID_40},${x.MM_FS_ID_41},${x.MM_FS_ID_42},${x.MM_FS_ID_43},${x.MM_FS_ID_44},${x.MM_FS_ID_45},${x.MM_FS_ID_46},${x.MM_FS_ID_47},${x.MM_FS_ID_48},${x.MM_FS_ID_49},${x.MM_FS_ID_50},${x.MM_FS_ID_51},${x.MM_FS_ID_52},${x.MM_FS_ID_53},${x.MM_FS_ID_54},${x.MM_FS_ID_55},${x.MM_FS_ID_56},${x.MM_FS_ID_57},${x.MM_FS_ID_58},${x.MM_FS_ID_59},${x.MM_FS_ID_60},${x.MM_FS_ID_61},${x.MM_FS_ID_62},${x.MM_FS_ID_63},${x.MM_FS_ID_64},${x.MM_FS_ID_65},${x.MM_FS_ID_66},${x.MM_FS_ID_67},${x.MM_FS_ID_68},${x.MM_FS_ID_69},${x.MM_FS_ID_70},${x.MM_FS_ID_71},${x.MM_FS_ID_72},${x.MM_FS_ID_73},${x.MM_FS_ID_74},${x.MM_FS_ID_75},${x.MM_FS_ID_76},${x.MM_FS_ID_77},${x.MM_FS_ID_78},${x.MM_FS_ID_79},${x.MM_FS_ID_80},${x.MM_FS_ID_81},${x.MM_FS_ID_82},${x.MM_FS_ID_83},${x.MM_FS_ID_84},${x.MM_FS_ID_85},${x.MM_FS_ID_86},${x.MM_FS_ID_87}` })
                    filePath = `./data/blood/${Start}.csv`
                    break
                case 2:
                    sql = new GetJockeyStudyData(param)
                    value = await sql.Execsql() as EntJockeyStudyData[]
                    console.log(`${count}`)
                    rows = value.map(x => { return `${x.GoalTime},${x.JockeyID},${x.HorseGender},${x.Venue},${x.Range},${x.Ground},${x.GroundCondition},${x.pace},${x.HorseNo},${x.Age},${x.HoldMonth},${x.Weather},${x.Weight},${x.Hold},${x.Day},${x.Round}`})
                    filePath = `./data/Jockey/${Start}.csv`
                    break
                case 3:
                    sql = new GetBloodStudyData_Blood(param)
                    console.log(`${count}`)
                    console.log(Start)
                    value = await sql.Execsql() as EntBloodStudyData_Blood[]
                    rows = value.map(x => { return `${x.time},${x.Range},${x.Venue},${x.Ground},${x.GroundCondition},${x.pace},${x.HorseGender},${x.Weight},${x.Age},${x.FID},${x.MID},${x.FFID},${x.FMID},${x.MFID},${x.MMID},${x.FFFID},${x.FFMID},${x.FMFID},${x.FMMID},${x.MFFID},${x.MFMID},${x.MMFID},${x.MMMID},${x.FFFFID},${x.FFFMID},${x.FFFFFID},${x.FFFFMID},${x.FFFMFID},${x.FFFMMID},${x.FFFFFFID},${x.FFFFFMID},${x.FFFFMFID},${x.FFFFMMID},${x.FFFMFFID},${x.FFFMFMID},${x.FFFMMFID},${x.FFFMMMID},${x.FFMFID},${x.FFMMID},${x.FFMFFID},${x.FFMFMID},${x.FFMMFID},${x.FFMMMID},${x.FFMFFFID},${x.FFMFFMID},${x.FFMFMFID},${x.FFMFMMID},${x.FFMMFFID},${x.FFMMFMID},${x.FFMMMFID},${x.FFMMMMID},${x.FMFFID},${x.FMFMID},${x.FMFFFID},${x.FMFFMID},${x.FMFMFID},${x.FMFMMID},${x.FMFFFFID},${x.FMFFFMID},${x.FMFFMFID},${x.FMFFMMID},${x.FMFMFFID},${x.FMFMFMID},${x.FMFMMFID},${x.FMFMMMID},${x.FMMFID},${x.FMMMID},${x.FMMFFID},${x.FMMFMID},${x.FMMMFID},${x.FMMMMID},${x.FMMFFFID},${x.FMMFFMID},${x.FMMFMFID},${x.FMMFMMID},${x.FMMMFFID},${x.FMMMFMID},${x.FMMMMFID},${x.FMMMMMID},${x.MFFFID},${x.MFFMID},${x.MFFFFID},${x.MFFFMID},${x.MFFMFID},${x.MFFMMID},${x.MFFFFFID},${x.MFFFFMID},${x.MFFFMFID},${x.MFFFMMID},${x.MFFMFFID},${x.MFFMFMID},${x.MFFMMFID},${x.MFFMMMID},${x.MFMFID},${x.MFMMID},${x.MFMFFID},${x.MFMFMID},${x.MFMMFID},${x.MFMMMID},${x.MFMFFFID},${x.MFMFFMID},${x.MFMFMFID},${x.MFMFMMID},${x.MFMMFFID},${x.MFMMFMID},${x.MFMMMFID},${x.MFMMMMID},${x.MMFFID},${x.MMFMID},${x.MMFFFID},${x.MMFFMID},${x.MMFMFID},${x.MMFMMID},${x.MMFFFFID},${x.MMFFFMID},${x.MMFFMFID},${x.MMFFMMID},${x.MMFMFFID},${x.MMFMFMID},${x.MMFMMFID},${x.MMFMMMID},${x.MMMFID},${x.MMMMID},${x.MMMFFID},${x.MMMFMID},${x.MMMMFID},${x.MMMMMID},${x.MMMFFFID},${x.MMMFFMID},${x.MMMFMFID},${x.MMMFMMID},${x.MMMMFFID},${x.MMMMFMID},${x.MMMMMFID},${x.MMMMMMID},${x.FID1},${x.FID2},${x.FID3},${x.FID4},${x.FID5},${x.FID6},${x.FID7},${x.FID8},${x.FID9},${x.FID10},${x.FID11},${x.FID12},${x.FID13},${x.FID14},${x.FID15},${x.FID16},${x.FID17},${x.FID18},${x.FID19},${x.FID20},${x.FID21},${x.FID22},${x.FID23},${x.FID24},${x.FID25},${x.FID26},${x.FID27},${x.FID28},${x.FID29},${x.FID30},${x.FID31},${x.FID32},${x.FID33},${x.FID34},${x.FID35},${x.FID36},${x.FID37},${x.FID38},${x.FID39},${x.FID40},${x.FID41},${x.FID42},${x.FID43},${x.FID44},${x.FID45},${x.FID46},${x.FID47},${x.FID48},${x.FID49},${x.FID50},${x.FID51},${x.FID52},${x.FID53},${x.FID54},${x.FID55},${x.FID56},${x.FID57},${x.FID58},${x.FID59},${x.FID60},${x.FID61},${x.FID62},${x.FID63},${x.FID64},${x.FID65},${x.FID66},${x.FID67},${x.FID68},${x.FID69},${x.FID70},${x.FID71},${x.FID72},${x.FID73},${x.FID74},${x.FID75},${x.FID76},${x.FID77},${x.FID78},${x.FID79},${x.FID80},${x.FID81},${x.FID82},${x.FID83},${x.FID84},${x.FID85},${x.FID86},${x.FID87},${x.MFSID1},${x.MFSID2},${x.MFSID3},${x.MFSID4},${x.MFSID5},${x.MFSID6},${x.MFSID7},${x.MFSID8},${x.MFSID9},${x.MFSID10},${x.MFSID11},${x.MFSID12},${x.MFSID13},${x.MFSID14},${x.MFSID15},${x.MFSID16},${x.MFSID17},${x.MFSID18},${x.MFSID19},${x.MFSID20},${x.MFSID21},${x.MFSID22},${x.MFSID23},${x.MFSID24},${x.MFSID25},${x.MFSID26},${x.MFSID27},${x.MFSID28},${x.MFSID29},${x.MFSID30},${x.MFSID31},${x.MFSID32},${x.MFSID33},${x.MFSID34},${x.MFSID35},${x.MFSID36},${x.MFSID37},${x.MFSID38},${x.MFSID39},${x.MFSID40},${x.MFSID41},${x.MFSID42},${x.MFSID43},${x.MFSID44},${x.MFSID45},${x.MFSID46},${x.MFSID47},${x.MFSID48},${x.MFSID49},${x.MFSID50},${x.MFSID51},${x.MFSID52},${x.MFSID53},${x.MFSID54},${x.MFSID55},${x.MFSID56},${x.MFSID57},${x.MFSID58},${x.MFSID59},${x.MFSID60},${x.MFSID61},${x.MFSID62},${x.MFSID63},${x.MFSID64},${x.MFSID65},${x.MFSID66},${x.MFSID67},${x.MFSID68},${x.MFSID69},${x.MFSID70},${x.MFSID71},${x.MFSID72},${x.MFSID73},${x.MFSID74},${x.MFSID75},${x.MFSID76},${x.MFSID77},${x.MFSID78},${x.MFSID79},${x.MFSID80},${x.MFSID81},${x.MFSID82},${x.MFSID83},${x.MFSID84},${x.MFSID85},${x.MFSID86},${x.MFSID87},${x.MMFSID1},${x.MMFSID2},${x.MMFSID3},${x.MMFSID4},${x.MMFSID5},${x.MMFSID6},${x.MMFSID7},${x.MMFSID8},${x.MMFSID9},${x.MMFSID10},${x.MMFSID11},${x.MMFSID12},${x.MMFSID13},${x.MMFSID14},${x.MMFSID15},${x.MMFSID16},${x.MMFSID17},${x.MMFSID18},${x.MMFSID19},${x.MMFSID20},${x.MMFSID21},${x.MMFSID22},${x.MMFSID23},${x.MMFSID24},${x.MMFSID25},${x.MMFSID26},${x.MMFSID27},${x.MMFSID28},${x.MMFSID29},${x.MMFSID30},${x.MMFSID31},${x.MMFSID32},${x.MMFSID33},${x.MMFSID34},${x.MMFSID35},${x.MMFSID36},${x.MMFSID37},${x.MMFSID38},${x.MMFSID39},${x.MMFSID40},${x.MMFSID41},${x.MMFSID42},${x.MMFSID43},${x.MMFSID44},${x.MMFSID45},${x.MMFSID46},${x.MMFSID47},${x.MMFSID48},${x.MMFSID49},${x.MMFSID50},${x.MMFSID51},${x.MMFSID52},${x.MMFSID53},${x.MMFSID54},${x.MMFSID55},${x.MMFSID56},${x.MMFSID57},${x.MMFSID58},${x.MMFSID59},${x.MMFSID60},${x.MMFSID61},${x.MMFSID62},${x.MMFSID63},${x.MMFSID64},${x.MMFSID65},${x.MMFSID66},${x.MMFSID67},${x.MMFSID68},${x.MMFSID69},${x.MMFSID70},${x.MMFSID71},${x.MMFSID72},${x.MMFSID73},${x.MMFSID74},${x.MMFSID75},${x.MMFSID76},${x.MMFSID77},${x.MMFSID78},${x.MMFSID79},${x.MMFSID80},${x.MMFSID81},${x.MMFSID82},${x.MMFSID83},${x.MMFSID84},${x.MMFSID85},${x.MMFSID86},${x.MMFSID87}`})
                    filePath = `./data/blood/${Start}.csv`
                    break
                case 4:
                case 5:
                case 6:
                case 9:
                    sql = new GetRaceHorseStudyData(param)
                    value = await sql.Execsql() as EntRaceHorseStudyData[]
                    const mgr = new MgrRaceData(value)
                    switch (mode){
                        case 4:
                            const data = mgr.CreateRotationData()
                            rows = data[0]
                            filePath = `./data/rotation/${Start}.csv`
                            break
                        case 5:
                            rows = mgr.CreateAchievementData()
                            filePath = `./data/achievement/${Start}.csv`
                            break
                        case 6:
                            rows = await mgr.CreateAptitudeData()
                            filePath = `./data/aptitude/${Start}.csv`
                            break
                        case 9:
                            const createdata = mgr.CreatePaceData()
                            const Pace = new BulkInsert(createdata, 'PaceTable')
                            await Pace.BulkInsert('PaceTable')
                            filePath = `./data/pace/${Start}.csv`
                            break

                    }
                    
                    break
                case 7:
                    sql = new GetRaceInfomationData(param)
                    console.log(count)
                    value = await sql.Execsql() as EntRaceInfomationData[]
                    rows = await CreateRacePredictData(value, shell)
                    filePath = `./data/predict/${Start}.csv`
                    break
                case 8:
                    sql = new GetHorseIDs(param)
                    console.log(count)
                    value = await sql.Execsql() as EntHorseIDsData[]
                    await CreateTotallingData(value)
                    break
                case 10:
                    sql = new GetPaceData(param)
                    value = await sql.Execsql() as EntPaceData[]
                    rows = CreatePaceData(value)
                    filePath = `./data/pace/${Start}.csv`
                    break
            }
            await FileUtil.ContinueOutputFile(filePath, rows)
        }
        count++
    } while(count != loop)
}
function CreatePaceData(value: EntPaceData[]) {
    const dic:{
        [RaceID: number]:{
            [HorseNo: number]: EntPaceData | null
        }
    } = {}
    for(const data of value){
        const RaceID = data.RaceID
        if (dic[RaceID] == undefined) {
            dic[RaceID] = {}
            for (let i = 1; i <= 24; i++) {
                dic[RaceID][i] = null
            }
        }
        dic[RaceID][data.HorseNo] = data
    }
    const rows: string[] = []
    for(const strID of Object.keys(dic)){
        const RaceID = Number(strID)
        let row = ''
        for (const strNo of (Object.keys(dic[RaceID]))){
            const HorseNo = Number(strNo)
            const data = dic[RaceID][HorseNo]
            if (data != null) {
                if (HorseNo == 1) {
                    row = `${data.pace},${data.Venue},${data.HoldMonth},${data.Hold},${data.Day},${data.Range},${data.Ground},${data.GroundCondition},${data.Weather},${data.HorseAge},${data.HorseGender},${data.HorseWeight},${data.Fluctuation},${data.Weight},${data.JockeyID},${data.Pace_1},${data.Passage1_1},${data.Passage2_1},${data.Passage3_1},${data.Passage4_1},${data.Pace_2},${data.Passage1_2},${data.Passage2_2},${data.Passage3_2},${data.Passage4_2},${data.Pace_3},${data.Passage1_3},${data.Passage2_3},${data.Passage3_3},${data.Passage4_3},${data.Pace_4},${data.Passage1_4},${data.Passage2_4},${data.Passage3_4},${data.Passage4_4},${data.Pace_5},${data.Passage1_5},${data.Passage2_5},${data.Passage3_5},${data.Passage4_5}`
                }
                else {
                    row += `,${data.HorseAge},${data.HorseGender},${data.HorseWeight},${data.Fluctuation},${data.Weight},${data.JockeyID},${data.Pace_1},${data.Passage1_1},${data.Passage2_1},${data.Passage3_1},${data.Passage4_1},${data.Pace_2},${data.Passage1_2},${data.Passage2_2},${data.Passage3_2},${data.Passage4_2},${data.Pace_3},${data.Passage1_3},${data.Passage2_3},${data.Passage3_3},${data.Passage4_3},${data.Pace_4},${data.Passage1_4},${data.Passage2_4},${data.Passage3_4},${data.Passage4_4},${data.Pace_5},${data.Passage1_5},${data.Passage2_5},${data.Passage3_5},${data.Passage4_5}`
                }
            } else {
                row += `,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,`
            }
        }
        rows.push(row)
    }
    return rows
}
async function CreateTotallingData(value: EntHorseIDsData[]){
    const HorseIDs = value.map(x => x.Horse)

    const RaceDataparam = new PrmStudyData(0, 0, HorseIDs)
    const RaceDatapsql = new GetRaceHorsePredictData(RaceDataparam)
    const RaceDatas = await RaceDatapsql.Execsql() as EntRaceHorseStudyData[]

    const mgr = new MgrRaceData(RaceDatas)
    await mgr.dicCreate()
    const dic = mgr.insertDic

    const param = new PrmStudyData(0, 0, HorseIDs)
    const deletesql = new DeletePredictRecord(param)
    await deletesql.Execsql()
    const Achievement = new BulkInsert(dic.strAchievement, 'AchievementTable')
    await Achievement.BulkInsert('AchievementTable')
    const Aptitude = new BulkInsert(dic.strPassage, 'AptitudeTable')
    await Aptitude.BulkInsert('AptitudeTable')
    const Rotation = new BulkInsert(dic.data, 'RotationTable')
    await Rotation.BulkInsert('RotationTable')

}


async function CreateRacePredictData(value: EntRaceInfomationData[], shell: PythonShell) {
    const ProgressBar = simpleProgress()
    const rows: string[] = []
    const dicRace: {
        [RaceID: number]: {
            Venue: number,
            Direction: number,
            Range: number,
            Ground: number,
            GroundCondition: number,
            Weather: number,
            Hold: number,
            Day: number,
            HoldMonth: number,
            Round: number,
            Pace: number
        }
    } = {}

    const dicpredict: {
        [RaceID: number]: {
            info: string,
            Horses: {
                [HorseNo: number]: 
                {
                    horseinfo: string,
                    rank: number
                }
            }
        }
    } = {}

    const initprogress = ProgressBar(Object.keys(dicRace).length, 20, 'init')
    value.map(x => {
        initprogress(1)
        dicRace[x.ID] = {
            Venue: x.Venue,
            Direction: x.Direction,
            Range: x.Range,
            Ground: x.Ground,
            GroundCondition: x.GroundCondition,
            Weather: x.Weather,
            Hold: x.Hold,
            Day: x.Day,
            HoldMonth: x.HoldMonth,
            Round: x.Round,
            Pace: x.pace
        }
    })
    const RaceIDs = value.map(x => {return x.ID})
    const param = new PrmStudyData(0,0, RaceIDs)
    const HorseIDssql = new GetRaceHorseInfomationData(param)
    const HorseIDsvalue = await HorseIDssql.Execsql() as EntRaceHorseInfomationData[]
    const dicHorse: {
        [RaceID: number]: {
            [HorseID: number]: {
                Jockey: number,
                Rank: number,
                HorseNo: number
                HorseAge: number,
                HorseGender: number,
                HorseWeight: number,
                Weight: number,
                TrainerID: number,
                Fluctuation: number,
                Pace: number,
                Popularity: number,
                RaceRemarks: number,
                Remarks: number,
                SpurtTime: number
            }
        }
    } = {}
    const horseprogress = ProgressBar(Object.keys(dicRace).length, 20, 'horse')
    for (const data of HorseIDsvalue) {
        horseprogress(1)
        if (dicHorse[data.RaceID] == undefined) {
            dicHorse[data.RaceID] = {}
        }
        dicHorse[data.RaceID][data.HorseID] = {
            Jockey: data.JockeyID,
            Rank : data.Rank,
            HorseNo : data.HorseNo,
            HorseAge: data.HorseAge,
            HorseGender: data.HorseGender,
            HorseWeight: data.HorseWeight,
            Weight: data.Weight,
            TrainerID: data.TrainerID,
            Fluctuation: data.Fluctuation,
            Pace: data.pace,
            Popularity: data.Popularity,
            RaceRemarks: data.RaceRemarks,
            Remarks: data.Remarks,
            SpurtTime: data.SpurtTime,
        }
    }
    const HorseIDs = Array.from(new Set(HorseIDsvalue.map(x => {return x.HorseID})))

    const bloodparam = new PrmStudyData(0,0, HorseIDs)
    const blood = new GetHorseIDBloodStudyData_Blood(bloodparam)
    const bloodvalue = await blood.Execsql() as EntBloodStudyData_Blood[]
    const blooddata: {[ID: number]: string} = {}
    bloodvalue.forEach(x=> {
        blooddata[x.HorseID] = `${x.FID},${x.MID},${x.FFID},${x.FMID},${x.MFID},${x.MMID},${x.FFFID},${x.FFMID},${x.FMFID},${x.FMMID},${x.MFFID},${x.MFMID},${x.MMFID},${x.MMMID},${x.FFFFID},${x.FFFMID},${x.FFFFFID},${x.FFFFMID},${x.FFFMFID},${x.FFFMMID},${x.FFFFFFID},${x.FFFFFMID},${x.FFFFMFID},${x.FFFFMMID},${x.FFFMFFID},${x.FFFMFMID},${x.FFFMMFID},${x.FFFMMMID},${x.FFMFID},${x.FFMMID},${x.FFMFFID},${x.FFMFMID},${x.FFMMFID},${x.FFMMMID},${x.FFMFFFID},${x.FFMFFMID},${x.FFMFMFID},${x.FFMFMMID},${x.FFMMFFID},${x.FFMMFMID},${x.FFMMMFID},${x.FFMMMMID},${x.FMFFID},${x.FMFMID},${x.FMFFFID},${x.FMFFMID},${x.FMFMFID},${x.FMFMMID},${x.FMFFFFID},${x.FMFFFMID},${x.FMFFMFID},${x.FMFFMMID},${x.FMFMFFID},${x.FMFMFMID},${x.FMFMMFID},${x.FMFMMMID},${x.FMMFID},${x.FMMMID},${x.FMMFFID},${x.FMMFMID},${x.FMMMFID},${x.FMMMMID},${x.FMMFFFID},${x.FMMFFMID},${x.FMMFMFID},${x.FMMFMMID},${x.FMMMFFID},${x.FMMMFMID},${x.FMMMMFID},${x.FMMMMMID},${x.MFFFID},${x.MFFMID},${x.MFFFFID},${x.MFFFMID},${x.MFFMFID},${x.MFFMMID},${x.MFFFFFID},${x.MFFFFMID},${x.MFFFMFID},${x.MFFFMMID},${x.MFFMFFID},${x.MFFMFMID},${x.MFFMMFID},${x.MFFMMMID},${x.MFMFID},${x.MFMMID},${x.MFMFFID},${x.MFMFMID},${x.MFMMFID},${x.MFMMMID},${x.MFMFFFID},${x.MFMFFMID},${x.MFMFMFID},${x.MFMFMMID},${x.MFMMFFID},${x.MFMMFMID},${x.MFMMMFID},${x.MFMMMMID},${x.MMFFID},${x.MMFMID},${x.MMFFFID},${x.MMFFMID},${x.MMFMFID},${x.MMFMMID},${x.MMFFFFID},${x.MMFFFMID},${x.MMFFMFID},${x.MMFFMMID},${x.MMFMFFID},${x.MMFMFMID},${x.MMFMMFID},${x.MMFMMMID},${x.MMMFID},${x.MMMMID},${x.MMMFFID},${x.MMMFMID},${x.MMMMFID},${x.MMMMMID},${x.MMMFFFID},${x.MMMFFMID},${x.MMMFMFID},${x.MMMFMMID},${x.MMMMFFID},${x.MMMMFMID},${x.MMMMMFID},${x.MMMMMMID},${x.FID1},${x.FID2},${x.FID3},${x.FID4},${x.FID5},${x.FID6},${x.FID7},${x.FID8},${x.FID9},${x.FID10},${x.FID11},${x.FID12},${x.FID13},${x.FID14},${x.FID15},${x.FID16},${x.FID17},${x.FID18},${x.FID19},${x.FID20},${x.FID21},${x.FID22},${x.FID23},${x.FID24},${x.FID25},${x.FID26},${x.FID27},${x.FID28},${x.FID29},${x.FID30},${x.FID31},${x.FID32},${x.FID33},${x.FID34},${x.FID35},${x.FID36},${x.FID37},${x.FID38},${x.FID39},${x.FID40},${x.FID41},${x.FID42},${x.FID43},${x.FID44},${x.FID45},${x.FID46},${x.FID47},${x.FID48},${x.FID49},${x.FID50},${x.FID51},${x.FID52},${x.FID53},${x.FID54},${x.FID55},${x.FID56},${x.FID57},${x.FID58},${x.FID59},${x.FID60},${x.FID61},${x.FID62},${x.FID63},${x.FID64},${x.FID65},${x.FID66},${x.FID67},${x.FID68},${x.FID69},${x.FID70},${x.FID71},${x.FID72},${x.FID73},${x.FID74},${x.FID75},${x.FID76},${x.FID77},${x.FID78},${x.FID79},${x.FID80},${x.FID81},${x.FID82},${x.FID83},${x.FID84},${x.FID85},${x.FID86},${x.FID87},${x.MFSID1},${x.MFSID2},${x.MFSID3},${x.MFSID4},${x.MFSID5},${x.MFSID6},${x.MFSID7},${x.MFSID8},${x.MFSID9},${x.MFSID10},${x.MFSID11},${x.MFSID12},${x.MFSID13},${x.MFSID14},${x.MFSID15},${x.MFSID16},${x.MFSID17},${x.MFSID18},${x.MFSID19},${x.MFSID20},${x.MFSID21},${x.MFSID22},${x.MFSID23},${x.MFSID24},${x.MFSID25},${x.MFSID26},${x.MFSID27},${x.MFSID28},${x.MFSID29},${x.MFSID30},${x.MFSID31},${x.MFSID32},${x.MFSID33},${x.MFSID34},${x.MFSID35},${x.MFSID36},${x.MFSID37},${x.MFSID38},${x.MFSID39},${x.MFSID40},${x.MFSID41},${x.MFSID42},${x.MFSID43},${x.MFSID44},${x.MFSID45},${x.MFSID46},${x.MFSID47},${x.MFSID48},${x.MFSID49},${x.MFSID50},${x.MFSID51},${x.MFSID52},${x.MFSID53},${x.MFSID54},${x.MFSID55},${x.MFSID56},${x.MFSID57},${x.MFSID58},${x.MFSID59},${x.MFSID60},${x.MFSID61},${x.MFSID62},${x.MFSID63},${x.MFSID64},${x.MFSID65},${x.MFSID66},${x.MFSID67},${x.MFSID68},${x.MFSID69},${x.MFSID70},${x.MFSID71},${x.MFSID72},${x.MFSID73},${x.MFSID74},${x.MFSID75},${x.MFSID76},${x.MFSID77},${x.MFSID78},${x.MFSID79},${x.MFSID80},${x.MFSID81},${x.MFSID82},${x.MFSID83},${x.MFSID84},${x.MFSID85},${x.MFSID86},${x.MFSID87},${x.MMFSID1},${x.MMFSID2},${x.MMFSID3},${x.MMFSID4},${x.MMFSID5},${x.MMFSID6},${x.MMFSID7},${x.MMFSID8},${x.MMFSID9},${x.MMFSID10},${x.MMFSID11},${x.MMFSID12},${x.MMFSID13},${x.MMFSID14},${x.MMFSID15},${x.MMFSID16},${x.MMFSID17},${x.MMFSID18},${x.MMFSID19},${x.MMFSID20},${x.MMFSID21},${x.MMFSID22},${x.MMFSID23},${x.MMFSID24},${x.MMFSID25},${x.MMFSID26},${x.MMFSID27},${x.MMFSID28},${x.MMFSID29},${x.MMFSID30},${x.MMFSID31},${x.MMFSID32},${x.MMFSID33},${x.MMFSID34},${x.MMFSID35},${x.MMFSID36},${x.MMFSID37},${x.MMFSID38},${x.MMFSID39},${x.MMFSID40},${x.MMFSID41},${x.MMFSID42},${x.MMFSID43},${x.MMFSID44},${x.MMFSID45},${x.MMFSID46},${x.MMFSID47},${x.MMFSID48},${x.MMFSID49},${x.MMFSID50},${x.MMFSID51},${x.MMFSID52},${x.MMFSID53},${x.MMFSID54},${x.MMFSID55},${x.MMFSID56},${x.MMFSID57},${x.MMFSID58},${x.MMFSID59},${x.MMFSID60},${x.MMFSID61},${x.MMFSID62},${x.MMFSID63},${x.MMFSID64},${x.MMFSID65},${x.MMFSID66},${x.MMFSID67},${x.MMFSID68},${x.MMFSID69},${x.MMFSID70},${x.MMFSID71},${x.MMFSID72},${x.MMFSID73},${x.MMFSID74},${x.MMFSID75},${x.MMFSID76},${x.MMFSID77},${x.MMFSID78},${x.MMFSID79},${x.MMFSID80},${x.MMFSID81},${x.MMFSID82},${x.MMFSID83},${x.MMFSID84},${x.MMFSID85},${x.MMFSID86},${x.MMFSID87}`
    })

    const Aptitudesql = new GetAptitudeData(param)
    const Aptitude = await Aptitudesql.Execsql() as EntAptitudeData[]
    const dicAptitude: {
        [RaceIDs: number]: {
            [HorseID: number] : {
                Aptitude: string
            }
        }
    } = {}
    const Aptitudeprogress = ProgressBar(Object.keys(dicRace).length, 20, 'Aptitude')
    for (const data of Aptitude) {
        Aptitudeprogress(1)
        if (dicAptitude[data.RaceID] == undefined) {
            dicAptitude[data.RaceID] = {}
        }
        dicAptitude[data.RaceID][data.HorseID] = {Aptitude: `${data.AveragePassage1},${data.AveragePassage2},${data.AveragePassage3},${data.AveragePassage4}`}
    }

    const Achievementsql = new GetAchievementData(param)
    const Achievement = await Achievementsql.Execsql() as EntAchievementData[]
    const dicAchievement: {
        [RaceIDs: number]: {
            [HorseID: number] : {
                Achievement: string
            }
        }
    } = {}
    const Achievementprogress = ProgressBar(Object.keys(dicRace).length, 20, 'Achievement')
    for (const data of Achievement) {
        Achievementprogress(1)
        if (dicAchievement[data.RaceID] == undefined) {
            dicAchievement[data.RaceID] = {}
        }
        dicAchievement[data.RaceID][data.HorseID] =  { Achievement : `${data.GoalTime_1},${data.Weight_1},${data.before_1},${data.GoalTime_4},${data.Weight_4},${data.before_4},${data.GoalTime_5},${data.Weight_5},${data.before_5},${data.GoalTime_6},${data.Weight_6},${data.before_6},${data.GoalTime_8},${data.Weight_8},${data.before_8},${data.GoalTime_12},${data.Weight_12},${data.before_12},${data.GoalTime_13},${data.Weight_13},${data.before_13},${data.GoalTime_14},${data.Weight_14},${data.before_14},${data.GoalTime_15},${data.Weight_15},${data.before_15},${data.GoalTime_16},${data.Weight_16},${data.before_16},${data.GoalTime_20},${data.Weight_20},${data.before_20},${data.GoalTime_21},${data.Weight_21},${data.before_21},${data.GoalTime_22},${data.Weight_22},${data.before_22},${data.GoalTime_23},${data.Weight_23},${data.before_23},${data.GoalTime_24},${data.Weight_24},${data.before_24},${data.GoalTime_25},${data.Weight_25},${data.before_25},${data.GoalTime_28},${data.Weight_28},${data.before_28},${data.GoalTime_32},${data.Weight_32},${data.before_32},${data.GoalTime_40},${data.Weight_40},${data.before_40},${data.GoalTime_41},${data.Weight_41},${data.before_41},${data.GoalTime_42},${data.Weight_42},${data.before_42},${data.GoalTime_43},${data.Weight_43},${data.before_43},${data.GoalTime_44},${data.Weight_44},${data.before_44},${data.GoalTime_48},${data.Weight_48},${data.before_48},${data.GoalTime_49},${data.Weight_49},${data.before_49},${data.GoalTime_50},${data.Weight_50},${data.before_50},${data.GoalTime_51},${data.Weight_51},${data.before_51},${data.GoalTime_54},${data.Weight_54},${data.before_54},${data.GoalTime_55},${data.Weight_55},${data.before_55},${data.GoalTime_56},${data.Weight_56},${data.before_56},${data.GoalTime_58},${data.Weight_58},${data.before_58},${data.GoalTime_59},${data.Weight_59},${data.before_59},${data.GoalTime_61},${data.Weight_61},${data.before_61},${data.GoalTime_65},${data.Weight_65},${data.before_65},${data.GoalTime_66},${data.Weight_66},${data.before_66},${data.GoalTime_67},${data.Weight_67},${data.before_67},${data.GoalTime_68},${data.Weight_68},${data.before_68},${data.GoalTime_69},${data.Weight_69},${data.before_69},${data.GoalTime_70},${data.Weight_70},${data.before_70},${data.GoalTime_71},${data.Weight_71},${data.before_71},${data.GoalTime_72},${data.Weight_72},${data.before_72},${data.GoalTime_73},${data.Weight_73},${data.before_73},${data.GoalTime_74},${data.Weight_74},${data.before_74},${data.GoalTime_75},${data.Weight_75},${data.before_75},${data.GoalTime_77},${data.Weight_77},${data.before_77},${data.GoalTime_78},${data.Weight_78},${data.before_78},${data.GoalTime_79},${data.Weight_79},${data.before_79},${data.GoalTime_80},${data.Weight_80},${data.before_80},${data.GoalTime_81},${data.Weight_81},${data.before_81},${data.GoalTime_82},${data.Weight_82},${data.before_82},${data.GoalTime_83},${data.Weight_83},${data.before_83},${data.GoalTime_84},${data.Weight_84},${data.before_84},${data.GoalTime_85},${data.Weight_85},${data.before_85},${data.GoalTime_86},${data.Weight_86},${data.before_86},${data.GoalTime_87},${data.Weight_87},${data.before_87},${data.GoalTime_88},${data.Weight_88},${data.before_88},${data.GoalTime_89},${data.Weight_89},${data.before_89},${data.GoalTime_90},${data.Weight_90},${data.before_90},${data.GoalTime_91},${data.Weight_91},${data.before_91},${data.GoalTime_92},${data.Weight_92},${data.before_92},${data.GoalTime_93},${data.Weight_93},${data.before_93},${data.GoalTime_94},${data.Weight_94},${data.before_94},${data.GoalTime_95},${data.Weight_95},${data.before_95},${data.GoalTime_96},${data.Weight_96},${data.before_96},${data.GoalTime_97},${data.Weight_97},${data.before_97},${data.GoalTime_98},${data.Weight_98},${data.before_98},${data.GoalTime_99},${data.Weight_99},${data.before_99},${data.GoalTime_101},${data.Weight_101},${data.before_101},${data.GoalTime_102},${data.Weight_102},${data.before_102},${data.GoalTime_105},${data.Weight_105},${data.before_105},${data.GoalTime_106},${data.Weight_106},${data.before_106},${data.GoalTime_107},${data.Weight_107},${data.before_107},${data.GoalTime_108},${data.Weight_108},${data.before_108},${data.GoalTime_109},${data.Weight_109},${data.before_109},${data.GoalTime_110},${data.Weight_110},${data.before_110},${data.GoalTime_113},${data.Weight_113},${data.before_113},${data.GoalTime_114},${data.Weight_114},${data.before_114},${data.GoalTime_115},${data.Weight_115},${data.before_115},${data.GoalTime_116},${data.Weight_116},${data.before_116},${data.GoalTime_117},${data.Weight_117},${data.before_117},${data.GoalTime_118},${data.Weight_118},${data.before_118},${data.GoalTime_119},${data.Weight_119},${data.before_119},${data.GoalTime_120},${data.Weight_120},${data.before_120},${data.GoalTime_121},${data.Weight_121},${data.before_121},${data.GoalTime_122},${data.Weight_122},${data.before_122},${data.GoalTime_123},${data.Weight_123},${data.before_123},${data.GoalTime_125},${data.Weight_125},${data.before_125},${data.GoalTime_126},${data.Weight_126},${data.before_126},${data.GoalTime_127},${data.Weight_127},${data.before_127},${data.GoalTime_129},${data.Weight_129},${data.before_129},${data.GoalTime_130},${data.Weight_130},${data.before_130},${data.GoalTime_131},${data.Weight_131},${data.before_131},${data.GoalTime_132},${data.Weight_132},${data.before_132},${data.GoalTime_133},${data.Weight_133},${data.before_133},${data.GoalTime_134},${data.Weight_134},${data.before_134},${data.GoalTime_135},${data.Weight_135},${data.before_135},${data.GoalTime_136},${data.Weight_136},${data.before_136},${data.GoalTime_140},${data.Weight_140},${data.before_140},${data.GoalTime_141},${data.Weight_141},${data.before_141},${data.GoalTime_144},${data.Weight_144},${data.before_144},${data.GoalTime_145},${data.Weight_145},${data.before_145},${data.GoalTime_146},${data.Weight_146},${data.before_146},${data.GoalTime_148},${data.Weight_148},${data.before_148},${data.GoalTime_149},${data.Weight_149},${data.before_149},${data.GoalTime_150},${data.Weight_150},${data.before_150},${data.GoalTime_152},${data.Weight_152},${data.before_152},${data.GoalTime_153},${data.Weight_153},${data.before_153},${data.GoalTime_154},${data.Weight_154},${data.before_154},${data.GoalTime_155},${data.Weight_155},${data.before_155},${data.GoalTime_156},${data.Weight_156},${data.before_156},${data.GoalTime_157},${data.Weight_157},${data.before_157},${data.GoalTime_160},${data.Weight_160},${data.before_160},${data.GoalTime_161},${data.Weight_161},${data.before_161},${data.GoalTime_162},${data.Weight_162},${data.before_162},${data.GoalTime_163},${data.Weight_163},${data.before_163},${data.GoalTime_164},${data.Weight_164},${data.before_164},${data.GoalTime_167},${data.Weight_167},${data.before_167},${data.GoalTime_171},${data.Weight_171},${data.before_171},${data.GoalTime_172},${data.Weight_172},${data.before_172},${data.GoalTime_173},${data.Weight_173},${data.before_173},${data.GoalTime_175},${data.Weight_175},${data.before_175},${data.GoalTime_176},${data.Weight_176},${data.before_176},${data.GoalTime_177},${data.Weight_177},${data.before_177},${data.GoalTime_178},${data.Weight_178},${data.before_178},${data.GoalTime_179},${data.Weight_179},${data.before_179},${data.GoalTime_180},${data.Weight_180},${data.before_180},${data.GoalTime_181},${data.Weight_181},${data.before_181},${data.GoalTime_182},${data.Weight_182},${data.before_182},${data.GoalTime_183},${data.Weight_183},${data.before_183},${data.GoalTime_184},${data.Weight_184},${data.before_184},${data.GoalTime_185},${data.Weight_185},${data.before_185},${data.GoalTime_186},${data.Weight_186},${data.before_186},${data.GoalTime_187},${data.Weight_187},${data.before_187},${data.GoalTime_188},${data.Weight_188},${data.before_188},${data.GoalTime_191},${data.Weight_191},${data.before_191},${data.GoalTime_195},${data.Weight_195},${data.before_195},${data.GoalTime_196},${data.Weight_196},${data.before_196},${data.GoalTime_197},${data.Weight_197},${data.before_197},${data.GoalTime_199},${data.Weight_199},${data.before_199},${data.GoalTime_200},${data.Weight_200},${data.before_200},${data.GoalTime_201},${data.Weight_201},${data.before_201},${data.GoalTime_203},${data.Weight_203},${data.before_203},${data.GoalTime_204},${data.Weight_204},${data.before_204},${data.GoalTime_205},${data.Weight_205},${data.before_205},${data.GoalTime_206},${data.Weight_206},${data.before_206},${data.GoalTime_211},${data.Weight_211},${data.before_211},${data.GoalTime_212},${data.Weight_212},${data.before_212},${data.GoalTime_213},${data.Weight_213},${data.before_213},${data.GoalTime_214},${data.Weight_214},${data.before_214},${data.GoalTime_215},${data.Weight_215},${data.before_215},${data.GoalTime_216},${data.Weight_216},${data.before_216},${data.GoalTime_219},${data.Weight_219},${data.before_219},${data.GoalTime_220},${data.Weight_220},${data.before_220},${data.GoalTime_221},${data.Weight_221},${data.before_221},${data.GoalTime_222},${data.Weight_222},${data.before_222},${data.GoalTime_223},${data.Weight_223},${data.before_223},${data.GoalTime_224},${data.Weight_224},${data.before_224},${data.GoalTime_225},${data.Weight_225},${data.before_225},${data.GoalTime_227},${data.Weight_227},${data.before_227},${data.GoalTime_235},${data.Weight_235},${data.before_235},${data.GoalTime_239},${data.Weight_239},${data.before_239},${data.GoalTime_240},${data.Weight_240},${data.before_240},${data.GoalTime_241},${data.Weight_241},${data.before_241},${data.GoalTime_242},${data.Weight_242},${data.before_242},${data.GoalTime_243},${data.Weight_243},${data.before_243},${data.GoalTime_247},${data.Weight_247},${data.before_247},${data.GoalTime_251},${data.Weight_251},${data.before_251},${data.GoalTime_255},${data.Weight_255},${data.before_255},${data.GoalTime_256},${data.Weight_256},${data.before_256},${data.GoalTime_257},${data.Weight_257},${data.before_257},${data.GoalTime_258},${data.Weight_258},${data.before_258},${data.GoalTime_259},${data.Weight_259},${data.before_259},${data.GoalTime_260},${data.Weight_260},${data.before_260},${data.GoalTime_262},${data.Weight_262},${data.before_262},${data.GoalTime_266},${data.Weight_266},${data.before_266},${data.GoalTime_267},${data.Weight_267},${data.before_267},${data.GoalTime_268},${data.Weight_268},${data.before_268},${data.GoalTime_269},${data.Weight_269},${data.before_269},${data.GoalTime_270},${data.Weight_270},${data.before_270},${data.GoalTime_271},${data.Weight_271},${data.before_271},${data.GoalTime_272},${data.Weight_272},${data.before_272},${data.GoalTime_273},${data.Weight_273},${data.before_273},${data.GoalTime_274},${data.Weight_274},${data.before_274},${data.GoalTime_275},${data.Weight_275},${data.before_275},${data.GoalTime_276},${data.Weight_276},${data.before_276},${data.GoalTime_278},${data.Weight_278},${data.before_278},${data.GoalTime_279},${data.Weight_279},${data.before_279},${data.GoalTime_280},${data.Weight_280},${data.before_280},${data.GoalTime_281},${data.Weight_281},${data.before_281},${data.GoalTime_282},${data.Weight_282},${data.before_282},${data.GoalTime_283},${data.Weight_283},${data.before_283},${data.GoalTime_284},${data.Weight_284},${data.before_284},${data.GoalTime_285},${data.Weight_285},${data.before_285},${data.GoalTime_286},${data.Weight_286},${data.before_286},${data.GoalTime_287},${data.Weight_287},${data.before_287},${data.GoalTime_288},${data.Weight_288},${data.before_288},${data.GoalTime_290},${data.Weight_290},${data.before_290},${data.GoalTime_291},${data.Weight_291},${data.before_291},${data.GoalTime_292},${data.Weight_292},${data.before_292},${data.GoalTime_293},${data.Weight_293},${data.before_293},${data.GoalTime_294},${data.Weight_294},${data.before_294},${data.GoalTime_295},${data.Weight_295},${data.before_295},${data.GoalTime_298},${data.Weight_298},${data.before_298},${data.GoalTime_299},${data.Weight_299},${data.before_299},${data.GoalTime_300},${data.Weight_300},${data.before_300},${data.GoalTime_301},${data.Weight_301},${data.before_301},${data.GoalTime_302},${data.Weight_302},${data.before_302},${data.GoalTime_303},${data.Weight_303},${data.before_303},${data.GoalTime_304},${data.Weight_304},${data.before_304},${data.GoalTime_306},${data.Weight_306},${data.before_306},${data.GoalTime_307},${data.Weight_307},${data.before_307},${data.GoalTime_308},${data.Weight_308},${data.before_308},${data.GoalTime_309},${data.Weight_309},${data.before_309},${data.GoalTime_310},${data.Weight_310},${data.before_310},${data.GoalTime_311},${data.Weight_311},${data.before_311},${data.GoalTime_314},${data.Weight_314},${data.before_314},${data.GoalTime_315},${data.Weight_315},${data.before_315},${data.GoalTime_316},${data.Weight_316},${data.before_316},${data.GoalTime_317},${data.Weight_317},${data.before_317},${data.GoalTime_318},${data.Weight_318},${data.before_318},${data.GoalTime_319},${data.Weight_319},${data.before_319},${data.GoalTime_320},${data.Weight_320},${data.before_320},${data.GoalTime_321},${data.Weight_321},${data.before_321},${data.GoalTime_322},${data.Weight_322},${data.before_322},${data.GoalTime_326},${data.Weight_326},${data.before_326},${data.GoalTime_332},${data.Weight_332},${data.before_332},${data.GoalTime_333},${data.Weight_333},${data.before_333},${data.GoalTime_339},${data.Weight_339},${data.before_339},${data.GoalTime_340},${data.Weight_340},${data.before_340},${data.GoalTime_341},${data.Weight_341},${data.before_341},${data.GoalTime_343},${data.Weight_343},${data.before_343},${data.GoalTime_344},${data.Weight_344},${data.before_344},${data.GoalTime_347},${data.Weight_347},${data.before_347},${data.GoalTime_348},${data.Weight_348},${data.before_348},${data.GoalTime_349},${data.Weight_349},${data.before_349},${data.GoalTime_351},${data.Weight_351},${data.before_351},${data.GoalTime_352},${data.Weight_352},${data.before_352},${data.GoalTime_353},${data.Weight_353},${data.before_353},${data.GoalTime_355},${data.Weight_355},${data.before_355},${data.GoalTime_356},${data.Weight_356},${data.before_356},${data.GoalTime_357},${data.Weight_357},${data.before_357},${data.GoalTime_358},${data.Weight_358},${data.before_358},${data.GoalTime_359},${data.Weight_359},${data.before_359},${data.GoalTime_360},${data.Weight_360},${data.before_360},${data.GoalTime_361},${data.Weight_361},${data.before_361},${data.GoalTime_363},${data.Weight_363},${data.before_363},${data.GoalTime_364},${data.Weight_364},${data.before_364},${data.GoalTime_365},${data.Weight_365},${data.before_365},${data.GoalTime_367},${data.Weight_367},${data.before_367},${data.GoalTime_368},${data.Weight_368},${data.before_368},${data.GoalTime_369},${data.Weight_369},${data.before_369},${data.GoalTime_371},${data.Weight_371},${data.before_371},${data.GoalTime_372},${data.Weight_372},${data.before_372},${data.GoalTime_375},${data.Weight_375},${data.before_375},${data.GoalTime_376},${data.Weight_376},${data.before_376},${data.GoalTime_377},${data.Weight_377},${data.before_377},${data.GoalTime_378},${data.Weight_378},${data.before_378},${data.GoalTime_379},${data.Weight_379},${data.before_379},${data.GoalTime_380},${data.Weight_380},${data.before_380},${data.GoalTime_381},${data.Weight_381},${data.before_381},${data.GoalTime_382},${data.Weight_382},${data.before_382},${data.GoalTime_383},${data.Weight_383},${data.before_383},${data.GoalTime_384},${data.Weight_384},${data.before_384},${data.GoalTime_391},${data.Weight_391},${data.before_391},${data.GoalTime_392},${data.Weight_392},${data.before_392},${data.GoalTime_395},${data.Weight_395},${data.before_395},${data.GoalTime_402},${data.Weight_402},${data.before_402},${data.GoalTime_406},${data.Weight_406},${data.before_406},${data.GoalTime_407},${data.Weight_407},${data.before_407},${data.GoalTime_410},${data.Weight_410},${data.before_410},${data.GoalTime_417},${data.Weight_417},${data.before_417},${data.GoalTime_436},${data.Weight_436},${data.before_436},${data.GoalTime_440},${data.Weight_440},${data.before_440},${data.GoalTime_441},${data.Weight_441},${data.before_441},${data.GoalTime_448},${data.Weight_448},${data.before_448},${data.GoalTime_452},${data.Weight_452},${data.before_452},${data.GoalTime_453},${data.Weight_453},${data.before_453},${data.GoalTime_456},${data.Weight_456},${data.before_456},${data.GoalTime_472},${data.Weight_472},${data.before_472},${data.GoalTime_476},${data.Weight_476},${data.before_476},${data.GoalTime_477},${data.Weight_477},${data.before_477},${data.GoalTime_483},${data.Weight_483},${data.before_483},${data.GoalTime_488},${data.Weight_488},${data.before_488},${data.GoalTime_492},${data.Weight_492},${data.before_492},${data.GoalTime_495},${data.Weight_495},${data.before_495},${data.GoalTime_499},${data.Weight_499},${data.before_499},${data.GoalTime_508},${data.Weight_508},${data.before_508},${data.GoalTime_536},${data.Weight_536},${data.before_536},${data.GoalTime_585},${data.Weight_585},${data.before_585}`}
    }
    const Rotationsql = new GetRotationData(param)
    const Rotation = await Rotationsql.Execsql() as EntRotationData[]
    const dicRotation: {
        [RaceIDs: number]: {
            [HorseID: number] : {
                Rotation: string
            }
        }
    } = {}
    const Rotationprogress = ProgressBar(Object.keys(dicRace).length, 20, 'Rotation')
    for (const data of Rotation) {
        Rotationprogress(1)
        if (dicRotation[data.RaceID] == undefined) {
            dicRotation[data.RaceID] = {}
        }
        dicRotation[data.RaceID][data.HorseID] = { Rotation : `${data.GoalTime_2},${data.Venue_2},${data.HoldMonth_2},${data.Hold_2},${data.Day_2},${data.Range_2},${data.Ground_2},${data.GroundCondition_2},${data.Weather_2},${data.pace_2},${data.Weight_2},${data.TrainerID_2},${data.HorseGender_2},${data.HorseWeight_2},${data.HorseNo_2},${data.HorseAge_2},${data.Remarks_2},${data.RaceRemarks_2},${data.Fluctuation_2},${data.SpurtTime_2},${data.JockeyID_2},${data.before_2},${data.GoalTime_3},${data.Venue_3},${data.HoldMonth_3},${data.Hold_3},${data.Day_3},${data.Range_3},${data.Ground_3},${data.GroundCondition_3},${data.Weather_3},${data.pace_3},${data.Weight_3},${data.TrainerID_3},${data.HorseGender_3},${data.HorseWeight_3},${data.HorseNo_3},${data.HorseAge_3},${data.Remarks_3},${data.RaceRemarks_3},${data.Fluctuation_3},${data.SpurtTime_3},${data.JockeyID_3},${data.before_3},${data.GoalTime_4},${data.Venue_4},${data.HoldMonth_4},${data.Hold_4},${data.Day_4},${data.Range_4},${data.Ground_4},${data.GroundCondition_4},${data.Weather_4},${data.pace_4},${data.Weight_4},${data.TrainerID_4},${data.HorseGender_4},${data.HorseWeight_4},${data.HorseNo_4},${data.HorseAge_4},${data.Remarks_4},${data.RaceRemarks_4},${data.Fluctuation_4},${data.SpurtTime_4},${data.JockeyID_4},${data.before_4},${data.GoalTime_5},${data.Venue_5},${data.HoldMonth_5},${data.Hold_5},${data.Day_5},${data.Range_5},${data.Ground_5},${data.GroundCondition_5},${data.Weather_5},${data.pace_5},${data.Weight_5},${data.TrainerID_5},${data.HorseGender_5},${data.HorseWeight_5},${data.HorseNo_5},${data.HorseAge_5},${data.Remarks_5},${data.RaceRemarks_5},${data.Fluctuation_5},${data.SpurtTime_5},${data.JockeyID_5},${data.before_5},${data.GoalTime_6},${data.Venue_6},${data.HoldMonth_6},${data.Hold_6},${data.Day_6},${data.Range_6},${data.Ground_6},${data.GroundCondition_6},${data.Weather_6},${data.pace_6},${data.Weight_6},${data.TrainerID_6},${data.HorseGender_6},${data.HorseWeight_6},${data.HorseNo_6},${data.HorseAge_6},${data.Remarks_6},${data.RaceRemarks_6},${data.Fluctuation_6},${data.SpurtTime_6},${data.JockeyID_6},${data.before_6}`}
    }
    const multiProgressber = multiProgress()
    const Raceprogress = multiProgressber().addProgress(Object.keys(dicRace).length, 20, 'Race')

    
    for (const strRaceID of Object.keys(dicRace)) {
        const RaceID = Number(strRaceID)
        const info = dicRace[RaceID]
        if (dicpredict[RaceID] == undefined) {
            dicpredict[RaceID] = {
                info: `,${info.Venue},${info.Range},${info.Ground},${info.GroundCondition},${info.Weather},${info.Hold},${info.Day}`,
                Horses:[]
            }
        }
        for (let no = 1; no <= 24; no++ ){
            dicpredict[RaceID].Horses[no]={
                horseinfo:',None,None,None,None,None',
                rank:0
            }
        }
        const Horse = dicHorse[RaceID]

        const predictprogress = multiProgressber().addProgress(Object.keys(Horse).length, 20, 'predict')
        for (const strHorseID of Object.keys(Horse)) {
            predictprogress.addCount(1)
            const HorseID = Number(strHorseID)
            const Horsevalue = Horse[HorseID]

            const JockeyData = `Jockey,0,${Horsevalue.Jockey},${Horsevalue.HorseGender},${info.Venue},${info.Range},${info.Ground},${info.GroundCondition},${info.Pace},${Horsevalue.HorseNo},${Horsevalue.HorseAge},${info.HoldMonth},${info.Weather},${Horsevalue.Weight},${info.Hold},${info.Day},${info.Round}`
            const blood = blooddata[HorseID]
            const BloodData = `blood,0,${info.Range},${info.Venue},${info.Ground},${info.GroundCondition},${info.Pace},${Horsevalue.HorseGender},${Horsevalue.Weight},${Horsevalue.HorseAge},${blood}`

            const Aptitude = dicAptitude[RaceID][HorseID]
            const Rotation = dicRotation[RaceID][HorseID]
            const Achievement = dicAchievement[RaceID][HorseID]
            const rowAptitude = `aptitude,0,${info.Venue},${info.Range},${info.Weather},${info.Ground},${info.GroundCondition},${info.Pace},${info.HoldMonth},${info.Hold},${Horsevalue.HorseNo},${info.Day},${Horsevalue.Weight},${Horsevalue.TrainerID},${Horsevalue.HorseGender},${Horsevalue.HorseWeight},${Horsevalue.Fluctuation},${Horsevalue.Jockey},${Horsevalue.HorseAge},${Aptitude.Aptitude},${blood}`
            const rowRotation = `rotation,0,${info.Direction},${info.Venue},${info.HoldMonth},${info.Hold},${info.Day},${info.Range},${info.Ground},${info.GroundCondition},${info.Weather},${info.Pace},${Horsevalue.Weight},${Horsevalue.TrainerID},${Horsevalue.HorseGender},${Horsevalue.HorseWeight},${Horsevalue.HorseNo},${Horsevalue.HorseAge},${Horsevalue.Fluctuation},${Horsevalue.Jockey},0,${Rotation.Rotation}`
            const rowAchievement = `achievement,0,${info.Venue},${info.Range},${info.Ground},${info.GroundCondition},${info.HoldMonth},${info.Hold},${info.Day},${info.Weather},${Horsevalue.Pace},${Horsevalue.HorseAge},${Horsevalue.Weight},${Horsevalue.TrainerID},${Horsevalue.HorseGender},${Horsevalue.HorseWeight},${Horsevalue.HorseNo},${Horsevalue.Fluctuation},${Horsevalue.Jockey},${Achievement.Achievement}`
            const Blood = await Predict(BloodData, shell)
            const Jockey = await Predict(JockeyData, shell)
            const preAchievement = await Predict(rowAchievement, shell)
            const preRotation = await Predict(rowRotation, shell)
            const preAptitude = await Predict(rowAptitude, shell)

            dicpredict[RaceID].Horses[Horsevalue.HorseNo] = {
                horseinfo: `,${Blood},${Jockey},${preAchievement},${preRotation},${preAptitude}`,
                rank: Horsevalue.Rank
            }
        }

        for (const strHorseNo of Object.keys(dicpredict[RaceID].Horses)) {
            const HorseNo = Number(strHorseNo)
            const Horsevalue = dicpredict[RaceID].Horses[HorseNo]
            if (Horsevalue.rank != 0) {
                let row = `${Horsevalue.rank}${dicpredict[RaceID].info}${Horsevalue.horseinfo}`
                for (const strEnemyNo of Object.keys(dicpredict[RaceID].Horses)) {
                    const EnemyNo = Number(strEnemyNo)
                    if (EnemyNo != HorseNo) {
                        const Enemyvalue = dicpredict[RaceID].Horses[EnemyNo]
                        row += `${Enemyvalue.horseinfo}`
                    } else {
                        row += ',None,None,None,None,None'
                    }
                }
                rows.push(row)
            }
        }
        predictprogress.del()
        Raceprogress.addCount(1)
    }

    return rows
}
function Predict(data: string,shell: PythonShell, name=''): Promise<number | null>{
    return new Promise((resolve, reject) => {
        const datarow = data.split(',')
        const datas = datarow.map(x => {return x == null || x == 'null' ? 'None': x})
        shell.send(`${datas}`)
        let result: number| null = null
        shell.once('message', async function(message){
            result = Number(message.replace('[', '').replace(']', ''))
            resolve(result)
        })
    })

}
