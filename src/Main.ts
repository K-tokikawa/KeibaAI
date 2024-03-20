import { CreateBloodStudyData } from "./CreateData/CreateBloodStudyData"
import { CreateHorseStudyData } from "./CreateData/CreateHorseStudyData"
import { CreateJockeyStydyData } from "./CreateData/CreateJockeyStudyData"
import { CreateRaceStudyData } from "./CreateData/CreateRaceStudyData"
import { ExecPythonPredict, ExecPythontrainExplanatoryValue } from "./CreateData/CreateUtil"

const valuenum = 500
main()
async function main(){
    await CreateBloodStudyData(valuenum)
    await CreateJockeyStydyData(valuenum)
    await CreateHorseStudyData(valuenum)
    await ExecPythontrainExplanatoryValue()

    await CreateRaceStudyData(valuenum)
    await ExecPythonPredict()
}


