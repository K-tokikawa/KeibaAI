import SQLBase from "../SQLBase"
import EntStudyDataCount from "../entity/EntStudyDataCount"
export default class GetRaceStudyDataCount extends SQLBase<EntStudyDataCount[]>
{
    constructor() {
        super()
    }
    public async Execsql(): Promise<EntStudyDataCount[]> {
        const sql = `
select
    max(num)
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
`
        return await this.ExecGet(sql)
    }
}
