import fs from 'fs'
import Encoding from 'encoding-japanese'
import iconv from 'iconv-lite';
export default class FileUtil {

    public static OutputFile(
        lines: string[],
        filePath: string
    ) {
        console.log('output')
        lines.forEach((line, index) => {
            line = line + '\n'
            const arybuf = Encoding.convert(line, {
                from: 'UNICODE',
                to: 'UTF8',
                type: 'arraybuffer',
            });
            if (index == 0) {
                fs.writeFileSync(filePath, Buffer.from(arybuf));
            }
            else {
                fs.appendFileSync(filePath, Buffer.from(arybuf));
            }
        })
    }

    public static DeleteFile(filePath: string) {
        fs.unlinkSync(filePath)
    }
    public static ReadFileSync(filePath: string): string[] {
        const response = fs.readFileSync(filePath)
        const pageElement = iconv.decode(response as Buffer, 'eucjp')
        const page = pageElement.split('\r\n');
        return page
    }

    public static async ContinueOutputFile(filepath: string, lines: string[]){
        return new Promise((resoleve) => {
            let exist = fs.existsSync(filepath)
            lines.forEach((line: string, index: number) => {
                line = line + '\n'
                const arybuf = Encoding.convert(line, {
                    from: 'UNICODE',
                    to: 'UTF8',
                    type: 'arraybuffer',
                });
    
                if (exist) {
                    fs.appendFileSync(filepath, Buffer.from(arybuf))
                } else {
                    fs.writeFileSync(filepath, Buffer.from(arybuf));
                    exist = fs.existsSync(filepath)
                }
            })
            resoleve(true)
        })
    }
}