import SQLBase from "../SQLBase"
import EntHorseIDsData from "../entity/EntHorseIDsData"
import PrmStudyData from "../param/PrmStudyData"
export default class GetHorseIDs extends SQLBase<EntHorseIDsData[]>
{
    private parameter: PrmStudyData | null

    constructor(prm: PrmStudyData | null) {
        super()
        this.parameter = prm
    }
    public async Execsql(): Promise<EntHorseIDsData[]> {
        const sql = `
select
    HorseID as Horse
    , num
from (
    select
        RHI.HorseID
        , ROW_NUMBER()over(order by RHI.HorseID) as num
    from (
        select
            RHI.HorseID
        from RaceHorseInfomation as RHI
            left outer join RaceInfomation as RI
                on RI.ID = RHI.RaceID
        where
            RHI.HorseID is not null
            and RI.Year >= 1992
        group by
            RHI.HorseID
    ) as RHI
) as RHI
where
    RHI.num between ${this.parameter?.Start} and ${this.parameter?.Finish}
`
        return await this.ExecGet(sql)
    }
}
