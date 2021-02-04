<template>
  <button
    :disabled="disabled"
    class="button"
    @click="onClick()"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { Vue, Component, Emit, Prop } from 'vue-property-decorator';

@Component({})
export default class Button extends Vue {
  @Prop() private disabled!: boolean;

  @Emit('click')
  private onClick() {
    return;
  }
}
</script>

<style scoped lang="scss">
.button {
  font-weight: 400;
  font-size: 18px;
  background: rgb(132, 206, 235);
  color: #fff;
  border: none;
  border-radius: 3px;
  padding: 5px 20px;
  &:hover {
    opacity: 0.9;
    cursor: pointer;
  }
  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
}
</style>