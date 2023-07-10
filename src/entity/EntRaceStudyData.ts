export default class EntRaceStudyData{
    public HorseID: number
    public GoalTime: number
    public OutValue: number
    public Direction: number
    public HoldMonth: number
    public Hold: number
    public Day: number
    public HoldDay: Date
    public ID: number
    public Venue: string
    public Range: number
    public Ground: number | null
    public GroundCondition: number
    public Weight: number
    public TrainerID: string
    public HorseGender: number
    public HorseWeight: number
    public Fluctuation: number
    public JockeyID: string
    public before: Date
    public num: number
    constructor(){
        this.HorseID = 0
        this.GoalTime = 0
        this.OutValue = 0
        this.Direction = 0
        this.HoldDay = new Date()
        this.HoldMonth = 0
        this.Hold = 0
        this.Day = 0
        this.ID = 0
        this.Venue = ''
        this.Range = 0
        this.Ground = 0
        this.GroundCondition = 0
        this.Weight = 0
        this.TrainerID = ''
        this.HorseGender = 0
        this.HorseWeight = 0
        this.Fluctuation = 0
        this.JockeyID = ''
        this.before = new Date()
        this.num = 0
    }
}