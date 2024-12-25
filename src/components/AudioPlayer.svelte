<script>
  import { onMount } from 'svelte'
  import { paths } from './config.js'

  export let tracks = []

  const LS_KEYS = {
    isPlaying: 'svelte-audio-player-isPlaying',
    volume: 'svelte-audio-player-volume',
    cachedVolume: 'svelte-audio-player-cachedVolume',
    shuffle: 'svelte-audio-player-shuffle',
    repeat: 'svelte-audio-player-repeat',
    showElapsedTime: 'svelte-audio-player-showElapsedTime',
    currentTrackIndex: 'svelte-audio-player-currentTrackIndex',
    currentTime: 'svelte-audio-player-currentTime',
    isMuted: 'svelte-audio-player-isMuted',
  }

  const getItem = (key, defaultValue) => {
    const value = localStorage.getItem(key)
    return value !== null ? JSON.parse(value) : defaultValue
  }

  let audio
  let isPlaying = false
  let isMuted = getItem(LS_KEYS.isMuted, false)
  let shuffle = getItem(LS_KEYS.shuffle, false)
  let repeat = getItem(LS_KEYS.repeat, false)
  let showElapsedTime = getItem(LS_KEYS.showElapsedTime, false)
  let currentTime = parseFloat(localStorage.getItem(LS_KEYS.currentTime)) || 0
  let duration = 0
  let volume = parseFloat(localStorage.getItem(LS_KEYS.volume)) || 1
  let currentTrackIndex =
    parseInt(localStorage.getItem(LS_KEYS.currentTrackIndex)) || 0
  let cachedVolume =
    parseFloat(localStorage.getItem(LS_KEYS.cachedVolume)) || volume
  // let preset = 'full' // 'minimal', 'normal', 'full'

  const VIEW_BOX = '0 0 32 32'

  onMount(() => {
    if (tracks.length > 0) {
      audio = new Audio(tracks[currentTrackIndex].src)
      audio.volume = volume
      audio.addEventListener('timeupdate', updateTime)
      audio.addEventListener('loadedmetadata', () => {
        updateDuration()
        audio.currentTime = currentTime // Restore currentTime here
        currentTime = audio.currentTime // Ensure state is updated
      })
      audio.addEventListener('ended', handleTrackEnd)
    }

    // Initialize and sync LS_KEYS from localStorage
    const settings = [
      {
        key: LS_KEYS.volume,
        handler: (value) => {
          volume = parseFloat(value)
          if (audio) audio.volume = volume
        },
      },
      {
        key: LS_KEYS.cachedVolume,
        handler: (value) => {
          cachedVolume = parseFloat(value)
        },
      },
      {
        key: LS_KEYS.shuffle,
        handler: (value) => {
          shuffle = JSON.parse(value)
        },
      },
      {
        key: LS_KEYS.repeat,
        handler: (value) => {
          repeat = JSON.parse(value)
        },
      },
      {
        key: LS_KEYS.showElapsedTime,
        handler: (value) => {
          showElapsedTime = JSON.parse(value)
        },
      },
      {
        key: LS_KEYS.currentTrackIndex,
        handler: (value) => {
          currentTrackIndex = parseInt(value)
        },
      },
      {
        key: LS_KEYS.currentTime,
        handler: (value) => {
          currentTime = parseFloat(value)
          if (audio) {
            audio.currentTime = currentTime
          }
        },
      },
      {
        key: LS_KEYS.isMuted,
        handler: (value) => {
          isMuted = JSON.parse(value)
          if (audio) audio.muted = isMuted
        },
      },
    ]

    settings.forEach(({ key, handler }) => {
      const savedValue = localStorage.getItem(key)
      if (savedValue !== null) {
        handler(savedValue)
      } else {
        // Set default value in localStorage
        const defaultValue = eval(key)
        localStorage.setItem(key, JSON.stringify(defaultValue))
      }
    })
  })

  // Sync state changes to localStorage
  $: localStorage.setItem(LS_KEYS.volume, JSON.stringify(volume))
  $: localStorage.setItem(LS_KEYS.cachedVolume, JSON.stringify(cachedVolume))
  $: localStorage.setItem(LS_KEYS.shuffle, JSON.stringify(shuffle))
  $: localStorage.setItem(LS_KEYS.repeat, JSON.stringify(repeat))
  $: localStorage.setItem(
    LS_KEYS.showElapsedTime,
    JSON.stringify(showElapsedTime),
  )
  $: localStorage.setItem(
    LS_KEYS.currentTrackIndex,
    JSON.stringify(currentTrackIndex),
  )
  $: localStorage.setItem(LS_KEYS.currentTime, JSON.stringify(currentTime))
  $: localStorage.setItem(LS_KEYS.isMuted, JSON.stringify(isMuted))

  // Calculate position
  $: position = duration ? currentTime / duration : 0

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
    audio.currentTime = event.target.value * duration
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

<div class="svelte-audio-player">
  <div class="track-name">
    <div class="counter">{currentTrackIndex + 1} / {tracks.length}</div>

    <div class="title">
      {tracks[currentTrackIndex].author} – «{tracks[currentTrackIndex].title}»
    </div>
  </div>

  <div class="track-info">
    <div class="buttons-control">
      <button
        on:click={prevTrack}
        aria-label="Previous Track"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={VIEW_BOX}
        >
          <path d={paths.previousLeft}></path>
          <path d={paths.previousRight}></path>
        </svg>
      </button>

      <button
        on:click={playPause}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={VIEW_BOX}
        >
          <path d={isPlaying ? paths.pauseLeft : paths.play}></path>

          {#if isPlaying}
            <path d={paths.pauseRight}></path>
          {/if}
        </svg>
      </button>

      <button
        on:click={nextTrack}
        aria-label="Next Track"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={VIEW_BOX}
        >
          <path d={paths.nextLeft}></path>
          <path d={paths.nextRight}></path>
        </svg>
      </button>

      <button
        on:click={toggleShuffle}
        class={shuffle ? '' : 'shuffle'}
        aria-label="Shuffle"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={VIEW_BOX}
        >
          <path d={paths.shuffle}></path>
        </svg>
      </button>
      <button
        on:click={toggleRepeat}
        class={repeat ? '' : 'repeat'}
        aria-label="Repeat"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={VIEW_BOX}
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
          min="0"
          max="1"
          step="0.01"
          bind:value={position}
          on:input={changeDuration}
        />
        <div class="duration-time">
          <span
            role="button"
            tabindex="0"
            on:click={toggleTimeDisplay}
            on:keydown={(e) => e.key === 'Enter' && toggleTimeDisplay()}
          >
            {formatTime(currentTime, true)}
          </span>
        </div>
      </div>
      <div class="volume-control">
        <button
          on:click={toggleMute}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={VIEW_BOX}
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
