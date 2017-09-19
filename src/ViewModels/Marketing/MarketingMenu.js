import { inject } from 'aurelia-framework';
import { RouteMenu } from 'Helpers/RouteMenuHelper';
import * as RouteMenuSettings from 'Configuration/RouteMenuSettings';

@inject(RouteMenu)
export class MarketingMenu {

    constructor(routeMenu) {
        this.routeMenu = routeMenu;
    }
    attached() {
        $("div").scroll(function() {

            if ($(window).scrollTop() > 1) {
                $('#nav_bar').removeClass('navbar-fixed');

            }
            if ($(window).scrollTop() < 2) {
                $('#nav_bar').addClass('navbar-fixed');

            }
        });
    }
    configureRouter(config, router) {
        this.showDropdownQuaySoBackToSchool = true;


        config.map([RouteMenuSettings.MarketingMenu[0]]);
        this.routeMenu.SetMenuCon(config, RouteMenuSettings.MarketingMenu, "MarketingMenu");
        this.router = router;

    }
    activate() {

        var listrole = Lockr.get('UserInfo').Roles;



    }
}