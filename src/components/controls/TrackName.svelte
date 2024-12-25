<script>
  export let currentTrackIndex
  export let tracks
</script>

<div class="track-name">
  {#if tracks.length > 0}
    <div class="counter">{currentTrackIndex + 1} / {tracks.length}</div>
    <div class="title">
      {tracks[currentTrackIndex].author} – «{tracks[currentTrackIndex].title}»
    </div>
  {:else}
    <div class="title">No track available</div>
  {/if}
</div>
