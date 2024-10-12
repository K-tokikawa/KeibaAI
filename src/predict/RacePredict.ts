import { PredictHorseID } from "../sql/PredictHorseID";
import { RaceHorseInfomation } from "../sql/RaceHorseInfoamtion";
import { TimeAverage } from "../sql/TimeAverage";
import AnalysisData from "./AnalysisData";

export default async function RacePredict(Year: number, Month: number, HoldDay: number, Round: number[]) {
    const analysisData = new AnalysisData()
    const races = await analysisData.GetAnalysisData(Year, Month, HoldDay, Round)
    // 出走馬の最新のRaceIDを取得
    for (const race of races) {

        // netkeibaIDからDBのhorseIDを取得
    }
    // RaceInfomationに投げて予測レースより以前のデータを取得する。

    return races
}

async function GetHorseRecentRace(race: AnalysisData) {
    const netkeibaHorseIDs = race.Horse.map(x => x.HorseID)
    const predictHorse = new PredictHorseID(netkeibaHorseIDs)
    const recentDatas = await predictHorse.Execsql()
    const timeAverage = new TimeAverage()
    const timeAverages = await timeAverage.GetDicTimeAverage()

    for (const recentData of recentDatas) {
        const horseID = recentData.HorseID
        const raceID = recentData.RaceID
        const horseData = race.Horse.find(x => x.HorseID == recentData.netkeibaID)
        if (horseData == undefined) continue
        const raceHorseInfomation = new RaceHorseInfomation(raceID, [horseID], timeAverages) 
        raceHorseInfomation.HorseID = horseID
        raceHorseInfomation.RaceID = raceID
        raceHorseInfomation.Venue = Number(race.Venue)
        raceHorseInfomation.Hold = Number(race.Hold)
        raceHorseInfomation.Day = Number(race.Day)
        raceHorseInfomation.HoldMonth = Number(race.HoldMonth)
        raceHorseInfomation.HoldDay = Number(race.HoldDay)
        raceHorseInfomation.Range = Number(race.Range)
        raceHorseInfomation.Direction = Number(race.Direction)
        raceHorseInfomation.Ground = Number(race.Ground)
        raceHorseInfomation.Weather = Number(race.Weather)
        raceHorseInfomation.GroundCondition = Number(race.GroundCondition)
        raceHorseInfomation.GateNo = Number(horseData.GateNo)
        raceHorseInfomation.HorseNo = Number(horseData.HorseNo)
        raceHorseInfomation.HorseAge = Number(horseData.HorseAge)
        raceHorseInfomation.HorseGender = Number(horseData.HorseGender)
        raceHorseInfomation.Weight = Number(horseData.Weight)
        raceHorseInfomation.JockeyID = Number(horseData.JockeyID)
        raceHorseInfomation.HorseWeight = Number(horseData.HorseWeight)
        raceHorseInfomation.Fluctuation = Number(horseData.Fluctuation)
        raceHorseInfomation.Barn = Number(horseData.Barn)
        raceHorseInfomation.TrainerID = Number(horseData.TrainerID)
        // raceHorseInfomation.Cource = 
        // raceHorseInfomation.Condition = 
        // raceHorseInfomation.RapTime1 = 
        // raceHorseInfomation.RapTime2 = 
        // raceHorseInfomation.RapTime3 = 
        // raceHorseInfomation.RapTime4 = 
        // raceHorseInfomation.RapTime5 = 
        // raceHorseInfomation.TrainingLoad = 
        
    }
    // 
}