<template>
  <Button class="qa-icon-button">
    <Icon :name="icon" class="qa-ib-icon" />
  </Button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Icon from '@/components/content/Icon.vue';
import Button from '@/components/form/Button.vue';

export default defineComponent({
  name: 'IconButton',
  components: { Icon, Button },
  props: {
    icon: {
      type: String,
      default: '',
    },
  },
});
</script>

<style lang="scss">
.qa-icon-button {
  font-size: 28px;
  padding: 0;
  background-color: transparent;

  .qa-ib-icon {
    color: var(--qa-color-font-dark);
    &:hover {
      color: var(--qa-color-black);
    }
  }
  &:hover {
    background-color: transparent;
  }
}
</style>
