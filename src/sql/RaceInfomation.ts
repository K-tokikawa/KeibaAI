import SQLBase from "../SQLBase"
import { convertToEmptyString } from "../Util"

export class RaceInfomation extends SQLBase<RaceInfomation[]> {
    public ID: number = 0
    public RaceID: number | null= null
    public Venue: number | null= null
    public Year: number | null= null
    public Hold: number | null= null
    public Day: number | null= null
    public HoldMonth: number | null= null
    public HoldDay: number | null= null
    public Round: number | null= null
    public Range: number | null= null
    public Direction: number | null= null
    public Ground: number | null= null
    public Weather: number | null= null
    public GroundCondition: number | null= null
    public RaceMasterID: number | null= null
    public HorseIDs: number[] | null= null
    public RaceRow: string = ''
    constructor(year: number, start: number, end: number, outValue: boolean)
    {
        super()
        if (year <= 0
            || !(start == 1 || start == 4 || start == 7 || start == 10)
            || !(end == 3 || end == 6 || end == 9 || end == 12)) {
            throw new Error(
                `パラメータが正しく設定されていません。
                Year : ${year}
                Start : ${start}
                End : ${end}
                `
            )
        }
        this.sql =`
SELECT 
    RI.ID, 
    RI.RaceID, 
    RI.Venue, 
    RI.Year, 
    RI.Hold, 
    RI.Day, 
    RI.HoldMonth, 
    RI.HoldDay, 
    RI.Round, 
    RI.Range, 
    RI.Direction, 
    RI.Ground, 
    RI.Weather, 
    RI.GroundCondition, 
    RI.RaceMasterID,
    STRING_AGG(RHI.HorseID, ',') WITHIN GROUP (ORDER BY RHI.HorseID) AS HorseIDs,
    convert(Varchar, RI.Venue) + ',' +
    convert(Varchar, RI.Hold) + ',' +
    convert(Varchar, RI.Day) + ',' +
    convert(Varchar, RI.HoldMonth) + ',' +
    convert(Varchar, RI.Range) + ',' +
    convert(Varchar, RI.Direction) + ',' +
    convert(Varchar, RI.Ground) + ',' +
    convert(Varchar, RI.Weather) + ',' +
    convert(Varchar, RI.GroundCondition) as RaceRow
FROM RaceInfomation AS RI
LEFT OUTER JOIN RaceHorseInfomation AS RHI
    ON RHI.RaceID = RI.ID
WHERE
	Year = ${year}
    and HoldMonth between ${start} and ${end}
    ${outValue ? "and OutValue = 0" : ""}
GROUP BY 
    RI.ID, 
    RI.RaceID, 
    RI.Venue, 
    RI.Year, 
    RI.Hold, 
    RI.Day, 
    RI.HoldMonth, 
    RI.HoldDay, 
    RI.Round, 
    RI.Range, 
    RI.Direction, 
    RI.Ground, 
    RI.Weather, 
    RI.GroundCondition, 
    RI.RaceMasterID;
`
    }

    async Execsql():Promise<RaceInfomation[]> {
        return await this.ExecGet(this.sql)
    }

    async GetDicRaceInfomation(): Promise<{[RaceID: number]: RaceInfomation}> {
        const raceInfomations = await this.Execsql()
        const dicRaceInfoamtion = raceInfomations.reduce((x, item) => {
            const horseIDs = item.HorseIDs?.toString().split(",").map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));
            if (horseIDs != undefined) {
                item.HorseIDs = horseIDs
            }
            x[item.ID] = item
            return x
        }, {} as {[key: number]: RaceInfomation}
        )
        return dicRaceInfoamtion
    }
}