<script>
  export let currentTime
  export let duration
  export let position
  export let showElapsedTime
  export let onInput
  export let onToggleTimeDisplay

  const formatTime = (seconds, isElapsedTime) => {
    if (isNaN(seconds)) return '0:00'

    const format = (time) => {
      const minutes = Math.floor(time / 60)
      const secs = Math.floor(time % 60)
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
    }

    if (isElapsedTime) {
      let elapsed = showElapsedTime ? duration - currentTime : duration
      if (elapsed < 0) elapsed = 0
      const time = format(elapsed)
      return showElapsedTime ? `-${time}` : time
    } else {
      return format(seconds)
    }
  }
</script>

<div class="progress-control">
  <div class="current-time">
    <span>{formatTime(currentTime, false)}</span>
  </div>
  <input
    type="range"
    min="0"
    max="1"
    step="0.01"
    bind:value={position}
    on:input={onInput}
  />
  <div class="duration-time">
    <span
      role="button"
      tabindex="0"
      on:click={onToggleTimeDisplay}
      on:keydown={(e) => e.key === 'Enter' && onToggleTimeDisplay()}
    >
      {formatTime(currentTime, true)}
    </span>
  </div>
</div>
