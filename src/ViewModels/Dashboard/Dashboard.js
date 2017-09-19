import { inject } from 'aurelia-framework';
import * as toastr from "toastr"; 
import { RouteMenu } from 'Helpers/RouteMenuHelper';
import * as RouteMenuSettings from 'Configuration/RouteMenuSettings';

@inject(RouteMenu)
export class Dashboard {

    constructor(routeMenu) {
        this.routeMenu = routeMenu;
        this.isAccess=true
    }
    activate()
    {
         
              if(Lockr.get('UserInfo').Roles==null){
                  this.isAccess=true;
              }
              else
              {
                    this.isAccess=false
              }
    }

}