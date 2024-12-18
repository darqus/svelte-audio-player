<script>
  import { onMount } from 'svelte'
  import { tracks, paths } from './config.js'

  let audio
  let isPlaying = false
  export let currentTime = 0
  export let duration = 0
  let volume = 1
  let isMuted = false
  let shuffle = false
  let repeat = false
  // let preset = 'full' // 'minimal', 'normal', 'full'

  const XMLNS = 'http://www.w3.org/2000/svg'
  const viewBox = '0 0 32 32'

  let currentTrackIndex = 0

  onMount(() => {
    audio = new Audio(tracks[currentTrackIndex].src)
    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', nextTrack)
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

  const changeVolume = (event) => {
    volume = event.target.value
    audio.volume = volume
  }

  const toggleMute = () => {
    isMuted = !isMuted
    audio.muted = isMuted
  }

  const nextTrack = () => {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length
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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
  }
</script>

<div class="audio-player">
  <!-- {duration} -->
  <div class="buttons-control">
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

    <button on:click={toggleShuffle}>
      <svg
        {XMLNS}
        {viewBox}
      >
        <path d={paths.shuffle}></path>
      </svg>
    </button>

    <button on:click={toggleRepeat}>
      <svg
        {XMLNS}
        {viewBox}
      >
        <path d={paths.repeatLeft}></path>
        <path d={paths.repeatRight}></path>
      </svg>
    </button>
  </div>

  <div class="progress-control">
    <div class="current-time">
      <span>{formatTime(currentTime)}</span>
    </div>
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={duration}
      on:input={updateDuration}
    />
    <div class="diration-time">
      <span>{formatTime(duration)}</span>
    </div>
  </div>

  <div class="volume-control">
    <button on:click={toggleMute}>
      <svg
        {XMLNS}
        {viewBox}
      >
        <path d={isMuted ? paths.muteSpeaker : paths.volumeSpeaker}></path>
        <path d={isMuted ? paths.muteClose : paths.volumeLeftLine}></path>

        {#if !isMuted}
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

<style>
  :root {
    --box-shadow-color: #000; /* Define appropriate color */
    --progress-bg: #ccc; /* Define appropriate color */
    --progress-bar-color: #f00; /* Define appropriate color */
    --gap: 10px;
    --control-size: 2rem;
    --control-color: #000;
    --duration: 0.3s;
    --opacity-hover: 0.6;
    --opacity-focus: 0.7;
  }

  .audio-player {
    border-radius: var(--gap);
    padding: var(--gap);
    box-shadow: 0 0 10px var(--box-shadow-color);
    display: grid;
    grid-template-columns: auto repeat(2, 1fr);
    gap: var(--gap);
  }

  .buttons-control {
    display: grid;
    grid-template-columns: repeat(5, var(--control-size));
    gap: var(--gap);
    align-items: center;
  }

  .buttons-control button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: opacity var(--duration);
  }

  .buttons-control button:focus {
    opacity: var(--opacity-focus);
  }

  .buttons-control button:hover {
    opacity: var(--opacity-hover);
  }

  .buttons-control button svg path {
    fill: var(--control-color);
  }

  .progress-control {
    display: grid;
    grid-template-columns: 1fr minmax(200px, 250px) 1fr;
    align-items: center;
    gap: var(--gap);
  }

  .volume-control {
    display: grid;
    grid-template-columns: var(--control-size) 1fr;
    gap: var(--gap);
  }

  .volume-control button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: opacity var(--duration);
  }

  .volume-control button:focus {
    opacity: var(--opacity-focus);
  }

  .volume-control button:hover {
    opacity: var(--opacity-hover);
  }

  .volume-control input {
    margin: 0;
  }
</style>
