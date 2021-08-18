<template>
  <div class="product-item">
    <img class="product-img" :src="product.img" />
    <div class="product-info">
      <span class="product-name" v-html="product.title" />
      <label class="comment-label">Комментарий к товару:</label>
      <textarea v-model="commentData" class="comment" @change.stop="commentChange" />
    </div>
    <div class="prices-wrap count">
      <span class="price-title">Кол-во:</span>
      <Count v-model="countData" :disabled="product.isCar" @change="countChange" />
    </div>
    <div class="prices-wrap">
      <span class="price-title">Скидка:</span>
      <Count v-model="discountData" :disabled="!product.isSale" @change="discountChange" />
    </div>
    <div class="prices-wrap price">
      <span class="price-title">Цена:</span>
      <span
        class="prices product-price"
        v-html="product.price.toLocaleString() + ' ₽'"
      />
    </div>
    <div class="prices-wrap">
      <span class="price-title">Итого:</span>
      <span
        class="prices product-sum"
        v-html="product.total.toLocaleString() + ' ₽'"
      />
    </div>
    <i class="close-icon el-icon-close" :class="{disabled: product.isCar}" @click="confirmDelete" />
  </div>
</template>
<script>
import Count from "../components/Count.vue";
export default {
  name: "ProductItem",
  components: { Count },
  emits: ['update:comment', 'update:count', 'update:discount'],
  props: {
    product: Object,
    globalDiscount: Number,
    comment: String,
    count: Number,
    discount: Number
  },
  computed: {
    commentData: {
      get() { return this.comment },
      set(val) { this.$emit('update:comment', val) }
    },
    countData: {
      get() { return this.count },
      set(val) { this.$emit('update:count', val) }
    },
    discountData: {
      get() { return this.discount },
      set(val) { this.$emit('update:discount', val) }
    }
  },
  methods: {
    discountChange(e) {
      const [, newVal] = Object.values(e)
      this.emitChanges({count: this.count, comment: this.comment, discount: newVal})
    },
    countChange(e) {
      const [, newVal] = Object.values(e)
      this.emitChanges({count: newVal, comment: this.comment, discount: this.discount})
    },
    commentChange() {
      this.emitChanges({count: this.count, comment: this.comment, discount: this.discount})
    },
    confirmDelete() {
      if (!this.product.isCar) {
        if (confirm("Вы уверены, что хотите удалить данную позицию?"))
          this.$emit("delete");
      }
    },
    emitChanges(params) {
      this.$emit('change', params)
    }
  },
};
</script>
<style scoped>
@media (max-width: 900px) {
  div.product-item {
    position: relative;
    display: flex;
    flex-flow: row wrap;
    padding: 10px;
    gap: 10px;
    transition: all 150ms ease;
  }
  div.prices-wrap {
    flex-direction: row;
  }
  div.prices-wrap.count,
  div.prices-wrap.price {
    margin-right: auto;
  }

  div.product-item > * {
    cursor: default;
  }
  div.product-item:hover {
    box-shadow: 0 3px 15px gray;
  }
  textarea.comment {
    width: 100%;
  }
  i.close-icon {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  i.close-icon.disabled {
    opacity: .5;
    cursor: not-allowed;
  }
}

.product-item {
  display: grid;
  grid-template-columns: 17% 25% 90px 13% 12% 12% 24px;
  column-gap: 10px;
  justify-items: center;
  align-items: center;
  background-color: white;
}
.prices-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}
div.product-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.product-img {
  width: 100%;
}
span.product-name {
  font-size: 18px;
  line-height: 1.75rem;
  font-weight: 600;
}
span.prices {
  font-size: 16px;
  font-weight: bold;
}
input.discount-input {
  width: 60px;
  height: 40px;
  padding: 5px;
  border: 1px solid #c4c6da;
}
i.close-icon {
  cursor: pointer;
  padding: 3px;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  background-color: darkred;
  transition: all 200ms ease;
}
i.close-icon:hover {
  background-color: rgb(179, 10, 10);
}

.comment {
  font-family: "Open Sans", sans-serif;
  outline: none;
  height: 80px;
  width: 80%;
  padding: 5px;
  border: 1px solid #41456c;
  border-radius: 3px;
  color: #41456c;
  text-indent: 5px;
  letter-spacing: 1px;
  resize: none;
  transition: all 160ms linear;
}
textarea.comment:hover,
textarea.comment:focus {
  border: 1px solid #db620b;
}
</style>