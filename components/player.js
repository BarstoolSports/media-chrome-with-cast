import { useState, useRef, useEffect } from 'react'
import MuxVideoReact from '@mux-elements/mux-video-react'
import AirPlayButton from './airplay-button'
import 'media-chrome'

export default function Player () {
  const [hasAirplay, setHasAirplay] = useState(false);
  const muxVideoRef = useRef(null);

  useEffect(() => {
    const onPlaybackTargetChanged = (event) => {
      setHasAirplay(event.availability === 'available');
    };

    if (window.WebKitPlaybackTargetAvailabilityEvent) {
      // muxVideoRef is a ref to the `<mux-video>` DOM element
      muxVideoRef.current.addEventListener('webkitplaybacktargetavailabilitychanged', onPlaybackTargetChanged);
    }

  }, [])

  /*
   * Chromecast setup
   */
  useEffect(() => {
    const initializeCastApi = function() {
      console.log('debug initializeCastApi');
      cast.framework.CastContext.getInstance().setOptions({
        receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
      });
      const castSession = cast.framework.CastContext.getInstance().getCurrentSession();
      console.log('debug castSession', castSession);
    };

    console.log('debug setting __onGCastApiAvailable', typeof cast);
    window['__onGCastApiAvailable'] = function(isAvailable) {
      console.log('debug isAvailable', isAvailable);
      if (isAvailable) {
        initializeCastApi();
      }
    };
  }, []);

  return (
    <div>
      <div className="wrapper">
        <media-controller>
          <MuxVideoReact playsInline ref={muxVideoRef} slot="media" className="video" playbackId="3taBcOqKMfNG029QjBCJMKLviq13OrV6S" poster="https://image.mux.com/3taBcOqKMfNG029QjBCJMKLviq13OrV6S/thumbnail.jpg?width=500" />
          <div className="desktop">
            <media-control-bar>
              <media-play-button></media-play-button>
              <media-mute-button></media-mute-button>
              <media-volume-range></media-volume-range>
              <media-time-range></media-time-range>
              {hasAirplay && <AirPlayButton onClick={() => muxVideoRef.current.webkitShowPlaybackTargetPicker()} />}
              <google-cast-launcher></google-cast-launcher>
              <media-pip-button></media-pip-button>
              <media-fullscreen-button></media-fullscreen-button>
            </media-control-bar>
          </div>
          <div className="mobile top-controls" slot="top-chrome">
            <media-mute-button></media-mute-button>
            <div className="spacer" />
            {hasAirplay && <AirPlayButton onClick={() => muxVideoRef.current.webkitShowPlaybackTargetPicker()} />}
            <google-cast-launcher></google-cast-launcher>
            <media-pip-button></media-pip-button>
            {hasAirplay && <AirPlayButton onClick={() => muxVideoRef.current.webkitShowPlaybackTargetPicker()} />}
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
        @media(min-width: 768px) {
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
  )
}
