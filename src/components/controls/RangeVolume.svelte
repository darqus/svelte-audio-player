<script>
  import { paths } from '../config.js'
  export let volume
  export let isMuted
  export let onInput
  export let onToggleMute
</script>

<div class="volume-control">
  <button
    on:click={onToggleMute}
    aria-label={isMuted ? 'Unmute' : 'Mute'}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
    >
      <path d={isMuted || volume == 0 ? paths.muteSpeaker : paths.volumeSpeaker}
      ></path>
      <path d={isMuted || volume == 0 ? paths.muteClose : paths.volumeLeftLine}
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
    bind:value={volume}
    on:input={onInput}
  />
</div>
