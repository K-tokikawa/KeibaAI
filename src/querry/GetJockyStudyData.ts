import SQLBase from "../SQLBase"
import EntJockyStudyData from "../entity/EntJockyStudyData"
import PrmStudyData from "../param/PrmStudyData"
export default class GetJockyStudyData extends SQLBase<EntJockyStudyData[]>
{
    private parameter: PrmStudyData | null

    constructor(prm: PrmStudyData | null) {
        super()
        this.parameter = prm
    }
    public async Execsql(): Promise<EntJockyStudyData[]> {
        const sql = `
select
      RHI.Rank
    , RHI.JockeyID
    , RHI.Venue
    , RHI.[Range]
    , RHI.HoldMonth
    , RHI.Popularity
    , RHI.Weather
    , RHI.GateNo
    , RHI.Weight
from (
    select
        ROW_NUMBER()over(order by JockeyID) as ID
        , RHI.Rank
        , RHI.JockeyID
        , RI.Venue
        , RI.[Range]
        , RI.HoldMonth
        , RHI.Popularity
        , RI.Weather
        , RHI.GateNo
        , RHI.Weight
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
) as RHI
where
    RHI.ID between ${this.parameter?.Start} and ${this.parameter?.Finish}
`
        return await this.ExecGet(sql)
    }
}