import SQLBase from "../SQLBase"
import EntStudyDataCount from "../entity/EntStudyDataCount"
export default class GetJockyStudyDataCount extends SQLBase<EntStudyDataCount[]>
{
    constructor() {
        super()
    }
    public async Execsql(): Promise<EntStudyDataCount[]> {
        const sql = `
select
    count(RHI.Rank)
from RaceHorseInfomation as RHI
    left outer join RaceInfomation as RI
        on RI.ID = RHI.RaceID
where
    RHI.JockeyID in (
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
