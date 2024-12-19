# Audio Player Package

A customizable HTML audio player built with Svelte.

## Features

- Play/Pause
- Previous/Next
- Shuffle/Repeat
- Volume Control
- Mute/Unmute
- Time Duration and Elapsed Time
- Customizable SVG Icons
- Settings Presets: Minimal, Normal, Full

## Installation

```bash
npm install audio-player-package
```

## Usage for Svelte

To use the AudioPlayer component in your Svelte application, follow these steps:

1. Import the AudioPlayer component from the package.
2. Include the component in your Svelte template.

```js
<script>
  import AudioPlayer from 'audio-player-package/src/components/AudioPlayer.svelte';
</script>

<AudioPlayer />
```

You can customize the player by passing props to the component. Refer to the documentation for available options.

This is a basic implementation. You can further customize the styles and functionality as needed.

## Usage for any projects

To use the AudioPlayer component in any JavaScript project, follow these steps:

1. Install the package using npm.
2. Import the AudioPlayer component into your project.
3. Include the component in your HTML or JavaScript file.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Audio Player</title>
  <!-- common styles -->
  <link
    rel="stylesheet"
    href="style.css"
  />
  <!-- audio player styles -->
  <link
    rel="stylesheet"
    href="build/bundle.css"
  />
</head>
<body>
  <div id="audio-player"></div>
  <script type="module">
    import AudioPlayer from 'audio-player-package/build/bundle.js';

    const player = new AudioPlayer({
      target: document.getElementById('audio-player'),
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
      }
    });
  </script>
</body>
</html>
```

You can customize the player by passing props to the component. Refer to the documentation for available options.

This is a basic implementation. You can further customize the styles and functionality as needed.
