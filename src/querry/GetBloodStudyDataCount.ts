import SQLBase from "../SQLBase"
import EntStudyDataCount from "../entity/EntStudyDataCount"
export default class GetBloodStudyDataCount extends SQLBase<EntStudyDataCount[]>
{

    constructor() {
        super()
    }
    public async Execsql(): Promise<EntStudyDataCount[]> {
        const sql = `
select
    count(FS.HorseID) as Count
from RaceHorseInfomation as RHI
    left outer join RaceInfomation as RI
        on RI.ID = RHI.RaceID
    left outer join HorseMaster as HM
        on HM.ID = RHI.HorseID
    left outer join HorseMaster as Father
        on Father.netkeibaID = HM.Father
    inner join FatherScore as FS
        on FS.HorseID = Father.ID
    left outer join TimeAverage as TA
        on TA.ID = RHI.Average
`
        return await this.ExecGet(sql)
    }
}
