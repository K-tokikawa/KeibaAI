import SQLBase from "../SQLBase"
import EntJockyStudyData from "../entity/EntJockeyStudyData"
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
      GoalTime
    , JockeyID
    , HorseGender
    , Venue
    , Range
    , Ground
    , GroundCondition
    , HoldMonth
    , Popularity
    , Weather
    , HorseNo
    , Age
    , Weight
    , Hold
    , Day
    , Round
    , pace
from (
    select
        ROW_NUMBER()over(order by JM.JockeyID) as ID
        , RHI.GoalTime - TA.Average as GoalTime
        , JM.ID as JockeyID
        , RHI.HorseGender
        , case when RI.Year > 2000 then RHI.HorseAge else RHI.HorseAge - 1 end as Age
        , convert(int, RI.Venue) as Venue
        , RI.[Range]
        , RI.Ground
        , RI.GroundCondition
        , RI.HoldMonth
        , RHI.Popularity
        , RI.Weather
        , RHI.HorseNo
        , RHI.Weight
        , RI.Hold
        , RI.Day
        , RI.Round
        , RT.pace
    from RaceHorseInfomation as RHI
        left outer join RaceInfomation as RI
            on RI.ID = RHI.RaceID
        left outer join RapTable as RT
            on RT.ID = RI.ID
        left outer join JockeyMaster as JM
            on JM.JockeyID = RHI.JockeyID
		inner join TimeAverage as TA
			on TA.ID = RHI.Average
    where
            RHI.OutValue = 0
        and RI.Direction <> 3
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
) as RHI
where
    RHI.GoalTime is not null
    and RHI.ID between ${this.parameter?.Start} and ${this.parameter?.Finish}
`
        return await this.ExecGet(sql)
    }
}