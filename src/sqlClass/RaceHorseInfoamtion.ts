import SQLBase from "../SQLBase";
import { convertToEmptyString, getDateDifferenceInDays } from "./Util";

export class RaceHorseInfomation extends SQLBase<RaceHorseInfomation[]> {
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
    public OutValue: boolean = false
    public Cource: number = 0
    public Condition: number = 0
    public RapTime1: number = 0
    public RapTime2: number = 0
    public RapTime3: number = 0
    public RapTime4: number = 0
    public RapTime5: number = 0
    public TrainingLoad: number = 0
    public HoldDate: Date = new Date()
    public RaceMasterID: number = 0
    public before: number = 0
    public RaceRow: string = ''
    public RotationRow: string = ''
    public JockeyRow: string = ''
    public Achievement: number[] = []
    private timeAverage: {
        [key: string] : number
    } = {}
    constructor(raceID: number, horseIDs: number[], timeAverage: {[key: string] : number}) {
        super()
        this.timeAverage = timeAverage
        if (horseIDs.length == 0) {
            throw new Error(`HorseIDが指定されていません。RaceID : ${raceID}`)
        }
        if (!(raceID > 0)) {
            throw new Error('RaceIDが指定されていません。')
        }

        this.sql = `
with training as (
    select
          RHI.RaceID
        , RHI.HorseID
        , C.num as Cource
        ,       case TR.GroundCondition
                when  '''良''' then 1
                when  '''稍重''' then 2
                when  '''重''' then 3
                when  '''不良''' then 4
                else 5
          end as Condition
        , RapTime1
        , RapTime2
        , RapTime3
        , RapTime4
        , RapTime5
        , TrainingLoad.num as TrainingLoad
    from Training as TR
    left outer join RaceHorseInfomation as RHI
            on RHI.netkeibaID = TR.HorseID
            and RHI.netkeibaRaceID = TR.RaceID
    left outer join (
            select
                    Course
                    , ROW_NUMBER()over(order by count(Course) desc) as num
            from Training as TR
            Group by
                    Course
            ) as C
            on C.Course = TR.Course
    left outer join (
        select
              TR.RaceID as RaceID
            , TR.HorseID as HorseID
            , num
        from Training as TR
            left outer join (
                select
                    TR.TrainingLoad
                    , ROW_NUMBER()over(order by TrainingLoad) as num
                from Training as TR
                group by
                    TrainingLoad
            ) as TrainingLoad
                on TrainingLoad.TrainingLoad = TR.TrainingLoad
    ) as TrainingLoad
        on TrainingLoad.HorseID = TR.HorseID
        and TrainingLoad.RaceID = TR.RaceID
),
HoldDate as (
	select
		DATEFROMPARTS(Year, HoldMonth, HoldDay) AS HoldDate
    from RaceInfomation
    where
		ID = ${raceID}
)
select
      RHI.HorseID
    , RHI.RaceID
    , Rank
    , Venue
    , Hold
    , Day
    , HoldMonth
    , HoldDay
    , RI.Range
    , RI.Direction
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
    , Cource
    , Condition
    , RapTime1
    , RapTime2
    , RapTime3
    , RapTime4
    , RapTime5
    , TrainingLoad
    , DATEFROMPARTS(Year, HoldMonth, HoldDay) AS HoldDate
    , RaceMasterID
from RaceHorseInfomation as RHI
	left outer  join RaceInfomation as RI
		on RI.ID = RHI.RaceID
	left outer join training as tr
		on tr.RaceID = RI.ID
		and tr.HorseID = RHI.HorseID
where
	    DATEFROMPARTS(Year, HoldMonth, HoldDay) <= (select * from HoldDate)
    and RHI.HorseID in (${horseIDs})
order by
        HorseID
        , DATEFROMPARTS(Year, HoldMonth, HoldDay) desc
`
    }

    public async Execsql(): Promise<RaceHorseInfomation[]>{
        return await this.ExecGet(this.sql)
    }
    private Dammy() {
        const rowBase = this.GetRowBase(null)
        const rowRace = `${convertToEmptyString(this.GoalTime)},${rowBase},${this.GetRowRace(null)}`
        this.RotationRow = `${rowRace},${this.GetRowRotation(null)}`
        return this
    }

    public async GetDicRaceHorseInfomation() {
        const raceHorseInfomations = (await this.Execsql()).filter(x => x.Direction != 3)
        var dic: {
            [HorseID: number]: RaceHorseInfomation[]
        } = {}
        for (var raceHorseInfomation of raceHorseInfomations) {
            let age = 0
            if (raceHorseInfomation.HorseAge == 3) {
                age = 1
            } else if (raceHorseInfomation.HorseAge > 3){
                age = 2
            }
            const averageTime = this.timeAverage[`${raceHorseInfomation.Direction}_${raceHorseInfomation.Range}_${age}`]
            raceHorseInfomation.GoalTime = raceHorseInfomation.GoalTime - averageTime /* あんまりよくないけど書き換える*/
            const rowBase = this.GetRowBase(raceHorseInfomation)
            const rowRace = `${rowBase},${this.GetRowRace(raceHorseInfomation)}`
            if (dic[raceHorseInfomation.HorseID] == undefined) {
                dic[raceHorseInfomation.HorseID] = []
                raceHorseInfomation.Achievement = new Array(713).fill(null)
                raceHorseInfomation.JockeyRow = `${raceHorseInfomation.JockeyID},${rowBase}`
                raceHorseInfomation.RaceRow = rowRace
                raceHorseInfomation.RotationRow = `${
                    raceHorseInfomation.RaceRow},${
                    convertToEmptyString(raceHorseInfomation.Cource)},${
                    convertToEmptyString(raceHorseInfomation.Condition)},${
                    convertToEmptyString(raceHorseInfomation.RapTime1)},${
                    convertToEmptyString(raceHorseInfomation.RapTime2)},${
                    convertToEmptyString(raceHorseInfomation.RapTime3)},${
                    convertToEmptyString(raceHorseInfomation.RapTime4)},${
                    convertToEmptyString(raceHorseInfomation.RapTime5)},${
                    convertToEmptyString(raceHorseInfomation.TrainingLoad)}`
            } else {
                const lastValue = dic[raceHorseInfomation.HorseID].at(-1)
                raceHorseInfomation.before = getDateDifferenceInDays(lastValue?.HoldDate as Date, raceHorseInfomation.HoldDate)

                raceHorseInfomation.RotationRow = `${convertToEmptyString(raceHorseInfomation.GoalTime)},${rowRace},${this.GetRowRotation(raceHorseInfomation)}`
                if (dic[raceHorseInfomation.HorseID][0].Achievement[raceHorseInfomation.RaceMasterID - 1] == undefined) {
                    dic[raceHorseInfomation.HorseID][0].Achievement[raceHorseInfomation.RaceMasterID - 1] = raceHorseInfomation.GoalTime
                } else if (dic[raceHorseInfomation.HorseID][0].Achievement[raceHorseInfomation.RaceMasterID - 1] > raceHorseInfomation.GoalTime){
                    dic[raceHorseInfomation.HorseID][0].Achievement[raceHorseInfomation.RaceMasterID - 1] = raceHorseInfomation.GoalTime
                }
            }
            dic[raceHorseInfomation.HorseID].push(raceHorseInfomation)
        }
        const horseIDs = Object.keys(dic).map(x => Number(x))
        for (const horseID of horseIDs) {
            while (dic[horseID].length < 7) {
                dic[horseID].push(this.Dammy())
            }
        }
        return dic
    }

    GetRowBase(params: RaceHorseInfomation | null) {
        const rowBase = `${
            convertToEmptyString(params != null ? params.Venue : this.Venue)},${
            convertToEmptyString(params != null ? params.Hold : this.Hold)},${
            convertToEmptyString(params != null ? params.Day : this.Day)},${
            convertToEmptyString(params != null ? params.HoldMonth : this.HoldMonth)},${
            convertToEmptyString(params != null ? params.Range : this.Range)},${
            convertToEmptyString(params != null ? params.Direction : this.Direction)},${
            convertToEmptyString(params != null ? params.Ground : this.Ground)},${
            convertToEmptyString(params != null ? params.Weather : this.Weather)},${
            convertToEmptyString(params != null ? params.GroundCondition : this.GroundCondition)}`
        return rowBase
    }

    GetRowRace(params: RaceHorseInfomation | null) {
        const rowRace = `${
            convertToEmptyString(params != null ? params.GateNo : this.GateNo)},${
            convertToEmptyString(params != null ? params.HorseNo : this.HorseNo)},${
            convertToEmptyString(params != null ? params.HorseAge : this.HorseAge)},${
            convertToEmptyString(params != null ? params.HorseGender : this.HorseGender)},${
            convertToEmptyString(params != null ? params.Weight : this.Weight)},${
            convertToEmptyString(params != null ? params.JockeyID : this.JockeyID)},${
            convertToEmptyString(params != null ? params.HorseWeight : this.HorseWeight)},${
            convertToEmptyString(params != null ? params.Fluctuation : this.Fluctuation)},${
            convertToEmptyString(params != null ? params.TrainerID : this.TrainerID)}`
        return rowRace
    }

    GetRowRotation(params: RaceHorseInfomation | null) {
        const rotationRow = `${
            convertToEmptyString(params != null ? params.Passage1 : this.Passage1)},${
            convertToEmptyString(params != null ? params.Passage2 : this.Passage2)},${
            convertToEmptyString(params != null ? params.Passage3 : this.Passage3)},${
            convertToEmptyString(params != null ? params.Passage4 : this.Passage4)},${
            convertToEmptyString(params != null ? params.SpurtTime : this.SpurtTime)},${
            convertToEmptyString(params != null ? params.Remarks : this.Remarks)},${
            convertToEmptyString(params != null ? params.RaceRemarks : this.RaceRemarks)},${
            convertToEmptyString(params != null ? params.Barn : this.Barn)},${
            convertToEmptyString(params != null ? params.Cource : this.Cource)},${
            convertToEmptyString(params != null ? params.Condition : this.Condition)},${
            convertToEmptyString(params != null ? params.RapTime1 : this.RapTime1)},${
            convertToEmptyString(params != null ? params.RapTime2 : this.RapTime2)},${
            convertToEmptyString(params != null ? params.RapTime3 : this.RapTime3)},${
            convertToEmptyString(params != null ? params.RapTime4 : this.RapTime4)},${
            convertToEmptyString(params != null ? params.RapTime5 : this.RapTime5)},${
            convertToEmptyString(params != null ? params.TrainingLoad : this.TrainingLoad)},${
            convertToEmptyString(params != null ? params.before : this.before)}`
            .replace(/0/g, '')
        return rotationRow
    }
}