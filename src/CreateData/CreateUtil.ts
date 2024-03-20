import { PythonShell } from "python-shell"
import EntStudyDataMinMax from "../entity/EntStudyDataMinMax"

export function GetLoop(Datanum: number, valuenum: number)
{
    let loop = 1
    if (Datanum >= valuenum) {
        loop = Math.ceil(Datanum / valuenum)
    }
    return loop
}

export function GetLoopMin(valuenum: number, minmax: EntStudyDataMinMax[]){
    const min = minmax[0].min
    const max = minmax[0].max
    const Horsecount = max - min + 1
    const loop = Math.ceil(Horsecount / valuenum)

    return [loop, min]
    
}
export function GetStartFinish(valuenum: number, count: number, loop: number, Datanum: number)
{
    let Start = count == 0 ? 1 : + valuenum * count + 1
    let Finish = valuenum * (count + 1)
    if (count + 1 == loop) {
        Finish = Datanum
    }

    return [Start, Finish]
}

export function GetStartFinishMinMax(valuenum: number, count: number, min: number)
{
    const Start = count == 0 ? min : min + valuenum * count
    const Finish = Start + valuenum - 1

    return [Start, Finish]
}

export async function ExecPythontrainExplanatoryValue()
{
    const shell = new PythonShell('./src/python/trainExplanatoryValue.py')
    shell.on('message', function(message) {
        console.log(message)
    })
}

export async function ExecPythonPredict()
{
    const shell = new PythonShell('./src/python/trainPredict.py')
    shell.on('message', function(message) {
        console.log(message)
    })
}