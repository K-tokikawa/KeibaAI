import SQLBase from "../SQLBase"
import EntRaceHorseInfomationData from "../entity/EntRaceHorseInfomationData"
import PrmStudyData from "../param/PrmStudyData"
export default class GetRaceHorseInfomationData extends SQLBase<EntRaceHorseInfomationData[]>
{
    private parameter: PrmStudyData | null

    constructor(prm: PrmStudyData | null) {
        super()
        this.parameter = prm
    }
    public async Execsql(): Promise<EntRaceHorseInfomationData[]> {
        const sql = `
select
      RaceID
    , HorseID
    , Case when Rank < 6 then Rank else 5 end as Rank
    , HorseNo
    , JM.ID as JockeyID
    , HorseAge
    , HorseGender
    , HorseWeight
    , Weight
    , TrainerID
    , Fluctuation
    , Popularity
    , RaceRemarks
    , Remarks
    , SpurtTime
from RaceHorseInfomation as RHI
    left outer join JockeyMaster as JM
        on JM.JockeyID = RHI.JockeyID
where
    RHI.RaceID in (${this.parameter?.IDs})
    and RHI.HorseID is not null
    `
    
        return await this.ExecGet(sql)
    }
}
