(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.VSlideshow = {}));
}(this, function (exports) { 'use strict';

  var script = {
      props: {
          value: {
              type: Number,
              default: 0
          },
          slides: {
              type: Array,
              required: true,
              validator: function (value) {
                  if (value.some(function (slide) { return typeof slide !== "object" || !slide.id; })) 
                      { return false; }
                  return true;
              }
          },
          loop: {
              type: Boolean,
              default: true
          },
          safe: {
              type: Boolean,
              default: true
          },
          listClass: {
              type: [String,Array,Object],
              default: null
          },
          itemClass: {
              type: [String,Array,Object],
              default: null
          }
      },
      data: function data() {
          return {
              previousIndex: null,
              currentIndex: 0,
              enterActive: false,
              leaveActive: false
          };
      },
      computed: {
          total: function total() {
              return this.slides.length;
          },
          busy: function busy() {
              return this.enterActive || this.leaveActive;
          }
      },
      watch: {
          value: function value(value$1) {
              this.goTo(value$1);
          },
          enterActive: function enterActive(value) {
              if (!this.leaveActive) 
                  { this.done(); }
          },
          leaveActive: function leaveActive(value) {
              if (!this.enterActive) 
                  { this.done(); }
          }
      },
      methods: {
          prev: function prev() {
              return this.goTo(this.currentIndex - 1);
          },
          next: function next() {
              return this.goTo(this.currentIndex + 1);
          },
          goTo: function goTo(index) {
              var this$1 = this;

              if (this.safe && this.busy || index === this.currentIndex) 
                  { return; }
              var nextIndex = index >= this.total ? 0 : index <= -1 ? this.total - 1 : index;
              if (nextIndex !== index && !this.loop) 
                  { return; }
              this.previousIndex = this.currentIndex;
              this.currentIndex = nextIndex;
              return new Promise(function (resolve) { return this$1.$once("done", function () { return resolve(); }); });
          },
          beforeEnter: function beforeEnter(el) {
              this.enterActive = true;
              this.$emit("before-enter", Object.assign({}, {el: el},
                  this.getData()));
          },
          enter: function enter(el, done) {
              this.$emit("enter", Object.assign({}, {el: el},
                  this.getData()), done);
          },
          afterEnter: function afterEnter(el) {
              return (function ($return, $error) {
                  return this.$nextTick().then((function ($await_1) {
                      this.enterActive = false;
                      this.$emit("after-enter", Object.assign({}, {el: el},
                          this.getData()));
                      return $return();
                  }).$asyncbind(this, $error), $error);
              }).$asyncbind(this, true);
          },
          enterCancelled: function enterCancelled(el) {
              this.$emit("enter-cancelled", Object.assign({}, {el: el},
                  this.getData()));
          },
          beforeLeave: function beforeLeave(el) {
              this.leaveActive = true;
              this.$emit("before-leave", Object.assign({}, {el: el},
                  this.getData()));
          },
          leave: function leave(el, done) {
              this.$emit("leave", Object.assign({}, {el: el},
                  this.getData()), done);
          },
          afterLeave: function afterLeave(el) {
              return (function ($return, $error) {
                  return this.$nextTick().then((function ($await_2) {
                      this.leaveActive = false;
                      this.$emit("after-leave", Object.assign({}, {el: el},
                          this.getData()));
                      return $return();
                  }).$asyncbind(this, $error), $error);
              }).$asyncbind(this, true);
          },
          leaveCancelled: function leaveCancelled(el) {
              this.$emit("leave-cancelled", Object.assign({}, {el: el},
                  this.getData()));
          },
          done: function done() {
              this.$emit("done", this.getData());
              this.$emit("input", this.currentIndex);
          },
          getData: function getData() {
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

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      var options = typeof script === 'function' ? script.options : script;
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      if (scopeId) {
          options._scopeId = scopeId;
      }
      var hook;
      if (moduleIdentifier) {
          hook = function hook(context) {
              context = context || this.$vnode && this.$vnode.ssrContext || this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext;
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          options._ssrRegister = hook;
      } else if (style) {
          hook = shadowMode ? function () {
              style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
          } : function (context) {
              style.call(this, createInjector(context));
          };
      }
      if (hook) {
          if (options.functional) {
              var originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          } else {
              var existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  var normalizeComponent_1 = normalizeComponent;

  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
      return function (id, style) {
          return addStyle(id, style);
      };
  }

  var HEAD;
  var styles = {};
  function addStyle(id, css) {
      var group = isOldIE ? css.media || 'default' : id;
      var style = styles[group] || (styles[group] = {
          ids: new Set(),
          styles: []
      });
      if (!style.ids.has(id)) {
          style.ids.add(id);
          var code = css.source;
          if (css.map) {
              code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
              code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
          }
          if (!style.element) {
              style.element = document.createElement('style');
              style.element.type = 'text/css';
              if (css.media) 
                  { style.element.setAttribute('media', css.media); }
              if (HEAD === undefined) {
                  HEAD = document.head || document.getElementsByTagName('head')[0];
              }
              HEAD.appendChild(style.element);
          }
          if ('styleSheet' in style.element) {
              style.styles.push(code);
              style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
          } else {
              var index = style.ids.size - 1;
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) 
                  { style.element.removeChild(nodes[index]); }
              if (nodes.length) 
                  { style.element.insertBefore(textNode, nodes[index]); }
               else 
                  { style.element.appendChild(textNode); }
          }
      }
  }

  var browser = createInjector;

  var __vue_script__ = script;
  var __vue_render__ = function () {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", {
          staticClass: "v-slideshow"
      }, [_c("TransitionGroup", {
          staticClass: "v-slideshow__list",
          class: _vm.listClass,
          attrs: {
              tag: "ul",
              name: "v-slideshow-item"
          },
          on: {
              "before-enter": _vm.beforeEnter,
              enter: _vm.enter,
              "after-enter": _vm.afterEnter,
              "enter-cancelled": _vm.enterCancelled,
              "before-leave": _vm.beforeLeave,
              leave: _vm.leave,
              "after-leave": _vm.afterLeave,
              "leave-cancelled": _vm.leaveCancelled
          }
      }, _vm._l(_vm.slides, function (slide, index) {
          return _c("li", {
              directives: [{
                  name: "show",
                  rawName: "v-show",
                  value: index === _vm.currentIndex,
                  expression: "index === currentIndex"
              }],
              key: slide.id,
              staticClass: "v-slideshow__item",
              class: _vm.itemClass
          }, [_vm._t("default", null, {
              previousIndex: _vm.previousIndex,
              currentIndex: _vm.currentIndex,
              total: _vm.total,
              busy: _vm.busy,
              slides: _vm.slides,
              goTo: _vm.goTo,
              prev: _vm.prev,
              next: _vm.next,
              slide: slide,
              index: index
          })], 2);
      }), 0),_vm._v(" "),_vm._t("nav", null, {
          previousIndex: _vm.previousIndex,
          currentIndex: _vm.currentIndex,
          total: _vm.total,
          busy: _vm.busy,
          slides: _vm.slides,
          goTo: _vm.goTo,
          prev: _vm.prev,
          next: _vm.next
      })], 2);
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;
  var __vue_inject_styles__ = function (inject) {
      if (!inject) 
          { return; }
      inject("data-v-62d87631_0", {
          source: "\n.v-slideshow__list[data-v-62d87631] {\n  position: relative;\n  margin-top: 0;\n  margin-bottom: 0;\n  padding-left: 0;\n  list-style: none;\n}\n.v-slideshow-item-leave-active[data-v-62d87631] {\n  position: absolute;\n  top: 0;\n}\n",
          map: {
              "version": 3,
              "sources": ["/Users/maj/Sites/v-slideshow/src/v-slideshow.vue"],
              "names": [],
              "mappings": ";AAoLA;EACA,kBAAA;EACA,aAAA;EACA,gBAAA;EACA,eAAA;EACA,gBAAA;AACA;AAEA;EACA,kBAAA;EACA,MAAA;AACA",
              "file": "v-slideshow.vue",
              "sourcesContent": ["<template>\n  <div class=\"v-slideshow\">\n    <TransitionGroup\n      class=\"v-slideshow__list\"\n      tag=\"ul\"\n      name=\"v-slideshow-item\"\n      :class=\"listClass\"\n      @before-enter=\"beforeEnter\"\n      @enter=\"enter\"\n      @after-enter=\"afterEnter\"\n      @enter-cancelled=\"enterCancelled\"\n      @before-leave=\"beforeLeave\"\n      @leave=\"leave\"\n      @after-leave=\"afterLeave\"\n      @leave-cancelled=\"leaveCancelled\"\n    >\n      <li class=\"v-slideshow__item\"\n        v-for=\"(slide, index) in slides\"\n        :key=\"slide.id\"\n        :class=\"itemClass\"\n        v-show=\"index === currentIndex\"\n      >\n        <slot\n          :previous-index=\"previousIndex\"\n          :current-index=\"currentIndex\"\n          :total=\"total\"\n          :busy=\"busy\"\n          :slides=\"slides\"\n          :go-to=\"goTo\"\n          :prev=\"prev\"\n          :next=\"next\"\n          :slide=\"slide\"\n          :index=\"index\"></slot>\n      </li>\n    </TransitionGroup>\n\n    <slot\n      name=\"nav\"\n      :previous-index=\"previousIndex\"\n      :current-index=\"currentIndex\"\n      :total=\"total\"\n      :busy=\"busy\"\n      :slides=\"slides\"\n      :go-to=\"goTo\"\n      :prev=\"prev\"\n      :next=\"next\"></slot>\n  </div>\n</template>\n\n<script>\nexport const getId = () => {};\nexport default {\n  props: {\n    value: { type: Number, default: 0 },\n    slides: {\n      type: Array,\n      required: true,\n      validator: value => {\n        if (value.some(slide => typeof slide !== \"object\" || !slide.id)) return false;\n        return true;\n      }\n    },\n    loop: { type: Boolean, default: true },\n    safe: { type: Boolean, default: true },\n    listClass: { type: [String, Array, Object], default: null },\n    itemClass: { type: [String, Array, Object], default: null }\n  },\n\n  data() {\n    return {\n      previousIndex: null,\n      currentIndex: 0,\n      enterActive: false,\n      leaveActive: false\n    };\n  },\n\n  computed: {\n    total() {\n      return this.slides.length;\n    },\n\n    busy() {\n      return this.enterActive || this.leaveActive;\n    }\n  },\n\n  watch: {\n    value(value) {\n      this.goTo(value);\n    },\n\n    enterActive(value) {\n      if (!this.leaveActive) this.done();\n    },\n\n    leaveActive(value) {\n      if (!this.enterActive) this.done();\n    }\n  },\n\n  methods: {\n    prev() {\n      return this.goTo(this.currentIndex - 1);\n    },\n\n    next() {\n      return this.goTo(this.currentIndex + 1);\n    },\n\n    goTo(index) {\n      if ((this.safe && this.busy) || index === this.currentIndex) return;\n\n      // Make the loop\n      const nextIndex = index >= this.total ? 0 : index <= -1 ? this.total - 1 : index;\n      if (nextIndex !== index && !this.loop) return;\n\n      this.previousIndex = this.currentIndex;\n      this.currentIndex = nextIndex;\n\n      return new Promise(resolve => this.$once(\"done\", () => resolve()));\n    },\n\n    beforeEnter(el) {\n      this.enterActive = true;\n      this.$emit(\"before-enter\", { el, ...this.getData() });\n    },\n\n    enter(el, done) {\n      this.$emit(\"enter\", { el, ...this.getData() }, done);\n    },\n\n    async afterEnter(el) {\n      await this.$nextTick();\n      this.enterActive = false;\n      this.$emit(\"after-enter\", { el, ...this.getData() });\n    },\n\n    enterCancelled(el) {\n      this.$emit(\"enter-cancelled\", { el, ...this.getData() });\n    },\n\n    beforeLeave(el) {\n      this.leaveActive = true;\n      this.$emit(\"before-leave\", { el, ...this.getData() });\n    },\n\n    leave(el, done) {\n      this.$emit(\"leave\", { el, ...this.getData() }, done);\n    },\n\n    async afterLeave(el) {\n      await this.$nextTick();\n      this.leaveActive = false;\n      this.$emit(\"after-leave\", { el, ...this.getData() });\n    },\n\n    leaveCancelled(el) {\n      this.$emit(\"leave-cancelled\", { el, ...this.getData() });\n    },\n\n    done() {\n      this.$emit(\"done\", this.getData());\n      this.$emit(\"input\", this.currentIndex);\n    },\n\n    getData() {\n      return {\n        previousIndex: this.previousIndex,\n        currentIndex: this.currentIndex,\n        slides: this.slides,\n        total: this.total,\n        busy: this.busy\n      };\n    }\n  }\n};\n</script>\n\n<style lang=\"postcss\" scoped>\n.v-slideshow__list {\n  position: relative;\n  margin-top: 0;\n  margin-bottom: 0;\n  padding-left: 0;\n  list-style: none;\n}\n\n.v-slideshow-item-leave-active {\n  position: absolute;\n  top: 0;\n}\n</style>\n"]
          },
          media: undefined
      });
  };
  var __vue_scope_id__ = "data-v-62d87631";
  var __vue_module_identifier__ = undefined;
  var __vue_is_functional_template__ = false;
  var VSlideshow = normalizeComponent_1({
      render: __vue_render__,
      staticRenderFns: __vue_staticRenderFns__
  }, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, browser, undefined);

  function install(Vue) {
      if (install.installed) 
          { return; }
      install.installed = true;
      Vue.component('VSlideshow', VSlideshow);
  }

  var plugin = {
      install: install
  };
  var GlobalVue = null;
  if (typeof window !== 'undefined') {
      GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
      GlobalVue = global.Vue;
  }
  if (GlobalVue) {
      GlobalVue.use(plugin);
  }

  exports.default = VSlideshow;
  exports.install = install;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
