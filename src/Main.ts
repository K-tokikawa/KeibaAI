import { RaceInfomation } from "./sqlClass/RaceInfomation"
import { RaceHorseInfomation } from "./sqlClass/RaceHorseInfoamtion"
import { BloodData } from "./sqlClass/BloodData"
import FileUtil from "./FileUtil"
import simpleProgress from "./ProgressBar"
import { ExecPythontrainExplanatoryValue, Predict } from "./sqlClass/Util"
import { PythonShell } from "python-shell"
import { RaceHorseInfoamtion_row } from "./sqlClass/RaceHorseInfoamtion_row"

const MODE: ('Study' | 'Predict') = 'Predict'
const CREATEDATAMODE: ('All' | 'Row') = 'All'
main()

async function main() {
  await CreateStudyData()
  // await predict()
}

async function predict(){
  await ExecPythontrainExplanatoryValue()
}

async function CreateStudyData()
{
    // データの取得 2008年くらいから 2008年からしか調教データがない
    // → データ数が多いので分割して取得する。レース情報を期間を指定して取得
    // レース情報を取得 RaceIDでDictinary 
    const startYear = 2014
    const endYear = 2024

    const range = Array.from({ length: endYear - startYear + 1 }, (_, i) => i + startYear).sort((a, b) => b - a);
    const shell = new PythonShell('./src/python/whilepredict.py')
    const shell_1 = new PythonShell('./src/python/whilepredict.py')
    const shell_2 = new PythonShell('./src/python/whilepredict.py')
    const shell_3 = new PythonShell('./src/python/whilepredict.py')
    for (const year of range) {
      // 期間内レースに出走した競走馬情報を取得
      const periods: ('first' | 'second' | 'third' | 'fourth')[] = ['first' , 'second' , 'third' , 'fourth'];
      for (const half of periods) {
            let horseRotationRows: string[] = []
            let horseachievementRows: string[] = []
            let bloodRows: string[] = []
            let jockeyRows: string[] = []
            let predictRows: string[] = []
            const raceInfomations = await GetRaceInfomation(year, half)
            const ProgressBar = simpleProgress()
            const progress = ProgressBar(Object.keys(raceInfomations).length, 20, 'CreateData')
            for (const raceInfomation of raceInfomations) {
              progress(1)
              const raceID = raceInfomation.ID as number
              const horses = raceInfomation.HorseIDs as number[]
              if (CREATEDATAMODE == 'All') {
                const record = await CreateAllRecord(raceID, horses, [shell, shell_1, shell_2, shell_3])

                horseRotationRows = horseRotationRows.concat(record.horseRotationRows)
                horseachievementRows = horseachievementRows.concat(record.horseachievementRows)
                bloodRows = bloodRows.concat(record.bloodRows)
                jockeyRows = jockeyRows.concat(record.jockeyRows)
                predictRows = predictRows.concat(record.predictRows)
              } else {
                const record = await CreateJockeyRecord(raceID, horses)
                jockeyRows = jockeyRows.concat(record)
              }
            }
            if (horseRotationRows.length > 0) {
              FileUtil.OutputFile(horseRotationRows, `./data/rotation_alpha/${year}_${half}.csv`)
            }
            if (horseachievementRows.length > 0) {
              FileUtil.OutputFile(horseachievementRows, `./data/achievement_alpha/${year}_${half}.csv`)
            }
            if (bloodRows.length > 0) {
              FileUtil.OutputFile(bloodRows, `./data/blood_alpha/${year}_${half}.csv`)
            }
            if (jockeyRows.length > 0) {
              FileUtil.OutputFile(jockeyRows, `./data/jockey_alpha/${year}_${half}.csv`)
            }
            if (predictRows.length > 0) {
              FileUtil.OutputFile(predictRows, `./data/predict_alpha/${year}_${half}.csv`)
            }
          }
    }
    // 作成しないといけないデータ
    // 血統
    // 騎手 コース 馬場 距離 芝orダート 斤量 開催月
    // 馬
    // → ローテーション 適性
    // ローテーション 直近5レース タイム コース 馬場 距離 芝orダート 調教 騎手 厩舎 上がりタイム 備考 増減 間隔 斤量
    // 適性 騎手 天気 開催月 馬体重 馬番 性別 年齢 斤量 開催 開催日 + 実績(コース 馬場 距離 芝orダート のタイム タイム 斤量 何日前か)
}
async function CreateAllRecord(raceID: number, horses: number[], pythonShell: PythonShell[]) {
  const horseRotationRows: string[] = []
  const horseachievementRows: string[] = []
  const bloodRows: string[] = []
  const jockeyRows: string[] = []
  const predictRows: string[] = []
  const dicHorseInfomations = await GetDicRaceHorseInfomation(raceID, horses)
  const horseIDs = Object.keys(dicHorseInfomations).map(x => Number(x))
  const dicBloodData = await GetDicBloodData(horseIDs)
  for (const horseID of horseIDs) {
    const horseInfomations  = dicHorseInfomations[horseID]
    const goalTime = horseInfomations[0].GoalTime
    const raceRow = MODE == 'Study' ? goalTime + ',' + horseInfomations[0].RaceRow : horseInfomations[0].RaceRow

    const bloodRow = raceRow + ',' + dicBloodData[horseID]
    const achievementRow = raceRow + ',' + horseInfomations[0].Achievement.join(',')
    const rotationRow = GetRotationRow(horseInfomations)
    const jockeyRow = MODE == 'Study' ? horseInfomations[0].Rank + ',' + horseInfomations[0].JockeyRow : horseInfomations[0].JockeyRow

    if (MODE == 'Study') {
      bloodRows.push(bloodRow)
      horseachievementRows.push(achievementRow)
      horseRotationRows.push(rotationRow)
      jockeyRows.push(jockeyRow)
    } else {
      // Pythonになげる
      const predict = await Promise.all(
        [
          Predict('blood,' + bloodRow, pythonShell[0]),
          Predict('achievement,' + achievementRow, pythonShell[1]),
          Predict('rotation,' + rotationRow, pythonShell[2]),
          Predict('jockey,' + jockeyRow, pythonShell[3]),
        ]
      )
      console.log(predict)
      // 結果とGoalTimeを結合してファイルに出力する
      const predictRow = goalTime + ',' + `${predict[0]},${predict[1]},${predict[2]},${predict[3]}}`
      predictRows.push(predictRow)
    }
  }
  return {
    horseRotationRows,
    horseachievementRows,
    bloodRows,
    jockeyRows,
    predictRows
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
    const raceRow = goalTime + ',' + horseInfomations[0].RaceRow

    const bloodRow = raceRow + ',' + dicBloodData[horseID]
    const jockeyRow = horseInfomations[0].Rank + ',' + horseInfomations[0].JockeyRow

    bloodRows.push(bloodRow)
    jockeyRows.push(jockeyRow)
  }
  return jockeyRows
}

async function GetRaceInfomation(year: number, half: 'first' | 'second' | 'third' | 'fourth') {
  const period = generateHalfYearPeriod(half)
  const races = new RaceInfomation(year, period.start, period.end)
  return await races.Execsql()
}

async function GetDicRaceHorseInfomation(raceID: number, horseIDs: number[]) {
  const horses = new RaceHorseInfomation(raceID, horseIDs)
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
  let rotatinRow = ''
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