<script>
  import { onMount } from 'svelte'

  let audio
  let isPlaying = false
  let currentTime = 0
  let duration = 0
  let volume = 1
  let isMuted = false
  let shuffle = false
  let repeat = false
  let preset = 'full' // 'minimal', 'normal', 'full'

  const icons = {
    play: 'icons/play.svg',
    pause: 'icons/pause.svg',
    next: 'icons/next.svg',
    previous: 'icons/previous.svg',
    shuffle: 'icons/shuffle.svg',
    repeat: 'icons/repeat.svg',
    volume: 'icons/volume.svg',
    mute: 'icons/mute.svg',
  }

  const tracks = [
    { src: 'tracks/01. NWO.mp3', title: '01. NWO' },
    { src: 'tracks/02. Just One Fix.mp3', title: '02. Just One Fix' },
    // Add more tracks here
  ]

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
  {isPlaying}
  <div class="controls">
    <button on:click={prevTrack}>
      <img
        src={icons.previous}
        alt="Previous"
      />
    </button>

    <button on:click={playPause}>
      <img
        src={isPlaying ? icons.pause : icons.play}
        alt={isPlaying ? 'Play' : 'Pause'}
      />
    </button>

    <button on:click={nextTrack}>
      <img
        src={icons.next}
        alt="Next"
      />
    </button>

    <button on:click={toggleShuffle}>
      <img
        src={icons.shuffle}
        alt="Shuffle"
      />
    </button>

    <button on:click={toggleRepeat}>
      <img
        src={icons.repeat}
        alt="Repeat"
      />
    </button>

    <div class="volume-control">
      <button on:click={toggleMute}>
        <img
          src={isMuted ? icons.mute : icons.volume}
          alt="Mute/Volume"
        />
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

  <div class="progress">
    <div
      class="progress-bar"
      style="width: {(currentTime / duration) * 100}%"
    ></div>
  </div>

  <div class="time">
    <span>{formatTime(currentTime)}</span>
    <span>{formatTime(duration)}</span>
  </div>
</div>

<style lang="scss">
  $bg-color: #aaa;
  $box-shadow-color: rgba(0, 0, 0, 0.1);
  $progress-bg: #ddd;
  $progress-bar-color: #007bff;

  .audio-player {
    background-color: $bg-color;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px $box-shadow-color;
    display: grid;
    grid-template-rows: auto auto auto;
    gap: 10px;

    .controls {
      display: grid;
      grid-template-columns: repeat(5, 1fr) auto;
      gap: 10px;
      align-items: center;

      .volume-control {
        display: flex;
        align-items: center;

        input {
          margin-left: 10px;
        }
      }
    }

    .progress {
      width: 100%;
      height: 5px;
      background-color: $progress-bg;

      .progress-bar {
        height: 100%;
        background-color: $progress-bar-color;
        width: 0;
      }
    }

    .time {
      display: grid;
      grid-template-columns: 1fr 1fr;
      justify-content: space-between;
    }
  }
</style>
