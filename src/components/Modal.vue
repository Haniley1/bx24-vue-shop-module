<template>
  <div class="fixed-overlay">
    <div class="window">
      <span class="close-window" @click="$emit('close')">&times;</span>
      <div class="window-body">
        <el-row :gutter="10">
          <el-col :span="14">
            <el-carousel :interval="5000" trigger="click" arrow="always" height="350px">
              <el-carousel-item v-for="item in 4" :key="item">
                <img class="carousel-img" :src="info.imgUrl" :alt="`img${item}`">
              </el-carousel-item>
            </el-carousel>
          </el-col>
          <el-col :span="10">
            <div class="product-article">Артикул: {{ info.article }}</div>
            <div class="product-name">{{ info.title }}</div>
            <div class="product-price">{{ info.fullPrice }} ₽</div>
            <div class="cart-actions" v-if="!info.isAuto">
              <count v-model="count"/>
              <button class="card-btn" :class="{added}" v-text="added ? 'Добавлено' : 'Добавить в корзину'"
                      @click="addProduct"/>
            </div>
            <template v-if="!info.isAuto">
              <label class="comment-label">Комментарий к товару:</label>
              <textarea v-model="comment" class="comment-modal"/>
            </template>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import Count from "./Count";

export default {
  name: "Modal",
  components: {Count},
  props: {
    info: Object
  },
  data() {
    return {
      count: 1,
      comment: '',
      added: false
    }
  },
  created() {
    this.comment = this.info.comment;
    console.log(this.info, 'INFO')
  },
  methods: {
    addProduct() {
      if (this.added === true) return
      this.added = true
      this.$emit('buy', {id: this.info.id, count: this.count, comment: this.comment})
      this.count = 1
      setTimeout(function () {
        this.added = false
      }.bind(this), 4000)
    }
  }
}
</script>

<style scoped>
div.fixed-overlay {
  z-index: 998;
  position: fixed;
  overflow: auto;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

div.window {
  position: absolute;
  z-index: 999;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: auto;
  background-color: white;
  box-shadow: 0 0 30px rgba(25, 23, 58, 0.2);
  padding: 30px;
}

div.window-head {
  display: flex;
  justify-content: flex-end;
}

span.close-window {
  position: absolute;
  right: -25px;
  top: -15px;
  color: white;
  cursor: pointer;
  font-size: 32px;
  transition: all ease-in .2s;
}

span.close-window:hover {
  font-weight: bold;
  color: #41456c;
}

/*div.window-body {*/
/*  padding: 30px;*/
/*}*/
img.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

div.product-article {
  color: #d3d4dc;
  font-size: .8rem;
}

div.product-name {
  font-size: 1.25rem;
  font-weight: bold;
}

div.product-price {
  padding: 20px 0;
  font-size: 1.25rem;
}

div.cart-actions {
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
}

textarea.comment-modal {
  font-family: "Open Sans", sans-serif;
  outline: none;
  height: 80px;
  width: 100%;
  padding: 5px;
  border: 1px solid #41456c;
  border-radius: 3px;
  color: #41456c;
  text-indent: 5px;
  letter-spacing: 1px;
  resize: none;
  transition: all 160ms linear;
}
textarea.comment-modal:hover, textarea.comment-modal:focus {
  border: 1px solid #db620b;
}

</style>