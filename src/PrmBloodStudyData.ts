export default class PrmBloodStudyData {
    private m_Range: number
    constructor(range: number) {
        this.m_Range = range
    }

    public get Range() { return this.m_Range }
}