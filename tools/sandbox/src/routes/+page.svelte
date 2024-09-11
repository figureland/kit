<script lang="ts">
  import { state } from '@figureland/kit/state/svelte'
  const s = state(0)
</script>

<h1>Welcome to SvelteKit {$s}</h1>
<button on:click={() => s.set((s) => s + 1)}>Inc</button>
<button on:click={() => s.set((s) => s - 1)}>Dec</button>
