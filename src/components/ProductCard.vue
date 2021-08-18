<template>
  <div class="product-card"
       :class="card.hover ? 'card-hover' : ''"
       @mouseenter="card.hover = true"
       @mouseleave="card.hover = false">
    <img :src="card.imgUrl" alt="Товар" height="200">
    <div class="product-description">
      <span class="product-title">{{ card.title }}</span>
      <div class="product-price" v-if="card.purchasingPrice">
        <span class="product-stock-price">{{ card.purchasingPrice }} ₽</span>
        <span class="product-full-price">{{ card.fullPrice }} ₽</span>
      </div>
      <div class="product-price" v-else>
        <span class="product-stock-price">{{ card.fullPrice }} ₽</span>
      </div>
      <span class="product-article">Артикул: {{ card.article }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductCard",
  data() {
    return {
      card: {},
      added: false,
      count: 1
    }
  },
  props: {
    cardProp: Object
  },
  created() {
    this.card = this.cardProp
    this.card.hover = false
  }
}
</script>

<style scoped>
div.product-card {
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: white;
  font-size: 16px;
  transition: box-shadow .3s;
  cursor: pointer;
}
div.product-card.card-hover {
  z-index: 20;
  box-shadow: 0 4px 48px rgba(0, 0, 0, 0.25);
}
div.product-card > img {
  padding: 20px;
  width: calc(100% - 40px);
}
div.product-description {
  position: relative;
  z-index: 20;
  padding: 20px;
  background-color: white;
  color: #41456c;
  font-weight: 700;
}
div.product-price {
  margin-top: 10px
}
span.product-full-price {
  text-decoration: line-through;
  color: #d3d4dc;
  margin-left: 20px;
}
span.product-article {
  color: #d3d4dc;
  font-size: .8rem;
}
div.product-cart {
  display: flex;
  justify-content: space-between;
  box-shadow: 0 4px 48px rgba(0, 0, 0, 0.25);
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 5;
  width: 100%;
  padding: 0 20px 20px 20px;
  background-color: #ffffff;
}
</style>