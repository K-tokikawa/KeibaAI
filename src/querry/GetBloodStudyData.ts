import SQLBase from "../SQLBase"
import PrmBloodStudyData from "../param/PrmStudyData"
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
      , Ground
      , Venue
      , GroundCondition
      , Weight
      , HorseGender
      , Age
      , time
      , F_ID_1
      , F_ID_2
      , F_ID_3
      , F_ID_4
      , F_ID_5
      , F_ID_6
      , F_ID_7
      , F_ID_8
      , F_ID_9
      , F_ID_10
      , F_ID_11
      , F_ID_12
      , F_ID_13
      , F_ID_14
      , F_ID_15
      , F_ID_16
      , F_ID_17
      , F_ID_18
      , F_ID_19
      , F_ID_20
      , F_ID_21
      , F_ID_22
      , F_ID_23
      , F_ID_24
      , F_ID_25
      , F_ID_26
      , F_ID_27
      , F_ID_28
      , F_ID_29
      , F_ID_30
      , F_ID_31
      , F_ID_32
      , F_ID_33
      , F_ID_34
      , F_ID_35
      , F_ID_36
      , F_ID_37
      , F_ID_38
      , F_ID_39
      , F_ID_40
      , F_ID_41
      , F_ID_42
      , F_ID_43
      , F_ID_44
      , F_ID_45
      , F_ID_46
      , F_ID_47
      , F_ID_48
      , F_ID_49
      , F_ID_50
      , F_ID_51
      , F_ID_52
      , F_ID_53
      , F_ID_54
      , F_ID_55
      , F_ID_56
      , F_ID_57
      , F_ID_58
      , F_ID_59
      , F_ID_60
      , F_ID_61
      , F_ID_62
      , F_ID_63
      , F_ID_64
      , F_ID_65
      , F_ID_66
      , F_ID_67
      , F_ID_68
      , F_ID_69
      , F_ID_70
      , F_ID_71
      , F_ID_72
      , F_ID_73
      , F_ID_74
      , F_ID_75
      , F_ID_76
      , F_ID_77
      , F_ID_78
      , F_ID_79
      , F_ID_80
      , F_ID_81
      , F_ID_82
      , F_ID_83
      , F_ID_84
      , F_ID_85
      , F_ID_86
      , F_ID_87
      , M_FS_ID_1
      , M_FS_ID_2
      , M_FS_ID_3
      , M_FS_ID_4
      , M_FS_ID_5
      , M_FS_ID_6
      , M_FS_ID_7
      , M_FS_ID_8
      , M_FS_ID_9
      , M_FS_ID_10
      , M_FS_ID_11
      , M_FS_ID_12
      , M_FS_ID_13
      , M_FS_ID_14
      , M_FS_ID_15
      , M_FS_ID_16
      , M_FS_ID_17
      , M_FS_ID_18
      , M_FS_ID_19
      , M_FS_ID_20
      , M_FS_ID_21
      , M_FS_ID_22
      , M_FS_ID_23
      , M_FS_ID_24
      , M_FS_ID_25
      , M_FS_ID_26
      , M_FS_ID_27
      , M_FS_ID_28
      , M_FS_ID_29
      , M_FS_ID_30
      , M_FS_ID_31
      , M_FS_ID_32
      , M_FS_ID_33
      , M_FS_ID_34
      , M_FS_ID_35
      , M_FS_ID_36
      , M_FS_ID_37
      , M_FS_ID_38
      , M_FS_ID_39
      , M_FS_ID_40
      , M_FS_ID_41
      , M_FS_ID_42
      , M_FS_ID_43
      , M_FS_ID_44
      , M_FS_ID_45
      , M_FS_ID_46
      , M_FS_ID_47
      , M_FS_ID_48
      , M_FS_ID_49
      , M_FS_ID_50
      , M_FS_ID_51
      , M_FS_ID_52
      , M_FS_ID_53
      , M_FS_ID_54
      , M_FS_ID_55
      , M_FS_ID_56
      , M_FS_ID_57
      , M_FS_ID_58
      , M_FS_ID_59
      , M_FS_ID_60
      , M_FS_ID_61
      , M_FS_ID_62
      , M_FS_ID_63
      , M_FS_ID_64
      , M_FS_ID_65
      , M_FS_ID_66
      , M_FS_ID_67
      , M_FS_ID_68
      , M_FS_ID_69
      , M_FS_ID_70
      , M_FS_ID_71
      , M_FS_ID_72
      , M_FS_ID_73
      , M_FS_ID_74
      , M_FS_ID_75
      , M_FS_ID_76
      , M_FS_ID_77
      , M_FS_ID_78
      , M_FS_ID_79
      , M_FS_ID_80
      , M_FS_ID_81
      , M_FS_ID_82
      , M_FS_ID_83
      , M_FS_ID_84
      , M_FS_ID_85
      , M_FS_ID_86
      , M_FS_ID_87
      , MM_FS_ID_1
      , MM_FS_ID_2
      , MM_FS_ID_3
      , MM_FS_ID_4
      , MM_FS_ID_5
      , MM_FS_ID_6
      , MM_FS_ID_7
      , MM_FS_ID_8
      , MM_FS_ID_9
      , MM_FS_ID_10
      , MM_FS_ID_11
      , MM_FS_ID_12
      , MM_FS_ID_13
      , MM_FS_ID_14
      , MM_FS_ID_15
      , MM_FS_ID_16
      , MM_FS_ID_17
      , MM_FS_ID_18
      , MM_FS_ID_19
      , MM_FS_ID_20
      , MM_FS_ID_21
      , MM_FS_ID_22
      , MM_FS_ID_23
      , MM_FS_ID_24
      , MM_FS_ID_25
      , MM_FS_ID_26
      , MM_FS_ID_27
      , MM_FS_ID_28
      , MM_FS_ID_29
      , MM_FS_ID_30
      , MM_FS_ID_31
      , MM_FS_ID_32
      , MM_FS_ID_33
      , MM_FS_ID_34
      , MM_FS_ID_35
      , MM_FS_ID_36
      , MM_FS_ID_37
      , MM_FS_ID_38
      , MM_FS_ID_39
      , MM_FS_ID_40
      , MM_FS_ID_41
      , MM_FS_ID_42
      , MM_FS_ID_43
      , MM_FS_ID_44
      , MM_FS_ID_45
      , MM_FS_ID_46
      , MM_FS_ID_47
      , MM_FS_ID_48
      , MM_FS_ID_49
      , MM_FS_ID_50
      , MM_FS_ID_51
      , MM_FS_ID_52
      , MM_FS_ID_53
      , MM_FS_ID_54
      , MM_FS_ID_55
      , MM_FS_ID_56
      , MM_FS_ID_57
      , MM_FS_ID_58
      , MM_FS_ID_59
      , MM_FS_ID_60
      , MM_FS_ID_61
      , MM_FS_ID_62
      , MM_FS_ID_63
      , MM_FS_ID_64
      , MM_FS_ID_65
      , MM_FS_ID_66
      , MM_FS_ID_67
      , MM_FS_ID_68
      , MM_FS_ID_69
      , MM_FS_ID_70
      , MM_FS_ID_71
      , MM_FS_ID_72
      , MM_FS_ID_73
      , MM_FS_ID_74
      , MM_FS_ID_75
      , MM_FS_ID_76
      , MM_FS_ID_77
      , MM_FS_ID_78
      , MM_FS_ID_79
      , MM_FS_ID_80
      , MM_FS_ID_81
      , MM_FS_ID_82
      , MM_FS_ID_83
      , MM_FS_ID_84
      , MM_FS_ID_85
      , MM_FS_ID_86
      , MM_FS_ID_87
  from (
  
      select
            RM.Range
          , RM.Ground
          , RM.Venue
          , RM.GroundCondition
          , RHI.Weight
          , RHI.HorseGender
          , case when RI.[Year] > 2000 then RHI.HorseAge else RHI.HorseAge - 1 end as Age
          , ROW_NUMBER()over(order by FS.HorseID) as num
          , GoalTime - TA.Average as time
          , FS.ID_1 as F_ID_1
          , FS.ID_2 as F_ID_2
          , FS.ID_3 as F_ID_3
          , FS.ID_4 as F_ID_4
          , FS.ID_5 as F_ID_5
          , FS.ID_6 as F_ID_6
          , FS.ID_7 as F_ID_7
          , FS.ID_8 as F_ID_8
          , FS.ID_9 as F_ID_9
          , FS.ID_10 as F_ID_10
          , FS.ID_11 as F_ID_11
          , FS.ID_12 as F_ID_12
          , FS.ID_13 as F_ID_13
          , FS.ID_14 as F_ID_14
          , FS.ID_15 as F_ID_15
          , FS.ID_16 as F_ID_16
          , FS.ID_17 as F_ID_17
          , FS.ID_18 as F_ID_18
          , FS.ID_19 as F_ID_19
          , FS.ID_20 as F_ID_20
          , FS.ID_21 as F_ID_21
          , FS.ID_22 as F_ID_22
          , FS.ID_23 as F_ID_23
          , FS.ID_24 as F_ID_24
          , FS.ID_25 as F_ID_25
          , FS.ID_26 as F_ID_26
          , FS.ID_27 as F_ID_27
          , FS.ID_28 as F_ID_28
          , FS.ID_29 as F_ID_29
          , FS.ID_30 as F_ID_30
          , FS.ID_31 as F_ID_31
          , FS.ID_32 as F_ID_32
          , FS.ID_33 as F_ID_33
          , FS.ID_34 as F_ID_34
          , FS.ID_35 as F_ID_35
          , FS.ID_36 as F_ID_36
          , FS.ID_37 as F_ID_37
          , FS.ID_38 as F_ID_38
          , FS.ID_39 as F_ID_39
          , FS.ID_40 as F_ID_40
          , FS.ID_41 as F_ID_41
          , FS.ID_42 as F_ID_42
          , FS.ID_43 as F_ID_43
          , FS.ID_44 as F_ID_44
          , FS.ID_45 as F_ID_45
          , FS.ID_46 as F_ID_46
          , FS.ID_47 as F_ID_47
          , FS.ID_48 as F_ID_48
          , FS.ID_49 as F_ID_49
          , FS.ID_50 as F_ID_50
          , FS.ID_51 as F_ID_51
          , FS.ID_52 as F_ID_52
          , FS.ID_53 as F_ID_53
          , FS.ID_54 as F_ID_54
          , FS.ID_55 as F_ID_55
          , FS.ID_56 as F_ID_56
          , FS.ID_57 as F_ID_57
          , FS.ID_58 as F_ID_58
          , FS.ID_59 as F_ID_59
          , FS.ID_60 as F_ID_60
          , FS.ID_61 as F_ID_61
          , FS.ID_62 as F_ID_62
          , FS.ID_63 as F_ID_63
          , FS.ID_64 as F_ID_64
          , FS.ID_65 as F_ID_65
          , FS.ID_66 as F_ID_66
          , FS.ID_67 as F_ID_67
          , FS.ID_68 as F_ID_68
          , FS.ID_69 as F_ID_69
          , FS.ID_70 as F_ID_70
          , FS.ID_71 as F_ID_71
          , FS.ID_72 as F_ID_72
          , FS.ID_73 as F_ID_73
          , FS.ID_74 as F_ID_74
          , FS.ID_75 as F_ID_75
          , FS.ID_76 as F_ID_76
          , FS.ID_77 as F_ID_77
          , FS.ID_78 as F_ID_78
          , FS.ID_79 as F_ID_79
          , FS.ID_80 as F_ID_80
          , FS.ID_81 as F_ID_81
          , FS.ID_82 as F_ID_82
          , FS.ID_83 as F_ID_83
          , FS.ID_84 as F_ID_84
          , FS.ID_85 as F_ID_85
          , FS.ID_86 as F_ID_86
          , FS.ID_87 as F_ID_87
          , M_FS.ID_1 as M_FS_ID_1
          , M_FS.ID_2 as M_FS_ID_2
          , M_FS.ID_3 as M_FS_ID_3
          , M_FS.ID_4 as M_FS_ID_4
          , M_FS.ID_5 as M_FS_ID_5
          , M_FS.ID_6 as M_FS_ID_6
          , M_FS.ID_7 as M_FS_ID_7
          , M_FS.ID_8 as M_FS_ID_8
          , M_FS.ID_9 as M_FS_ID_9
          , M_FS.ID_10 as M_FS_ID_10
          , M_FS.ID_11 as M_FS_ID_11
          , M_FS.ID_12 as M_FS_ID_12
          , M_FS.ID_13 as M_FS_ID_13
          , M_FS.ID_14 as M_FS_ID_14
          , M_FS.ID_15 as M_FS_ID_15
          , M_FS.ID_16 as M_FS_ID_16
          , M_FS.ID_17 as M_FS_ID_17
          , M_FS.ID_18 as M_FS_ID_18
          , M_FS.ID_19 as M_FS_ID_19
          , M_FS.ID_20 as M_FS_ID_20
          , M_FS.ID_21 as M_FS_ID_21
          , M_FS.ID_22 as M_FS_ID_22
          , M_FS.ID_23 as M_FS_ID_23
          , M_FS.ID_24 as M_FS_ID_24
          , M_FS.ID_25 as M_FS_ID_25
          , M_FS.ID_26 as M_FS_ID_26
          , M_FS.ID_27 as M_FS_ID_27
          , M_FS.ID_28 as M_FS_ID_28
          , M_FS.ID_29 as M_FS_ID_29
          , M_FS.ID_30 as M_FS_ID_30
          , M_FS.ID_31 as M_FS_ID_31
          , M_FS.ID_32 as M_FS_ID_32
          , M_FS.ID_33 as M_FS_ID_33
          , M_FS.ID_34 as M_FS_ID_34
          , M_FS.ID_35 as M_FS_ID_35
          , M_FS.ID_36 as M_FS_ID_36
          , M_FS.ID_37 as M_FS_ID_37
          , M_FS.ID_38 as M_FS_ID_38
          , M_FS.ID_39 as M_FS_ID_39
          , M_FS.ID_40 as M_FS_ID_40
          , M_FS.ID_41 as M_FS_ID_41
          , M_FS.ID_42 as M_FS_ID_42
          , M_FS.ID_43 as M_FS_ID_43
          , M_FS.ID_44 as M_FS_ID_44
          , M_FS.ID_45 as M_FS_ID_45
          , M_FS.ID_46 as M_FS_ID_46
          , M_FS.ID_47 as M_FS_ID_47
          , M_FS.ID_48 as M_FS_ID_48
          , M_FS.ID_49 as M_FS_ID_49
          , M_FS.ID_50 as M_FS_ID_50
          , M_FS.ID_51 as M_FS_ID_51
          , M_FS.ID_52 as M_FS_ID_52
          , M_FS.ID_53 as M_FS_ID_53
          , M_FS.ID_54 as M_FS_ID_54
          , M_FS.ID_55 as M_FS_ID_55
          , M_FS.ID_56 as M_FS_ID_56
          , M_FS.ID_57 as M_FS_ID_57
          , M_FS.ID_58 as M_FS_ID_58
          , M_FS.ID_59 as M_FS_ID_59
          , M_FS.ID_60 as M_FS_ID_60
          , M_FS.ID_61 as M_FS_ID_61
          , M_FS.ID_62 as M_FS_ID_62
          , M_FS.ID_63 as M_FS_ID_63
          , M_FS.ID_64 as M_FS_ID_64
          , M_FS.ID_65 as M_FS_ID_65
          , M_FS.ID_66 as M_FS_ID_66
          , M_FS.ID_67 as M_FS_ID_67
          , M_FS.ID_68 as M_FS_ID_68
          , M_FS.ID_69 as M_FS_ID_69
          , M_FS.ID_70 as M_FS_ID_70
          , M_FS.ID_71 as M_FS_ID_71
          , M_FS.ID_72 as M_FS_ID_72
          , M_FS.ID_73 as M_FS_ID_73
          , M_FS.ID_74 as M_FS_ID_74
          , M_FS.ID_75 as M_FS_ID_75
          , M_FS.ID_76 as M_FS_ID_76
          , M_FS.ID_77 as M_FS_ID_77
          , M_FS.ID_78 as M_FS_ID_78
          , M_FS.ID_79 as M_FS_ID_79
          , M_FS.ID_80 as M_FS_ID_80
          , M_FS.ID_81 as M_FS_ID_81
          , M_FS.ID_82 as M_FS_ID_82
          , M_FS.ID_83 as M_FS_ID_83
          , M_FS.ID_84 as M_FS_ID_84
          , M_FS.ID_85 as M_FS_ID_85
          , M_FS.ID_86 as M_FS_ID_86
          , M_FS.ID_87 as M_FS_ID_87
          , MM_FS.ID_1 as MM_FS_ID_1
          , MM_FS.ID_2 as MM_FS_ID_2
          , MM_FS.ID_3 as MM_FS_ID_3
          , MM_FS.ID_4 as MM_FS_ID_4
          , MM_FS.ID_5 as MM_FS_ID_5
          , MM_FS.ID_6 as MM_FS_ID_6
          , MM_FS.ID_7 as MM_FS_ID_7
          , MM_FS.ID_8 as MM_FS_ID_8
          , MM_FS.ID_9 as MM_FS_ID_9
          , MM_FS.ID_10 as MM_FS_ID_10
          , MM_FS.ID_11 as MM_FS_ID_11
          , MM_FS.ID_12 as MM_FS_ID_12
          , MM_FS.ID_13 as MM_FS_ID_13
          , MM_FS.ID_14 as MM_FS_ID_14
          , MM_FS.ID_15 as MM_FS_ID_15
          , MM_FS.ID_16 as MM_FS_ID_16
          , MM_FS.ID_17 as MM_FS_ID_17
          , MM_FS.ID_18 as MM_FS_ID_18
          , MM_FS.ID_19 as MM_FS_ID_19
          , MM_FS.ID_20 as MM_FS_ID_20
          , MM_FS.ID_21 as MM_FS_ID_21
          , MM_FS.ID_22 as MM_FS_ID_22
          , MM_FS.ID_23 as MM_FS_ID_23
          , MM_FS.ID_24 as MM_FS_ID_24
          , MM_FS.ID_25 as MM_FS_ID_25
          , MM_FS.ID_26 as MM_FS_ID_26
          , MM_FS.ID_27 as MM_FS_ID_27
          , MM_FS.ID_28 as MM_FS_ID_28
          , MM_FS.ID_29 as MM_FS_ID_29
          , MM_FS.ID_30 as MM_FS_ID_30
          , MM_FS.ID_31 as MM_FS_ID_31
          , MM_FS.ID_32 as MM_FS_ID_32
          , MM_FS.ID_33 as MM_FS_ID_33
          , MM_FS.ID_34 as MM_FS_ID_34
          , MM_FS.ID_35 as MM_FS_ID_35
          , MM_FS.ID_36 as MM_FS_ID_36
          , MM_FS.ID_37 as MM_FS_ID_37
          , MM_FS.ID_38 as MM_FS_ID_38
          , MM_FS.ID_39 as MM_FS_ID_39
          , MM_FS.ID_40 as MM_FS_ID_40
          , MM_FS.ID_41 as MM_FS_ID_41
          , MM_FS.ID_42 as MM_FS_ID_42
          , MM_FS.ID_43 as MM_FS_ID_43
          , MM_FS.ID_44 as MM_FS_ID_44
          , MM_FS.ID_45 as MM_FS_ID_45
          , MM_FS.ID_46 as MM_FS_ID_46
          , MM_FS.ID_47 as MM_FS_ID_47
          , MM_FS.ID_48 as MM_FS_ID_48
          , MM_FS.ID_49 as MM_FS_ID_49
          , MM_FS.ID_50 as MM_FS_ID_50
          , MM_FS.ID_51 as MM_FS_ID_51
          , MM_FS.ID_52 as MM_FS_ID_52
          , MM_FS.ID_53 as MM_FS_ID_53
          , MM_FS.ID_54 as MM_FS_ID_54
          , MM_FS.ID_55 as MM_FS_ID_55
          , MM_FS.ID_56 as MM_FS_ID_56
          , MM_FS.ID_57 as MM_FS_ID_57
          , MM_FS.ID_58 as MM_FS_ID_58
          , MM_FS.ID_59 as MM_FS_ID_59
          , MM_FS.ID_60 as MM_FS_ID_60
          , MM_FS.ID_61 as MM_FS_ID_61
          , MM_FS.ID_62 as MM_FS_ID_62
          , MM_FS.ID_63 as MM_FS_ID_63
          , MM_FS.ID_64 as MM_FS_ID_64
          , MM_FS.ID_65 as MM_FS_ID_65
          , MM_FS.ID_66 as MM_FS_ID_66
          , MM_FS.ID_67 as MM_FS_ID_67
          , MM_FS.ID_68 as MM_FS_ID_68
          , MM_FS.ID_69 as MM_FS_ID_69
          , MM_FS.ID_70 as MM_FS_ID_70
          , MM_FS.ID_71 as MM_FS_ID_71
          , MM_FS.ID_72 as MM_FS_ID_72
          , MM_FS.ID_73 as MM_FS_ID_73
          , MM_FS.ID_74 as MM_FS_ID_74
          , MM_FS.ID_75 as MM_FS_ID_75
          , MM_FS.ID_76 as MM_FS_ID_76
          , MM_FS.ID_77 as MM_FS_ID_77
          , MM_FS.ID_78 as MM_FS_ID_78
          , MM_FS.ID_79 as MM_FS_ID_79
          , MM_FS.ID_80 as MM_FS_ID_80
          , MM_FS.ID_81 as MM_FS_ID_81
          , MM_FS.ID_82 as MM_FS_ID_82
          , MM_FS.ID_83 as MM_FS_ID_83
          , MM_FS.ID_84 as MM_FS_ID_84
          , MM_FS.ID_85 as MM_FS_ID_85
          , MM_FS.ID_86 as MM_FS_ID_86
          , MM_FS.ID_87 as MM_FS_ID_87
      from RaceHorseInfomation as RHI
          left outer join RaceInfomation as RI
              on RI.ID = RHI.RaceID
          left outer join RaceMaster as RM
              on RM.ID = RI.RaceMasterID
          -- 父
          left outer join HorseMaster as HM
              on HM.ID = RHI.HorseID
          left outer join HorseMaster as Father
              on Father.netkeibaID = HM.Father
          inner join FatherScore as FS
              on FS.HorseID = Father.ID
          -- 母父
          left outer join HorseMaster as Mother
              on Mother.netkeibaID = HM.Mother
          left outer join HorseMaster as M_Father
              on M_Father.netkeibaID = Mother.Father
          inner join FatherScore as M_FS
              on M_FS.HorseID = M_Father.ID
          -- 母母父
          left outer join HorseMaster as M_Mother
              on M_Mother.netkeibaID = Mother.Mother
          left outer join HorseMaster as MM_Father
              on MM_Father.netkeibaID = M_Mother.Father
          inner join FatherScore as MM_FS
              on MM_FS.HorseID = MM_Father.ID
          inner join TimeAverage as TA
              on TA.ID = RHI.Average
      where
          GoalTime is not null
  ) as score
where
    score.num BETWEEN ${this.parameter?.Start} and ${this.parameter?.Finish}
`
        return await this.ExecGet(sql)
    }
}