<script>
  import { onMount } from 'svelte'

  let audio
  let isPlaying = false
  export let currentTime = 0
  export let duration = 0
  let volume = 1
  let isMuted = false
  let shuffle = false
  let repeat = false
  let preset = 'full' // 'minimal', 'normal', 'full'

  const paths = {
    volume:
      'M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64l0 384c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352 64 352c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l67.8 0L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z',
    mute: 'M320 64c0-12.6-7.4-24-18.9-29.2s-25-3.1-34.4 5.3L131.8 160 64 160c-35.3 0-64 28.7-64 64l0 64c0 35.3 28.7 64 64 64l67.8 0L266.7 471.9c9.4 8.4 22.9 10.4 34.4 5.3S320 460.6 320 448l0-384z',
    play: 'M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z',
    pause:
      'M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z',
    previous:
      'M267.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29l0-320c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160L64 241 64 96c0-17.7-14.3-32-32-32S0 78.3 0 96L0 416c0 17.7 14.3 32 32 32s32-14.3 32-32l0-145 11.5 9.6 192 160z',
    next: 'M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416L0 96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241l0-145c0-17.7 14.3-32 32-32s32 14.3 32 32l0 320c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-145-11.5 9.6-192 160z',
    shuffle:
      'M403.8 34.4c12-5 25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6l0-32-32 0c-10.1 0-19.6 4.7-25.6 12.8L284 229.3 244 176l31.2-41.6C293.3 110.2 321.8 96 352 96l32 0 0-32c0-12.9 7.8-24.6 19.8-29.6zM164 282.7L204 336l-31.2 41.6C154.7 401.8 126.2 416 96 416l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c10.1 0 19.6-4.7 25.6-12.8L164 282.7zm274.6 188c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6l0-32-32 0c-30.2 0-58.7-14.2-76.8-38.4L121.6 172.8c-6-8.1-15.5-12.8-25.6-12.8l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c30.2 0 58.7 14.2 76.8 38.4L326.4 339.2c6 8.1 15.5 12.8 25.6 12.8l32 0 0-32c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64z',
    repeat:
      'M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96l160 0 0 32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32l0 32L160 64C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96l-160 0 0-32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6l0-32 160 0c88.4 0 160-71.6 160-160z',
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
  <!-- {isPlaying} -->
  <div class="controls">
    <button on:click={prevTrack}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512"
      >
        <path d={paths.previous}></path>
      </svg>
    </button>

    <button on:click={playPause}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
      >
        <path d={isPlaying ? paths.play : paths.pause}></path>
      </svg>
    </button>

    <button on:click={nextTrack}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512"
      >
        <path d={paths.next}></path>
      </svg>
    </button>

    <button on:click={toggleShuffle}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path d={paths.shuffle}></path>
      </svg>
    </button>

    <button on:click={toggleRepeat}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path d={paths.repeat}></path>
      </svg>
    </button>

    <div class="volume-control">
      <button on:click={toggleMute}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 512"
        >
          <path d={isMuted ? paths.mute : paths.volume}></path>
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

<style>
  :root {
    --box-shadow-color: #000; /* Define appropriate color */
    --progress-bg: #ccc; /* Define appropriate color */
    --progress-bar-color: #f00; /* Define appropriate color */
    --gap: 10px;
    --control-size: 2rem;
  }

  .audio-player {
    border-radius: var(--gap);
    padding: var(--gap);
    box-shadow: 0 0 10px var(--box-shadow-color);
    display: grid;
    grid-template-rows: auto auto auto;
    gap: var(--gap);
  }

  .controls {
    display: grid;
    grid-template-columns: repeat(5, var(--control-size)) 1fr;
    gap: var(--gap);
    align-items: center;
  }

  .controls button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
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
    /* width: var(--control-size); */
    /* height: inherit; */
  }

  /* .volume-control button img {
    width: auto;
    height: auto;
  } */

  .volume-control input {
    /* margin-left: var(--gap); */
  }

  .progress {
    width: 100%;
    height: 5px;
    background-color: var(--progress-bg);
  }

  .progress-bar {
    height: 100%;
    background-color: var(--progress-bar-color);
    width: 0;
  }

  .time {
    display: grid;
    grid-template-columns: 1fr auto;
  }
</style>
