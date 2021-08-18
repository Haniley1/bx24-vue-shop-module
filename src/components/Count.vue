<template>
  <div class="count" :class="{disabled}">
    <button :disabled="disabled" class="count-btn btn-decrease" @click="decrease">-</button>
    <input :disabled="disabled" ref="counter" class="count-text" :value="modelValue" @change="inlineChange">
    <button :disabled="disabled" class="count-btn btn-increase" @click="increase">+</button>
  </div>
</template>

<script>
export default {
  name: "Count",
  props: {
    modelValue: Number,
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      value: null
    }
  },
  created() {
    this.value = this.modelValue
  },
  methods: {
    inlineChange(e) {
      this.$emit('update:modelValue', parseInt(e.target.value) || '')
      this.$emit('change', {oldValue: this.value, newValue: parseInt(e.target.value)});
      this.value = parseInt(e.target.value)
    },
    increase() {
      if (this.modelValue >= this.min && this.modelValue <= this.max)
        this.$emit('update:modelValue', this.modelValue + 1)
      this.$nextTick()
      this.$emit('change', {oldValue: this.value, newValue: this.modelValue + 1});
      this.$emit('increase');
      this.value = this.modelValue + 1
    },
    decrease() {
      if (this.modelValue >= this.min && this.modelValue <= this.max)
        this.$emit('update:modelValue', this.modelValue - 1)
      this.$nextTick()
      this.$emit('change', {oldValue: this.value, newValue: this.modelValue - 1});
      this.$emit('decrease');
      this.value = this.modelValue - 1
    }
  }
}
</script>

<style scoped>
div.count {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 90px;
  height: 40px;
  border: 1px solid #C4C6DA;
}
div.count.disabled {
  opacity: .6;
  cursor: not-allowed;
}
button.count-btn {
  cursor: pointer;
  border: none;
  font-size: 24px;
  line-height: 16px;
  background-color: transparent;
  color: #6A6E97;
}
input.count-text {
  width: 20px;
  border: none;
  text-align: center;
  font-size: 15px;
  line-height: 18px;
  background-color: transparent;
  border-bottom: 1px solid transparent;
  color: #41456C;
  transition: all linear 100ms;
}
input.count-text:focus {
  outline: none;
  border-bottom: 1px solid #6A6E97;
}
</style>