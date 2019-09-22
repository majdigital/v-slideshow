<template>
  <div>
    <VSlideshow
      v-model="currentIndex"
      class="SimpleSlideshow"
      :slides="slides"
      @enter="enter"
      @leave="leave"
    >
      <template v-slot="{ slide }">
        <div class="Slide">
          <img class="Slide-image" :src="slide.image"/>
          <div class="Slide-content">
            <h4>{{ slide.title }}</h4>
            <p>{{ slide.description }}</p>
          </div>
        </div>
      </template>
      <template v-slot:nav="{ slides, previousIndex, currentIndex, goTo, prev, next }">
        <ul class="Nav">
          <li><button @click="prev">previous</button></li>
          <li v-for="(slide, index) in slides" :key="index" @click="goTo(index)">
            <button>{{ index }}</button>
          </li>
          <li><button @click="next">next</button></li>
        </ul>
      </template>
    </VSlideshow>

    <div>
      <p>Control the slideshow from the outside:</p>
      <p><input type="number" v-model.number="currentIndex" /></p>
      <p><button @click="currentIndex--">-</button><input type="range" min="0" :max="slides.length - 1" v-model.number="currentIndex" /><button @click="currentIndex++">+</button></p>
    </div>
  </div>
</template>

<script>
import anime from "animejs/lib/anime.es.js";

import VSlideshow from "../src/v-slideshow";

export default {
  components: { VSlideshow },

  data() {
    return {
      currentIndex: 0,
      slides: [
        {
          id: "slide-0",
          title: "Sunt rerum qui odit ratione ratione enim porro illum",
          description:
            "Porro laborum aut consequatur quia omnis praesentium ipsum mollitia. Itaque commodi animi sapiente aut aliquid officiis. Ut voluptate unde architecto eligendi perspiciatis modi aspernatur voluptates maiores. A illum officiis ipsam ipsa quaerat consequatur distinctio. Quod illum ullam et voluptas dolor fuga excepturi saepe autem.",
          image: "https://source.unsplash.com/collection/1368747/1600x1200?sig=0`"
        },
        {
          id: "slide-1",
          title: "Impedit non sapiente iure quisquam enim et ut unde",
          description:
            "Praesentium ullam ipsum nihil. Minima et est quo fugit rem cum culpa. Excepturi modi aspernatur ad quis eveniet enim nihil esse nobis.",
          image: "https://source.unsplash.com/collection/1368747/1600x1200?sig=1`"
        },
        {
          id: "slide-2",
          title: "Ea ipsa consectetur ut accusantium ipsam dolor qui",
          description:
            "Libero odio perferendis. Molestiae et ut nemo pariatur illo sunt. Ea officiis vel neque sunt at quia iste qui. Et est necessitatibus. Nesciunt laboriosam qui et sit incidunt.",
          image: "https://source.unsplash.com/collection/1368747/1600x1200?sig=2`"
        },
        {
          id: "slide-3",
          title: "Voluptates est odit doloremque",
          description:
            "Expedita ea necessitatibus ipsa ut beatae alias itaque. Ipsa vel provident reprehenderit doloribus repudiandae asperiores. Voluptates nesciunt dolore sed amet eligendi repellendus dolorem. Voluptatem voluptatibus dolor. Expedita et doloribus possimus voluptatem assumenda ullam molestiae. Velit dolores explicabo et.",
          image: "https://source.unsplash.com/collection/1368747/1600x1200?sig=3`"
        }
      ]
    };
  },

  methods: {
    async leave(data, done) {
      setTimeout(done, 300);
    },

    async enter(data, done) {
      const { el } = data;
      anime({
        targets: data.el,
        opacity: [0, 1],
        easing: "linear",
        duration: 300,
        complete: done
      });
    }
  }
};
</script>

<style scoped>
.v-slideshow >>> .v-slideshow-item-leave-active {
  z-index: -1;
}

.Slide {
  position: relative;
  display: flex;
}

.Slide-image {
  max-width: 100%;
}

.Slide-content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  color: #ffffff;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), transparent);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
    "Helvetica Neue", sans-serif;
}

.Slide-content h4 {
  margin-bottom: 0;
  font-weight: 500;
}

.Nav {
  display: flex;
  justify-content: center;
  padding-left: 0;
  list-style: none;
}

.Nav li {
  margin-right: 10px;
}
</style>