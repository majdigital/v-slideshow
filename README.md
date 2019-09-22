# VSlideshow

VSlideshow is a customizable carousel. Focus on the transitions and the layout, VSlideshow will take care of the rest
Under the hood, VSlideshow uses the built-in component `<TransitionGroup>` from Vue.js.

[Download and import](#download-and-import) | [Getting started](#getting-started) | [Examples](#examples)

## Download and import

```sh
npm i v-slideshow
```

Globally:

```js
import Vue from 'vue';
import VSlideshow from 'v-slideshow';

Vue.use('VSlideshow', VSlideshow);
```

In component:

```js
import VSlideshow from 'v-slideshow';

export default {
  components: { VSlideshow },
};
```

Via script:

```html
<script src="https://unpkg.com/v-slideshow"></script>
```

## Getting started

<details>
  <summary>Basic usage:</summary>

```html
<div>
  <VSlideshow :slides="slides" @enter="enter" @leave="leave">
    <!-- Content inside a slide -->
    <template v-slot="{ slide }">
      <div>{{ slide.text }}</div>
    </template>

    <!-- Nav for the slideshow -->
    <template v-slot:nav="{ prev, next }">
      <button @click="prev">previous</button>
      <button @click="next">next</button>
    </template>
  </VSlideshow>
</div>

<script>
  import VSlideshow from '../src/v-slideshow';

  export default {
    components: { VSlideshow },

    data() {
      return {
        slides: [
          { id: 'slide-0', text: 'Slide 0' },
          { id: 'slide-1', text: 'Slide 1' },
          { id: 'slide-2', text: 'Slide 2' },
          { id: 'slide-3', text: 'Slide 3' },
          { id: 'slide-4', text: 'Slide 4' },
          { id: 'slide-5', text: 'Slide 5' },
        ],
      };
    },

    methods: {
      leave(data, done) {
        done();
      },

      enter(data, done) {
        done();
      },
    },
  };
</script>
```

</details>

## API

### Props

| Property  | Description                                                                    | Type                  | Default    |
| --------- | ------------------------------------------------------------------------------ | --------------------- | ---------- |
| value     | The index of the current slide                                                 | Number                | `0`        |
| slides    | An array of slides                                                             | Array                 | `required` |
| loop      | Make a loop whenever the slideshow reaches the end                             | Boolean               | `true`     |
| safe      | Prevents the slideshow to change the slide while there is a transition running | Boolean               | `true`     |
| listClass | Class list applied on the list of the slides                                   | String, Array, Object | `null`     |
| itemClass | Class list applied on each slide                                               | String, Array, Object | `null`     |

> ⚠️ The prop `slides` must by an array of objects.
> Each slide must contain a unique ID because of `TransitionGroup`. [nanoid](https://github.com/ai/nanoid) is a good option if you need to generate an ID.

### Events

| Event           | Description                                                          | Parameters                                                |
| --------------- | -------------------------------------------------------------------- | --------------------------------------------------------- |
| before-enter    | Before slide enter                                                   | [data](#composition-of-data): Object                      |
| enter           | On slide enter, make sure to call `done` when the transition is done | [data](#composition-of-data): Object <br/> done: Function |
| after-enter     | After slide enter                                                    | [data](#composition-of-data): Object                      |
| enter-cancelled | On cancellation of slide enter                                       | [data](#composition-of-data): Object                      |
| before-leave    | Before slide leave                                                   | [data](#composition-of-data): Object                      |
| leave           | On slide leave, make sure to call `done` when the transition is done | [data](#composition-of-data): Object <br/> done: Function |
| after-leave     | After slide leave                                                    | [data](#composition-of-data): Object                      |
| leave-cancelled | On cancellation of slide leave                                       | [data](#composition-of-data): Object                      |
| done            | When enter and leave transitions are done                            | [data](#composition-of-data): Object                      |
| input           | When the current slide index changes                                 | value: Number                                             |

#### Composition of `data`

| Property      | Description                                    | Type        |
| ------------- | ---------------------------------------------- | ----------- |
| el            | DOM element (not present for @done and @input) | DOM Element |
| previousIndex | The index of the previous slide                | Number      |
| currentIndex  | The index of the current slide                 | Number      |
| slides        | The props `slides`                             | Array       |
| total         | The number of slides                           | Number      |
| busy          | Whether a transition is running                | Boolean     |

### Scoped slots

#### Default

The content for each slide.

##### slot props

| Property      | Description                            | Type     |
| ------------- | -------------------------------------- | -------- |
| previousIndex | The index of the previous slide        | Number   |
| currentIndex  | The index of the current slide         | Number   |
| total         | The index of the previous slide        | Number   |
| busy          | The index of the previous slide        | Number   |
| slides        | The slides                             | Array    |
| goTo          | The method to go to a specific slide   | Function |
| prev          | The method to go to the previous slide | Function |
| next          | The method to go to the next slide     | Function |
| slide         | The slide                              | Object   |
| index         | The index of the slide                 | Number   |

#### Nav

The content for the nav.

##### slot props

Same as default slot except that there is no `slide` or `index`.

### Methods

If you save a reference of VSlideshow (`<VSlideshow ref="mySlideshow">`), you will have access to some methods:

- prev
- next
- goTo (arguments: index {number})

They all returns a promise resolved when the transition is done.

## Examples

You can see some examples in the folder examples.

```sh
npm run serve
```
