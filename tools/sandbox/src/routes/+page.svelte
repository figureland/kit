<!-- <script lang="ts">
  import { wrap, state } from '@figureland/kit/state/svelte'
  import { factory } from '@figureland/kit/state'
  import Big, { type BigSource } from 'big.js'

  const s = state(0.000001)
  const decimal = factory((v: BigSource) => new Big(v), {
    set: (instance, v) => {
      instance.value = new Big(v)
    },
    get: (v) => v.toString()
  })

  const w = wrap(decimal(0.00001))
</script>

<h1>Welcome to SvelteKit {$w} {$s}</h1> -->

<h1>hello</h1>