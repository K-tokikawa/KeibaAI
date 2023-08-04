import SQLBase from "../SQLBase"
import EntRaceHorseStudyData from "../entity/EntRaceHorseStudyData"
import PrmStudyData from "../param/PrmStudyData"
export default class GetRaceHorseStudyData extends SQLBase<EntRaceHorseStudyData[]>
{
    private parameter: PrmStudyData | null

    constructor(prm: PrmStudyData | null) {
        super()
        this.parameter = prm
    }
    public async Execsql(): Promise<EntRaceHorseStudyData[]> {
        const sql = `
select
      HorseID
    , RaceID
    , GoalTime
    , Direction
    , HoldDay
    , HoldMonth
    , Hold
    , Day
    , Weather
    , ID
    , Rank
    , Venue
    , Range
    , Ground
    , GroundCondition
    , Round
    , pace
    , Weight
    , TrainerID
    , Age
    , Popularity
    , HorseGender
    , isnull(HorseWeight, lead(HorseWeight)over(partition by RHI.HorseID order by RHI.num)) as HorseWeight
    , HorseNo
    , HorseAge
    , isnull(Passage1, 0) as Passage1
    , isnull(Passage2, 0) as Passage2
    , isnull(Passage3, 0) as Passage3
    , isnull(Passage4, 0) as Passage4
    , SpurtTime
    , isnull(Fluctuation, 0) as Fluctuation
    , RaceRemarks
    , Remarks
    , JockeyID
    , lag(RHI.HoldDay)over(partition by RHI.HorseID order by RHI.num) as before
    , num
from (
    select
          RHI.GoalTime - TA.Average as GoalTime
        , RI.ID as RaceID
        , convert(datetime, convert(nvarchar, RI.Year) + '-' + convert(nvarchar, RI.HoldMonth) + '-' + convert(nvarchar, RI.HoldDay)) as HoldDay
        , RHI.OutValue
        , case when RI.Direction = 3 then null else RI.Direction end as Direction
        , RI.HoldMonth
        , RI.Hold
        , RI.Day
        , RI.Weather
        , RM.ID
        , RHI.Rank
        , RI.Range
        , convert(int, RI.Venue) as Venue
        , RI.Ground
        , RI.GroundCondition
        , RI.Round
        , RT.pace
        , RHI.Weight
        , convert(int, RHI.TrainerID) as TrainerID
        , RHI.HorseAge as Age
        , RHI.Popularity
        , RHI.HorseGender
        , isnull(HorseWeight, lead(HorseWeight)over(partition by RHI.HorseID order by convert(datetime, convert(nvarchar, RI.Year) + '-' + convert(nvarchar, RI.HoldMonth) + '-' + convert(nvarchar, RI.HoldDay)) desc)) as HorseWeight
        , RHI.HorseNo
        , case when RI.Year > 2000 then RHI.HorseAge else RHI.HorseAge - 1 end as HorseAge
        , RHI.Passage1
        , RHI.Passage2
        , RHI.Passage3
        , RHI.Passage4
        , RHI.SpurtTime
        , isnull(RHI.RaceRemarks, 0) as RaceRemarks
        , isnull(RHI.Remarks, 0) as Remarks
        , convert(int, RHI.Fluctuation) as Fluctuation
        , JM.ID as JockeyID
        , RHI.HorseID
        , ROW_NUMBER()over(partition by RHI.HorseID order by convert(datetime, convert(nvarchar, RI.Year) + '-' + convert(nvarchar, RI.HoldMonth) + '-' + convert(nvarchar, RI.HoldDay)) desc) as num
    from RaceHorseInfomation as RHI
        left outer join RaceInfomation as RI
            on RI.ID = RHI.RaceID
        left outer join RaceMaster as RM
            on RM.ID = RI.RaceMasterID
        left outer join JockeyMaster as JM
            on JM.JockeyID = RHI.JockeyID
        left outer join RapTable as RT
            on RT.ID = RI.ID
        inner join TimeAverage as TA
            on TA.ID = RHI.Average
    where
            RHI.HorseID is not null
        and RI.Direction is not null
        and HorseWeight is not null
        ${this.parameter?.remove3 ? 'and OutValue = 0': '' }
) as RHI
where
${this.parameter?.IDs == null ? `RHI.HorseID between ${this.parameter?.Start} and ${this.parameter?.Finish}`: `RHI.HorseID in (${this.parameter?.IDs})`}
order by
    RHI.HorseID
`
        return await this.ExecGet(sql)
    }
}