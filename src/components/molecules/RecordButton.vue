<template>
  <Button class="qa-record-button" pill :class="{ border }">
    <Icon :name="icon" class="qa-rb-icon" />
    <span class="qa-rb-text"><slot /></span>
  </Button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Icon from '@/components/content/Icon.vue';
import Button from '@/components/form/Button.vue';

export default defineComponent({
  name: 'RecordButton',
  components: { Icon, Button },
  props: {
    icon: {
      type: String,
      default: '',
    },
    border: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss">
.qa-record-button {
  --qa-record-button-color: var(--qa-color-red);
  --qa-record-button-bg-color: var(--qa-color-white);
  --qa-record-button-font-color: var(--qa-color-font-dark);
  background-color: var(--qa-record-button-bg-color);
  color: var(--qa-record-button-font-color);
  padding: 0.1em 0.2em 0.1em 0.1em;
  font-size: 28px;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  line-height: 1em;
  box-sizing: border-box;
  height: 40px;
  &.border {
    border: 2px solid var(--qa-record-button-color);
  }
  .qa-rb-icon {
    color: var(--qa-record-button-color);
  }
  .qa-rb-text {
    font-size: 0.8em;
  }
  &:hover {
    background-color: var(--qa-record-button-bg-color);
  }
}
</style>
