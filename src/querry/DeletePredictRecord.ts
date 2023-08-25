import SQLBase from "../SQLBase"
import PrmStudyData from "../param/PrmStudyData"
export default class DeletePredictRecord extends SQLBase<void>
{
    private parameter: PrmStudyData | null

    constructor(prm: PrmStudyData | null) {
        super()
        this.parameter = prm
    }
    public async Execsql(): Promise<void> {
        const sql = `
delete AchievementTable where HorseID in (${this.parameter?.IDs})
delete AptitudeTable where HorseID in (${this.parameter?.IDs})
delete RotationTable where HorseID in (${this.parameter?.IDs})

`
        return await this.ExecGet(sql)
    }
}
