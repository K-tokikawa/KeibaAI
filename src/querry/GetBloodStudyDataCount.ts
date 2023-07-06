import SQLBase from "../SQLBase"
import EntBloodStudyDataCount from "../entity/EntStudyDataCount"
export default class GetBloodStudyDataCount extends SQLBase<EntBloodStudyDataCount[]>
{

    constructor() {
        super()
    }
    public async Execsql(): Promise<EntBloodStudyDataCount[]> {
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
