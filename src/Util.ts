import { PythonShell } from "python-shell";

export function convertToEmptyString(value: any): string {
    return (value === null || isNaN(value)) ? "" : String(value);
  }

export function getDateDifferenceInDays(date1: Date, date2: Date): number {
    // ミリ秒の差を計算
    const timeDifference = Math.abs(date2.getTime() - date1.getTime());
    
    // 1日のミリ秒数
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    
    // ミリ秒の差を1日あたりのミリ秒数で割って、日数に変換
    return Math.floor(timeDifference / millisecondsPerDay);
}

export function Predict(data: string, shell: PythonShell): Promise<number | null>{
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

export function formatNumber(num: number): string {
    // 数字が10以下の場合は二桁にする
    return num.toString().padStart(2, '0');
}

export function convertToDate(time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0, 0); // 時、分、秒、ミリ秒を設定
    return now;
}