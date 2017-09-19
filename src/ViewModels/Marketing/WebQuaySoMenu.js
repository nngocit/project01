import { inject } from 'aurelia-framework';
import { RouteMenu } from 'Helpers/RouteMenuHelper';
import * as RouteMenuSettings from 'Configuration/RouteMenuSettings';

@inject(RouteMenu)
export class CauHinhWebMenu {

    constructor(routeMenu) {
        this.routeMenu = routeMenu;
    }

    configureRouter(config, router) {
        config.map([RouteMenuSettings.WebQuaySoMenu[0]]);
        this.routeMenu.SetMenuCon(config, RouteMenuSettings.WebQuaySoMenu, "WebQuaySoMenu");
        this.router = router;
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
}