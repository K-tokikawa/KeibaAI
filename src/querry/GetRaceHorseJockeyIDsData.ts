import SQLBase from "../SQLBase"
import EntRaceHorseInfomationData from "../entity/EntRaceHorseJockeyIDsData"
import PrmStudyData from "../param/PrmStudyData"
export default class GetRaceHorseJockeyIDsData extends SQLBase<EntRaceHorseInfomationData[]>
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
    , JockeyID
from RaceHorseInfomation as RHI
where
    RHI.ID in (${this.parameter?.IDs})`
        return await this.ExecGet(sql)
    }
}


