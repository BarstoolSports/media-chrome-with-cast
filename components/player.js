import { useState, useRef, useEffect } from "react";
import MuxVideoReact from "@mux-elements/mux-video-react";
import AirPlayButton from "./airplay-button";
import "media-chrome";

function useChromecast() {}

let session = null;

const currentMediaURL =
  "https://stream.mux.com/3taBcOqKMfNG029QjBCJMKLviq13OrV6S.m3u8";
const contentType = "application/vnd.apple.mpegurl";

function initializeCastApi() {
  var sessionRequest = new chrome.cast.SessionRequest(
    chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
  );
  var apiConfig = new chrome.cast.ApiConfig(
    sessionRequest,
    sessionListener,
    receiverListener
  );
  chrome.cast.initialize(apiConfig, onInitSuccess, onInitError);

  setTimeout(function () {
    chrome.cast.requestSession(
      sessionListener.bind(this),
      onLaunchError.bind(this)
    );
  }, 3000);
  // console.log("castSession: ", castSession);
  // chrome.cast.initialize(apiConfig, onInitSuccess, onInitError);
}

function sessionListener(e) {
  session = e;
  console.log("New session");
  if (session.media.length != 0) {
    console.log("Found " + session.media.length + " sessions.");
  }
}

function receiverListener(e) {
  if (e === "available") {
    console.log("Chromecast was found on the network.");
  } else {
    console.log("There are no Chromecasts available.");
  }
}

function onInitSuccess() {
  console.log("Initialization succeeded");
}

function onInitError() {
  console.log("Initialization failed");
}

function launchApp() {
  console.log("Launching the Chromecast App...");
  chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
}

function onRequestSessionSuccess(e) {
  console.log("Successfully created session: " + e.sessionId);
  session = e;
  loadMedia();
}

function onLaunchError(err) {
  console.log("Error connecting to the Chromecast.");
  console.log(err);
}
function loadMedia() {
  if (!session) {
    console.log("No session.");
    return;
  }

  console.log("session: ", session);
  console.log("muxVideoRef.current ", muxVideoRef.current);
  const mediaInfo = new chrome.cast.media.MediaInfo(
    currentMediaURL,
    contentType
  );

  var request = new chrome.cast.media.LoadRequest(mediaInfo);
  request.autoplay = true;

  session.loadMedia(request, onLoadSuccess, onLoadError);
}

function onLoadSuccess() {
  console.log("Successfully loaded video.");
}

function onLoadError() {
  console.log("Failed to load video.");
}

export default function Player() {
  const [hasAirplay, setHasAirplay] = useState(false);
  const muxVideoRef = useRef(null);

  const remotePlayerRef = useRef(null);

  useEffect(() => {
    const onPlaybackTargetChanged = (event) => {
      setHasAirplay(event.availability === "available");
    };

    if (window.WebKitPlaybackTargetAvailabilityEvent) {
      // muxVideoRef is a ref to the `<mux-video>` DOM element
      muxVideoRef.current.addEventListener(
        "webkitplaybacktargetavailabilitychanged",
        onPlaybackTargetChanged
      );
    }
  }, []);

  /*
   * Chromecast setup
   */
  useEffect(() => {
    function switchPlayer() {}
    // const initializeCastApi = function () {
    //   console.log(
    //     "debug initializeCastApi",
    //     chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
    //   );
    //   cast.framework.CastContext.getInstance().setOptions({
    //     receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
    //   });

    // castSession.loadMedia(request).then(
    //   function (response) {
    //     console.log("Load succeed");
    //     console.log("success: ", success);
    //     playerController.playOrPause();
    //   },
    //   function (errorCode) {
    //     console.log("Error code: " + errorCode);
    //   }
    // );

    // const player = new cast.framework.RemotePlayer();
    // const playerController = new cast.framework.RemotePlayerController(
    //   player
    // );

    // playerController.addEventListener(
    //   cast.framework.RemotePlayerEventType.ANY_CHANGE,
    //   function (event) {
    //     console.log("playerController event: ", event);
    //     switch (event.field) {
    //       case "isConnected": {
    //         launchApp();
    //         // console.log("mediaInfo: ", mediaInfo);
    //         // var request = new chrome.cast.media.LoadRequest(mediaInfo);
    //         castSession.loadMedia(request).then(
    //           function (response) {
    //             console.log("Load succeed");
    //             console.log("success: ", success);
    //             playerController.playOrPause();
    //           },
    //           function (errorCode) {
    //             console.log("Error code: " + errorCode);
    //           }
    //         );
    //       }
    //     }
    //   }
    // );
    // };

    console.log("debug setting __onGCastApiAvailable", typeof cast);
    window["__onGCastApiAvailable"] = function (isAvailable) {
      console.log("debug isAvailable", isAvailable);
      if (isAvailable) {
        initializeCastApi();
      }
    };
  }, []);

  return (
    <div>
      <div className="wrapper">
        <media-controller>
          <MuxVideoReact
            playsInline
            ref={muxVideoRef}
            slot="media"
            className="video"
            playbackId="3taBcOqKMfNG029QjBCJMKLviq13OrV6S"
            poster="https://image.mux.com/3taBcOqKMfNG029QjBCJMKLviq13OrV6S/thumbnail.jpg?width=500"
          />
          <div className="desktop">
            <media-control-bar>
              <media-play-button></media-play-button>
              <media-mute-button></media-mute-button>
              <media-volume-range></media-volume-range>
              <media-time-range></media-time-range>
              {hasAirplay && (
                <AirPlayButton
                  onClick={() =>
                    muxVideoRef.current.webkitShowPlaybackTargetPicker()
                  }
                />
              )}

              <div id="cast-button">
                <google-cast-launcher
                  // id="cast-button"
                  className="cast-button"
                  style={{ display: "inline-block" }}
                  // onClick={launchApp}
                ></google-cast-launcher>
              </div>

              <media-pip-button></media-pip-button>
              <media-fullscreen-button></media-fullscreen-button>
            </media-control-bar>
          </div>
          <div className="mobile top-controls" slot="top-chrome">
            <media-mute-button></media-mute-button>
            <div className="spacer" />
            {hasAirplay && (
              <AirPlayButton
                onClick={() =>
                  muxVideoRef.current.webkitShowPlaybackTargetPicker()
                }
              />
            )}
            <google-cast-launcher
              id="cast-button"
              className="cast-button"
            ></google-cast-launcher>
            <media-pip-button></media-pip-button>
            {hasAirplay && (
              <AirPlayButton
                onClick={() =>
                  muxVideoRef.current.webkitShowPlaybackTargetPicker()
                }
              />
            )}
            <media-fullscreen-button></media-fullscreen-button>
          </div>
          <div className="mobile centered-controls" slot="centered-chrome">
            <media-play-button></media-play-button>
          </div>
        </media-controller>
      </div>
      <style jsx>{`
        .spacer {
          flex-grow: 1;
        }
        .wrapper {
          max-width: 800px;
          margin: 0 auto;
        }
        .desktop {
          display: none;
        }
        .top-controls {
          display: flex;
          width: 100%;
        }
        .centered-controls :global(media-play-button) {
          width: 80px;
        }
        .mobile :global(media-control-bar) {
          width: 100%;
        }
        .wrapper :global(google-cast-launcher) {
          height: 40px;
          padding: 10px;
          background-color: rgba(20, 20, 30, 0.7);
          border: none;
          outline: none;
        }
        .wrapper :global(google-cast-launcher:hover) {
          cursor: pointer;
          background-color: rgba(50, 50, 70, 0.7);
        }

        @media (min-width: 768px) {
          .mobile {
            display: none;
            width: 100%;
          }
          .desktop {
            display: block;
            width: 100%;
          }
          .desktop :global(media-control-bar) {
            width: 100%;
          }
        }
        .wrapper :global(media-controller) {
          aspect-ratio: 16 / 9;
          width: 100%;
        }
        .wrapper :global(video) {
          max-width: 100%;
        }
      `}</style>
    </div>
  );
}
