export default class EntRaceInfomationData{
    public ID: number
    public Venue: string
    public Range: number
    public Ground: number
    public GroundCondition: number
    public Weather: number
    public HoldMonth: number
    public Hold: number
    public Day: number
    public HoldDay: Date
    public hc: number

    constructor() {
        this.ID = 0
        this.Venue = ''
        this.Range = 0
        this.Ground = 0
        this.GroundCondition = 0
        this.Weather = 0
        this.HoldMonth = 0
        this.Hold = 0
        this.Day = 0
        this.HoldDay = new Date()
        this.hc = 0
    }
}