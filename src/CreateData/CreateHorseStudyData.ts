import FileUtil from "../FileUtil"
import simpleProgress from "../ProgressBar"
import EntRaceHorseStudyData from "../entity/EntRaceHorseStudyData"
import EntStudyDataCount from "../entity/EntStudyDataCount"
import EntStudyDataMinMax from "../entity/EntStudyDataMinMax"
import MgrRaceData from "../manager/MgrRaceData"
import PrmStudyData from "../param/PrmStudyData"
import BulkInsert from "../querry/BulkInsert"
import GetRaceHorseStudyData from "../querry/GetRaceHorseStudyData"
import GetRaceHorseStudyDataMinMax from "../querry/GetRaceHorseStudyDataMinMax"
import { GetLoopMin, GetStartFinishMinMax } from "./CreateUtil"

export async function CreateHorseStudyData(valuenum: number){
    const sql: GetRaceHorseStudyDataMinMax = new GetRaceHorseStudyDataMinMax()
    let MinMax: EntStudyDataMinMax[] =  await sql.Execsql()
    let [loop, min] = GetLoopMin(valuenum, MinMax)
    let count = 0
    const ProgressBar = simpleProgress()
    const progress = ProgressBar(loop, 200, 'Horse')
    while (loop != 0)
    {
        const [Start, Finish] = GetStartFinishMinMax(valuenum, count, min)

        let param = new PrmStudyData(Start, Finish)
        const sql = new GetRaceHorseStudyData(param)
        const value = await sql.Execsql() as EntRaceHorseStudyData[]
        const mgr = new MgrRaceData(value.filter(x => x.OutValue == 0))

        const Rotationrows = mgr.CreateRotationData()
        const RotationfilePath = `./data/rotation/${Start}.csv`
        await FileUtil.ContinueOutputFile(RotationfilePath, Rotationrows)
        
        const Acievementrows = mgr.CreateAchievementData()
        const AchievementfilePath = `./data/achievement/${Start}.csv`
        await FileUtil.ContinueOutputFile(AchievementfilePath, Acievementrows)

        const Aptituderows = await mgr.CreateAptitudeData()
        const AptitudefilePath = `./data/aptitude/${Start}.csv`
        await FileUtil.ContinueOutputFile(AptitudefilePath, Aptituderows)

        progress(1)
        loop--
        count++
    }
}