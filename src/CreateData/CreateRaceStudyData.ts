import { PythonShell } from "python-shell"
import FileUtil from "../FileUtil"
import { multiProgress } from "../ProgressBar"
import MgrPredictData from "../manager/MgrPredictData"
import CreateStudyDataBase from "../class/ClassCreateStudyDataBase"

export async function CreateRaceStudyData(valuenum: number) {
    const shell = new PythonShell('./src/python/whilepredict.py')
    const classcreate = new ClassCreateRaceStudyData()
    classcreate.CreateData(valuenum, shell)
}

class ClassCreateRaceStudyData extends CreateStudyDataBase{
    constructor()
    {
        super()
    }
    async main(Start: number, shell: PythonShell){
        const rows = await CreateRacePredictData(this.mgr, shell)
        const filePath = `./data/predict/${Start}.csv`
        await FileUtil.ContinueOutputFile(filePath, rows)
    }
}

async function CreateRacePredictData(mgr: MgrPredictData, shell: PythonShell) {
    const rows: string[] = []

    const multiProgressber = multiProgress()
    const Raceprogress = multiProgressber().addProgress(Object.keys(mgr.dicRace).length, 20, 'Race')

    const dicpredict: {
        [RaceID: number]: {
            info: string,
            Horses: {
                [HorseNo: number]: 
                {
                    horseinfo: string,
                    rank: number
                }
            }
        }
    } = {}

    for (const strRaceID of Object.keys(mgr.dicRace)) {
        const RaceID = Number(strRaceID)
        const info = mgr.dicRace[RaceID]
        if (dicpredict[RaceID] == undefined) {
            dicpredict[RaceID] = {
                info: `,${info.Venue},${info.Range},${info.Ground},${info.GroundCondition},${info.Weather},${info.Hold},${info.Day}`,
                Horses:[]
            }
        }
        for (let no = 1; no <= 18; no++ ){
            dicpredict[RaceID].Horses[no]={
                horseinfo:',None,None,None,None,None',
                rank:0
            }
        }
        const Horse = mgr.dicHorse[RaceID]

        const predictprogress = multiProgressber().addProgress(Object.keys(Horse).length, 20, 'predict')
        for (const strHorseID of Object.keys(Horse)) {
            predictprogress.addCount(1)
            const HorseID = Number(strHorseID)
            const Horsevalue = Horse[HorseID]

            const JockeyData = `Jockey,${Horsevalue.Jockey},${info.Venue},${info.Range},${info.Ground},${info.GroundCondition},${info.Weather},${info.HoldMonth},${info.Hold},${info.Day},${Horsevalue.HorseNo},${Horsevalue.Weight},${Horsevalue.HorseAge},${Horsevalue.HorseGender},${info.Round}`
            const blood = mgr.BloodData[HorseID]
            const BloodData = `blood,${info.Venue},${info.Range},${info.Ground},${info.GroundCondition},${Horsevalue.Weight},${Horsevalue.HorseAge},${Horsevalue.HorseGender},${blood}`

            try {
                const Aptitude = mgr.dicAptitude[RaceID][HorseID]
                const Rotation = mgr.dicRotation[RaceID][HorseID]
                const Achievement = mgr.dicAchievement[RaceID][HorseID]
                const row = `${info.Venue},${info.Range},${info.Ground},${info.GroundCondition},${info.Weather},${info.HoldMonth},${info.Hold},${info.Day},${Horsevalue.HorseNo},${Horsevalue.Weight},${Horsevalue.HorseWeight},${Horsevalue.HorseAge},${Horsevalue.TrainerID},${Horsevalue.HorseGender},${Horsevalue.Fluctuation},${Horsevalue.Jockey}`
                const rowAptitude = `aptitude,${row},${Aptitude.Aptitude},${blood}`
                const rowRotation = `rotation,${row},${info.Direction},${Rotation.Rotation}`
                const rowAchievement = `achievement,${row},${Achievement.Achievement}`
                const Blood = await Predict(BloodData, shell)
                const Jockey = await Predict(JockeyData, shell)
                const preAchievement = await Predict(rowAchievement, shell)
                const preRotation = await Predict(rowRotation, shell)
                const preAptitude = await Predict(rowAptitude, shell)
    
                dicpredict[RaceID].Horses[Horsevalue.HorseNo] = {
                    horseinfo: `,${Blood},${Jockey},${preAchievement},${preRotation},${preAptitude}`,
                    rank: Horsevalue.Rank
                }
            }catch {
                FileUtil.OutputFile([`${RaceID}_${Horsevalue.HorseNo}`], `${RaceID}.txt`, false)
            }
        }

        for (const strHorseNo of Object.keys(dicpredict[RaceID].Horses)) {
            const HorseNo = Number(strHorseNo)
            const Horsevalue = dicpredict[RaceID].Horses[HorseNo]
            if (Horsevalue.rank != 0) {
                let row = `${Horsevalue.rank}${dicpredict[RaceID].info}${Horsevalue.horseinfo}`
                for (const strEnemyNo of Object.keys(dicpredict[RaceID].Horses)) {
                    const EnemyNo = Number(strEnemyNo)
                    if (EnemyNo != HorseNo) {
                        const Enemyvalue = dicpredict[RaceID].Horses[EnemyNo]
                        row += `${Enemyvalue.horseinfo}`
                    } else {
                        row += ',None,None,None,None,None'
                    }
                }
                rows.push(row)
            }
        }
        predictprogress.del()
        Raceprogress.addCount(1)
    }

    return rows
}
function Predict(data: string, shell: PythonShell): Promise<number | null>{
    return new Promise((resolve) => {
        const datarow = data.split(',')
        const datas = datarow.map(x => {return x == null || x == 'null' ? 'None': x})
        shell.send(`${datas}`)
        let result: number| null = null
        shell.once('message', async function(message){
            result = Number(message.replace('[', '').replace(']', ''))
            resolve(result)
        })
    })

}
