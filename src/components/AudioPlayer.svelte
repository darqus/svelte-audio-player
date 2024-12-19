<script>
  import { onMount } from 'svelte'
  import { paths } from './config.js'

  export let tracks = []

  let audio
  let isPlaying = false
  let isMuted = false
  let shuffle = false
  let repeat = false
  let showElapsedTime = false
  let currentTime = 0
  let duration = 0
  let elapsedTime = 0
  let volume = 1
  let currentTrackIndex = 0
  let cachedVolume = volume
  // let preset = 'full' // 'minimal', 'normal', 'full'

  const MIN_DURATION = 0
  const STEP_DURATION = 0.01

  const XMLNS = 'http://www.w3.org/2000/svg'
  const viewBox = '0 0 32 32'

  onMount(() => {
    if (tracks.length > 0) {
      audio = new Audio(tracks[currentTrackIndex].src)
      audio.volume = volume
      audio.addEventListener('timeupdate', updateTime)
      audio.addEventListener('loadedmetadata', updateDuration)
      audio.addEventListener('ended', handleTrackEnd)
    }
  })

  const playPause = () => {
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    isPlaying = !isPlaying
  }

  const updateTime = () => {
    currentTime = audio.currentTime
  }

  const updateDuration = () => {
    duration = audio.duration
  }

  const changeDuration = (event) => {
    audio.currentTime = event.target.value
    currentTime = audio.currentTime
  }

  const changeVolume = (event) => {
    volume = parseFloat(event.target.value)
    audio.volume = volume
    isMuted = volume === 0
  }

  const toggleMute = () => {
    isMuted = !isMuted
    if (isMuted) {
      cachedVolume = volume
      volume = 0
    } else {
      volume = cachedVolume
    }
    audio.muted = isMuted
    audio.volume = volume
  }

  const toggleTimeDisplay = () => {
    showElapsedTime = !showElapsedTime
  }

  const handleTrackEnd = () => {
    if (repeat) {
      audio.currentTime = 0
      audio.play()
    } else {
      nextTrack()
    }
  }

  const nextTrack = () => {
    if (shuffle) {
      let newIndex
      do {
        newIndex = Math.floor(Math.random() * tracks.length)
      } while (newIndex === currentTrackIndex)
      currentTrackIndex = newIndex
    } else if (!repeat) {
      currentTrackIndex = (currentTrackIndex + 1) % tracks.length
    }
    audio.src = tracks[currentTrackIndex].src
    audio.play()
    isPlaying = true
  }

  const prevTrack = () => {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length
    audio.src = tracks[currentTrackIndex].src
    audio.play()
    isPlaying = true
  }

  const toggleShuffle = () => {
    shuffle = !shuffle
  }

  const toggleRepeat = () => {
    repeat = !repeat
  }

  const formatTime = (seconds, isElapsedTime) => {
    if (isNaN(seconds)) return '0:00'

    const format = (time) => {
      const minutes = Math.floor(time / 60)
      const secs = Math.floor(time % 60)
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
    }

    if (isElapsedTime) {
      let elapsed = showElapsedTime ? duration - currentTime : duration
      if (elapsed < 0) elapsed = 0
      const time = format(elapsed)
      return showElapsedTime ? `-${time}` : time
    } else {
      return format(seconds)
    }
  }
</script>

<div class="audio-player">
  <div class="track-name">
    <strong>{currentTrackIndex + 1} / {tracks.length}</strong>

    <div class="title">
      {tracks[currentTrackIndex].author} – «{tracks[currentTrackIndex].title}»
    </div>
  </div>

  <div class="track-info">
    <div class="buttons-control">
      <!-- {elapsedTime} -->
      <button on:click={prevTrack}>
        <svg
          {XMLNS}
          {viewBox}
        >
          <path d={paths.previousLeft}></path>
          <path d={paths.previousRight}></path>
        </svg>
      </button>

      <button on:click={playPause}>
        <svg
          {XMLNS}
          {viewBox}
        >
          <path d={isPlaying ? paths.pauseLeft : paths.play}></path>

          {#if isPlaying}
            <path d={paths.pauseRight}></path>
          {/if}
        </svg>
      </button>

      <button on:click={nextTrack}>
        <svg
          {XMLNS}
          {viewBox}
        >
          <path d={paths.nextLeft}></path>
          <path d={paths.nextRight}></path>
        </svg>
      </button>

      <button
        on:click={toggleShuffle}
        class={shuffle ? '' : 'shuffle'}
      >
        <svg
          {XMLNS}
          {viewBox}
        >
          <path d={paths.shuffle}></path>
        </svg>
      </button>

      <button
        on:click={toggleRepeat}
        class={repeat ? '' : 'repeat'}
      >
        <svg
          {XMLNS}
          {viewBox}
        >
          <path d={paths.repeatLeft}></path>
          <path d={paths.repeatRight}></path>
        </svg>
      </button>
    </div>

    <div class="track-ranges">
      <div class="progress-control">
        <div class="current-time">
          <span>{formatTime(currentTime, false)}</span>
        </div>
        <input
          type="range"
          min={MIN_DURATION}
          max={duration}
          step={STEP_DURATION}
          value={currentTime}
          on:input={changeDuration}
        />
        <div class="duration-time">
          <span
            on:click={toggleTimeDisplay}
            on:keydown={(e) => e.key === 'Enter' && toggleTimeDisplay()}
          >
            {formatTime(currentTime, true)}
          </span>
        </div>
      </div>

      <div class="volume-control">
        <button on:click={toggleMute}>
          <svg
            {XMLNS}
            {viewBox}
          >
            <path
              d={isMuted || volume == 0
                ? paths.muteSpeaker
                : paths.volumeSpeaker}
            ></path>
            <path
              d={isMuted || volume == 0
                ? paths.muteClose
                : paths.volumeLeftLine}
            ></path>
            {#if !isMuted && volume != 0}
              <path d={paths.volumeRightLine}></path>
            {/if}
          </svg>
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          on:input={changeVolume}
        />
      </div>
    </div>
  </div>
</div>

<style>
  :root {
    --box-shadow-color: #00000012;
    --gap: 10px;
    --control-size: 2rem;
    --control-size-small: 1.4rem;
    --current-time-width: 30px;
    --duration-time-width: 40px;
    --track-background-color: #4a4a4a;
    --track-background-color-focus: #595959;
    --track-border-radius: 4px;
    --thumb-background-color: #4a4a4a;
    --thumb-size: 14px;
    --track-height: 5px;
    --control-color: #000;
    --text-color: #888;
    --name-color: #222;
    --duration: 0.3s;
    --opacity-hover: 0.6;
    --opacity-focus: 0.7;
  }

  .audio-player {
    display: grid;
    gap: var(--gap);
    border: 1px solid #ebebeb;
    border-radius: var(--gap);
    padding: var(--gap);
    box-shadow: 0 7px 16px 0 var(--box-shadow-color);
    background-color: #fff;
  }

  .track-name {
    display: grid;
    grid-template-columns: auto 1fr;
    font-size: 1rem;
    gap: var(--gap);
    align-items: end;
    font-size: 0.8rem;
    max-width: 530px;
    align-items: center;
  }

  .track-name strong {
    color: var(--text-color);
    font-weight: bold;
  }

  .track-name .title {
    color: var(--name-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .track-info {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--gap);
  }

  .track-ranges {
    display: grid;
    grid-template-columns: auto auto;
    gap: var(--gap);
  }

  .buttons-control {
    display: grid;
    grid-template-columns: repeat(5, var(--control-size));
    gap: var(--gap);
    align-items: center;
  }

  .buttons-control button {
    display: grid;
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: opacity var(--duration);
  }

  .buttons-control button svg path {
    fill: var(--control-color);
  }

  .buttons-control button:focus {
    opacity: var(--opacity-focus);
  }

  .buttons-control button:hover {
    opacity: var(--opacity-hover);
  }

  .buttons-control button.repeat,
  .buttons-control button.shuffle {
    opacity: 0.2;
  }

  .progress-control {
    display: grid;
    grid-template-columns:
      var(--current-time-width)
      minmax(80px, 120px)
      var(--duration-time-width);
    align-items: center;
    gap: var(--gap);
  }

  .progress-control .current-time,
  .progress-control .duration-time {
    display: grid;
    font-size: 0.9rem;
    color: var(--text-color);
  }

  .volume-control {
    display: grid;
    grid-template-columns:
      var(--control-size-small)
      minmax(40px, 60px);
    gap: 2px;
    align-items: center;
  }

  .volume-control button {
    display: grid;
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: opacity var(--duration);
  }

  .volume-control button svg path {
    fill: var(--control-color);
  }

  .volume-control button:focus {
    opacity: var(--opacity-focus);
  }

  .volume-control button:hover {
    opacity: var(--opacity-hover);
  }

  /* General styles */
  .volume-control input[type='range'],
  .progress-control input[type='range'] {
    -webkit-appearance: none; /* Override default CSS styles */
    appearance: none;
    width: 100%;
    margin: 0;
    background: transparent; /* Otherwise white in Chrome */
  }

  /* WebKit-specific styles */
  .volume-control input[type='range']::-webkit-slider-runnable-track,
  .progress-control input[type='range']::-webkit-slider-runnable-track {
    width: 100%;
    height: var(--track-height);
    cursor: pointer;
    animate: 0.2s;
    background: var(--track-background-color);
    border-radius: var(--track-border-radius);
  }

  .volume-control input[type='range']::-webkit-slider-thumb,
  .progress-control input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: var(--thumb-size);
    height: var(--thumb-size);
    background-color: var(--thumb-background-color);
    border-radius: 50%;
    cursor: pointer;
    margin-top: -4px; /* Center the thumb on the track */
    border: 2px solid #fff;
    box-shadow: 0px 1px 4px 0px #00000026;
  }

  /* Mozilla-specific styles */
  .volume-control input[type='range']::-moz-range-track,
  .progress-control input[type='range']::-moz-range-track {
    width: 100%;
    height: var(--track-height);
    cursor: pointer;
    background-color: var(--track-background-color);
    border-radius: var(--track-border-radius);
    border: 2px solid #fff;
    box-shadow: 0px 1px 4px 0px #00000026;
  }

  .volume-control input[type='range']::-moz-range-thumb,
  .progress-control input[type='range']::-moz-range-thumb {
    width: var(--thumb-size);
    height: var(--thumb-size);
    background-color: var(--thumb-background-color);
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #fff;
    box-shadow: 0px 1px 4px 0px #00000026;
  }

  /* IE-specific styles */
  .volume-control input[type='range']::-ms-track,
  .progress-control input[type='range']::-ms-track {
    width: 100%;
    height: var(--track-height);
    cursor: pointer;
    background-color: transparent;
    border-color: transparent;
    color: transparent;
  }

  .volume-control input[type='range']::-ms-fill-lower,
  .progress-control input[type='range']::-ms-fill-lower {
    background-color: var(--track-background-color);
    border-radius: var(--track-border-radius);
  }

  .volume-control input[type='range']::-ms-fill-upper,
  .progress-control input[type='range']::-ms-fill-upper {
    background-color: var(--track-background-color);
    border-radius: var(--track-border-radius);
  }

  .volume-control input[type='range']::-ms-thumb,
  .progress-control input[type='range']::-ms-thumb {
    width: var(--thumb-size);
    height: var(--thumb-size);
    background-color: var(--thumb-background-color);
    border-radius: 50%;
    cursor: pointer;
  }

  /* Additional styles */
  .volume-control input[type='range']:focus,
  .progress-control input[type='range']:focus {
    outline: none;
  }

  .volume-control input[type='range']:focus::-webkit-slider-runnable-track,
  .progress-control input[type='range']:focus::-webkit-slider-runnable-track {
    background-color: var(--track-background-color-focus);
  }

  .volume-control input[type='range']:focus::-moz-range-track,
  .progress-control input[type='range']:focus::-moz-range-track {
    background-color: var(--track-background-color-focus);
  }

  .volume-control input[type='range']:focus::-ms-fill-lower,
  .progress-control input[type='range']:focus::-ms-fill-lower {
    background-color: var(--track-background-color-focus);
  }

  .volume-control input[type='range']:focus::-ms-fill-upper,
  .progress-control input[type='range']:focus::-ms-fill-upper {
    background-color: var(--track-background-color-focus);
  }

  @media (min-width: 800px) {
    .audio-player {
      grid-template-rows: auto auto;
    }

    .track-name {
      max-width: 740px;
    }

    .progress-control {
      grid-template-columns:
        var(--current-time-width)
        minmax(250px, 300px)
        var(--duration-time-width);
    }

    .volume-control {
      grid-template-columns:
        var(--control-size-small)
        minmax(50px, 100px);
    }
  }
</style>
