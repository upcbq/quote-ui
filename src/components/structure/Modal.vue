<template>
  <div>
    <div
      class="qa-modal--bg cursor--pointer"
      @click.prevent="!data?.ignoreBgClick ? $emit('close', data?.id) : () => {}"
    ></div>
    <div class="qa-modal" :class="data?.containerClasses">
      <component
        v-if="data?.component"
        :is="data?.component"
        v-bind="data?.componentAttr"
        v-on="data?.componentListeners || {}"
        :class="data?.componentClasses"
        @close="$emit('close', data?.id)"
      />
      <div v-else class="qa-modal--default">
        <h3 v-if="data?.title" class="qa-modal--title">{{ data?.title }}</h3>
        <p v-if="data?.body" class="qa-modal--body">{{ data?.body }}</p>
        <div class="qa-modal--button-container">
          <Button
            class="qa-modal--button"
            v-if="data?.mainButton"
            @click.prevent="primary"
          >
            {{ data?.mainButton }}
          </Button>
          <Button
            class="qa-modal--button"
            v-if="data?.secondaryButton"
            @click.prevent="secondary"
            light
          >
            {{ data?.secondaryButton }}
          </Button>
        </div>
      </div>

      <button
        class="qa-close-button clear-btn cursor--pointer"
        v-if="data?.closeButton"
        @click.prevent="$emit('close', data?.id)"
      >
        <Icon name="close" />
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { ModalConfig } from '@/store/modules/ui/ui.interfaces';
import { defineComponent, PropType } from 'vue';
import Button from '@/components/form/Button.vue';
import Icon from '@/components/content/Icon.vue';

export default defineComponent({
  name: 'QaModal',
  components: { Button, Icon },
  props: {
    data: {
      type: Object as PropType<ModalConfig>,
      default: Object,
    },
  },
  setup(props, ctx) {
    function primary() {
      ctx.emit('close', props.data?.id);
      ctx.emit('primary');
    }
    function secondary() {
      ctx.emit('close', props.data?.id);
      ctx.emit('secondary');
    }

    return {
      primary,
      secondary,
    };
  },
});
</script>

<style lang="scss">
.qa-modal--bg {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  background-color: var(--qa-color-black);
  opacity: 0.2;
  pointer-events: all;
}
.qa-modal {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--qa-color-white);
  pointer-events: all;

  .qa-modal--default {
    padding: 30px 10px 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    max-width: 480px;
    max-height: 90vh;
  }

  .qa-modal--title {
    margin-top: -10px;
    font-size: 24px;
  }

  .qa-modal--body {
    font-size: 18px;
    overflow-y: auto;
  }

  .qa-modal--button-container {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    gap: 5px;
  }

  @include media-smaller(xs) {
    .qa-modal--default {
      min-width: 90vw;
    }
  }
}
</style>
