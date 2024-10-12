import { AxiosBase } from "../axios/AxiosBase";
import iconv from 'iconv-lite'
import { convertToDate } from "../Util";
import { formatNumber } from '../Util'

export default class AnalysisData {
    public ID: number = 0
    public RaceID: string = ''
    public Venue: string = ''
    public Year: number = 0
    public Hold: number = 0
    public Day: number = 0
    public HoldMonth: number = 0
    public HoldDay: number = 0
    public Round: number = 0
    public Range: number = 0
    public Direction: number = 0
    public Ground: number = 0
    public Weather: number = 0
    public GroundCondition: number = 0
    public RaceTime: string = ''
    public Horse: {
        HorseID : string,
        GateNo : number,
        HorseNo : number,
        HorseAge : number,
        HorseGender : number,
        Weight : number,
        JockeyID : string,
        Popularity : number,
        HorseWeight : number,
        Fluctuation : string,
        Barn : number,
        TrainerID : string,
        cancel: boolean
    }[] = []
    constructor() {

    }

    async GetAnalysisData(Year: number, Month: number, HoldDay: number, Rounds: number[]) {
        const lstClassRace: AnalysisData[] = []

        console.log(`${Year}${Month}${HoldDay}`)
        var races = await GetRaceCode(`${Year}${Month < 10 ? `0${Month}` : `${Month}`}${HoldDay < 10 ? `0${HoldDay}` : HoldDay}`)
        for (var race of races) {
            for (const Round of Rounds) {
                const strRound = Round < 10 ? `0${Round}` : `${Round}`
                let strRaceID = `${race}${strRound}`
                const memberurl = `https://race.netkeiba.com/race/shutuba.html?race_id=${strRaceID}&rf=race_submenu`
        
                const axios: AxiosBase = new AxiosBase(memberurl)
                const page = await axios.GET() as Buffer
                
                const pageElement = iconv.decode(page, 'eucjp')
        
                const pages = pageElement.split('\n')
                var VenueCode  = race.substring(5, 6)
                var Hold = Number(race.substring(7, 8))
                var Day = Number(race.substring(9, 10))

                const racedata: AnalysisData = this.PageAnalysis(pages, 0, strRaceID, VenueCode, Year, Hold, Day, Month, HoldDay, Round)
        
                if (racedata.Ground == 3) continue;
                const raceTime = convertToDate(racedata.RaceTime)
                const now = new Date();
                const plusOne = new Date()
                plusOne.setHours(plusOne.getHours() + 1); // 現在の時間に1時間を加算
                  if (Rounds.length > 1) {
                    if (raceTime > now && raceTime < plusOne) {
                        lstClassRace.push(racedata)
                    }
                } else {
                    lstClassRace.push(racedata)
                }
            }
        }
        return lstClassRace
    }

    PageAnalysis(pages: string[], ID: number, RaceID: string, Venue: string, Year: number, Hold: number, Day: number, HoldMonth: number, HoldDay: number, Round: number) {
        let Range = 0
        let Ground = 0
        let Direction = 0
        let Weather = 0
        let GroundCondition = 0
        const dicHorse: {
            [GateNo: number]: {
                [HorseNo: number]: {
                    HorseID: string,
                    HorseAge: number,
                    HorseGender: number,
                    Weight: number,
                    JockeyID: string,
                    Popularity: number,
                    HorseWeight: number,
                    Fluctuation: string,
                    Barn: number,
                    TrainerID: string
                    cancel: boolean
                }
            }
        } = {}
        let HorseID: string | null = ''
        let GateNo: number = 0
        let HorseNo: number = 0
        let cancel: boolean = false
        let RaceTime = ''
        for (const line of pages) {
            if (line.match(/span class="Turf"/)) {
                if (line.match(/.*発走/)) {
                    RaceTime = String(line.match(/.*発走/)?.[0]).replace("発走", "")
                }
                // 距離
                if (line.match(/\d{4}/)) {
                    Range = Number(line.match(/\d{4}/)?.[0])
                }
                // 芝orダート
                if (Ground == 0) {
                    if (line.match(/障/)) {
                        Ground = 3
                    } else if (line.match(/ダ/)) {
                        Ground = 2
                    } else if (line.match(/芝/)) {
                        Ground = 1
                    }
                }
        
                // 向き
                if (line.match(/右/)) {
                    Direction = 1
                } else if (line.match(/左/)) {
                    Direction = 2
                } else if (line.match(/直線/)) {
                    Direction = 3
                }
            }
            if (line.match(/晴/)) {
                Weather = 1
            }
            if (line.match(/曇/)) {
                Direction = 2
            }
            if (line.match(/雨/)) {
                Direction = 3
            }
            if (line.match(/雪/)) {
                Direction = 4
            }
    
            if (line.match(/馬場:良/)){
                GroundCondition = 1
            }
            if (line.match(/馬場:稍/)){
                GroundCondition = 2
            }
            if (line.match(/馬場:重/)){
                GroundCondition = 3
            }
            if (line.match(/馬場:不/)){
                GroundCondition = 4
            }
            
            if (line.match(/Waku[0-9]/)) {
                GateNo = Number(line.match(/(?<=\<span\>).*?(?=\<\/span\>)/)?.[0] as string)
                if (dicHorse[GateNo] == undefined) {
                    dicHorse[GateNo] = {}
                }
            }
            if (line.match(/HorseList Cancel/)) {
                cancel = true
            }
            if (line.match(/Umaban[0-9] /)) {
                HorseNo = Number(line.match(/(?<=Txt_C"\>).*?(?=\<\/td\>)/)?.[0] as string)
                if (dicHorse[GateNo][HorseNo] == undefined) {
                    dicHorse[GateNo][HorseNo] = {
                        HorseID: '',
                        HorseAge: 0,
                        HorseGender: 0,
                        Weight: 0,
                        JockeyID: '',
                        Popularity: 0,
                        HorseWeight: 0,
                        Fluctuation: '',
                        Barn: 0,
                        TrainerID: '',
                        cancel: cancel
                    }
                }
                cancel = false
            }
    
            if (line.match(/(?<=id="myhorse_).*?(?=\")/)) {
                HorseID = line.match(/(?<=id="myhorse_).*?(?=\")/)?.[0] as string
                dicHorse[GateNo][HorseNo].HorseID = HorseID
            }
    
            if (line.match(/Barei Txt_C/)) {
                if (line.match(/牡/)) {
                    dicHorse[GateNo][HorseNo].HorseGender = 1
                }
                if (line.match(/牝/)) {
                    dicHorse[GateNo][HorseNo].HorseGender = 2
                }
                if (line.match(/セ/)) {
                    dicHorse[GateNo][HorseNo].HorseGender = 3
                }
                dicHorse[GateNo][HorseNo].HorseAge = Number(line.match(/\d{1}|\d{2}/)?.[0])
            }
    
            if (line.match(/"Txt_C">\d{2}/)) {
                // dicHorse[GateNo][HorseNo].Weight = Number(line.match(/\d{2}.\d{1}/)?.[0])
                dicHorse[GateNo][HorseNo].Weight = Number(line.match(/\d{2}/)?.[0])
            }
    
            if (line.match(/jockey\/result\/recent/)) {
                dicHorse[GateNo][HorseNo].JockeyID = line.match(/(?<=recent\/).*?(?=\/\")/)?.[0] as string
            }
    
            if (line.match(/\d{3}<small>/)) {
                dicHorse[GateNo][HorseNo].HorseWeight = Number(line.match(/\d{3}/)?.[0] as string)
            }
    
            if (line.match(/(?<=small>\().[0-9][0-9]?(?=\)<\/small)/)) {
                dicHorse[GateNo][HorseNo].Fluctuation = line.match(/(?<=small>\().[0-9][0-9]?(?=\)<\/small)/)?.[0] as string
            }
            if (line.match(/(?<="Label[0-9]">).*?(?=<\/span)/)) {
                if (line.match(/栗東/)) {
                    dicHorse[GateNo][HorseNo].Barn = 1
                }
                if (line.match(/美浦/)) {
                    dicHorse[GateNo][HorseNo].Barn = 2
                }
                if (line.match(/地方/)) {
                    dicHorse[GateNo][HorseNo].Barn = 3
                }
                if (line.match(/海外/)) {
                    dicHorse[GateNo][HorseNo].Barn = 4
                }
            }
            if (line.match(/trainer\/result/)) {
                dicHorse[GateNo][HorseNo].TrainerID = line.match(/(?<=recent\/).*?(?=\/\")/)?.[0] as string
            }
        }
        const Horse : {
            HorseID : string,
            GateNo : number,
            HorseNo : number,
            HorseAge : number,
            HorseGender : number,
            Weight : number,
            JockeyID : string,
            Popularity : number,
            HorseWeight : number,
            Fluctuation : string,
            Barn : number,
            TrainerID : string,
            cancel: boolean
        }[] = []
        this.ID = ID
        this.RaceID = RaceID
        this.Venue = Venue
        this.Year = Year
        this.Hold = Hold
        this.Day = Day
        this.HoldMonth = HoldMonth
        this.HoldDay = HoldDay
        this.Round = Round
        this.Range = Range
        this.Direction = Direction
        this.Ground = Ground
        this.Weather = Weather
        this.GroundCondition = GroundCondition
        this.RaceTime = RaceTime
        this.Horse = Horse
        for (const strGateNo of Object.keys(dicHorse)) {
            const GateNo = Number(strGateNo)
            for (const strHorseNo of Object.keys(dicHorse[GateNo])) {
                const HorseNo = Number(strHorseNo)
                const HorseID = dicHorse[GateNo][HorseNo].HorseID
                const HorseAge = dicHorse[GateNo][HorseNo].HorseAge
                const HorseGender = dicHorse[GateNo][HorseNo].HorseGender
                const Weight = dicHorse[GateNo][HorseNo].Weight
                const JockeyID = dicHorse[GateNo][HorseNo].JockeyID
                const Popularity = dicHorse[GateNo][HorseNo].Popularity
                const HorseWeight = dicHorse[GateNo][HorseNo].HorseWeight
                const Fluctuation = dicHorse[GateNo][HorseNo].Fluctuation
                const Barn = dicHorse[GateNo][HorseNo].Barn
                const TrainerID = dicHorse[GateNo][HorseNo].TrainerID
                const cancel = dicHorse[GateNo][HorseNo].cancel
                const Horse = {
                    HorseID,
                    GateNo,
                    HorseNo,
                    HorseAge,
                    HorseGender,
                    Weight,
                    JockeyID,
                    Popularity,
                    HorseWeight,
                    Fluctuation,
                    Barn,
                    TrainerID,
                    cancel
                }
                this.Horse.push(Horse)
            }
        }
        return this
    }
}




async function GetRaceCode(today: string) {
  try
  {
    var url = `https://p.keibabook.co.jp/cyuou/nittei/${today}`
    const axios: AxiosBase = new AxiosBase(url)
    const page = await axios.GET() as Buffer
          
    const pageElement = iconv.decode(page, 'utf-8')

    const pages = pageElement.split('\n')
    var racecode = []
    for (var line of pages){
      var info = line.match(/(\d+)回([^0-9]+)(\d+)日/)
      if (info){
        var hold = formatNumber(Number(info[1]))
        var venue = GetCode(info[2])
        var holdday = formatNumber(Number(info[3]))
        var date = new Date()
        var Year = date.getFullYear()
        var code = `${Year}${venue}${hold}${holdday}`
        racecode.push(code)
      }
    }
    return racecode
  }catch(e)
  {
    console.log(e)
    throw e
  }
}

function GetCode(venue: string){
  var sapporo = /札幌/
  var hakodate = /函館/
  var hukushima = /福島/
  var nigata = /新潟/
  var tokyo = /東京/
  var nakayama = /中山/
  var tyukyo = /中京/
  var kyoto = /京都/
  var hanshin = /阪神/
  var kokura = /小倉/
  if (venue.match(sapporo)){
    return '01'
  } else if (venue.match(hakodate)){
    return '02'
  } else if (venue.match(hukushima)){
    return '03'
  } else if (venue.match(nigata)){
    return '04'
  } else if (venue.match(tokyo)){
    return '05'
  } else if (venue.match(nakayama)){
    return '06'
  } else if (venue.match(tyukyo)){
    return '07'
  } else if (venue.match(kyoto)){
    return '08'
  } else if (venue.match(hanshin)){
    return '09'
  } else if (venue.match(kokura)){
    return '10'
  } else {
    return ''
  }
}