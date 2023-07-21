export default function simpleProgress(){
    const simpleProgress = (maxCount: number, progressLength: number, title: string)=>{
        let nowCount = 0;
    
        return  (addCount: number) =>{
            nowCount += addCount;
    
            const per = Math.min( nowCount / maxCount , 1.0 );
            const count = nowCount <= 0 ? 0 : Math.floor(per * progressLength );
    
            process.stdout.write( `${ title }【${
                "■".repeat( count ) + "□".repeat( progressLength - count)
            }】${ Math.floor(per * 100) }%\r` );
            return per >= 1;
        };
    };
    return simpleProgress
}