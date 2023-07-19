import { PythonShell } from "python-shell";
const shell = new PythonShell('./src/python/predict.py')
// const datas = data.map(x => {return x == None ? 'None': x})
const data = 'rotation,1,2,8,1,5,2000,1,3,1,60,314,1,490,5,7,-6,645,0,112.3,2,8,1,1,1800,1,1,1,60,314,1,496,5,7,6,645,0,108.1,1,7,2,4,1700,2,1,1,61,314,1,490,8,7,-2,645,0,108.2,1,6,1,7,1700,2,1,1,60,314,1,492,3,7,-2,645,0,108.9,3,5,1,7,1700,2,1,2,57,314,1,494,2,7,0,668,0,127.9,3,4,1,3,2000,1,1,1,57,314,1,494,3,7,-10,356,0'
const datarow = data.split(',')
const datas = datarow.map(x => {return x == 'null' ? 'None': x})
shell.send(`${datas}`)
shell.on('message', function(message){
    console.log(message)
})