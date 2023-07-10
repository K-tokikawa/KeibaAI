export default class ClassRotationData{
    private m_GoalTime: number
    private m_OutValue: number
    private m_Direction: number
    private m_Venue: string
    private m_HoldMonth: number
    private m_Hold: number
    private m_Day: number
    private m_ID: number
    private m_Range: number
    private m_Ground: number | null
    private m_GroundCondition: number
    private m_Weight: number
    private m_TrainerID: string
    private m_HorseGender: number
    private m_HorseWeight: number
    private m_Fluctuation: number
    private m_JockeyID: string
    private m_before: number
    constructor(
        GoalTime: number,
        OutValue:number,
        Direction: number,
        Venue: string,
        HoldMonth: number,
        Hold: number,
        Day: number,
        ID: number,
        Range: number,
        Ground: number | null,
        GroundCondition: number,
        Weight: number,
        TrainerID: string,
        HorseGender: number,
        HorseWeight: number,
        Fluctuation: number,
        JockeyID: string,
        before: number,
    ){
        this.m_GoalTime = GoalTime
        this.m_OutValue = OutValue
        this.m_Direction = Direction
        this.m_Venue = Venue
        this.m_HoldMonth = HoldMonth
        this.m_Hold = Hold
        this.m_Day = Day
        this.m_ID = ID
        this.m_Range = Range
        this.m_Ground = Ground
        this.m_GroundCondition = GroundCondition
        this.m_Weight = Weight
        this.m_TrainerID = TrainerID
        this.m_HorseGender = HorseGender
        this.m_HorseWeight = HorseWeight
        this.m_Fluctuation = Fluctuation
        this.m_JockeyID = JockeyID
        this.m_before = before
    }
    public get GoalTime() { return this.m_GoalTime }
    public get OutValue() { return this.m_OutValue }
    public get Direction() { return this.m_Direction}
    public get Venue() { return this.m_Venue }
    public get HoldMonth() { return this.m_HoldMonth }
    public get Hold() { return this.m_Hold }
    public get Day() { return this.m_Day }
    public get Range() { return this.m_Range }
    public get Ground() { return this.m_Ground }
    public get GroundCondition() { return this.m_GroundCondition }
    public get Weight() { return this.m_Weight}
    public get TrainerID() { return this.m_TrainerID }
    public get HorseGender() { return this.m_HorseGender }
    public get HorseWeight() { return this.m_HorseWeight }
    public get Fluctuation() { return this.m_Fluctuation }
    public get JockeyID() { return this.m_JockeyID }
    public get before() { return this.m_before }
}