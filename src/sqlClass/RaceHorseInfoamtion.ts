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
    public OutValue: number = 0
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
    constructor(raceID: number, horseIDs: number[]) {
        super()
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
			,	case TR.GroundCondition
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
	and OutValue = 0
order by
	HorseID
	, DATEFROMPARTS(Year, HoldMonth, HoldDay) desc
`
    }

    public Execsql(): Promise<RaceHorseInfomation[]>{
        return this.ExecGet(this.sql)
    }
    private Dammy() {
        const rowBase = `${
            convertToEmptyString(this.Venue)},${
            convertToEmptyString(this.Hold)},${
            convertToEmptyString(this.Day)},${
            convertToEmptyString(this.HoldMonth)},${
            convertToEmptyString(this.Range)},${
            convertToEmptyString(this.Direction)},${
            convertToEmptyString(this.Ground)},${
            convertToEmptyString(this.Weather)},${
            convertToEmptyString(this.GroundCondition)}`

        const rowRace = `${
                convertToEmptyString(this.GoalTime)},${
                rowBase},${
                convertToEmptyString(this.GateNo)},${
                convertToEmptyString(this.HorseNo)},${
                convertToEmptyString(this.HorseAge)},${
                convertToEmptyString(this.HorseGender)},${
                convertToEmptyString(this.Weight)},${
                convertToEmptyString(this.JockeyID)},${
                convertToEmptyString(this.HorseWeight)},${
                convertToEmptyString(this.Fluctuation)},${
                convertToEmptyString(this.TrainerID)}`
        this.RotationRow = `${
                    rowRace},${
                    convertToEmptyString(this.Passage1)},${
                    convertToEmptyString(this.Passage2)},${
                    convertToEmptyString(this.Passage3)},${
                    convertToEmptyString(this.Passage4)},${
                    convertToEmptyString(this.SpurtTime)},${
                    convertToEmptyString(this.Remarks)},${
                    convertToEmptyString(this.RaceRemarks)},${
                    convertToEmptyString(this.Barn)},${
                    convertToEmptyString(this.Cource)},${
                    convertToEmptyString(this.Condition)},${
                    convertToEmptyString(this.RapTime1)},${
                    convertToEmptyString(this.RapTime2)},${
                    convertToEmptyString(this.RapTime3)},${
                    convertToEmptyString(this.RapTime4)},${
                    convertToEmptyString(this.RapTime5)},${
                    convertToEmptyString(this.TrainingLoad)},${
                    convertToEmptyString(this.before)}`
                    .replace(/0/g, '')
        return this
    }
    public async GetDicRaceHorseInfomation() {
        const raceHorseInfomations = await this.Execsql()
        var dic: {
            [HorseID: number]: RaceHorseInfomation[]
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
                    convertToEmptyString(raceHorseInfomation.GoalTime)},${
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
                raceHorseInfomation.Achievement = new Array(713).fill(null)
                raceHorseInfomation.JockeyRow = `${raceHorseInfomation.Rank},${rowBase}`
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
                raceHorseInfomation.RotationRow = `${
                    rowRace},${
                    convertToEmptyString(raceHorseInfomation.Passage1)},${
                    convertToEmptyString(raceHorseInfomation.Passage2)},${
                    convertToEmptyString(raceHorseInfomation.Passage3)},${
                    convertToEmptyString(raceHorseInfomation.Passage4)},${
                    convertToEmptyString(raceHorseInfomation.SpurtTime)},${
                    convertToEmptyString(raceHorseInfomation.Remarks)},${
                    convertToEmptyString(raceHorseInfomation.RaceRemarks)},${
                    convertToEmptyString(raceHorseInfomation.Barn)},${
                    convertToEmptyString(raceHorseInfomation.Cource)},${
                    convertToEmptyString(raceHorseInfomation.Condition)},${
                    convertToEmptyString(raceHorseInfomation.RapTime1)},${
                    convertToEmptyString(raceHorseInfomation.RapTime2)},${
                    convertToEmptyString(raceHorseInfomation.RapTime3)},${
                    convertToEmptyString(raceHorseInfomation.RapTime4)},${
                    convertToEmptyString(raceHorseInfomation.RapTime5)},${
                    convertToEmptyString(raceHorseInfomation.TrainingLoad)},${
                    convertToEmptyString(raceHorseInfomation.before)}`
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
}