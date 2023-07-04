export default class PrmBloodStudyDataCount  {
    private m_ID: number

    constructor(ID: number) {
        this.m_ID = ID
    }

    public get ID() { return this.m_ID }
}