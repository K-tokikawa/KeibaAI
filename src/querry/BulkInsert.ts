import SQLBase from "../SQLBase"

export default class BulkInsert extends SQLBase<number>
{
    private parameter: string[];
    private dbName: string
    constructor(prm: string[], dbName: string) {
        super()
        this.parameter = prm
        this.dbName = dbName
    }
    public async Execsql(): Promise<number> {
        return 0
    }

    public async BulkInsert(filename: string) {
        return await this.ExecBulkInsert(this.dbName, this.parameter, `D:\\data\\${filename}.csv`)
    }
}