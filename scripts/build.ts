import dts from 'bun-plugin-dts'

await Bun.build({
  outdir: './dist',
  entrypoints: [
    './src/index.ts',
    // './src/math/index.ts',
    // './src/math/constants.ts',
    // './src/math/number.ts',
    // './src/math/vector2.ts',
    // './src/math/matrix2D.ts',
    // './src/math/box.ts',
    // './src/math/size.ts',
    // './src/math/style.ts',
    // './src/math/random.ts',
    // './src/math/easing.ts',

    // // state
    // './src/state/index.ts',
    // './src/state/svelte.ts',
    // './src/state/react.ts',
    // './src/state/vue.ts',
    // './src/state/typed-local-storage.ts',
    // './src/state/animated.ts',

    // type
    // './src/type/index.ts',
    './src/type/device.ts',
    './src/type/map.ts',
    './src/type/merge.ts',
    './src/type/object.ts',
    './src/type/async.ts',
    './src/type/time.ts',
    './src/type/equals.ts',
    './src/type/clone.ts',

    // dom
    // './src/dom/index.ts',
    './src/dom/device.ts',
    './src/dom/clipboard.ts',
    './src/dom/filedrop.ts',
    './src/dom/fullscreen.ts',
    './src/dom/keycommands.ts',
    './src/dom/pointer.ts',
    './src/dom/screen.ts',
    './src/dom/sfx.ts',
    './src/dom/events.ts',
    './src/dom/blob.ts',
    './src/dom/preferences.ts',
    './src/dom/timer.ts'
  ],
  // splitting: true,
  plugins: [dts()],
  external: ['svelte', 'react', 'vue']
})
