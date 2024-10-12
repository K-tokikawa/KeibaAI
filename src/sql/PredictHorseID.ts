import SQLBase from "../SQLBase"

export class PredictHorseID extends SQLBase<PredictHorseID[]> {
    public HorseID : number = 0
    public RaceID : number = 0
    public netkeibaID: string = ''
    constructor(netKeibaIDs: string[])
    {
        super()
        this.sql =`
select
	top(1)
	  RHI.HorseID
	, RHI.RaceID
    , RHI.netkeibaID
from RaceHorseInfomation as RHI
	left outer join RaceInfomation as RI
		on RI.ID = RHI.RaceID
where
	netkeibaID in (${netKeibaIDs})
order by
	Year desc
	, HoldMonth desc
	, HoldDay desc
`
    }

    async Execsql():Promise<PredictHorseID[]> {
        return await this.ExecGet(this.sql)
    }
}