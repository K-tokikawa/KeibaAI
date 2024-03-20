import SQLBase from "../SQLBase"
import EntStudyDataCount from "../entity/EntStudyDataCount"
export default class GetBloodStudyDataCount extends SQLBase<EntStudyDataCount[]>
{

    constructor() {
        super()
    }
    public async Execsql(): Promise<EntStudyDataCount[]> {
        const sql = `
select
    Count(RHI.ID) as Count
from RaceHorseInfomation as RHI
    left outer join RaceInfomation as RI
        on RI.ID = RHI.RaceID
    left outer join RaceMaster as RM
        on RM.ID = RI.RaceMasterID
    inner join TimeAverage as TA
        on TA.ID = RHI.Average
    left outer join BloodTable as BD
        on BD.ID = RHI.HorseID
where
    GoalTime is not null
    and RHI.OutValue = 0
    and RI.Year >= 1992
`
        return await this.ExecGet(sql)
    }
}
