import { inject } from 'aurelia-framework';
import { RouteMenu } from 'Helpers/RouteMenuHelper';
import * as RouteMenuSettings from 'Configuration/RouteMenuSettings';

@inject(RouteMenu)
export class UserMenu {

    constructor(routeMenu) {
        this.routeMenu = routeMenu;
        this.showDropdownUser = true;
        this.showDropdownCauhinhdanhmuc = true;
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

        config.map([RouteMenuSettings.AdministratorMenu[0]]);
        this.routeMenu.SetMenuCon(config, RouteMenuSettings.AdministratorMenu, "AdministratorMenu");
        this.router = router;
    }
}