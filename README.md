# @uekichinos/counter

[![Socket Badge](https://badge.socket.dev/npm/package/@uekichinos/counter/0.1.0)](https://badge.socket.dev/npm/package/@uekichinos/counter/0.1.0)

Lightweight counter animation library that detects and animates all numbers within any string — including integers, decimals, and comma-formatted values.

```
"We have 1,500,344 customers"  →  counts up from 0 to 1,500,344
"34.67%"                        →  counts up from 0.00% to 34.67%
"RM55 billion"                  →  counts up from RM0 to RM55 billion
```

- **Zero dependencies** — plain DOM, no frameworks required
- **Any string format** — surrounding text is preserved, only numbers animate
- **Scroll-triggered or immediate** — via Intersection Observer
- **Accessibility-aware** — respects `prefers-reduced-motion`
- **Works everywhere** — ESM, CommonJS, or `<script>` tag

---

## Installation

```bash
npm install @uekichinos/counter
```

---

## Quick start

### Declarative (recommended)

Add `data-counter` to any element. Call `initCounters` once.

```html
<p data-counter>RM55 billion</p>
<p data-counter>34.67%</p>
<p data-counter>We have 1,500,344 customers</p>

<script type="module">
  import { initCounters } from '@uekichinos/counter'

  initCounters('[data-counter]')
  // scroll-triggered, animates once, 2s easeOut — all by default
</script>
```

### Programmatic

```js
import { animateCounter } from '@uekichinos/counter'

const el = document.querySelector('#revenue')
animateCounter(el, { duration: 3000, trigger: 'scroll' })
```

### Via `<script>` tag (no bundler)

```html
<script src="https://unpkg.com/@uekichinos/counter/dist/index.js"></script>
<script>
  Counter.initCounters('[data-counter]')
</script>
```

---

## API

### `initCounters(selector, options?)`

Finds all elements matching `selector` and animates them. Best for declarative HTML setups.

```js
initCounters('[data-counter]', {
  duration: 2000,
  trigger: 'scroll',
})
```

Per-element overrides are supported via data attributes:

```html
<p data-counter data-counter-duration="4000" data-counter-trigger="immediate" data-counter-repeat="true">
  99.99%
</p>
```

| Data attribute              | Overrides       |
|-----------------------------|-----------------|
| `data-counter-duration`     | `duration`      |
| `data-counter-trigger`      | `trigger`       |
| `data-counter-repeat`       | `repeat`        |

---

### `animateCounter(el, options?)`

Animates a single element.

```js
animateCounter(document.querySelector('#stat'), {
  duration: 2000,
  easing: 'easeOut',
  trigger: 'scroll',
  repeat: false,
  threshold: 0.2,
  startValue: 0,
  onComplete: () => console.log('done'),
})
```

---

## Options

| Option       | Type                                   | Default      | Description |
|--------------|----------------------------------------|--------------|-------------|
| `duration`   | `number`                               | `2000`       | Animation duration in milliseconds |
| `easing`     | `'linear' \| 'easeOut' \| 'easeInOut'` | `'easeOut'`  | Easing function |
| `trigger`    | `'scroll' \| 'immediate'`              | `'scroll'`   | When to start — on scroll into view, or right away |
| `repeat`     | `boolean`                              | `false`      | Re-animate each time the element re-enters the viewport |
| `threshold`  | `number`                               | `0.2`        | How much of the element must be visible to trigger (0–1) |
| `startValue` | `number`                               | `0`          | Value to count up from — useful for live dashboards updating incrementally |
| `onComplete` | `() => void`                           | —            | Called once when the animation finishes |

---

## Examples

### Multiple numbers in one string

All numbers in the string are detected and animate simultaneously.

```html
<p data-counter>
  From 12 offices across 48 countries, we serve 3,200,000 users daily.
</p>
```

### Animate from a previous value

```js
animateCounter(el, { startValue: 1200, duration: 1000 })
// counts from 1,200 → target
```

### Run something after the count finishes

```js
animateCounter(el, {
  onComplete: () => {
    document.querySelector('#badge').classList.add('visible')
  },
})
```

### Repeat on every scroll-in

```html
<p data-counter data-counter-repeat="true">99.99%</p>
```

### Immediate trigger (no scroll)

```html
<p data-counter data-counter-trigger="immediate">1,500,344</p>
```

---

## Accessibility

If the user has enabled **Reduce Motion** in their OS settings, all animations are skipped and the final value is displayed immediately. The `onComplete` callback still fires.

---

## Number formats supported

| Input string                         | Detected number |
|--------------------------------------|-----------------|
| `RM55 billion`                        | `55`            |
| `RM 55 million`                       | `55`            |
| `34.67%`                              | `34.67`         |
| `We have 1,500,344 customers`         | `1500344`       |
| `$1,234.56 total`                     | `1234.56`       |
| `From 12 offices across 48 countries` | `12`, `48`      |

Comma grouping and decimal places are preserved throughout the animation.

---

## License

MIT © [uekichinos](https://www.npmjs.com/~uekichinos)
