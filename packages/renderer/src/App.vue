<template>
  <router-view />
</template>

<script lang="ts">
import {defineComponent} from 'vue';
export default defineComponent({
  name: 'App',
});
</script>

<style lang="scss">
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

.splitpanes--vertical>.splitpanes__splitter {
  min-width: 6px !important;
  @apply bg-gray-300;
  cursor: col-resize;
}
</style>
