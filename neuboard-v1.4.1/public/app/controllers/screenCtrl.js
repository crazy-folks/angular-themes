angular.module('screenCtrl', [])

.directive('screenPortal', [function () {
  return {
    restrict: 'A',
    template: '<button ng-if="supported && !isRunning && !processing" class=\'btn btn-primary btn-sm\' ng-click=\'init()\'>' +
    'Initiate Video Chat</button></div>' +
    '<div ng-if="supported && !isRunning && processing">Select video source: <br><select ng-model="devices.selectedVideo" ' +
    'ng-options="option.label for option in devices.videoDevices"></select><br>' +
    'Select audio source: <br><select ng-model="devices.selectedAudio" ' +
    'ng-options="option.label for option in devices.audioDevices"></select><br>' +
    '<button class="btn btn-primary btn-sm" ng-if="startEnabled" ng-click="start()">Begin...</button></div>' +
    '<br><span ng-if="message && message.length > 0">{{message}}</span>' +
    '<div ng-if="supported && isRunning"><video style="width:100%;" id="localVideo"></video>' +
    '<meter id="localVolume" class="volume" min="-45" max="-20" high="-25" low="-40"></meter>' +
    '<div id="remotesVideos"></div></div>',
    controller: ['$scope', '$rootScope', 'ngToast', function ($scope, $rootScope, ngToast) {

      $scope.message = '';
      $scope.supported = false;
      $scope.webrtc = null;
      $scope.processing = false;
      $scope.isRunning = false;
      $scope.startEnabled = false;
      $scope.devices = {
        audioDevices: [],
        videoDevices: [],
        selectedAudio: null,
        selectedVideo: null
      };

      if (!window.RTCPeerConnection || !navigator.getUserMedia) {
        $scope.message = 'WebRTC is not supported by your browser. You can try the app with Chrome and Firefox.';
        $scope.supported = false;
        return;
      } else {
        $scope.supported = true;
      }

      $scope.init = function () {
        ngToast.create({ className: 'info', content: 'Detecting compatible hardware...' });
        $scope.message = 'Detecting compatible hardware...';

        if (typeof MediaStreamTrack === 'undefined') {
          console.log('This browser does not support MediaStreamTrack.');
          $scope.devices.audioDevices.push({
            id: 'default',
            label: 'Default'
          });
          $scope.devices.videoDevices.push({
            id: 'default',
            label: 'Default'
          });
          $scope.startEnabled = true;
          $scope.processing = true;
          $scope.message = '';
        } else {
          MediaStreamTrack.getSources(function (sourceInfos) {
            for (var i = 0; i !== sourceInfos.length; ++i) {
              var sourceInfo = sourceInfos[i];
              if (sourceInfo.kind === 'audio') {
                sourceInfo.label = sourceInfo.label || 'microphone ' + ($scope.devices.audioDevices.length + 1);
                $scope.devices.audioDevices.push(sourceInfo);
              } else if (sourceInfo.kind === 'video') {
                sourceInfo.label = sourceInfo.label || 'camera ' + ($scope.devices.videoDevices.length + 1);
                $scope.devices.videoDevices.push(sourceInfo);
              }
            }
            $scope.startEnabled = true;
            $scope.processing = true;
            $scope.message = '';
          });
        }

      };

      $scope.start = function () {
        var audio = $scope.devices.selectedAudio,
          video = $scope.devices.selectedVideo;
        $scope.processing = false;
        $scope.isRunning = true;
        var mediaOptions = {
          audio: true,
          video: true
        };
        if (audio && audio.id) {
          mediaOptions.audio = {
            mandatory: {
              sourceId: audio.id
            }
          };
        }
        if (video && video.id) {
          mediaOptions.video = {
            mandatory: {
              sourceId: video.id
            }
          };
        }

        $scope.webrtc = new SimpleWebRTC({
          localVideoEl: 'localVideo',
          remoteVideosEl: 'remotesVideos',
          autoRequestMedia: true,
          media: mediaOptions
        });

        ngToast.create({ className: 'info', content: 'Video Chat has been started.' });

        $scope.webrtc.on('readyToCall', function () {
          // join the room named from process id:
          $scope.webrtc.joinRoom($rootScope.processid);

        });

        // local volume has changed
        $scope.webrtc.on('volumeChange', function (volume, threshold) {
          showVolume(document.getElementById('localVolume'), volume);
        });

        // we got access to the camera
        $scope.webrtc.on('localStream', function (stream) {
          $('#localVolume').show();
        });
      };

      function showVolume(el, volume) {
        console.log('showVolume:' + volume + " on element " + el);
        if (!el) return;
        if (volume < -45) volume = -45; // -45 to -20 is
        if (volume > -20) volume = -20; // a good range
        el.value = volume;
      }

      $scope.$on('$destroy', function () {
        delete($scope.webrtc);
      });
    }]
  };
}]);