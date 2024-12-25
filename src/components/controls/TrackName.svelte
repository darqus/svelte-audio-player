<script>
  export let currentTrackIndex
  export let tracks
</script>

<div class="track-name">
  <div class="counter">
    {tracks.length > 0 ? `${currentTrackIndex + 1} / ${tracks.length}` : '–'}
  </div>
  <div class="title">
    {tracks.length > 0
      ? `${tracks[currentTrackIndex].author} – «${tracks[currentTrackIndex].title}»`
      : 'No track available'}
  </div>
</div>
