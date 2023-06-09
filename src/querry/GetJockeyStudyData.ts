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
      Rank
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
from (
    select
        ROW_NUMBER()over(order by JockeyID) as ID
        , RHI.Rank
        , RHI.JockeyID
        , RHI.HorseGender
        , case when RI.Year > 2000 then RHI.HorseAge else RHI.HorseAge - 1 end as Age
        , RI.Venue
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
    from RaceHorseInfomation as RHI
        left outer join RaceInfomation as RI
            on RI.ID = RHI.RaceID
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
    RHI.Rank is not null
    and RHI.ID between ${this.parameter?.Start} and ${this.parameter?.Finish}
`
        return await this.ExecGet(sql)
    }
}