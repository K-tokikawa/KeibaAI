import SQLBase from "../SQLBase"
import EntRaceInfomationData from "../entity/EntRaceInfomationData"
import PrmStudyData from "../param/PrmStudyData"
export default class GetRaceInfomationData extends SQLBase<EntRaceInfomationData[]>
{
    private parameter: PrmStudyData | null

    constructor(prm: PrmStudyData | null) {
        super()
        this.parameter = prm
    }
    public async Execsql(): Promise<EntRaceInfomationData[]> {
        const sql = `
select
      RI.ID
    , convert(int, Venue) as Venue
    , Direction
    , Range
    , Ground
    , GroundCondition
    , pace
    , Weather
    , HoldMonth
    , Hold
    , Day
    , convert(datetime, convert(nvarchar, RI.Year) + '-' + convert(nvarchar, RI.HoldMonth) + '-' + convert(nvarchar, RI.HoldDay)) as HoldDay
    , Round
    , hc
from RaceInfomation as RI
    left outer join RapTable as RT
        on RT.ID = RI.ID
    left outer join( 
        select
            RHI.RaceID
            , count(RHI.HorseID) as hc
        from RaceHorseInfomation as RHI
        where
            RHI.HorseID is not null
        group by
            RHI.RaceID
    ) as RHI
        on RHI.RaceID = RI.ID
where
    RI.ID between ${this.parameter?.Start} and ${this.parameter?.Finish}
    and RI.Direction is not null
    `
        return await this.ExecGet(sql)
    }
}


