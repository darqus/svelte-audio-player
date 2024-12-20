import AudioPlayer from './components/AudioPlayer.svelte'
import './app.css'

const app = new AudioPlayer({
  target: document.getElementById('svelte-audio-player'),
  props: {
    tracks: [
      {
        src: 'https://muz-tv.ru/storage/files/chart-tracks/1594629860.mp3',
        author: 'ЁЛКА',
        title: 'Мне Легко',
      },
      {
        src: 'https://muz-tv.ru/storage/files/chart-tracks/1601897430.mp3',
        author: 'Artist Name',
        title: 'Track Title',
      },
    ],
  },
})

// export default app
