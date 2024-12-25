<script>
  export let onClick
  export let ariaLabel
  export let pathLeft
  export let pathRight = null
  export let className = ''
</script>

<button
  on:click={onClick}
  aria-label={ariaLabel}
  class={className}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
  >
    <path d={pathLeft}></path>
    {#if pathRight}
      <path d={pathRight}></path>
    {/if}
  </svg>
</button>
