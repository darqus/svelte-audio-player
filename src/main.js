import App from './App.svelte'

const app = new App({
  target: document.getElementById('audio-player-svelte'),
  props: {
    tracks: [
      { src: 'tracks/01. NWO.mp3', title: '01. NWO' },
      { src: 'tracks/02. Just One Fix.mp3', title: '02. Just One Fix' },
      {
        src: 'tracks/01. Antonyo feat. Bradley - Supernatural Lover (Original Mix).mp3',
        title: '01. Antonyo feat. Bradley - Supernatural Lover (Original Mix)',
      },
      {
        src: 'tracks/02. Mark Picchiotti, Kenyata - Rumors (Mark Picchiotti Vocal).mp3',
        title: '02. Mark Picchiotti, Kenyata - Rumors (Mark Picchiotti Vocal)',
      },
    ],
  },
})

export default app
