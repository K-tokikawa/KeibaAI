import SQLBase from "../SQLBase"
import EntStudyDataCount from "../entity/EntStudyDataCount"
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
        left outer join RaceInfomation as RI
            on RI.ID = RHI.RaceID
    where
        RHI.HorseID is not null
        and RHI.OutValue = 0
        and RI.Year >= 1992
        and RI.Direction <> 3
        and RI.Direction is not null
    group by
        RHI.HorseID
) as RHI
`
        return await this.ExecGet(sql)
    }
}
