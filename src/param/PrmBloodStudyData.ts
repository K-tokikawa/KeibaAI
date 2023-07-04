export default class PrmBloodStudyData {
    private m_ID: number
    private m_Start: number
    private m_Finish: number

    constructor(ID: number, Start: number, Finish: number) {
        this.m_ID = ID
        this.m_Start = Start
        this.m_Finish = Finish
    }

    public get ID() { return this.m_ID }
    public get Start() { return this.m_Start }
    public get Finish() { return this.m_Finish }
}