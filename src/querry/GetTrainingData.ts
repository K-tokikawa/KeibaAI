import SQLBase from "../SQLBase"
import EntTrainingData from "../entity/EntTrainingData"
import PrmStudyData from "../param/PrmStudyData"
export default class GetTrainingData extends SQLBase<EntTrainingData[]>
{

    private parameter: PrmStudyData | null

    constructor(prm: PrmStudyData | null) {
        super()
        this.parameter = prm
    }
    public async Execsql(): Promise<EntTrainingData[]> {
        const sql = `
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
where
    RHI.HorseID in (${this.parameter?.IDs})
`
        return await this.ExecGet(sql)
    }
}
