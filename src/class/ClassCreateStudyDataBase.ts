import { PythonShell } from "python-shell"
import { CreateTotallingData, GetLoopMin, GetStartFinishMinMax } from "../CreateData/CreateUtil"
import GetRaceInfomationMinMax from "../querry/GetRaceInfomationDataMinMax"
import EntStudyDataMinMax from "../entity/EntStudyDataMinMax"
import PrmStudyData from "../param/PrmStudyData"
import GetRaceInfomationData from "../querry/GetRaceInfomationData"
import EntRaceInfomationData from "../entity/EntRaceInfomationData"
import MgrPredictData from "../manager/MgrPredictData"

export default abstract class CreateStudyDataBase
{
    protected mgr: MgrPredictData
    constructor()
    {
        this.mgr = new MgrPredictData()
    }
    async CreateData(valuenum: number, shell: PythonShell | null){

        await CreateTotallingData(valuenum)
        const sql = new GetRaceInfomationMinMax()
        let MinMax: EntStudyDataMinMax[] =  await sql.Execsql()
        let [loop, min] = GetLoopMin(valuenum, MinMax)
        let count = 0
        while (loop != 0)
        {
            const [Start, Finish] = GetStartFinishMinMax(valuenum, count, min)
    
            const param = new PrmStudyData(Start, Finish)
            const sql = new GetRaceInfomationData(param)
            const value = await sql.Execsql() as EntRaceInfomationData[]
            this.mgr = new MgrPredictData() // メモリ解放のためにインスタンス再生成
            try {
                await this.mgr.init(value)
                await this.main(Start, shell)
            } 
            catch {
                console.log(loop)
            }
            loop--
            count++
        }
    }
    abstract main(Start: number, shell: PythonShell|null): Promise<void>
}