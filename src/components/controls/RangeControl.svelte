<script>
  export let value
  export let onInput
  export let onChange
</script>

<input
  type="range"
  min="0"
  max="1"
  step="0.01"
  {value}
  on:input={onInput}
  on:change={onChange}
/>
