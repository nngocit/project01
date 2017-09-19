import { inject } from 'aurelia-framework';
import { UserService } from 'Services/UserSvc/UserService';
import { LogService } from 'Services/LogService';

@inject(UserService, LogService)
export class LogOut {
    constructor(userService, logService) {
        this.userService = userService;
        this.logService = logService;
    }

    activate() {
        var userId = Lockr.get('UserInfo').UserId;

        this.userService.LogOut(userId).then((data) => {

            this.logService.InsertAdminCPLog("VTA APP | User click ButtonLogout hoac loi 500", "", Lockr.get('UserInfo').Username);

            if (data.Result == true) {
                monster.remove('isAdmin');
                Lockr.rm('UserInfo');
                window.location = "#login";
                window.location.reload();
            }
        });

    }

}