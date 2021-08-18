<template>
  <Grid :length="arData.length" :pageSize="pageSize" :pageProvider="gridLoader" class="grid">
    <template v-slot:probe>
      <div class="item">Probe</div>
    </template>

    <!-- When the item is not loaded, a placeholder is rendered -->
    <template v-slot:placeholder="{ index, style }">
      <div class="item" :style="style">Placeholder {{ index }}</div>
    </template>

    <!-- Render a loaded item -->
    <template v-slot:default="{ item, style, index }">
      <div class="item" :style="style">{{ item }} {{ index }}</div>
    </template>
  </Grid>
</template>

<script>
import Grid from 'vue-virtual-scroll-grid'
export default {
  name: "test",
  components: {Grid},
  data() {
    return {
      arData: []
    }
  },
  computed: {
    pageSize() {
      let num = this.arData.length
      let iter = num % 2 ? 3 : 4
      for (iter;iter < num;iter+=2) {
        if (num % iter === 0) break
      }
      console.log(iter, 'pageSize')
      return iter
    }
  },
  created() {
    for (let i = 0; i < 90;i++) {
      this.arData.push({id: i+1,name:`Item №${i+1}`})
    }
  },
  methods: {
    gridLoader(pageNumber, pageSize) {
      return new Promise(resolve => {
        console.log(pageNumber,pageSize)
        let start = pageNumber * pageSize
        let end = pageNumber * pageSize + pageSize
        resolve(this.arData.slice(start,end))

      })
    }
  }
}
</script>

<style scoped>
.grid {
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(3, 1fr);
}
.item {
  background-color: lightgray;
  padding: 100px 0;
  text-align: center;
}
</style>