import GetData from './index';

let api;

export default api = {
    getNewTreeInfo:function(){
        return GetData("new-tree-info","new-tree-info");
    },
    getRank:function(){
        return GetData("click-rank", "rank-info");
    },
    checkUpdateData:function(){
        return GetData("check-update-data", "check-update-data");
    },
    checkEquipmentData:function(){
        return GetData("check-equipment-data", "check-equipment-data");
    },
    getNewTextTree:function(){
        return GetData("new-text-tree-info","new-text-tree-info");
    },
};
