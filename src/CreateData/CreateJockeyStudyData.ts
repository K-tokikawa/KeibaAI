import FileUtil from "../FileUtil"
import simpleProgress from "../ProgressBar"
import EntJockeyStudyData from "../entity/EntJockeyStudyData"
import EntStudyDataCount from "../entity/EntStudyDataCount"
import PrmStudyData from "../param/PrmStudyData"
import GetJockeyStudyData from "../querry/GetJockeyStudyData"
import GetJockeyStudyDataCount from "../querry/GetJockeyStudyDataCount"
import { GetLoop, GetStartFinish } from "./CreateUtil"
export async function CreateJockeyStydyData(valuenum: number)
{
    const sql: GetJockeyStudyDataCount = new GetJockeyStudyDataCount()
    let Count: EntStudyDataCount[] =  await sql.Execsql()
    const Datanum = Count[0]?.Count
    let loop = GetLoop(Datanum, valuenum)
    let count = 0
    const ProgressBar = simpleProgress()
    const progress = ProgressBar(loop, 200, 'Jockey')

    while (loop != 0)
    {
        const [Start, Finish] = GetStartFinish(valuenum, count, loop, Datanum)

        let param = new PrmStudyData(Start, Finish)
        const sql = new GetJockeyStudyData(param)
        const value: EntJockeyStudyData[]  = await sql.Execsql() as EntJockeyStudyData[]
        const rows: string[] = value.map(x => { return `${x.GoalTime},${x.JockeyID},${x.HorseGender},${x.Venue},${x.Range},${x.Ground},${x.GroundCondition},${x.pace},${x.HorseNo},${x.Age},${x.HoldMonth},${x.Weather},${x.Weight},${x.Hold},${x.Day},${x.Round}`})
        const filePath: string = `./data/Jockey/${Start}.csv`

        await FileUtil.ContinueOutputFile(filePath, rows)
        progress(1)
        loop--
        count++
    }
}