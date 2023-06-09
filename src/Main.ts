import GetBloodStudyData from "./GetBloodStudyData"
import PrmBloodStudyData from "./PrmBloodStudyData"
import FileUtil from "./FileUtil"
import EntBloodStudyData from "./EntBloodStudyData"
main()
async function main() {
    const range = 1000
    const param = new PrmBloodStudyData(range)
    const sql = new GetBloodStudyData(param)
    console.log('sql')
    const value = await sql.Execsql() as EntBloodStudyData[]
    value.forEach((row: EntBloodStudyData) => {
        console.log(`${row.R1000c1a0}`)
    })
}
