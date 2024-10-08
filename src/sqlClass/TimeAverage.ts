import { time } from "console"
import SQLBase from "../SQLBase"

export class TimeAverage extends SQLBase<TimeAverage[]> {
    public ID : number = 0
    public Direction : number = 0
    public Range : number = 0
    public Age : number = 0
    public Count : number = 0
    public Fastest : number = 0
    public Average : number = 0
    constructor()
    {
        super()
        this.sql =`
select
	*
from TimeAverage
`
    }

    async Execsql():Promise<TimeAverage[]> {
        return await this.ExecGet(this.sql)
    }
    async GetDicTimeAverage() {
        const timeAverages = await this.Execsql()
        const dicTimeAverage: {
            [key: string] : number
        } = {}
        for (const timeAverage of timeAverages) {
            dicTimeAverage[`${timeAverage.Direction}_${timeAverage.Range}_${timeAverage.Age}`] = timeAverage.Average
        }
        return dicTimeAverage
    }
}