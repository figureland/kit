<script lang="ts">
  import { wrap, state } from '@figureland/kit/state/svelte'
  import { decimal } from '@figureland/kit/math/decimal'
  const s = state(0.000001)
  const w = wrap(decimal(0.000001))
</script>

<h1>Welcome to SvelteKit {$w} {$s}</h1>
