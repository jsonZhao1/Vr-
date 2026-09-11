const constants = {
    USER_INFO: {
        ADD_USER_INFO: 'add_user_info',//新增人员信息
        DEL_USER_INFO: 'del_user_info',//删除人员信息
        UPDATE_USER_INFO: 'update_user_info',//修改人员信息
        GET_USER_INFO: 'get_user_info',//查询人员信息
        LIST_USER_INFO: 'list_user_info',//查询人员信息列表(不分页)
        LIST_PAGE_USER_INFO: 'list_page_user_info',//查询人员信息列表(分页)
    },
    EQUIPMENT: {
        ADD_EQUIPMENT: 'add_equipment',//新增设备
        DEL_EQUIPMENT: 'del_equipment',//删除设备
        UPDATE_EQUIPMENT: 'update_equipment',//修改设备
        GET_EQUIPMENT: 'get_equipment',//查询设备
        LIST_EQUIPMENT: 'list_equipment',//查询设备列表(不分页)
        LIST_PAGE_EQUIPMENT: 'list_equipment',//查询设备列表(分页)
        START_EQUIPMENT: 'start_equipment',//开始培训
    },
    TRAIN: {
        START_TRAIN: 'start_train',//开始培训
        END_TRAIN: 'end_train',//开始培训
        ADD_TRAIN: 'add_train',//进入培训
        DEL_TRAIN: 'del_train',//删除培训
        UPDATE_TRAIN: 'update_train',//修改培训
        GET_TRAIN: 'get_train',//查询培训
        LIST_TRAIN: 'list_train',//查询培训列表(不分页)
        LIST_PAGE_TRAIN: 'list_train',//查询培训列表(分页)
    },
    TRAIN_PROJECT: {
        ADD_TRAIN_PROJECT: 'add_train_project',//新增培训结果
        DEL_TRAIN_PROJECT: 'del_train_project',//删除培训结果
        UPDATE_TRAIN_PROJECT: 'update_train_project',//修改培训结果
        GET_TRAIN_PROJECT: 'get_train_project',//查询培训结果
        LIST_TRAIN_PROJECT: 'list_train_project',//查询培训结果列表(不分页)
        LIST_PAGE_TRAIN_PROJECT: 'list_train_project',//查询培训结果列表(分页)
    },
    PROJECT_TYPE: {
        ADD_PROJECT_TYPE: 'add_project_type',//新增科目类别
        DEL_PROJECT_TYPE: 'del_project_type',//删除科目类别科目类别
        UPDATE_PROJECT_TYPE: 'update_project_type',//修改科目类别
        GET_PROJECT_TYPE: 'get_project_type',//查询科目类别
        LIST_PROJECT_TYPE: 'list_project_type',//查询科目类别列表(不分页)
        LIST_PAGE_PROJECT_TYPE: 'list_project_type',//查询科目类别列表(分页)
        LIST_TYPE_OPTIONS: 'list_type_options',//查询下拉框
        LIST_PROJECT_OPTIONS: 'list_project_options',//查询下拉框
    },
    SUBJECT: {
        ADD_SUBJECT: 'add_subject',//新增题目
        DEL_SUBJECT: 'del_subject',//删除题目
        UPDATE_SUBJECT: 'update_subject',//修改题目
        GET_SUBJECT: 'get_subject',//查询题目
        LIST_SUBJECT: 'list_subject',//查询题目列表(不分页)
        LIST_PAGE_SUBJECT: 'list_subject',//查询题目列表(分页)
    },
    RECORD: {
        ADD_RECORD: 'add_record',//新增考核记录
        DEL_RECORD: 'del_record',//删除考核记录
        UPDATE_RECORD: 'update_record',//修改考核记录
        GET_RECORD: 'get_record',//查询考核记录
        LIST_RECORD: 'list_record',//查询考核记录列表(不分页)
        LIST_PAGE_RECORD: 'list_page_record',//查询考核记录列表(分页)
        EXPORT_RECORD: 'export_record',//导出培训信息
        GET_CURRENT_RECORD: 'get_current_record',//获取当前培训信息
    },
    PROGRAM: {
        ADD_PROGRAM: 'add_program',//新增软件记录
        DEL_PROGRAM: 'del_program',//删除考软件记录
        LIST_PAGE_PROGRAM: 'list_page_program',//查询软件记录列表(分页)
        UPDATE_PROGRAM: 'update_program',
        UP_PROGRAM: 'up_program',
        DOWN_PROGRAM: 'down_program',
        TOP_PROGRAM: 'top_program'
    },
    CLASSIFY: {
        ADD_CLASSIFY: 'add_classify',//新增软件记录
        DEL_CLASSIFY: 'del_classify',//删除考软件记录
        LIST_CLASSIFY: 'list_classify',//查询软件记录列表(分页)
        UPDATE_CLASSIFY: 'update_classify',
        UP_CLASSIFY: 'up_classify'
    },
    MANAGE: {
        VALIDATE_PASSWORD: 'validate_password',//校验密码
        UPDATE_PASSWORD: 'update_password',//修改密码
        SAVE_LOGO: 'save_logo',//保存Logo
        READ_LOGO: 'read_logo',//保存Logo
        SAVE_BANNER: 'save_banner',//保存banner
        READ_BANNER: 'read_banner',//读取banner
        EXPORT_CONFIG: 'export_config',//导出配置
        RESET_CONFIG: 'reset_config',//重置配置
        IMPORT_CONFIG: 'import_config',
        HELP_CONFIG: 'help_config',//保存Logo
        RNS_CONFIG: 'rns_config',//保存Logo
        SAVE_RNS: 'save_rns'//保存Logo
    }
}
export default constants
