export default class PrmStudyData {
    private m_Start: number
    private m_Finish: number
    private m_IDs: number[] | null
    private m_remove: number[] | null
    private m_remove2: number[] | null
    private m_remove3: boolean
    constructor(Start: number, Finish: number, IDs: number[] | null = null, remove: number[] | null = null, remove2: number[] | null = null, remove3: boolean = true) {
        this.m_Start = Start
        this.m_Finish = Finish
        this.m_IDs = IDs
        this.m_remove = remove
        this.m_remove2 = remove2
        this.m_remove3 = remove3
    }

    public get Start() { return this.m_Start }
    public get Finish() { return this.m_Finish }
    public get IDs() { return this.m_IDs}
    public get remove() { return this.m_remove}
    public get remove2() { return this.m_remove2}
    public get remove3() { return this.m_remove3}
}