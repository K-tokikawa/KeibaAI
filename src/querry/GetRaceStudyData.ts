import SQLBase from "../SQLBase"
import PrmStudyData from "../param/PrmStudyData"
import EntRaceStudyData from "../entity/EntRaceStudyData"
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
    RHI.HorseID
  , RHI.Hold
  , RHI.Venue
  , RHI.[Range]
  , RHI.Ground
  , RHI.GroundCondition
  , RHI.Weather
  , RHI.RaceID
  , RHI.Rank
  , RHI.Remarks
  , RHI.GateNo
  , RHI.HorseNo
  , RHI.HorseAge
  , RHI.HorseGender
  , RHI.Weight
  , RHI.JockeyID
  , RHI.GoalTime
  , RHI.SpurtTime
  , RHI.HorseWeight
  , RHI.Fluctuation
  , RHI.Barn
  , RHI.TrainerID
from (
    select
          RHI.HorseID
        , RI.[Year] + RI.HoldMonth + RI.HoldDay as Hold
        , RI.Venue
        , RI.[Range]
        , RI.Ground
        , RI.GroundCondition
        , RI.Weather
        , RHI.RaceID
        , RHI.Rank
        , RHI.Remarks
        , RHI.GateNo
        , RHI.HorseNo
        , RHI.HorseAge
        , RHI.HorseGender
        , RHI.Weight
        , RHI.JockeyID
        , RHI.GoalTime
        , RHI.SpurtTime
        , RHI.HorseWeight
        , RHI.Fluctuation
        , RHI.Barn
        , RHI.TrainerID
        , ROW_NUMBER()over(order by RHI.HorseID) as num
    from RaceHorseInfomation as RHI
        left outer join RaceInfomation as RI
            on RI.ID = RHI.RaceID
) as RHI
where
    num between ${this.parameter?.Start} and ${this.parameter?.Finish}
`
        return await this.ExecGet(sql)
    }
}
