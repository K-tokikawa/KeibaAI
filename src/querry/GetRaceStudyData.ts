import SQLBase from "../SQLBase"
import EntRaceStudyData from "../entity/EntRaceStudyData"
import PrmStudyData from "../param/PrmStudyData"
export default class GetRaceStudyData extends SQLBase<EntRaceStudyData[]>
{
    private parameter: PrmStudyData | null

    constructor(prm: PrmStudyData | null) {
        super()
        this.parameter = prm
    }
    public async Execsql(): Promise<EntRaceStudyData[]> {
        const sql = `
select
      HorseID
    , GoalTime
    , Direction
    , HoldDay
    , HoldMonth
    , Hold
    , Day
    , ID
    , Venue
    , Range
    , Ground
    , GroundCondition
    , Weight
    , TrainerID
    , HorseGender
    , HorseWeight
    , HorseAge
    , Passage1
    , Passage2
    , Passage3
    , Passage4
    , SpurtTime
    , Fluctuation
    , JockeyID
    , lag(RHI.HoldDay)over(partition by RHI.HorseID order by RHI.num) as before
    , num
from (
    select
          RHI.GoalTime
        , convert(datetime, convert(nvarchar, RI.Year) + '-' + convert(nvarchar, RI.HoldMonth) + '-' + convert(nvarchar, RI.HoldDay)) as HoldDay
        , RHI.OutValue
        , case when RI.Direction = 3 then null else RI.Direction end as Direction
        , RI.HoldMonth
        , RI.Hold
        , RI.Day
        , RI.Weather
        , RM.ID
        , RI.Range
        , RI.Venue
        , RI.Ground
        , RI.GroundCondition
        , RHI.Weight
        , RHI.TrainerID
        , RHI.HorseGender
        , RHI.HorseWeight
        , case when RI.Year > 2000 then RHI.HorseAge else RHI.HorseAge - 1 end as HorseAge
        , RHI.Passage1
        , RHI.Passage2
        , RHI.Passage3
        , RHI.Passage4
        , RHI.SpurtTime
        , convert(int, RHI.Fluctuation) as Fluctuation
        , RHI.JockeyID
        , RHI.HorseID
        , ROW_NUMBER()over(partition by RHI.HorseID order by convert(datetime, convert(nvarchar, RI.Year) + '-' + convert(nvarchar, RI.HoldMonth) + '-' + convert(nvarchar, RI.HoldDay)) desc) as num
    from RaceHorseInfomation as RHI
        left outer join RaceInfomation as RI
            on RI.ID = RHI.RaceID
        left outer join RaceMaster as RM
            on RM.ID = RI.RaceMasterID
    where
        RHI.HorseID is not null
        and RI.Direction <> 3
        and OutValue = 0
) as RHI
where
    RHI.HorseID between ${this.parameter?.Start} and ${this.parameter?.Finish}
order by
    RHI.HorseID
`
        return await this.ExecGet(sql)
    }
}