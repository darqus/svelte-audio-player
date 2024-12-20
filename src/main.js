import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

const app = mount(App, {
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
        author: 'ISB',
        title: 'Who I Am',
      },
      {
        src: 'https://muz-tv.ru/storage/files/chart-tracks/1594629860.mp3',
        author: 'ЁЛКА X АНТ',
        title: 'Комната',
      },
      {
        src: 'https://muz-tv.ru/storage/files/chart-tracks/1601289714.mp3',
        author: 'ЁЛМАРИ КРАЙМБРЕРИ',
        title: 'Океан',
      },
      {
        src: 'https://muz-tv.ru/storage/files/chart-tracks/1601027082.mp3',
        author: 'ПОЛИНА ГАГАРИНА',
        title: 'На Расстоянии',
      },
    ],
  },
})

export default app
