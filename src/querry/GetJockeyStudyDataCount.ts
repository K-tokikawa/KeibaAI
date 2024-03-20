import SQLBase from "../SQLBase"
import EntStudyDataCount from "../entity/EntStudyDataCount"
export default class GetJockeyStudyDataCount extends SQLBase<EntStudyDataCount[]>
{
    constructor() {
        super()
    }
    public async Execsql(): Promise<EntStudyDataCount[]> {
        const sql = `
select
    count(RHI.Rank) as Count
from RaceHorseInfomation as RHI
    left outer join RaceInfomation as RI
        on RI.ID = RHI.RaceID
where
        RHI.Rank is not null
    and RHI.OutValue = 0
    and RI.Year >= 1992
    and RHI.JockeyID in (
        select
            RHI.JockeyID
        from RaceHorseInfomation as RHI
            left outer join RaceInfomation as RI
                on RI.ID = RHI.RaceID
        where
            RI.[Year] = (
                select
                    max([Year])
                from RaceInfomation
            )
        group by
            RHI.JockeyID
    )
`
        return await this.ExecGet(sql)
    }
}
