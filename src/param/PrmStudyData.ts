export default class PrmStudyData {
    private m_Start: number
    private m_Finish: number
    private m_IDs: number[] | null
    private m_remove: number[] | null
    constructor(Start: number, Finish: number, IDs: number[] | null = null, remove: number[] | null = null) {
        this.m_Start = Start
        this.m_Finish = Finish
        this.m_IDs = IDs
        this.m_remove = remove
    }

    public get Start() { return this.m_Start }
    public get Finish() { return this.m_Finish }
    public get IDs() { return this.m_IDs}
    public get remove() { return this.m_remove}
}