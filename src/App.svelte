<script>
  import AudioPlayer from './components/AudioPlayer.svelte'

  export let tracks = []
</script>

<AudioPlayer {tracks} />
