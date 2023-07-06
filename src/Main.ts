import GetBloodStudyData from "./querry/GetBloodStudyData"
import PrmStudyData from "./param/PrmStudyData"
import FileUtil from "./FileUtil"
import EntBloodStudyData from "./entity/EntBloodStudyData"
import EntStudyDataCount from "./entity/EntStudyDataCount"
import GetBloodStudyDataCount from "./querry/GetBloodStudyDataCount"
import GetJockyStudyDataCount from "./querry/GetJockyStudyDataCount"
import GetJockyStudyData from "./querry/GetJockyStudyData"
import EntJockyStudyData from "./entity/EntJockyStudyData"

const str = '2:12.3'
console.log(Number(str.substring(0, 1)) * 60 +
Number(str.substring(2, 4))+
Number(str.substring(5, 7)) / 10)

// main()
async function main(mode: number) {
    let ID = 0
    ID++
    const valuenum = 10000
    let max: any[] = []
    switch (mode) {
        case 1:
            const sqlbloodcount = new GetBloodStudyDataCount()
            max = await sqlbloodcount.Execsql() as EntStudyDataCount[]
            break
        case 2:
            const sqljockycount = new GetJockyStudyDataCount()
            max = await sqljockycount.Execsql() as EntStudyDataCount[]
            break
    }

    const Datanum = max[0].Count
    let loop = 1
    if (Datanum >= valuenum) {
        loop = Math.ceil(Datanum / valuenum)
    }
    let count = 0
    do {
        let bolstart = false
        bolstart = count >= 133
        if (bolstart) {
            let Start = count == 0 ? 1 : + valuenum * (count) + 1
            let Finish = valuenum * (count + 1)
            if (count + 1 == loop) {
                Finish = Datanum
            }
            let rows: string[] = []
            const param = new PrmStudyData(Start, Finish)
            let sql: GetBloodStudyData | GetJockyStudyData
            let value: EntBloodStudyData[] | EntJockyStudyData[]
            let filePath = ""
            switch (mode){
                case 1:
                    sql = new GetBloodStudyData(param)
                    value = await sql.Execsql() as EntBloodStudyData[]
                    console.log(`${count}`)
                    rows = value.map(x => { return `${x.time},${x.Range},${x.Venue},${x.Ground},${x.GroundCondition},${x.ID_1},${x.ID_2},${x.ID_3},${x.ID_4},${x.ID_5},${x.ID_6},${x.ID_7},${x.ID_8},${x.ID_9},${x.ID_10},${x.ID_11},${x.ID_12},${x.ID_13},${x.ID_14},${x.ID_15},${x.ID_16},${x.ID_17},${x.ID_18},${x.ID_19},${x.ID_20},${x.ID_21},${x.ID_22},${x.ID_23},${x.ID_24},${x.ID_25},${x.ID_26},${x.ID_27},${x.ID_28},${x.ID_29},${x.ID_30},${x.ID_31},${x.ID_32},${x.ID_33},${x.ID_34},${x.ID_35},${x.ID_36},${x.ID_37},${x.ID_38},${x.ID_39},${x.ID_40},${x.ID_41},${x.ID_42},${x.ID_43},${x.ID_44},${x.ID_45},${x.ID_46},${x.ID_47},${x.ID_48},${x.ID_49},${x.ID_50},${x.ID_51},${x.ID_52},${x.ID_53},${x.ID_54},${x.ID_55},${x.ID_56},${x.ID_57},${x.ID_58},${x.ID_59},${x.ID_60},${x.ID_61},${x.ID_62},${x.ID_63},${x.ID_64},${x.ID_65},${x.ID_66},${x.ID_67},${x.ID_68},${x.ID_69},${x.ID_70},${x.ID_71},${x.ID_72},${x.ID_73},${x.ID_74},${x.ID_75},${x.ID_76},${x.ID_77},${x.ID_78},${x.ID_79},${x.ID_80},${x.ID_81},${x.ID_82},${x.ID_83},${x.ID_84},${x.ID_85},${x.ID_86},${x.ID_87}` })
                    filePath = `./data/blood/${Start}.csv`
                    break
                case 2:
                    sql = new GetJockyStudyData(param)
                    value = await sql.Execsql() as EntJockyStudyData[]
                    rows = value.map(x => { return `${x.Rank},${x.JockeyID},${x.Venue},${x.Range},${x.GateNo},${x.HoldMonth},${x.Weather},${x.Popularity},${x.Weight}`})
                    filePath = `./data/Jocky/${Start}.csv`
                    break
            }
            await FileUtil.ContinueOutputFile(filePath, rows)
        }
        count++
    } while(count != loop)
}
