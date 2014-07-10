define(['control'], function(control) {
    control.register.controller('RequestappCtrl', function($scope, RequestappService, $upload) {
        $scope.isReady = false
        $scope.appSubmited = false
        
        $scope.website = ""
        $scope.facebook = ""
        $scope.twitter = ""
        $scope.platform = ""
        $scope.products = []
        $scope.maySubmitApp = false
        $scope.logo=""
        $scope.icon=""

        $scope.changeTab = function() {
            $scope.numTabs = 0
            if ($scope.website !== "") $scope.numTabs++
            if ($scope.facebook !== "") $scope.numTabs++
            if ($scope.twitter !== "") $scope.numTabs++
        }

        $scope.submit = function() {
            if ($scope.platform == "Both") {
                RequestappService.submitAndroid($scope.name, $scope.desc, $scope.website, $scope.facebook, $scope.twitter, $scope.bg, $scope.icon, $scope.logo,$scope.username)
                RequestappService.submitiOS($scope.name, $scope.desc, $scope.keywords, $scope.website, $scope.facebook, $scope.twitter, $scope.bg, $scope.tint, $scope.icon, $scope.logo,$scope.username)
            }
            else if ($scope.platform == "Android") {
                RequestappService.submitAndroid($scope.name, $scope.desc, $scope.website, $scope.facebook, $scope.twitter, $scope.bg, $scope.icon, $scope.logo,$scope.username)
            }
            else if ($scope.platform == "iOS") {
                RequestappService.submitiOS($scope.name, $scope.desc, $scope.keywords, $scope.website, $scope.facebook, $scope.twitter, $scope.bg, $scope.tint, $scope.icon, $scope.logo,$scope.username)
            }
            $scope.appSubmited = true
        }


        //get list accounts
        var callback = function(res) {
            $scope.products = []
            var appCheck = function(app, l) {
                res.data[l.key].app = app;
                $scope.products.push(res.data[l.key])
                $scope.isReady = true
            }

            for (var key in res.data) {
                if (res.data[key].status == "Active") {
                    RequestappService.hasApp(res.data[key].username, appCheck, {
                        key: key
                    })
                }
            }
        }
        RequestappService.list(callback)


        //upload stuff
        $scope.onIconUpload = function($files) {
            $scope.isUploadingIcon = true
            $scope.uploadProgressIcon = 0
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: 'https://itframe.shoutca.st/control/apps/iconupload/',
                    method: 'POST',
                    data: {},
                    file: file,
                }).progress(function(evt) {
                    $scope.uploadProgressIcon = parseInt(100.0 * evt.loaded / evt.total)
                }).success(function(data, status, headers, config) {
                    $scope.isUploadingIcon = false
                    $scope.isUploadedIcon = true
                    $scope.icon = data.name;
                });
            }
        };

        $scope.onLogoUpload = function($files) {
            $scope.isUploadingLogo = true
            $scope.uploadProgressLogo = 0
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: 'https://itframe.shoutca.st/control/apps/logoupload/',
                    method: 'POST',
                    data: {},
                    file: file,
                }).progress(function(evt) {
                    $scope.uploadProgressLogo = parseInt(100.0 * evt.loaded / evt.total)
                }).success(function(data, status, headers, config) {
                    $scope.isUploadingLogo = false
                    $scope.isUploadedLogo = true
                    $scope.logo = data.name;
                });
            }
        };
        
        $('.bg').colorpicker().on('changeColor', function(ev){
            $scope.bg=ev.color.toHex()
        });
        
        $('.tint').colorpicker().on('changeColor', function(ev){
            $scope.tint=ev.color.toHex()
        });
    });
});