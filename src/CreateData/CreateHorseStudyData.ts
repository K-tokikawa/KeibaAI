import { PythonShell } from "python-shell"
import FileUtil from "../FileUtil"
import CreateStudyDataBase from "../class/ClassCreateStudyDataBase"



export async function CreateHorseStudyData(valuenum: number){
    const classcreate = new ClassCreate()
    await classcreate.CreateData(valuenum, null) 
}

class ClassCreate extends CreateStudyDataBase
{
    constructor(){
        super()
    }
    async main(Start: number){
        for (const RaceID of this.mgr.RaceIDs) {
            const Aptituderows: string[] = []
            const Rotationrows: string[] = []
            const Acievementrows: string[] = []
            const Race = this.mgr.dicRace[RaceID]
            const Horses = this.mgr.dicHorse[RaceID]
            for (const strHorseID of Object.keys(Horses)) {
                try {
                    const HorseID = Number(strHorseID)
                    const Horse = Horses[HorseID]
                    const blood = this.mgr.BloodData[HorseID]
                    const row = `${Horse.GoalTime},${Race.Venue},${Race.Range},${Race.Ground},${Race.GroundCondition},${Race.Weather},${Race.HoldMonth},${Race.Hold},${Race.Day},${Horse.HorseNo},${Horse.Weight},${Horse.HorseWeight},${Horse.HorseAge},${Horse.TrainerID},${Horse.HorseGender},${Horse.Fluctuation},${Horse.Jockey}`
    
                    const Aptitude = this.mgr.dicAptitude[RaceID][HorseID]
                    const rowAptitude = `${row},${Aptitude.Aptitude},${blood}`
                    Aptituderows.push(rowAptitude)
    
                    const Rotation = this.mgr.dicRotation[RaceID][HorseID]
                    const rowRotation = `${row},${Race.Direction},${Rotation.Rotation}`
                    Rotationrows.push(rowRotation)
    
                    const Achievement = this.mgr.dicAchievement[RaceID][HorseID]
                    const rowAchievement = `${row},${Achievement.Achievement}`
                    Acievementrows.push(rowAchievement)
                }
                catch
                {

                }
            }
            const RotationfilePath = `./data/rotation/${Start}.csv`
            FileUtil.ContinueOutputFile(RotationfilePath, Rotationrows)
            
            const AchievementfilePath = `./data/achievement/${Start}.csv`
            FileUtil.ContinueOutputFile(AchievementfilePath, Acievementrows)
    
            const AptitudefilePath = `./data/aptitude/${Start}.csv`
            FileUtil.ContinueOutputFile(AptitudefilePath, Aptituderows)
        }
    }
}