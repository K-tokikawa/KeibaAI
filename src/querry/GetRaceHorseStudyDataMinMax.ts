import SQLBase from "../SQLBase"
import EntStudyDataMinMax from "../entity/EntStudyDataMinMax"
export default class GetRaceHorseStudyDataMinMax extends SQLBase<EntStudyDataMinMax[]>
{

    constructor() {
        super()
    }
    public async Execsql(): Promise<EntStudyDataMinMax[]> {
        const sql = `
select
      min(RHI.HorseID) as min
    , max(RHI.HorseID) as max
from (
    select
        RHI.HorseID
    from RaceHorseInfomation as RHI
        left outer join RaceInfomation as RI
            on RI.ID = RHI.RaceID
    where
        RHI.HorseID is not null
        and RI.Direction is not null
        and RI.Year >= 1992
) as RHI
`
        return await this.ExecGet(sql)
    }
}
