export default class PrmStudyData {
    private m_Start: number
    private m_Finish: number

    constructor(Start: number, Finish: number) {
        this.m_Start = Start
        this.m_Finish = Finish
    }

    public get Start() { return this.m_Start }
    public get Finish() { return this.m_Finish }
}