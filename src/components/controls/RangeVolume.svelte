<script>
  import { paths } from '../config.js'
  import RangeControl from './RangeControl.svelte'
  export let volume
  export let isMuted
  export let onInput
  export let onChange
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
  <RangeControl
    value={volume}
    {onInput}
    {onChange}
  />
</div>
