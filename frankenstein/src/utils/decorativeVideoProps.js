/**
 * Props for a <video> that is decoration rather than media.
 *
 * Every clip on this site is a silent six-second loop used as artwork.
 * Browsers can't tell that apart from a film, so they attach a reader
 * media UI to it: Chromium and Edge offer picture-in-picture (an
 * in-frame overlay button on hover, plus a context-menu entry), Edge
 * also offers "Enhance video", and both offer cast / AirPlay targets.
 * None of it does anything useful to a looping illustration, and all of
 * it implies the thing is a player.
 *
 * Spread these onto any decorative <video> to turn off everything the
 * platform lets us turn off. `disablePictureInPicture` and
 * `disableRemotePlayback` are the standardised opt-outs; `controlsList`
 * covers the case where controls appear anyway (a user preference, a UA
 * default we don't control); `x-webkit-airplay` is Safari's older
 * spelling of the remote-playback opt-out.
 *
 * There is no opt-out for Edge's enhance prompt, so where a reader can
 * actually reach a clip — the blur backdrops and the inline product
 * clips — we don't ship a video element at all: those are painted into a
 * canvas instead. See components/shared/IllustrationCanvas.
 */
export const decorativeVideoProps = {
  controls: false,
  disablePictureInPicture: true,
  disableRemotePlayback: true,
  controlsList: 'nodownload nofullscreen noplaybackrate noremoteplayback',
  'x-webkit-airplay': 'deny',
};

export default decorativeVideoProps;
