import SQLBase from "../SQLBase"
import EntStudyDataMinMax from "../entity/EntStudyDataMinMax"
export default class GetRaceInfomationMinMax extends SQLBase<EntStudyDataMinMax[]>
{

    constructor() {
        super()
    }
    public async Execsql(): Promise<EntStudyDataMinMax[]> {
        const sql = `
select
    min(RI.ID) as min
    , max(RI.ID) as max
from RaceHorseInfomation as RHI
where
    RI.Direction <> 3
`
        return await this.ExecGet(sql)
    }
}
