<template>
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
</template>

<script>
import VSlideshow from "../src/v-slideshow";

export default {
  components: { VSlideshow },

  data() {
    return {
      slides: [
        { id: "slide-0", text: "Slide 0" },
        { id: "slide-1", text: "Slide 1" },
        { id: "slide-2", text: "Slide 2" },
        { id: "slide-3", text: "Slide 3" },
        { id: "slide-4", text: "Slide 4" },
        { id: "slide-5", text: "Slide 5" }
      ]
    };
  },

  methods: {
    leave(data, done) {
      done();
    },

    enter(data, done) {
      done();
    }
  }
};
</script>
