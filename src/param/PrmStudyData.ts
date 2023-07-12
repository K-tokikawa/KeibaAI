export default class PrmStudyData {
    private m_Start: number
    private m_Finish: number
    private m_HorseID: number[] | null

    constructor(Start: number, Finish: number, HorseID: number[] | null = null) {
        this.m_Start = Start
        this.m_Finish = Finish
        this.m_HorseID = HorseID
    }

    public get Start() { return this.m_Start }
    public get Finish() { return this.m_Finish }
    public get HorseID() { return this.m_HorseID}
}