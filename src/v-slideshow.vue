<template>
  <div class="v-slideshow">
    <TransitionGroup
      class="v-slideshow__list"
      tag="ul"
      name="v-slideshow-item"
      :class="listClass"
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @enter-cancelled="enterCancelled"
      @before-leave="beforeLeave"
      @leave="leave"
      @after-leave="afterLeave"
      @leave-cancelled="leaveCancelled"
    >
      <li class="v-slideshow__item"
        v-for="(slide, index) in slides"
        :key="slide.id"
        :class="itemClass"
        v-show="index === currentIndex"
      >
        <slot
          :previous-index="previousIndex"
          :current-index="currentIndex"
          :total="total"
          :busy="busy"
          :slides="slides"
          :go-to="goTo"
          :prev="prev"
          :next="next"
          :slide="slide"
          :index="index"></slot>
      </li>
    </TransitionGroup>

    <slot
      name="nav"
      :previous-index="previousIndex"
      :current-index="currentIndex"
      :total="total"
      :busy="busy"
      :slides="slides"
      :go-to="goTo"
      :prev="prev"
      :next="next"></slot>
  </div>
</template>

<script>
export const getId = () => {};
export default {
  props: {
    value: { type: Number, default: 0 },
    slides: {
      type: Array,
      required: true,
      validator: value => {
        if (value.some(slide => typeof slide !== "object" || !slide.id)) return false;
        return true;
      }
    },
    loop: { type: Boolean, default: true },
    safe: { type: Boolean, default: true },
    listClass: { type: [String, Array, Object], default: null },
    itemClass: { type: [String, Array, Object], default: null }
  },

  data() {
    return {
      previousIndex: null,
      currentIndex: 0,
      enterActive: false,
      leaveActive: false
    };
  },

  computed: {
    total() {
      return this.slides.length;
    },

    busy() {
      return this.enterActive || this.leaveActive;
    }
  },

  watch: {
    value(value) {
      this.goTo(value);
    },

    enterActive(value) {
      if (!this.leaveActive) this.done();
    },

    leaveActive(value) {
      if (!this.enterActive) this.done();
    }
  },

  methods: {
    prev() {
      return this.goTo(this.currentIndex - 1);
    },

    next() {
      return this.goTo(this.currentIndex + 1);
    },

    goTo(index) {
      if ((this.safe && this.busy) || index === this.currentIndex) return;

      // Make the loop
      const nextIndex = index >= this.total ? 0 : index <= -1 ? this.total - 1 : index;
      if (nextIndex !== index && !this.loop) return;

      this.previousIndex = this.currentIndex;
      this.currentIndex = nextIndex;

      return new Promise(resolve => this.$once("done", () => resolve()));
    },

    beforeEnter(el) {
      this.enterActive = true;
      this.$emit("before-enter", { el, ...this.getData() });
    },

    enter(el, done) {
      this.$emit("enter", { el, ...this.getData() }, done);
    },

    async afterEnter(el) {
      await this.$nextTick();
      this.enterActive = false;
      this.$emit("after-enter", { el, ...this.getData() });
    },

    enterCancelled(el) {
      this.$emit("enter-cancelled", { el, ...this.getData() });
    },

    beforeLeave(el) {
      this.leaveActive = true;
      this.$emit("before-leave", { el, ...this.getData() });
    },

    leave(el, done) {
      this.$emit("leave", { el, ...this.getData() }, done);
    },

    async afterLeave(el) {
      await this.$nextTick();
      this.leaveActive = false;
      this.$emit("after-leave", { el, ...this.getData() });
    },

    leaveCancelled(el) {
      this.$emit("leave-cancelled", { el, ...this.getData() });
    },

    done() {
      this.$emit("done", this.getData());
      this.$emit("input", this.currentIndex);
    },

    getData() {
      return {
        previousIndex: this.previousIndex,
        currentIndex: this.currentIndex,
        slides: this.slides,
        total: this.total,
        busy: this.busy
      };
    }
  }
};
</script>

<style lang="postcss" scoped>
.v-slideshow__list {
  position: relative;
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 0;
  list-style: none;
}

.v-slideshow-item-leave-active {
  position: absolute;
  top: 0;
}
</style>
