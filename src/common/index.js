import "./footer.css";

import { angular, angularRoute } from "../vendor";
import Session from "./session";
import AuthChecker from "./auth-checker";
import { AUTH_EVENTS, USER_ROLES } from "./auth-constants";
import authEventHandlers from "./auth-event-handlers";
import routeEventHandlers from "./route-event-handlers";
import AuthInterceptor from "./auth-interceptor";
import HttpTimeoutInterceptor from "./http-timeout-interceptor";
import ServerErrorInterceptor from "./server-error-interceptor";
import FormUploadCtrl from "./form-upload-ctrl";
import NavigationCtrl from "./navigation-ctrl";
import SpinnerComponent from "./spinner-component";
import TextCollapseDirective from "./text-collapse-directive";
import ShowIfFeatureFlagDirective from "./show-if-feature-flag-directive";
import configRouting from "./config-routing";

export default angular.module("control.common", [angularRoute, "route-segment", "view-segment"])
    .service("Session", Session)
    .service("AuthChecker", AuthChecker)
    .service("AuthInterceptor", AuthInterceptor)
    .service("HttpTimeoutInterceptor", HttpTimeoutInterceptor)
    .service("ServerErrorInterceptor", ServerErrorInterceptor)
    .constant("AUTH_EVENTS", AUTH_EVENTS)
    .constant("USER_ROLES", USER_ROLES)
    .run(authEventHandlers)
    .run(routeEventHandlers)
    .controller("FormUploadCtrl", FormUploadCtrl)
    .controller("NavigationCtrl", NavigationCtrl)
    .directive("showIfFeatureFlag", ShowIfFeatureFlagDirective)
    .directive("loadingSpinner", () => SpinnerComponent)
    .directive("ddTextCollapse", TextCollapseDirective)
    .config(configRouting)
    .name;
