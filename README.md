# Svelte Audio Player Package

A customizable HTML audio player built with Svelte.

## Demo

See [link](https://darqus.github.io/svelte-audio-player/dist/)

## Features

- Play/Pause
- Previous/Next
- Shuffle/Repeat
- Volume Control
- Mute/Unmute
- Time Duration and Elapsed Time
- Customizable SVG Icons (in dev)
- Settings Presets: Minimal, Normal, Full (in dev)

## Installation

```bash
npm install svelte-audio-player
```

## Integtation for Svelte

To use the AudioPlayer component in your Svelte application, follow these steps:

1. Import the AudioPlayer component from the package.
2. Include the component in your Svelte template.

```html
<script>
  import AudioPlayer from 'svelte-audio-player/src/components/AudioPlayer.svelte';
</script>

<AudioPlayer
  tracks={[
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
  ]}
/>
```

You can customize the player by passing props to the component. Refer to the documentation for available options.

This is a basic implementation. You can further customize the styles and functionality as needed.

## Integtation for html projects

To use the AudioPlayer component in any JavaScript project, follow these steps:

1. Install the package using npm.
2. Import the AudioPlayer component into your project.
3. Include the component in your HTML or JavaScript file.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Svelte Audio Player Integration</title>
    <link
      rel="icon"
      type="image/png"
      href="dist/vite.svg"
    />
    <!-- common styles -->
    <link
      rel="stylesheet"
      href="src/app.css"
    />
    <!-- svelte audio player styles -->
    <link
      rel="stylesheet"
      href="dist/assets/svelte-audio-player.css"
    />
    <!-- svelte audio player bundle -->
    <script
      defer
      src="dist/assets/main.js"
    ></script>
  </head>
  <body>
    <div id="svelte-audio-player"></div>
    <script type="module">
      import AudioPlayer from './dist/assets/main.js'

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
    </script>
  </body>
</html>
```

## Dev mode

```sh
yarn dev
```

use Live share extention for live reload propject in dev mode

## Prod mode

```sh
yarn build
```

this command minify bundle for use in prod

## Design

See [Figma](https://www.figma.com/design/EqWAcGxTamQNTwlV3gIsRd/PLAYER-%E2%80%94-Open-Sourse?node-id=24-767&t=a6ZWbZjLS1Ly7G4i-0)

Desinger: [Rustam Samiev](https://bento.me/foxxx)

Github: [Repo](https://github.com/hellorustam)
