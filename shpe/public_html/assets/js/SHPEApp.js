$.getMultiScripts = function(arr, path) {
    var _arr = $.map(arr, function(scr) {
        return $.getScript( (path||"") + scr );
    });

    _arr.push($.Deferred(function( deferred ){
        $( deferred.resolve );
    }));

    return $.when.apply($, _arr);
}

var SHPEApp = angular.module('SHPEApp', []);

SHPEApp.controller('LandingPageController', LandingPageController);