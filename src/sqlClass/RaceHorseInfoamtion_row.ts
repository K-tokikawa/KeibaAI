import SQLBase from "../SQLBase";
import { convertToEmptyString } from "./Util";

export class RaceHorseInfoamtion_row extends SQLBase<RaceHorseInfoamtion_row[]> {
    public HorseID: number = 0
    public RaceID: number = 0
    public Rank: number = 0
    public Venue: number = 0
    public Hold: number = 0
    public Day: number = 0
    public HoldMonth: number = 0
    public HoldDay: number = 0
    public Range: number = 0
    public Direction: number = 0
    public Ground: number = 0
    public Weather: number = 0
    public GroundCondition: number = 0
    public GateNo: number = 0
    public HorseNo: number = 0
    public HorseAge: number = 0
    public HorseGender: number = 0
    public Weight: number = 0
    public JockeyID: number = 0
    public GoalTime: number = 0
    public Passage1: number = 0
    public Passage2: number = 0
    public Passage3: number = 0
    public Passage4: number = 0
    public SpurtTime: number = 0
    public Popularity: number = 0
    public HorseWeight: number = 0
    public Fluctuation: number = 0
    public Remarks: number = 0
    public RaceRemarks: number = 0
    public Barn: number = 0
    public TrainerID: number = 0
    public OutValue: number = 0
    public HoldDate: Date = new Date()
    public RaceMasterID: number = 0
    public before: number = 0
    public RaceRow: string = ''
    public JockeyRow: string = ''
    constructor(raceID: number, horseIDs: number[]) {
        super()
        if (horseIDs.length == 0) {
            throw new Error(`HorseIDが指定されていません。RaceID : ${raceID}`)
        }
        if (!(raceID > 0)) {
            throw new Error('RaceIDが指定されていません。')
        }

        this.sql = `
select
	  RHI.HorseID
	, RHI.RaceID
    , Rank
	, Venue
    , Hold
    , Day
    , HoldMonth
    , HoldDay
    , Range
    , Direction
    , Ground
    , Weather
    , GroundCondition
	, GateNo
	, HorseNo
	, HorseAge
	, HorseGender
	, Weight
	, JockeyID
	, GoalTime
	, Passage1
	, Passage2
	, Passage3
	, Passage4
	, SpurtTime
	, Popularity
	, HorseWeight
	, CAST(Fluctuation AS INT) as Fluctuation
	, Remarks
	, RaceRemarks
	, Barn
	, TrainerID
	, OutValue
    , DATEFROMPARTS(Year, HoldMonth, HoldDay) AS HoldDate
    , RaceMasterID
from RaceHorseInfomation as RHI
	left outer  join RaceInfomation as RI
		on RI.ID = RHI.RaceID
where
	    RHI.RaceID = ${raceID}
    and RHI.HorseID in (${horseIDs})
	and OutValue = 0
`
    }

    public Execsql(): Promise<RaceHorseInfoamtion_row[]>{
        return this.ExecGet(this.sql)
    }
    public async GetDicRaceHorseInfomation() {
        const raceHorseInfomations = await this.Execsql()
        var dic: {
            [HorseID: number]: RaceHorseInfoamtion_row[]
        } = {}
        for (var raceHorseInfomation of raceHorseInfomations) {
            const rowBase = `${
                convertToEmptyString(raceHorseInfomation.Venue)},${
                convertToEmptyString(raceHorseInfomation.Hold)},${
                convertToEmptyString(raceHorseInfomation.Day)},${
                convertToEmptyString(raceHorseInfomation.HoldMonth)},${
                convertToEmptyString(raceHorseInfomation.Range)},${
                convertToEmptyString(raceHorseInfomation.Direction)},${
                convertToEmptyString(raceHorseInfomation.Ground)},${
                convertToEmptyString(raceHorseInfomation.Weather)},${
                convertToEmptyString(raceHorseInfomation.GroundCondition)}`

            const rowRace = `${
                    rowBase},${
                    convertToEmptyString(raceHorseInfomation.GateNo)},${
                    convertToEmptyString(raceHorseInfomation.HorseNo)},${
                    convertToEmptyString(raceHorseInfomation.HorseAge)},${
                    convertToEmptyString(raceHorseInfomation.HorseGender)},${
                    convertToEmptyString(raceHorseInfomation.Weight)},${
                    convertToEmptyString(raceHorseInfomation.JockeyID)},${
                    convertToEmptyString(raceHorseInfomation.HorseWeight)},${
                    convertToEmptyString(raceHorseInfomation.Fluctuation)},${
                    convertToEmptyString(raceHorseInfomation.TrainerID)}`

            if (dic[raceHorseInfomation.HorseID] == undefined) {
                dic[raceHorseInfomation.HorseID] = []
                raceHorseInfomation.JockeyRow = `${raceHorseInfomation.JockeyID},${rowBase}`
                raceHorseInfomation.RaceRow = rowRace
            }
            dic[raceHorseInfomation.HorseID].push(raceHorseInfomation)
        }
        return dic
    }
}