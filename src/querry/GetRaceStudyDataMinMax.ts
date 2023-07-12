import SQLBase from "../SQLBase"
import EntStudyDataMinMax from "../entity/EntStudyDataMinMax"
export default class GetRaceStudyDataMinMax extends SQLBase<EntStudyDataMinMax[]>
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
          RHI.GoalTime
        , convert(datetime, convert(nvarchar, RI.Year) + '-' + convert(nvarchar, RI.HoldMonth) + '-' + convert(nvarchar, RI.HoldDay)) as HoldDay
        , RI.Weather
        , RI.Range
        , RI.Venue
        , RI.Ground
        , RI.GroundCondition
        , RHI.TrainerID
        , RHI.HorseGender
        , RHI.HorseWeight
        , convert(int, RHI.Fluctuation) as Fluctuation
        , RHI.JockeyID
        , RHI.HorseID
        , ROW_NUMBER()over(partition by RHI.HorseID order by convert(datetime, convert(nvarchar, RI.Year) + '-' + convert(nvarchar, RI.HoldMonth) + '-' + convert(nvarchar, RI.HoldDay))) as num
    from RaceHorseInfomation as RHI
        left outer join RaceInfomation as RI
            on RI.ID = RHI.RaceID
    where
        RHI.HorseID is not null
        and RI.Direction <> 3
) as RHI
`
        return await this.ExecGet(sql)
    }
}
