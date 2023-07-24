import SQLBase from "../SQLBase"
import EntStudyDataCount from "../entity/EntStudyDataCount"
import PrmStudyData from "../param/PrmStudyData"
export default class GetHorseIDsCount extends SQLBase<EntStudyDataCount[]>
{
    constructor() {
        super()
    }
    public async Execsql(): Promise<EntStudyDataCount[]> {
        const sql = `
select
    count(RHI.HorseID) as Count
from (
    select
        RHI.HorseID
    from RaceHorseInfomation as RHI
    where
        RHI.HorseID is not null
    group by
        RHI.HorseID
) as RHI
`
        return await this.ExecGet(sql)
    }
}
