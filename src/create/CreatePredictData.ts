import { RaceInfomation } from "../sql/RaceInfomation"
import { RaceHorseInfomation } from "../sql/RaceHorseInfoamtion"
import { BloodData } from "../sql/BloodData"
import FileUtil from "../FileUtil"
import simpleProgress from "../ProgressBar"
import { ExecPythontrainExplanatoryValue, Predict } from "../Util"
import { PythonShell } from "python-shell"
import { RaceHorseInfoamtion_row } from "../sql/RaceHorseInfoamtion_row"
import { TimeAverage } from "../sql/TimeAverage"

let StartYear = 2014
let EndYear = 2023
let MODE: ('Study' | 'Predict') = 'Predict'

let pythonShell: PythonShell[] = []
let pythonShell_2: PythonShell[] = []
let timeAverages : {[key: string]: number} = {}

export async function CreatePredictData(startYear: number, endYear: number, mode: ('Study' | 'Predict')) {
    StartYear = startYear
    EndYear = endYear
    MODE = mode
    const shell = new PythonShell('./src/python/whilepredict.py')
    const shell_1 = new PythonShell('./src/python/whilepredict.py')
    const shell_2 = new PythonShell('./src/python/whilepredict.py')
    const shell_3 = new PythonShell('./src/python/whilepredict.py')
    pythonShell = [shell, shell_1, shell_2, shell_3]
    
    const shell_4 = new PythonShell('./src/python/whilepredict.py')
    const shell_5 = new PythonShell('./src/python/whilepredict.py')
    const shell_6 = new PythonShell('./src/python/whilepredict.py')
    const shell_7 = new PythonShell('./src/python/whilepredict.py')
    pythonShell_2 = [shell_4, shell_5, shell_6, shell_7]
    const timeAverage = new TimeAverage()
    timeAverages = await timeAverage.GetDicTimeAverage()
    await CreateStudyData()
  }
  
  export async function predict(){
    await ExecPythontrainExplanatoryValue()
  }
  
  async function CreateStudyData()
  {
      // データの取得 2008年くらいから 2008年からしか調教データがない
      // → データ数が多いので分割して取得する。レース情報を期間を指定して取得
      // レース情報を取得 RaceIDでDictinary 
      // 作成しないといけないデータ
      // 血統
      // 騎手 コース 馬場 距離 芝orダート 斤量 開催月
      // 馬
      // → ローテーション 適性
      // ローテーション 直近5レース タイム コース 馬場 距離 芝orダート 調教 騎手 厩舎 上がりタイム 備考 増減 間隔 斤量
      // 適性 騎手 天気 開催月 馬体重 馬番 性別 年齢 斤量 開催 開催日 + 実績(コース 馬場 距離 芝orダート のタイム タイム 斤量 何日前か)
  
      const functinons: Promise<void>[] = []
  
      let functinon = CreateDetailStudyData;
      if (MODE == 'Predict') {
        functinon = CreatePredictStudyData
      }
      
      const range = Array.from({ length: EndYear - StartYear + 1 }, (_, i) => i + StartYear).sort((a, b) => b - a);
      for (const year of range) {
        // 期間内レースに出走した競走馬情報を取得
        const periods: ('first' | 'second' | 'third' | 'fourth')[] = ['first' , 'second' , 'third' , 'fourth'];
        for (const period of periods) {
          functinons.push(functinon(year, period))
          if (functinons.length == 2) {
            console.log(new Date())
            await Promise.all(functinons)
            functinons.length = 0
            console.log(new Date())
          }
        }
      }
  }
  
  async function CreateDetailStudyData(year: number, period: ('first' | 'second' | 'third' | 'fourth')) {
    let horseRotationRows: string[] = []
    let horseachievementRows: string[] = []
    let bloodRows: string[] = []
    let jockeyRows: string[] = []
    const raceInfomations = await GetRaceInfomation(year, period, true)
    const ProgressBar = simpleProgress()
    const progress = ProgressBar(Object.keys(raceInfomations).length, 20, `CreateData_${period}`)
    for (const raceInfomation of raceInfomations) {
      progress(1)
      const raceID = raceInfomation.ID as number
      const horses = raceInfomation.HorseIDs as number[]
      const record = await CreateAllRecord(raceID, horses)
      horseRotationRows = horseRotationRows.concat(record.horseRotationRows)
      horseachievementRows = horseachievementRows.concat(record.horseachievementRows)
      bloodRows = bloodRows.concat(record.bloodRows)
      jockeyRows = jockeyRows.concat(record.jockeyRows)
  }
    if (horseRotationRows.length > 0) {
      FileUtil.OutputFile(horseRotationRows, `./data/rotation_alpha/${year}_${period}.csv`)
    }
    if (horseachievementRows.length > 0) {
      FileUtil.OutputFile(horseachievementRows, `./data/achievement_alpha/${year}_${period}.csv`)
    }
    if (bloodRows.length > 0) {
      FileUtil.OutputFile(bloodRows, `./data/blood_alpha/${year}_${period}.csv`)
    }
    if (jockeyRows.length > 0) {
      FileUtil.OutputFile(jockeyRows, `./data/jockey_alpha/${year}_${period}.csv`)
    }
  }
  
  async function CreatePredictStudyData(year: number, period: ('first' | 'second' | 'third' | 'fourth')) {
    let predictRows: string[] = []
    const raceInfomations = await GetRaceInfomation(year, period, false)
    const ProgressBar = simpleProgress()
    const progress = ProgressBar(Object.keys(raceInfomations).length, 20, `CreateData_${year}_${period}`)
    let shells: PythonShell[] = []
    switch (period) {
      case 'first' :
        shells = pythonShell
        break
      case 'second' :
        shells = pythonShell_2
        break
    }
    let count = 0
    for (const raceInfomation of raceInfomations) {
      progress(1)
      count++
      const record = await CreatePredictRows(raceInfomation, shells)
      predictRows = predictRows.concat(record)
      if (count % 100 == 0) {
        // FileUtil.OutputFile(predictRows, `./data/predict_alpha/${year}_${period}_${count}.csv`)
      }
    }
    FileUtil.OutputFile(predictRows, `./data/predict_alpha/${year}_${period}_${count}.csv`)
  }
  
  async function CreateAllRecord(raceID: number, horses: number[]) {
    const horseRotationRows: string[] = []
    const horseachievementRows: string[] = []
    const bloodRows: string[] = []
    const jockeyRows: string[] = []
    const dicHorseInfomations = await GetDicRaceHorseInfomation(raceID, horses)
    const horseIDs = Object.keys(dicHorseInfomations).map(x => Number(x))
    const dicBloodData = await GetDicBloodData(horseIDs)
    for (const horseID of horseIDs) {
      const horseInfomations  = dicHorseInfomations[horseID]
      const studyRows = GetStudyRows(horseInfomations, dicBloodData[horseID])
      bloodRows.push(studyRows.bloodRow)
      horseachievementRows.push(studyRows.achievementRow)
      horseRotationRows.push(studyRows.rotationRow)
      jockeyRows.push(studyRows.jockeyRow)
  }
    return {
      horseRotationRows,
      horseachievementRows,
      bloodRows,
      jockeyRows
    }
  }
  
  async function CreatePredictRows(raceInfomation: RaceInfomation, shells: PythonShell[]) {
    const dicPredictRows: {[horseNo:number]: {predict: string, goalTime: number, outValue: boolean}} = {}
    const horses = raceInfomation.HorseIDs as number[]
    const dicHorseInfomations = await GetDicRaceHorseInfomation(raceInfomation.ID, horses)
    const horseIDs = Object.keys(dicHorseInfomations).map(x => Number(x))
    const dicBloodData = await GetDicBloodData(horseIDs)
    for (const horseID of horseIDs) {
      const horseInfomations  = dicHorseInfomations[horseID]
      const studyRows = GetStudyRows(horseInfomations, dicBloodData[horseID])
      // Pythonになげる
      const predict = await Promise.all(
        [
          Predict('blood,' + studyRows.bloodRow, shells[0]),
          Predict('achievement,' + studyRows.achievementRow, shells[1]),
          Predict('rotation,' + studyRows.rotationRow, shells[2]),
          Predict('jockey,' + studyRows.jockeyRow, shells[3]),
        ]
      )
      // 結果とGoalTimeを結合してファイルに出力する
      const goalTime = horseInfomations[0].GoalTime
      const predictRow = `${predict[0]},${predict[1]},${predict[2]},${predict[3]}`
      dicPredictRows[horseInfomations[0].HorseNo] = {predict: predictRow, goalTime: goalTime, outValue: horseInfomations[0].OutValue}
    }
    const predictRows = []
    const horseNos = Object.keys(dicPredictRows).map(x => Number(x)).sort((a, b) => a - b)
    
    for (const predictHorseNo of horseNos) {
      const predictHorse = dicPredictRows[predictHorseNo]
      if (predictHorse.outValue) {
        continue
      }
      const predictHorseRow = predictHorse.predict
      const predictHorseGoalTime = predictHorse.goalTime
      let predictRow = predictHorseGoalTime + `,${raceInfomation.RaceRow}` + ','+ predictHorseRow
      for (const horseNo of horseNos) {
        if (horseNo != predictHorseNo) {
          const horseRow = dicPredictRows[horseNo].predict
          predictRow += ',' + horseRow
        } else {
          predictRow += ',' + ',,,'
        }
      }
      for (let dammy = 18 - horseNos.length; dammy > 0; dammy--) {
        predictRow += ',' + ',,,'
      }
      predictRows.push(predictRow)
    }
    return predictRows
  }
  
  function GetStudyRows(horseInfomations: RaceHorseInfomation[], dicBloodData: string) {
    const goalTime = horseInfomations[0].GoalTime
    const raceRow = MODE == 'Study' ? goalTime + ',' + horseInfomations[0].RaceRow : horseInfomations[0].RaceRow
  
    const bloodRow = raceRow + ',' + dicBloodData
    const achievementRow = raceRow + ',' + horseInfomations[0].Achievement.join(',')
    const rotationRow = GetRotationRow(horseInfomations)
    const jockeyRow = MODE == 'Study' ? horseInfomations[0].Rank + ',' + horseInfomations[0].JockeyRow : horseInfomations[0].JockeyRow
    return {
      bloodRow,
      achievementRow,
      rotationRow,
      jockeyRow,
    }
  }
  
  async function CreateJockeyRecord(raceID: number, horses: number[]) {
    const dicHorseInfomations = await GetDicRaceHorseInfomation_row(raceID, horses)
    const horseIDs = Object.keys(dicHorseInfomations).map(x => Number(x))
    const jockeyRows: string[] = []
    for (const horseID of horseIDs) {
      const horseInfomations  = dicHorseInfomations[horseID]
      const jockeyRow = horseInfomations[0].Rank + ',' + horseInfomations[0].JockeyRow
      jockeyRows.push(jockeyRow)
    }
    return jockeyRows
  }
  
  async function CreateBloodRecord(raceID: number, horses: number[]) {
    const dicHorseInfomations = await GetDicRaceHorseInfomation_row(raceID, horses)
    const horseIDs = Object.keys(dicHorseInfomations).map(x => Number(x))
    const dicBloodData = await GetDicBloodData(horseIDs)
    const bloodRows: string[] = []
    const jockeyRows: string[] = []
    for (const horseID of horseIDs) {
      const horseInfomations  = dicHorseInfomations[horseID]
      const goalTime = horseInfomations[0].GoalTime
      const raceRow = goalTime + ',' + horseInfomations[0].RaceHorseRow
  
      const bloodRow = raceRow + ',' + dicBloodData[horseID]
      const jockeyRow = horseInfomations[0].Rank + ',' + horseInfomations[0].JockeyRow
  
      bloodRows.push(bloodRow)
      jockeyRows.push(jockeyRow)
    }
    return jockeyRows
  }
  
  async function GetRaceInfomation(year: number, half: 'first' | 'second' | 'third' | 'fourth', outValue: boolean) {
    const period = generateHalfYearPeriod(half)
    const races = new RaceInfomation(year, period.start, period.end, outValue)
    return await races.Execsql()
  }
  
  async function GetDicRaceHorseInfomation(raceID: number, horseIDs: number[]) {
    const horses = new RaceHorseInfomation(raceID, horseIDs, timeAverages)
    return await horses.GetDicRaceHorseInfomation()
  }
  
  async function GetDicRaceHorseInfomation_row(raceID: number, horseIDs: number[]) {
    const horses = new RaceHorseInfoamtion_row(raceID, horseIDs)
    return await horses.GetDicRaceHorseInfomation()
  }
  
  async function GetDicBloodData(horseIDs: number[]) {
    const bloodData = new BloodData(horseIDs)
    return await bloodData.GetDicBloodData()
  }
  
  function GetRotationRow(horseInfomations: RaceHorseInfomation[]){
    let rotatinRow = MODE == 'Study' ? `${horseInfomations[0].GoalTime}` : ''
    let rotationCount = 0
    for(const horseInfomation of horseInfomations) {
      rotatinRow += horseInfomation.RotationRow
      rotationCount++
      if (rotationCount == 6) {
        break
      } else {
        rotatinRow += ','
      }
    }
    return rotatinRow
  }
  
  function generateHalfYearPeriod(half: 'first' | 'second' | 'third' | 'fourth'): { start: number, end: number } {
    let start: number, end: number;
    switch(half) {
      case 'first':
        start = 1
        end = 3
        break;
      case 'second':
        start = 4
        end = 6
        break;
      case 'third':
        start = 7
        end = 9
        break;
      case 'fourth':
        start = 10
        end = 12
        break;
    }
      return {
        start: start,
        end: end,
      };
    }