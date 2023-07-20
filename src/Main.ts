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
import GetRaceHorseJockeyIDsData from "./querry/GetRaceHorseJockeyIDsData"
import EntRaceHorseJockeyIDsDat from "./entity/EntRaceHorseJockeyIDsData"
import MgrRaceData from "./manager/MgrRaceData"
import GetHorseIDBloodStudyData_Blood from "./querry/GetHorseIDBloodStudyData_Blood"
import { resolve } from "path"
import GetRaceHorsePredictData from "./querry/GetRaceHorsePredictData"

const blood_prt = 1
const Jockey = 2
const blood = 3
const Rotation = 4
const Achievement = 5
const Aptitude = 6
const nural = 7
main(nural)

async function main(mode: number) {
    let ID = 0
    ID++
    const valuenum = 3
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
            sql = new GetRaceHorseStudyDataMinMax()
            minmax = await sql.Execsql() as EntStudyDataMinMax[]
            break
        case 7:
            sql = new GetRaceInfomationMinMax()
            minmax = await sql.Execsql() as EntStudyDataMinMax[]
            break
    }
    const Datanum = Count[0]?.Count
    switch (mode){
        case 1:
        case 2:
        case 3:
            if (Datanum >= valuenum) {
                loop = Math.ceil(Datanum / valuenum)
            }
            break
        case 4:
        case 5:
        case 6:
        case 7:
            min = minmax[0].min
            max = minmax[0].max
            const Horsecount = max - min + 1
            loop = Math.ceil(Horsecount / valuenum)
            break

    }
    let count = 0
    do {
        let bolstart = false
        bolstart = count >= 0
        if (bolstart) {

            let Start = count == 0 ? 1 : + valuenum * count + 1
            let Finish = valuenum * (count + 1)
            if (count + 1 == loop) {
                Finish = Datanum
            }
            if (mode == 4 || mode == 5 || mode == 6) {
                Start = count == 0 ? min : min + valuenum * count
                Finish = Start + valuenum - 1
            }
            const param = new PrmStudyData(Start, Finish)

            let rows: string[] = []
            let sql: GetBloodStudyData | GetJockeyStudyData | GetBloodStudyData_Blood | GetRaceHorseStudyData | GetRaceInfomationData
            let value: EntBloodStudyData[] | EntJockeyStudyData[] | EntBloodStudyData_Blood[] | EntRaceHorseStudyData[] | EntRaceInfomationData[]
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
                    rows = value.map(x => { return `${x.Rank},${x.JockeyID},${x.HorseGender},${x.Venue},${x.Range},${x.Ground},${x.GroundCondition},${x.HorseNo},${x.Age},${x.HoldMonth},${x.Weather},${x.Popularity},${x.Weight},${x.Hold},${x.Day},${x.Round}`})
                    filePath = `./data/Jockey/${Start}.csv`
                    break
                case 3:
                    sql = new GetBloodStudyData_Blood(param)
                    console.log(`${count}`)
                    console.log(Start)
                    value = await sql.Execsql() as EntBloodStudyData_Blood[]
                    rows = value.map(x => { return `${x.time},${x.Range},${x.Venue},${x.Ground},${x.GroundCondition},${x.HorseGender},${x.Weight},${x.Age},${x.FID},${x.MID},${x.FFID},${x.FMID},${x.MFID},${x.MMID},${x.FFFID},${x.FFMID},${x.FMFID},${x.FMMID},${x.MFFID},${x.MFMID},${x.MMFID},${x.MMMID},${x.FFFFID},${x.FFFMID},${x.FFFFFID},${x.FFFFMID},${x.FFFMFID},${x.FFFMMID},${x.FFFFFFID},${x.FFFFFMID},${x.FFFFMFID},${x.FFFFMMID},${x.FFFMFFID},${x.FFFMFMID},${x.FFFMMFID},${x.FFFMMMID},${x.FFMFID},${x.FFMMID},${x.FFMFFID},${x.FFMFMID},${x.FFMMFID},${x.FFMMMID},${x.FFMFFFID},${x.FFMFFMID},${x.FFMFMFID},${x.FFMFMMID},${x.FFMMFFID},${x.FFMMFMID},${x.FFMMMFID},${x.FFMMMMID},${x.FMFFID},${x.FMFMID},${x.FMFFFID},${x.FMFFMID},${x.FMFMFID},${x.FMFMMID},${x.FMFFFFID},${x.FMFFFMID},${x.FMFFMFID},${x.FMFFMMID},${x.FMFMFFID},${x.FMFMFMID},${x.FMFMMFID},${x.FMFMMMID},${x.FMMFID},${x.FMMMID},${x.FMMFFID},${x.FMMFMID},${x.FMMMFID},${x.FMMMMID},${x.FMMFFFID},${x.FMMFFMID},${x.FMMFMFID},${x.FMMFMMID},${x.FMMMFFID},${x.FMMMFMID},${x.FMMMMFID},${x.FMMMMMID},${x.MFFFID},${x.MFFMID},${x.MFFFFID},${x.MFFFMID},${x.MFFMFID},${x.MFFMMID},${x.MFFFFFID},${x.MFFFFMID},${x.MFFFMFID},${x.MFFFMMID},${x.MFFMFFID},${x.MFFMFMID},${x.MFFMMFID},${x.MFFMMMID},${x.MFMFID},${x.MFMMID},${x.MFMFFID},${x.MFMFMID},${x.MFMMFID},${x.MFMMMID},${x.MFMFFFID},${x.MFMFFMID},${x.MFMFMFID},${x.MFMFMMID},${x.MFMMFFID},${x.MFMMFMID},${x.MFMMMFID},${x.MFMMMMID},${x.MMFFID},${x.MMFMID},${x.MMFFFID},${x.MMFFMID},${x.MMFMFID},${x.MMFMMID},${x.MMFFFFID},${x.MMFFFMID},${x.MMFFMFID},${x.MMFFMMID},${x.MMFMFFID},${x.MMFMFMID},${x.MMFMMFID},${x.MMFMMMID},${x.MMMFID},${x.MMMMID},${x.MMMFFID},${x.MMMFMID},${x.MMMMFID},${x.MMMMMID},${x.MMMFFFID},${x.MMMFFMID},${x.MMMFMFID},${x.MMMFMMID},${x.MMMMFFID},${x.MMMMFMID},${x.MMMMMFID},${x.MMMMMMID},${x.FID1},${x.FID2},${x.FID3},${x.FID4},${x.FID5},${x.FID6},${x.FID7},${x.FID8},${x.FID9},${x.FID10},${x.FID11},${x.FID12},${x.FID13},${x.FID14},${x.FID15},${x.FID16},${x.FID17},${x.FID18},${x.FID19},${x.FID20},${x.FID21},${x.FID22},${x.FID23},${x.FID24},${x.FID25},${x.FID26},${x.FID27},${x.FID28},${x.FID29},${x.FID30},${x.FID31},${x.FID32},${x.FID33},${x.FID34},${x.FID35},${x.FID36},${x.FID37},${x.FID38},${x.FID39},${x.FID40},${x.FID41},${x.FID42},${x.FID43},${x.FID44},${x.FID45},${x.FID46},${x.FID47},${x.FID48},${x.FID49},${x.FID50},${x.FID51},${x.FID52},${x.FID53},${x.FID54},${x.FID55},${x.FID56},${x.FID57},${x.FID58},${x.FID59},${x.FID60},${x.FID61},${x.FID62},${x.FID63},${x.FID64},${x.FID65},${x.FID66},${x.FID67},${x.FID68},${x.FID69},${x.FID70},${x.FID71},${x.FID72},${x.FID73},${x.FID74},${x.FID75},${x.FID76},${x.FID77},${x.FID78},${x.FID79},${x.FID80},${x.FID81},${x.FID82},${x.FID83},${x.FID84},${x.FID85},${x.FID86},${x.FID87},${x.MFSID1},${x.MFSID2},${x.MFSID3},${x.MFSID4},${x.MFSID5},${x.MFSID6},${x.MFSID7},${x.MFSID8},${x.MFSID9},${x.MFSID10},${x.MFSID11},${x.MFSID12},${x.MFSID13},${x.MFSID14},${x.MFSID15},${x.MFSID16},${x.MFSID17},${x.MFSID18},${x.MFSID19},${x.MFSID20},${x.MFSID21},${x.MFSID22},${x.MFSID23},${x.MFSID24},${x.MFSID25},${x.MFSID26},${x.MFSID27},${x.MFSID28},${x.MFSID29},${x.MFSID30},${x.MFSID31},${x.MFSID32},${x.MFSID33},${x.MFSID34},${x.MFSID35},${x.MFSID36},${x.MFSID37},${x.MFSID38},${x.MFSID39},${x.MFSID40},${x.MFSID41},${x.MFSID42},${x.MFSID43},${x.MFSID44},${x.MFSID45},${x.MFSID46},${x.MFSID47},${x.MFSID48},${x.MFSID49},${x.MFSID50},${x.MFSID51},${x.MFSID52},${x.MFSID53},${x.MFSID54},${x.MFSID55},${x.MFSID56},${x.MFSID57},${x.MFSID58},${x.MFSID59},${x.MFSID60},${x.MFSID61},${x.MFSID62},${x.MFSID63},${x.MFSID64},${x.MFSID65},${x.MFSID66},${x.MFSID67},${x.MFSID68},${x.MFSID69},${x.MFSID70},${x.MFSID71},${x.MFSID72},${x.MFSID73},${x.MFSID74},${x.MFSID75},${x.MFSID76},${x.MFSID77},${x.MFSID78},${x.MFSID79},${x.MFSID80},${x.MFSID81},${x.MFSID82},${x.MFSID83},${x.MFSID84},${x.MFSID85},${x.MFSID86},${x.MFSID87},${x.MMFSID1},${x.MMFSID2},${x.MMFSID3},${x.MMFSID4},${x.MMFSID5},${x.MMFSID6},${x.MMFSID7},${x.MMFSID8},${x.MMFSID9},${x.MMFSID10},${x.MMFSID11},${x.MMFSID12},${x.MMFSID13},${x.MMFSID14},${x.MMFSID15},${x.MMFSID16},${x.MMFSID17},${x.MMFSID18},${x.MMFSID19},${x.MMFSID20},${x.MMFSID21},${x.MMFSID22},${x.MMFSID23},${x.MMFSID24},${x.MMFSID25},${x.MMFSID26},${x.MMFSID27},${x.MMFSID28},${x.MMFSID29},${x.MMFSID30},${x.MMFSID31},${x.MMFSID32},${x.MMFSID33},${x.MMFSID34},${x.MMFSID35},${x.MMFSID36},${x.MMFSID37},${x.MMFSID38},${x.MMFSID39},${x.MMFSID40},${x.MMFSID41},${x.MMFSID42},${x.MMFSID43},${x.MMFSID44},${x.MMFSID45},${x.MMFSID46},${x.MMFSID47},${x.MMFSID48},${x.MMFSID49},${x.MMFSID50},${x.MMFSID51},${x.MMFSID52},${x.MMFSID53},${x.MMFSID54},${x.MMFSID55},${x.MMFSID56},${x.MMFSID57},${x.MMFSID58},${x.MMFSID59},${x.MMFSID60},${x.MMFSID61},${x.MMFSID62},${x.MMFSID63},${x.MMFSID64},${x.MMFSID65},${x.MMFSID66},${x.MMFSID67},${x.MMFSID68},${x.MMFSID69},${x.MMFSID70},${x.MMFSID71},${x.MMFSID72},${x.MMFSID73},${x.MMFSID74},${x.MMFSID75},${x.MMFSID76},${x.MMFSID77},${x.MMFSID78},${x.MMFSID79},${x.MMFSID80},${x.MMFSID81},${x.MMFSID82},${x.MMFSID83},${x.MMFSID84},${x.MMFSID85},${x.MMFSID86},${x.MMFSID87}`})
                    filePath = `./data/blood/${Start}.csv`
                    break
                case 4:
                case 5:
                case 6:
                    sql = new GetRaceHorseStudyData(param)
                    value = await sql.Execsql() as EntRaceHorseStudyData[]
                    const mgr = new MgrRaceData(value)
                    switch (mode){
                        case 4:
                            rows = mgr.CreateRotationData()
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
                    }
                    
                    break
                case 7:
                    sql = new GetRaceInfomationData(param)
                    console.log(count)
                    value = await sql.Execsql() as EntRaceInfomationData[]
                    console.log(value)
                    await CreateRacePredictData(value)
                    break
            }
            await FileUtil.ContinueOutputFile(filePath, rows)
        }
        count++
    } while(count != loop)
}



async function CreateRacePredictData(value: EntRaceInfomationData[]) {
    const Racedic: {
        [RaceID: number]: {
            Horses: number[],
            Venue: number,
            Range: number,
            Ground: number,
            GroundCondition: number,
            Weather: number,
            HoldMonth: number,
            Hold: number,
            Day: number}
    } = {}
    const predict: {
        [RaceID: number]: {
            info: string,
            [HorseNo: number]: 
                string
        }
    } = {}
    const RaceIDs = value.map(x => {return x.ID})
    const HorseIDsparam = new PrmStudyData(0,0, RaceIDs)
    const HorseIDssql = new GetRaceHorseJockeyIDsData(HorseIDsparam)
    const HorseIDsvalue = await HorseIDssql.Execsql() as EntRaceHorseJockeyIDsDat[]
    for (const row of HorseIDsvalue){
        if (Racedic[row.RaceID] == undefined) {
            Racedic[row.RaceID] = {
                Horses: [],
                Venue: 0 ,
                Range: 0 ,
                Ground: 0 ,
                GroundCondition: 0 ,
                Weather: 0 ,
                HoldMonth: 0 ,
                Hold: 0 ,
                Day: 0
            }
        }
        Racedic[row.RaceID].Horses.push(row.HorseID)
    }
    value.map(x => {
        Racedic[x.ID].Venue= x.Venue 
        Racedic[x.ID].Range= x.Range 
        Racedic[x.ID].Ground= x.Ground 
        Racedic[x.ID].GroundCondition= x.GroundCondition 
        Racedic[x.ID].Weather= x.Weather 
        Racedic[x.ID].HoldMonth= x.HoldMonth 
        Racedic[x.ID].Hold= x.Hold 
            Racedic[x.ID].Day= x.Day
        })
    const HorseIDs = Array.from(new Set(HorseIDsvalue.map(x => {return x.HorseID})))

    const bloodparam = new PrmStudyData(0,0, HorseIDs)
    const blood = new GetHorseIDBloodStudyData_Blood(bloodparam)
    const bloodvalue = await blood.Execsql() as EntBloodStudyData_Blood[]
    const blooddata: {[ID: number]: string} = {}
    bloodvalue.forEach(x=> {
        blooddata[x.HorseID] = `${x.FID},${x.MID},${x.FFID},${x.FMID},${x.MFID},${x.MMID},${x.FFFID},${x.FFMID},${x.FMFID},${x.FMMID},${x.MFFID},${x.MFMID},${x.MMFID},${x.MMMID},${x.FFFFID},${x.FFFMID},${x.FFFFFID},${x.FFFFMID},${x.FFFMFID},${x.FFFMMID},${x.FFFFFFID},${x.FFFFFMID},${x.FFFFMFID},${x.FFFFMMID},${x.FFFMFFID},${x.FFFMFMID},${x.FFFMMFID},${x.FFFMMMID},${x.FFMFID},${x.FFMMID},${x.FFMFFID},${x.FFMFMID},${x.FFMMFID},${x.FFMMMID},${x.FFMFFFID},${x.FFMFFMID},${x.FFMFMFID},${x.FFMFMMID},${x.FFMMFFID},${x.FFMMFMID},${x.FFMMMFID},${x.FFMMMMID},${x.FMFFID},${x.FMFMID},${x.FMFFFID},${x.FMFFMID},${x.FMFMFID},${x.FMFMMID},${x.FMFFFFID},${x.FMFFFMID},${x.FMFFMFID},${x.FMFFMMID},${x.FMFMFFID},${x.FMFMFMID},${x.FMFMMFID},${x.FMFMMMID},${x.FMMFID},${x.FMMMID},${x.FMMFFID},${x.FMMFMID},${x.FMMMFID},${x.FMMMMID},${x.FMMFFFID},${x.FMMFFMID},${x.FMMFMFID},${x.FMMFMMID},${x.FMMMFFID},${x.FMMMFMID},${x.FMMMMFID},${x.FMMMMMID},${x.MFFFID},${x.MFFMID},${x.MFFFFID},${x.MFFFMID},${x.MFFMFID},${x.MFFMMID},${x.MFFFFFID},${x.MFFFFMID},${x.MFFFMFID},${x.MFFFMMID},${x.MFFMFFID},${x.MFFMFMID},${x.MFFMMFID},${x.MFFMMMID},${x.MFMFID},${x.MFMMID},${x.MFMFFID},${x.MFMFMID},${x.MFMMFID},${x.MFMMMID},${x.MFMFFFID},${x.MFMFFMID},${x.MFMFMFID},${x.MFMFMMID},${x.MFMMFFID},${x.MFMMFMID},${x.MFMMMFID},${x.MFMMMMID},${x.MMFFID},${x.MMFMID},${x.MMFFFID},${x.MMFFMID},${x.MMFMFID},${x.MMFMMID},${x.MMFFFFID},${x.MMFFFMID},${x.MMFFMFID},${x.MMFFMMID},${x.MMFMFFID},${x.MMFMFMID},${x.MMFMMFID},${x.MMFMMMID},${x.MMMFID},${x.MMMMID},${x.MMMFFID},${x.MMMFMID},${x.MMMMFID},${x.MMMMMID},${x.MMMFFFID},${x.MMMFFMID},${x.MMMFMFID},${x.MMMFMMID},${x.MMMMFFID},${x.MMMMFMID},${x.MMMMMFID},${x.MMMMMMID},${x.FID1},${x.FID2},${x.FID3},${x.FID4},${x.FID5},${x.FID6},${x.FID7},${x.FID8},${x.FID9},${x.FID10},${x.FID11},${x.FID12},${x.FID13},${x.FID14},${x.FID15},${x.FID16},${x.FID17},${x.FID18},${x.FID19},${x.FID20},${x.FID21},${x.FID22},${x.FID23},${x.FID24},${x.FID25},${x.FID26},${x.FID27},${x.FID28},${x.FID29},${x.FID30},${x.FID31},${x.FID32},${x.FID33},${x.FID34},${x.FID35},${x.FID36},${x.FID37},${x.FID38},${x.FID39},${x.FID40},${x.FID41},${x.FID42},${x.FID43},${x.FID44},${x.FID45},${x.FID46},${x.FID47},${x.FID48},${x.FID49},${x.FID50},${x.FID51},${x.FID52},${x.FID53},${x.FID54},${x.FID55},${x.FID56},${x.FID57},${x.FID58},${x.FID59},${x.FID60},${x.FID61},${x.FID62},${x.FID63},${x.FID64},${x.FID65},${x.FID66},${x.FID67},${x.FID68},${x.FID69},${x.FID70},${x.FID71},${x.FID72},${x.FID73},${x.FID74},${x.FID75},${x.FID76},${x.FID77},${x.FID78},${x.FID79},${x.FID80},${x.FID81},${x.FID82},${x.FID83},${x.FID84},${x.FID85},${x.FID86},${x.FID87},${x.MFSID1},${x.MFSID2},${x.MFSID3},${x.MFSID4},${x.MFSID5},${x.MFSID6},${x.MFSID7},${x.MFSID8},${x.MFSID9},${x.MFSID10},${x.MFSID11},${x.MFSID12},${x.MFSID13},${x.MFSID14},${x.MFSID15},${x.MFSID16},${x.MFSID17},${x.MFSID18},${x.MFSID19},${x.MFSID20},${x.MFSID21},${x.MFSID22},${x.MFSID23},${x.MFSID24},${x.MFSID25},${x.MFSID26},${x.MFSID27},${x.MFSID28},${x.MFSID29},${x.MFSID30},${x.MFSID31},${x.MFSID32},${x.MFSID33},${x.MFSID34},${x.MFSID35},${x.MFSID36},${x.MFSID37},${x.MFSID38},${x.MFSID39},${x.MFSID40},${x.MFSID41},${x.MFSID42},${x.MFSID43},${x.MFSID44},${x.MFSID45},${x.MFSID46},${x.MFSID47},${x.MFSID48},${x.MFSID49},${x.MFSID50},${x.MFSID51},${x.MFSID52},${x.MFSID53},${x.MFSID54},${x.MFSID55},${x.MFSID56},${x.MFSID57},${x.MFSID58},${x.MFSID59},${x.MFSID60},${x.MFSID61},${x.MFSID62},${x.MFSID63},${x.MFSID64},${x.MFSID65},${x.MFSID66},${x.MFSID67},${x.MFSID68},${x.MFSID69},${x.MFSID70},${x.MFSID71},${x.MFSID72},${x.MFSID73},${x.MFSID74},${x.MFSID75},${x.MFSID76},${x.MFSID77},${x.MFSID78},${x.MFSID79},${x.MFSID80},${x.MFSID81},${x.MFSID82},${x.MFSID83},${x.MFSID84},${x.MFSID85},${x.MFSID86},${x.MFSID87},${x.MMFSID1},${x.MMFSID2},${x.MMFSID3},${x.MMFSID4},${x.MMFSID5},${x.MMFSID6},${x.MMFSID7},${x.MMFSID8},${x.MMFSID9},${x.MMFSID10},${x.MMFSID11},${x.MMFSID12},${x.MMFSID13},${x.MMFSID14},${x.MMFSID15},${x.MMFSID16},${x.MMFSID17},${x.MMFSID18},${x.MMFSID19},${x.MMFSID20},${x.MMFSID21},${x.MMFSID22},${x.MMFSID23},${x.MMFSID24},${x.MMFSID25},${x.MMFSID26},${x.MMFSID27},${x.MMFSID28},${x.MMFSID29},${x.MMFSID30},${x.MMFSID31},${x.MMFSID32},${x.MMFSID33},${x.MMFSID34},${x.MMFSID35},${x.MMFSID36},${x.MMFSID37},${x.MMFSID38},${x.MMFSID39},${x.MMFSID40},${x.MMFSID41},${x.MMFSID42},${x.MMFSID43},${x.MMFSID44},${x.MMFSID45},${x.MMFSID46},${x.MMFSID47},${x.MMFSID48},${x.MMFSID49},${x.MMFSID50},${x.MMFSID51},${x.MMFSID52},${x.MMFSID53},${x.MMFSID54},${x.MMFSID55},${x.MMFSID56},${x.MMFSID57},${x.MMFSID58},${x.MMFSID59},${x.MMFSID60},${x.MMFSID61},${x.MMFSID62},${x.MMFSID63},${x.MMFSID64},${x.MMFSID65},${x.MMFSID66},${x.MMFSID67},${x.MMFSID68},${x.MMFSID69},${x.MMFSID70},${x.MMFSID71},${x.MMFSID72},${x.MMFSID73},${x.MMFSID74},${x.MMFSID75},${x.MMFSID76},${x.MMFSID77},${x.MMFSID78},${x.MMFSID79},${x.MMFSID80},${x.MMFSID81},${x.MMFSID82},${x.MMFSID83},${x.MMFSID84},${x.MMFSID85},${x.MMFSID86},${x.MMFSID87}`
    })

    const RaceDataparam = new PrmStudyData(0, 0, HorseIDs, RaceIDs)
    const RaceDatapsql = new GetRaceHorsePredictData(RaceDataparam)
    console.log('RaceDatas')
    const RaceDatas = await RaceDatapsql.Execsql() as EntRaceHorseStudyData[]
    const mgr = new MgrRaceData(RaceDatas)
    await mgr.dicCreate(blooddata)
    console.log('dicCreate')
    const dicData = mgr.dic
    for (const x of Object.keys(Racedic)){
        const RaceID = Number(x)
        const RaceInfo = Racedic[RaceID]
        const strRaceInfo = `${RaceInfo.Venue},${RaceInfo.Range},${RaceInfo.Ground},${RaceInfo.GroundCondition},${RaceInfo.Weather},${RaceInfo.Hold},${RaceInfo.Day}`
        predict[RaceID] = {info:strRaceInfo}
        for (const value of Racedic[RaceID].Horses){
            const HorseID = value
            const HorseData = dicData[HorseID].data
            const num = HorseData.getNum(RaceID)
            const HorseNo = HorseData.getHorseNo(RaceID)
            const Horsepredict = HorseData.PredictData[num]
            const str = `${Horsepredict.RotationPredict},${Horsepredict.AchievementPredict},${Horsepredict.AptitudePredict},${HorseData.BloodPredict},${HorseData.JockeyPredict}`
            predict[RaceID][HorseNo] = str
        }
    }
}