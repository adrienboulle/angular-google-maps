"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var map_1 = require("./directives/map");
var circle_1 = require("./directives/circle");
var info_window_1 = require("./directives/info-window");
var marker_1 = require("./directives/marker");
var polygon_1 = require("./directives/polygon");
var polyline_1 = require("./directives/polyline");
var polyline_point_1 = require("./directives/polyline-point");
var kml_layer_1 = require("./directives/kml-layer");
var data_layer_1 = require("./directives/data-layer");
var lazy_maps_api_loader_1 = require("./services/maps-api-loader/lazy-maps-api-loader");
var lazy_maps_api_loader_2 = require("./services/maps-api-loader/lazy-maps-api-loader");
var maps_api_loader_1 = require("./services/maps-api-loader/maps-api-loader");
var browser_globals_1 = require("./utils/browser-globals");
/**
 * @internal
 */
function coreDirectives() {
    return [
        map_1.AgmMap, marker_1.AgmMarker, info_window_1.AgmInfoWindow, circle_1.AgmCircle,
        polygon_1.AgmPolygon, polyline_1.AgmPolyline, polyline_point_1.AgmPolylinePoint, kml_layer_1.AgmKmlLayer,
        data_layer_1.AgmDataLayer
    ];
}
exports.coreDirectives = coreDirectives;
;
/**
 * The angular-google-maps core module. Contains all Directives/Services/Pipes
 * of the core module. Please use `AgmCoreModule.forRoot()` in your app module.
 */
var AgmCoreModule = (function () {
    function AgmCoreModule() {
    }
    /**
     * Please use this method when you register the module at the root level.
     */
    AgmCoreModule.forRoot = function (lazyMapsAPILoaderConfig) {
        return {
            ngModule: AgmCoreModule,
            providers: browser_globals_1.BROWSER_GLOBALS_PROVIDERS.concat([
                { provide: maps_api_loader_1.MapsAPILoader, useClass: lazy_maps_api_loader_1.LazyMapsAPILoader },
                { provide: lazy_maps_api_loader_2.LAZY_MAPS_API_CONFIG, useValue: lazyMapsAPILoaderConfig }
            ]),
        };
    };
    return AgmCoreModule;
}());
AgmCoreModule.decorators = [
    { type: core_1.NgModule, args: [{ declarations: coreDirectives(), exports: coreDirectives() },] },
];
/** @nocollapse */
AgmCoreModule.ctorParameters = function () { return []; };
exports.AgmCoreModule = AgmCoreModule;
//# sourceMappingURL=core.module.js.map