<template>
  <div class="action-links">
    <span
      v-for="(link, index) in links"
      :key="index"
      class="action-link"
      :class="{ active: link.active, highlight: link.highlight }"
      @click="$emit('click', link.action)"
    >
      {{ link.label }}
    </span>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ActionLinks',
  
  props: {
    links: {
      type: Array,
      required: true,
      validator: (links) => {
        return links.every(link => 
          typeof link === 'object' && 
          link.label && 
          typeof link.action === 'string'
        );
      }
    }
  },
  
  emits: ['click']
});
</script>

<style lang="scss" scoped>
.action-links {
  display: flex;
  gap: 24px;
  padding: 14px 16px;
  background: #FFFFFF;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.action-link {
  font-size: 15px;
  color: #000;
  cursor: pointer;
  
  &.active {
    font-weight: 500;
    border-bottom: 2px solid $primary;
    padding-bottom: 2px;
  }
  
  &.highlight {
    color: $primary;
  }
}
</style>




