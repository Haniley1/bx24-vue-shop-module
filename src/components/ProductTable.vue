<template>
  <div class="products-table">
    <div class="table-header">
      <span v-if="tableData.length" class="table-title" v-html="tableType === 'product' ? 'Товары' : 'Услуги'"/>
      <span v-else class="table-title" v-html="tableType === 'product' ? 'Товары не выбраны' : 'Услуги не выбраны'"/>
    </div>
    <div class="table-body">
      <ProductItem
        v-for="item in tableData"
        :key="item.id"
        :product="item"
        :globalDiscount="globalDiscount"
        :comment="item.comment"
        :count="item.count"
        :discount="item.discount"
        @update:comment="item.comment = $event"
        @update:count="item.count = $event"
        @update:discount="item.discount = $event"
        @change="$emit('change', {changed: $event, product: item})"
        @delete="$emit('delete', item.id)"
      />
    </div>
    <div class="table-footer" v-if="tableData.length">
      <span>Итого: {{ tableSum.toLocaleString() }} ₽</span>
    </div>
  </div>
</template>
<script>
import ProductItem from "./ProductItem.vue"
export default {
    name: "ProductTable",
    components: {ProductItem},
    props: {
      data: {
        type: Array,
        required: true
      },
      tableType: String,
      globalDiscount: Number
    },
    computed: {
      tableData() {
        return this.data.filter(item => item.type === this.tableType)
      },
      tableSum() {
        return this.tableData.reduce((accum, item) => {
          const total = item.price * item.count
          return accum += item.discount ? total - (total / 100 * item.discount) : total
        }, 0)
      }
    },
};
</script>
<style scoped>
@media (max-width: 900px) {
  div.table-body {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
}
div.table-header {
  padding: 10px;
  text-align: center;
}
div.table-header > .table-title {
  font-size: 26px;
  font-weight: bold;
}
.products-container, .products-table, .services-table, .table-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
div.table-footer {
  padding: 10px;
  text-align: end;
  font-size: 22px;
  font-weight: bold;
  background: white;
}
</style>