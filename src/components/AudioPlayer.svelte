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

<style lang="scss">
  @use '../styles/index.scss';
</style>
