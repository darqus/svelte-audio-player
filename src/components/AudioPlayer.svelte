<script>
  import { onMount } from 'svelte'
  import { tracks, paths } from './config.js'

  let audio
  let isPlaying = false
  let isMuted = false
  let shuffle = false
  let repeat = false
  let currentTime = 0
  let duration = 0
  let volume = 1
  let currentTrackIndex = 0
  let cachedVolume = volume
  // let preset = 'full' // 'minimal', 'normal', 'full'

  const MIN_DURATION = 0
  const STEP_DURATION = 0.01

  const XMLNS = 'http://www.w3.org/2000/svg'
  const viewBox = '0 0 32 32'

  onMount(() => {
    audio = new Audio(tracks[currentTrackIndex].src)
    audio.volume = volume
    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleTrackEnd)
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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
  }
</script>

<div class="audio-player">
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

  <div class="progress-control">
    <div class="current-time">
      <span>{formatTime(currentTime)}</span>
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
      <span>{formatTime(duration)}</span>
    </div>
  </div>

  <div class="volume-control">
    <button on:click={toggleMute}>
      <svg
        {XMLNS}
        {viewBox}
      >
        <path
          d={isMuted || volume == 0 ? paths.muteSpeaker : paths.volumeSpeaker}
        ></path>
        <path
          d={isMuted || volume == 0 ? paths.muteClose : paths.volumeLeftLine}
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

<style>
  :root {
    --box-shadow-color: #000;
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
    grid-template-columns: auto 1fr auto;
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
    grid-template-columns: 1fr minmax(200px, 250px) 1fr;
    align-items: center;
    gap: var(--gap);
  }

  .progress-control .current-time,
  .progress-control .duration-time {
    font-size: 1rem;
    font-weight: bold;
  }

  .volume-control {
    display: grid;
    grid-template-columns: var(--control-size) minmax(100px, 150px);
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

  @media (max-width: 600px) {
    .audio-player {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto;
    }

    .progress-control {
      grid-template-columns: 1fr minmax(80px, 120px) 1fr;
    }
  }
</style>
