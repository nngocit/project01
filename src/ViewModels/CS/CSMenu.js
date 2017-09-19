import { inject } from 'aurelia-framework';
import { RouteMenu } from 'Helpers/RouteMenuHelper';
import * as RouteMenuSettings from 'Configuration/RouteMenuSettings';
import { Router } from 'aurelia-router';
import { CommentMenuPermission } from 'Configuration/PermissionSettings/CommentMenuPermission';
@inject(RouteMenu, CommentMenuPermission, Router)
export class CSMenu {


    router;
    constructor(routeMenu, commentMenuPermission, route) {
        this.routeMenu = routeMenu;
        this.commentMenuPermission = commentMenuPermission;
        this.showDropdownCS = false;
        this.router = route;
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

    activate() {

        var listrole = Lockr.get('UserInfo').Roles;

        for (let i of listrole) {
            this.commentMenuPermission.IsArray(i.Code);
        }
        this.showDropdownCS = this.commentMenuPermission.isCs();

        // console.log('showDropdownSanPham', this.showDropdownCS);
    }
    configureRouter(config, router) {
        config.map([RouteMenuSettings.CSMenu[0]]);
        this.routeMenu.SetMenuCon(config, RouteMenuSettings.CSMenu, "CSMenu");
        this.router = router;


    }
}