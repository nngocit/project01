export const GiftViewOnly = [];
export const GiftNoAccess = ["lenguyenthaotram", "nguyenngocthuyduong", "lecongkieu", "ngovuxuanyen", "vovanthinh", "tranthanhan01"];

export const ConditionViewOnly = [];
export const ConditionNoAccess = ["lenguyenthaotram", "lecongkieu", "ngovuxuanyen"];

export const ConditionGiftViewOnly = [];
export const ConditionGiftNoAccess = ["lenguyenthaotram", "lecongkieu", "ngovuxuanyen"];

export const ResultViewOnly = ["lenguyenthaotram", "lecongkieu", "ngovuxuanyen"];
export const ResultNoAccess = [""];

export const SapHetQuaViewOnly = [];
export const SapHetQuaNoAccess = ["lenguyenthaotram", "nguyenngocthuyduong", "lecongkieu", "ngovuxuanyen"];

export class QuaySoPermission {

    IsViewOnly(username, view) {
        if (view === "gift")
            return GiftViewOnly.indexOf(username) < 0 ? false : true;
        if (view === "condition")
            return ConditionViewOnly.indexOf(username) < 0 ? false : true;
        if (view === "conditiongift")
            return ConditionGiftViewOnly.indexOf(username) < 0 ? false : true;
        if (view === "result")
            return ResultViewOnly.indexOf(username) < 0 ? false : true;
        if (view === "saphetqua")
            return SapHetQuaViewOnly.indexOf(username) < 0 ? false : true;

        return true;
    }

    IsNoAccess(username, view) {
        if (view === "gift")
            return GiftNoAccess.indexOf(username) < 0 ? false : true;
        if (view === "condition")
            return ConditionNoAccess.indexOf(username) < 0 ? false : true;
        if (view === "conditiongift")
            return ConditionGiftNoAccess.indexOf(username) < 0 ? false : true;
        if (view === "result")
            return ResultNoAccess.indexOf(username) < 0 ? false : true;
        if (view === "saphetqua")
            return SapHetQuaNoAccess.indexOf(username) < 0 ? false : true;

        return true;
    }
}