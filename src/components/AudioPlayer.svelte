<script>
    import { onMount } from 'svelte';

    let audio;
    let isPlaying = false;
    let currentTime = 0;
    let duration = 0;
    let volume = 1;
    let isMuted = false;
    let shuffle = false;
    let repeat = false;
    let preset = 'full'; // 'minimal', 'normal', 'full'

    const icons = {
        play: 'icons/play.svg',
        pause: 'icons/pause.svg',
        next: 'icons/next.svg',
        previous: 'icons/previous.svg',
        shuffle: 'icons/shuffle.svg',
        repeat: 'icons/repeat.svg',
        volume: 'icons/volume.svg',
        mute: 'icons/mute.svg',
    };

    const tracks = [
        { src: 'tracks/01. NWO.mp3', title: '01. NWO' },
        { src: 'tracks/02. Just One Fix.mp3', title: '02. Just One Fix' },
        // Add more tracks here
    ];

    let currentTrackIndex = 0;

    onMount(() => {
        audio = new Audio(tracks[currentTrackIndex].src);
        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', nextTrack);
    });

    function playPause() {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        isPlaying = !isPlaying;
    }

    function updateTime() {
        currentTime = audio.currentTime;
    }

    function updateDuration() {
        duration = audio.duration;
    }

    function changeVolume(event) {
        volume = event.target.value;
        audio.volume = volume;
    }

    function toggleMute() {
        isMuted = !isMuted;
        audio.muted = isMuted;
    }

    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        audio.src = tracks[currentTrackIndex].src;
        audio.play();
        isPlaying = true;
    }

    function prevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        audio.src = tracks[currentTrackIndex].src;
        audio.play();
        isPlaying = true;
    }

    function toggleShuffle() {
        shuffle = !shuffle;
    }

    function toggleRepeat() {
        repeat = !repeat;
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
</script>

<style lang="scss">
  .audio-player {
    background: #aaa;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .progress {
    width: 100%;
    height: 5px;
    background: #ddd;
    margin: 10px 0;
    position: relative;
  }

  .progress-bar {
    height: 100%;
    background: #007bff;
    width: 0;
  }

  .time {
    display: flex;
    justify-content: space-between;
  }

  .volume-control {
    display: flex;
    align-items: center;
  }

  .volume-control input {
    margin-left: 10px;
  }
</style>

<div class="audio-player">
    <div class="controls">
      <button on:click={prevTrack}><img src={icons.previous} alt="Previous"></button>
      <button on:click={playPause}>
        <img src={isPlaying ? icons.pause : icons.play} alt="Play/Pause">
      </button>
      <button on:click={nextTrack}><img src={icons.next} alt="Next"></button>
      <button on:click={toggleShuffle}><img src={icons.shuffle} alt="Shuffle"></button>
      <button on:click={toggleRepeat}><img src={icons.repeat} alt="Repeat"></button>
      <div class="volume-control">
        <button on:click={toggleMute}><img src={isMuted ? icons.mute : icons.volume} alt="Mute/Volume"></button>
        <input type="range" min="0" max="1" step="0.01" value={volume} on:input={changeVolume}>
      </div>
    </div>
    <div class="progress">
        <div class="progress-bar" style="width: {currentTime / duration * 100}%"></div>
    </div>
    <div class="time">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
    </div>
</div>
