import { PythonShell } from "python-shell";
const shell = new PythonShell('./src/python/test.py')
shell.on('message', function(message){
    console.log(message)
})