[![CI](https://github.com/figureland/kit/actions/workflows/ci.yml/badge.svg)](https://github.com/figureland/kit/actions/workflows/ci.yml)
[![NPM](https://img.shields.io/npm/v/@figureland/kit?color=000000)](https://img.shields.io/npm/v/@figureland/kit?color=40bd5c)

**kit** is a collection of tools for creative programming. This project is very much a work in progress, but has been used in production applications.

### Tools

#### [math](./src/math/)

Tools for working with numbers, geometry, matrices and vertices.

#### [state](./src/state/)

Simple, powerful reactive programming primitives that are portable between frameworks.

#### [color](./src/color/)

Utilities for working with color, wrapping some functionality from [@texel/color](https://github.com/texel-org/color)

#### [infinity](./src/infinity/)

Minimal primitives for building infinity canvas and map-type interactions.

#### [tools](./src/tools/)

General purpose Typescript utilities, mainly used internally within this library.

#### [dom](./src/dom/)

A collection of useful tools for DOM-based interaction, like file handling, clipboard, pointer events.

## Notes

This codebase is available as [@figureland/kit](https://www.npmjs.com/package/@figureland/kit), distributed on the NPM and Github package registries. It will eventually be available on [JSR](https://jsr.io/) as well.

```bash
bun install @figureland/kit
```

This project follows the convention of [Deno](https://deno.com/), JSR, and others in that it doesn't use a build step. The library is distributed as the original Typescript source files, meaning you'll need to have a project that is already using TS.

## Development guide

### Setup

This codebase is based on [bun](https://bun.sh/). Bun is a amazing new Javascript runtime that, to some extent, replaces [node](https://nodejs.org/).

Consumers of this codebase don't need to have bun installed to use the library.

1. If you don't already have bun installed on your machine, follow these instructions need to [install](https://bun.sh/docs/installation) bun.

2. Following that you can install the codebase dependencies.
   ```
   bun install
   ```

### Test

```bash
bun test
```

## Thoughts on creative programming environments

We live in an amazing era of tools for the web. There are many incredible projects like [p5.js](https://p5js.org/), [Pts](https://ptsjs.org/) or [three.js](https://threejs.org/) that provide an amazing palette for creative coding. However, they all lean towards the rendering and graphical parts of projects. That makes a lot of sense, because they are often used for things like data visualisation, animations or prototyping.

It's easy to overlook that they are not just powerful tools but have also had a huge amount of thought and care put into their _learning experience_. The quality of their learning resources and the openness of their communities is why these projects continue to thrive today.

There's a bit of a gap that emerges when you want to make more complete applications, or do more sophisticated things with data. Modern Javascript development is well equipped with great standard libraries, like Deno's [std](https://jsr.io/@std), but there is still a question of environment. Where and how do I run this? Does it need a server? How do I go from prototype to product?

Normally, that's where tools like React and next.js come in. For creative and design processes, iteration is key, and often you want to be able to test and store lots of different options. React is a wonderful tool and has established a whole load of conventions, many good and some not so good. But it still imposes a 'React' way of thinking.

You could repurpose front-end web environments like [Storybook](https://storybook.js.org/) or [Histoire](https://histoire.dev/), but they are so focussed on isolated front-end components and design systems, which are all together a different stage of software production.

Alternative you could notebooks like [Jupyter](https://jupyter.org/) or Observable's [Framework](https://observablehq.com/framework/). Framework feels like the best starting point here, because it hints at a blend documentation, narrative and iteration as well as all the best features of the modern web ecosystem.
