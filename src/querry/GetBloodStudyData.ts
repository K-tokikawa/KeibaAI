import SQLBase from "../SQLBase"
import PrmBloodStudyData from "../param/PrmBloodStudyData"
import EntBloodStudyData from "../entity/EntBloodStudyData"
export default class GetBloodStudyData extends SQLBase<EntBloodStudyData[]>
{
    private parameter: PrmBloodStudyData | null

    constructor(prm: PrmBloodStudyData | null) {
        super()
        this.parameter = prm
    }
    public async Execsql(): Promise<EntBloodStudyData[]> {
        const sql = `
select
      Range
    , Venue
    , Ground
    , GroundCondition
    , time
    , ID_1
    , ID_2
    , ID_3
    , ID_4
    , ID_5
    , ID_6
    , ID_7
    , ID_8
    , ID_9
    , ID_10
    , ID_11
    , ID_12
    , ID_13
    , ID_14
    , ID_15
    , ID_16
    , ID_17
    , ID_18
    , ID_19
    , ID_20
    , ID_21
    , ID_22
    , ID_23
    , ID_24
    , ID_25
    , ID_26
    , ID_27
    , ID_28
    , ID_29
    , ID_30
    , ID_31
    , ID_32
    , ID_33
    , ID_34
    , ID_35
    , ID_36
    , ID_37
    , ID_38
    , ID_39
    , ID_40
    , ID_41
    , ID_42
    , ID_43
    , ID_44
    , ID_45
    , ID_46
    , ID_47
    , ID_48
    , ID_49
    , ID_50
    , ID_51
    , ID_52
    , ID_53
    , ID_54
    , ID_55
    , ID_56
    , ID_57
    , ID_58
    , ID_59
    , ID_60
    , ID_61
    , ID_62
    , ID_63
    , ID_64
    , ID_65
    , ID_66
    , ID_67
    , ID_68
    , ID_69
    , ID_70
    , ID_71
    , ID_72
    , ID_73
    , ID_74
    , ID_75
    , ID_76
    , ID_77
    , ID_78
    , ID_79
    , ID_80
    , ID_81
    , ID_82
    , ID_83
    , ID_84
    , ID_85
    , ID_86
    , ID_87
from (

    select
        RM.Range
        , RM.Venue
        , RM.Ground
        , RM.GroundCondition
        , ROW_NUMBER()over(order by FS.HorseID) as num
        ,   convert(decimal, convert(int, substring(GoalTime, 1, 1)) * 60)
          + convert(decimal, convert(int, substring(GoalTime, 3, 2)))
          + convert(decimal, convert(int, substring(GoalTime, 6, 1))) / 10 - TA.Average as time
        , ID_1
        , ID_2
        , ID_3
        , ID_4
        , ID_5
        , ID_6
        , ID_7
        , ID_8
        , ID_9
        , ID_10
        , ID_11
        , ID_12
        , ID_13
        , ID_14
        , ID_15
        , ID_16
        , ID_17
        , ID_18
        , ID_19
        , ID_20
        , ID_21
        , ID_22
        , ID_23
        , ID_24
        , ID_25
        , ID_26
        , ID_27
        , ID_28
        , ID_29
        , ID_30
        , ID_31
        , ID_32
        , ID_33
        , ID_34
        , ID_35
        , ID_36
        , ID_37
        , ID_38
        , ID_39
        , ID_40
        , ID_41
        , ID_42
        , ID_43
        , ID_44
        , ID_45
        , ID_46
        , ID_47
        , ID_48
        , ID_49
        , ID_50
        , ID_51
        , ID_52
        , ID_53
        , ID_54
        , ID_55
        , ID_56
        , ID_57
        , ID_58
        , ID_59
        , ID_60
        , ID_61
        , ID_62
        , ID_63
        , ID_64
        , ID_65
        , ID_66
        , ID_67
        , ID_68
        , ID_69
        , ID_70
        , ID_71
        , ID_72
        , ID_73
        , ID_74
        , ID_75
        , ID_76
        , ID_77
        , ID_78
        , ID_79
        , ID_80
        , ID_81
        , ID_82
        , ID_83
        , ID_84
        , ID_85
        , ID_86
        , ID_87
    from RaceHorseInfomation as RHI
        left outer join RaceInfomation as RI
            on RI.ID = RHI.RaceID
        left outer join RaceMaster as RM
            on RM.ID = RI.RaceMasterID
        left outer join HorseMaster as HM
            on HM.ID = RHI.HorseID
        left outer join HorseMaster as Father
            on Father.netkeibaID = HM.Father
        inner join FatherScore as FS
            on FS.HorseID = Father.ID
        inner join TimeAverage as TA
            on TA.ID = RHI.Average
    where
        GoalTime <> ''
) as score
where
    score.num BETWEEN ${this.parameter?.Start} and ${this.parameter?.Finish}
`
        return await this.ExecGet(sql)
    }
}