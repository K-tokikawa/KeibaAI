import { CreatePredictData } from "./create/CreatePredictData"

main()

async function main() {
  let startYear = 2014
  let endYear = 2023
  let MODE: ('Study' | 'Predict') = 'Predict'
  await CreatePredictData(startYear, endYear, MODE)
  // await predict()
}

