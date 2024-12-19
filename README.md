# Svalte Audio Player Package

A customizable HTML audio player built with Svelte.

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
      src: 'tracks/01. Antonyo feat. Bradley - Supernatural Lover (Original Mix).mp3',
      title: '01. Antonyo feat. Bradley - Supernatural Lover (Original Mix)',
    },
    {
      src: 'tracks/02. Mark Picchiotti, Kenyata - Rumors (Mark Picchiotti Vocal).mp3',
      title: '02. Mark Picchiotti, Kenyata - Rumors (Mark Picchiotti Vocal)',
    },
    { src: 'tracks/01. NWO.mp3', title: '01. NWO' },
    { src: 'tracks/02. Just One Fix.mp3', title: '02. Just One Fix' },
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
      href="favicon.png"
    />
    <!-- common styles -->
    <link
      rel="stylesheet"
      href="style.css"
    />
    <!-- svelte audio player styles -->
    <link
      rel="stylesheet"
      href="build/bundle.css"
    />
  </head>
  <body>
    <div id="audio-player-svelte"></div>
    <script type="module">
      import AudioPlayer from './build/bundle.js'

      const app = new AudioPlayer({
        target: document.getElementById('audio-player-svelte'),
        props: {
          tracks: [
            {
              src: 'tracks/01. Antonyo feat. Bradley - Supernatural Lover (Original Mix).mp3',
              title:
                '01. Antonyo feat. Bradley - Supernatural Lover (Original Mix)',
            },
            {
              src: 'tracks/02. Mark Picchiotti, Kenyata - Rumors (Mark Picchiotti Vocal).mp3',
              title:
                '02. Mark Picchiotti, Kenyata - Rumors (Mark Picchiotti Vocal)',
            },
            { src: 'tracks/01. NWO.mp3', title: '01. NWO' },
            { src: 'tracks/02. Just One Fix.mp3', title: '02. Just One Fix' },
          ],
        },
      })
    </script>
  </body>
</html>
```
