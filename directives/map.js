"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var google_maps_api_wrapper_1 = require("../services/google-maps-api-wrapper");
var circle_manager_1 = require("../services/managers/circle-manager");
var info_window_manager_1 = require("../services/managers/info-window-manager");
var marker_manager_1 = require("../services/managers/marker-manager");
var polygon_manager_1 = require("../services/managers/polygon-manager");
var polyline_manager_1 = require("../services/managers/polyline-manager");
var kml_layer_manager_1 = require("./../services/managers/kml-layer-manager");
var data_layer_manager_1 = require("./../services/managers/data-layer-manager");
/**
 * AgmMap renders a Google Map.
 * **Important note**: To be able see a map in the browser, you have to define a height for the
 * element `agm-map`.
 *
 * ### Example
 * ```typescript
 * import { Component } from '@angular/core';
 *
 * @Component({
 *  selector: 'my-map-cmp',
 *  styles: [`
 *    agm-map {
 *      height: 300px;
 *    }
 * `],
 *  template: `
 *    <agm-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
 *    </agm-map>
 *  `
 * })
 * ```
 */
var AgmMap = (function () {
    function AgmMap(_elem, _mapsWrapper) {
        this._elem = _elem;
        this._mapsWrapper = _mapsWrapper;
        /**
         * The longitude that defines the center of the map.
         */
        this.longitude = 0;
        /**
         * The latitude that defines the center of the map.
         */
        this.latitude = 0;
        /**
         * The zoom level of the map. The default zoom level is 8.
         */
        this.zoom = 8;
        /**
         * Enables/disables if map is draggable.
         */
        // tslint:disable-next-line:no-input-rename
        this.draggable = true;
        /**
         * Enables/disables zoom and center on double click. Enabled by default.
         */
        this.disableDoubleClickZoom = false;
        /**
         * Enables/disables all default UI of the Google map. Please note: When the map is created, this
         * value cannot get updated.
         */
        this.disableDefaultUI = false;
        /**
         * If false, disables scrollwheel zooming on the map. The scrollwheel is enabled by default.
         */
        this.scrollwheel = true;
        /**
         * If false, prevents the map from being controlled by the keyboard. Keyboard shortcuts are
         * enabled by default.
         */
        this.keyboardShortcuts = true;
        /**
         * The enabled/disabled state of the Zoom control.
         */
        this.zoomControl = true;
        /**
         * Styles to apply to each of the default map types. Note that for Satellite/Hybrid and Terrain
         * modes, these styles will only apply to labels and geometry.
         */
        this.styles = [];
        /**
         * When true and the latitude and/or longitude values changes, the Google Maps panTo method is
         * used to
         * center the map. See: https://developers.google.com/maps/documentation/javascript/reference#Map
         */
        this.usePanning = false;
        /**
         * The initial enabled/disabled state of the Street View Pegman control.
         * This control is part of the default UI, and should be set to false when displaying a map type
         * on which the Street View road overlay should not appear (e.g. a non-Earth map type).
         */
        this.streetViewControl = true;
        /**
         * Sets the viewport to contain the given bounds.
         */
        this.fitBounds = null;
        /**
         * The initial enabled/disabled state of the Scale control. This is disabled by default.
         */
        this.scaleControl = false;
        /**
         * The initial enabled/disabled state of the Map type control.
         */
        this.mapTypeControl = false;
        /**
         * The initial enabled/disabled state of the Pan control.
         */
        this.panControl = false;
        /**
         * The initial enabled/disabled state of the Rotate control.
         */
        this.rotateControl = false;
        /**
         * The initial enabled/disabled state of the Fullscreen control.
         */
        this.fullscreenControl = false;
        /**
         * The map mapTypeId. Defaults to 'roadmap'.
         */
        this.mapTypeId = 'roadmap';
        /**
         * When false, map icons are not clickable. A map icon represents a point of interest,
         * also known as a POI. By default map icons are clickable.
         */
        this.clickableIcons = true;
        /**
         * This setting controls how gestures on the map are handled.
         * Allowed values:
         * - 'cooperative' (Two-finger touch gestures pan and zoom the map. One-finger touch gestures are not handled by the map.)
         * - 'greedy'      (All touch gestures pan or zoom the map.)
         * - 'none'        (The map cannot be panned or zoomed by user gestures.)
         * - 'auto'        [default] (Gesture handling is either cooperative or greedy, depending on whether the page is scrollable or not.
         */
        this.gestureHandling = 'auto';
        this._observableSubscriptions = [];
        /**
         * This event emitter gets emitted when the user clicks on the map (but not when they click on a
         * marker or infoWindow).
         */
        this.mapClick = new core_1.EventEmitter();
        /**
         * This event emitter gets emitted when the user right-clicks on the map (but not when they click
         * on a marker or infoWindow).
         */
        this.mapRightClick = new core_1.EventEmitter();
        /**
         * This event emitter gets emitted when the user double-clicks on the map (but not when they click
         * on a marker or infoWindow).
         */
        this.mapDblClick = new core_1.EventEmitter();
        /**
         * This event emitter is fired when the map center changes.
         */
        this.centerChange = new core_1.EventEmitter();
        /**
         * This event is fired when the viewport bounds have changed.
         */
        this.boundsChange = new core_1.EventEmitter();
        /**
         * This event is fired when the map becomes idle after panning or zooming.
         */
        this.idle = new core_1.EventEmitter();
        /**
         * This event is fired when the zoom level has changed.
         */
        this.zoomChange = new core_1.EventEmitter();
        /**
         * This event is fired when the google map is fully initialized.
         * You get the google.maps.Map instance as a result of this EventEmitter.
         */
        this.mapReady = new core_1.EventEmitter();
    }
    /** @internal */
    AgmMap.prototype.ngOnInit = function () {
        // todo: this should be solved with a new component and a viewChild decorator
        var container = this._elem.nativeElement.querySelector('.agm-map-container-inner');
        this._initMapInstance(container);
    };
    AgmMap.prototype._initMapInstance = function (el) {
        var _this = this;
        this._mapsWrapper.createMap(el, {
            center: { lat: this.latitude || 0, lng: this.longitude || 0 },
            zoom: this.zoom,
            minZoom: this.minZoom,
            maxZoom: this.maxZoom,
            disableDefaultUI: this.disableDefaultUI,
            disableDoubleClickZoom: this.disableDoubleClickZoom,
            scrollwheel: this.scrollwheel,
            backgroundColor: this.backgroundColor,
            draggable: this.draggable,
            draggableCursor: this.draggableCursor,
            draggingCursor: this.draggingCursor,
            keyboardShortcuts: this.keyboardShortcuts,
            styles: this.styles,
            zoomControl: this.zoomControl,
            zoomControlOptions: this.zoomControlOptions,
            streetViewControl: this.streetViewControl,
            streetViewControlOptions: this.streetViewControlOptions,
            scaleControl: this.scaleControl,
            scaleControlOptions: this.scaleControlOptions,
            mapTypeControl: this.mapTypeControl,
            mapTypeControlOptions: this.mapTypeControlOptions,
            panControl: this.panControl,
            panControlOptions: this.panControlOptions,
            rotateControl: this.rotateControl,
            rotateControlOptions: this.rotateControlOptions,
            fullscreenControl: this.fullscreenControl,
            fullscreenControlOptions: this.fullscreenControlOptions,
            mapTypeId: this.mapTypeId,
            clickableIcons: this.clickableIcons,
            gestureHandling: this.gestureHandling
        })
            .then(function () { return _this._mapsWrapper.getNativeMap(); })
            .then(function (map) { return _this.mapReady.emit(map); });
        // register event listeners
        this._handleMapCenterChange();
        this._handleMapZoomChange();
        this._handleMapMouseEvents();
        this._handleBoundsChange();
        this._handleIdleEvent();
    };
    /** @internal */
    AgmMap.prototype.ngOnDestroy = function () {
        // unsubscribe all registered observable subscriptions
        this._observableSubscriptions.forEach(function (s) { return s.unsubscribe(); });
    };
    /* @internal */
    AgmMap.prototype.ngOnChanges = function (changes) {
        this._updateMapOptionsChanges(changes);
        this._updatePosition(changes);
    };
    AgmMap.prototype._updateMapOptionsChanges = function (changes) {
        var options = {};
        var optionKeys = Object.keys(changes).filter(function (k) { return AgmMap._mapOptionsAttributes.indexOf(k) !== -1; });
        optionKeys.forEach(function (k) { options[k] = changes[k].currentValue; });
        this._mapsWrapper.setMapOptions(options);
    };
    /**
     * Triggers a resize event on the google map instance.
     * When recenter is true, the of the google map gets called with the current lat/lng values or fitBounds value to recenter the map.
     * Returns a promise that gets resolved after the event was triggered.
     */
    AgmMap.prototype.triggerResize = function (recenter) {
        var _this = this;
        if (recenter === void 0) { recenter = true; }
        // Note: When we would trigger the resize event and show the map in the same turn (which is a
        // common case for triggering a resize event), then the resize event would not
        // work (to show the map), so we trigger the event in a timeout.
        return new Promise(function (resolve) {
            setTimeout(function () {
                return _this._mapsWrapper.triggerMapEvent('resize').then(function () {
                    if (recenter) {
                        _this.fitBounds != null ? _this._fitBounds() : _this._setCenter();
                    }
                    resolve();
                });
            });
        });
    };
    AgmMap.prototype._updatePosition = function (changes) {
        if (changes['latitude'] == null && changes['longitude'] == null &&
            changes['fitBounds'] == null) {
            // no position update needed
            return;
        }
        // we prefer fitBounds in changes
        if (changes['fitBounds'] && this.fitBounds != null) {
            this._fitBounds();
            return;
        }
        if (typeof this.latitude !== 'number' || typeof this.longitude !== 'number') {
            return;
        }
        this._setCenter();
    };
    AgmMap.prototype._setCenter = function () {
        var newCenter = {
            lat: this.latitude,
            lng: this.longitude,
        };
        if (this.usePanning) {
            this._mapsWrapper.panTo(newCenter);
        }
        else {
            this._mapsWrapper.setCenter(newCenter);
        }
    };
    AgmMap.prototype._fitBounds = function () {
        if (this.usePanning) {
            this._mapsWrapper.panToBounds(this.fitBounds);
            return;
        }
        this._mapsWrapper.fitBounds(this.fitBounds);
    };
    AgmMap.prototype._handleMapCenterChange = function () {
        var _this = this;
        var s = this._mapsWrapper.subscribeToMapEvent('center_changed').subscribe(function () {
            _this._mapsWrapper.getCenter().then(function (center) {
                _this.latitude = center.lat();
                _this.longitude = center.lng();
                _this.centerChange.emit({ lat: _this.latitude, lng: _this.longitude });
            });
        });
        this._observableSubscriptions.push(s);
    };
    AgmMap.prototype._handleBoundsChange = function () {
        var _this = this;
        var s = this._mapsWrapper.subscribeToMapEvent('bounds_changed').subscribe(function () {
            _this._mapsWrapper.getBounds().then(function (bounds) { _this.boundsChange.emit(bounds); });
        });
        this._observableSubscriptions.push(s);
    };
    AgmMap.prototype._handleMapZoomChange = function () {
        var _this = this;
        var s = this._mapsWrapper.subscribeToMapEvent('zoom_changed').subscribe(function () {
            _this._mapsWrapper.getZoom().then(function (z) {
                _this.zoom = z;
                _this.zoomChange.emit(z);
            });
        });
        this._observableSubscriptions.push(s);
    };
    AgmMap.prototype._handleIdleEvent = function () {
        var _this = this;
        var s = this._mapsWrapper.subscribeToMapEvent('idle').subscribe(function () { _this.idle.emit(void 0); });
        this._observableSubscriptions.push(s);
    };
    AgmMap.prototype._handleMapMouseEvents = function () {
        var _this = this;
        var events = [
            { name: 'click', emitter: this.mapClick },
            { name: 'rightclick', emitter: this.mapRightClick },
            { name: 'dblclick', emitter: this.mapDblClick },
        ];
        events.forEach(function (e) {
            var s = _this._mapsWrapper.subscribeToMapEvent(e.name).subscribe(function (event) {
                var value = { coords: { lat: event.latLng.lat(), lng: event.latLng.lng() } };
                e.emitter.emit(value);
            });
            _this._observableSubscriptions.push(s);
        });
    };
    return AgmMap;
}());
/**
 * Map option attributes that can change over time
 */
AgmMap._mapOptionsAttributes = [
    'disableDoubleClickZoom', 'scrollwheel', 'draggable', 'draggableCursor', 'draggingCursor',
    'keyboardShortcuts', 'zoomControl', 'zoomControlOptions', 'styles', 'streetViewControl',
    'streetViewControlOptions', 'zoom', 'mapTypeControl', 'mapTypeControlOptions', 'minZoom',
    'maxZoom', 'panControl', 'panControlOptions', 'rotateControl', 'rotateControlOptions',
    'fullscreenControl', 'fullscreenControlOptions', 'scaleControl', 'scaleControlOptions',
    'mapTypeId', 'clickableIcons', 'gestureHandling'
];
AgmMap.decorators = [
    { type: core_1.Component, args: [{
                selector: 'agm-map',
                providers: [
                    google_maps_api_wrapper_1.GoogleMapsAPIWrapper, marker_manager_1.MarkerManager, info_window_manager_1.InfoWindowManager, circle_manager_1.CircleManager, polyline_manager_1.PolylineManager,
                    polygon_manager_1.PolygonManager, kml_layer_manager_1.KmlLayerManager, data_layer_manager_1.DataLayerManager
                ],
                host: {
                    // todo: deprecated - we will remove it with the next version
                    '[class.sebm-google-map-container]': 'true'
                },
                styles: ["\n    .agm-map-container-inner {\n      width: inherit;\n      height: inherit;\n    }\n    .agm-map-content {\n      display:none;\n    }\n  "],
                template: "\n    <div class='agm-map-container-inner sebm-google-map-container-inner'></div>\n    <div class='agm-map-content'>\n      <ng-content></ng-content>\n    </div>\n  "
            },] },
];
/** @nocollapse */
AgmMap.ctorParameters = function () { return [
    { type: core_1.ElementRef, },
    { type: google_maps_api_wrapper_1.GoogleMapsAPIWrapper, },
]; };
AgmMap.propDecorators = {
    'longitude': [{ type: core_1.Input },],
    'latitude': [{ type: core_1.Input },],
    'zoom': [{ type: core_1.Input },],
    'minZoom': [{ type: core_1.Input },],
    'maxZoom': [{ type: core_1.Input },],
    'draggable': [{ type: core_1.Input, args: ['mapDraggable',] },],
    'disableDoubleClickZoom': [{ type: core_1.Input },],
    'disableDefaultUI': [{ type: core_1.Input },],
    'scrollwheel': [{ type: core_1.Input },],
    'backgroundColor': [{ type: core_1.Input },],
    'draggableCursor': [{ type: core_1.Input },],
    'draggingCursor': [{ type: core_1.Input },],
    'keyboardShortcuts': [{ type: core_1.Input },],
    'zoomControl': [{ type: core_1.Input },],
    'zoomControlOptions': [{ type: core_1.Input },],
    'styles': [{ type: core_1.Input },],
    'usePanning': [{ type: core_1.Input },],
    'streetViewControl': [{ type: core_1.Input },],
    'streetViewControlOptions': [{ type: core_1.Input },],
    'fitBounds': [{ type: core_1.Input },],
    'scaleControl': [{ type: core_1.Input },],
    'scaleControlOptions': [{ type: core_1.Input },],
    'mapTypeControl': [{ type: core_1.Input },],
    'mapTypeControlOptions': [{ type: core_1.Input },],
    'panControl': [{ type: core_1.Input },],
    'panControlOptions': [{ type: core_1.Input },],
    'rotateControl': [{ type: core_1.Input },],
    'rotateControlOptions': [{ type: core_1.Input },],
    'fullscreenControl': [{ type: core_1.Input },],
    'fullscreenControlOptions': [{ type: core_1.Input },],
    'mapTypeId': [{ type: core_1.Input },],
    'clickableIcons': [{ type: core_1.Input },],
    'gestureHandling': [{ type: core_1.Input },],
    'mapClick': [{ type: core_1.Output },],
    'mapRightClick': [{ type: core_1.Output },],
    'mapDblClick': [{ type: core_1.Output },],
    'centerChange': [{ type: core_1.Output },],
    'boundsChange': [{ type: core_1.Output },],
    'idle': [{ type: core_1.Output },],
    'zoomChange': [{ type: core_1.Output },],
    'mapReady': [{ type: core_1.Output },],
};
exports.AgmMap = AgmMap;
//# sourceMappingURL=map.js.map