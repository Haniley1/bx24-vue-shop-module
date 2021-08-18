<template>
<div class="products">
  <Loader v-if="loader"/>
  <template v-else>
    <div class="global-discount">
      <span class="discount-title">Общая скидка(%): </span>
      <Count v-model="globalDiscount"
             @change="editGlobalDiscount($event)"
      />
    </div>
    <div class="products-container">
      <ProductTable
        v-for="type in Object.values(types)"
        :key="type"
        :tableType="type"
        :globalDiscount="globalDiscount"
        :data="products"
        @change="editProduct($event.changed, $event.product)"
        @delete="deleteProduct($event)"
      />
    </div>
  </template>
</div>
</template>

<script>
import ProductTable from "../components/ProductTable.vue"
import Loader from "../components/Loader.vue"
import Count from "../components/Count.vue"
export default {
  name: 'App',
  components: {ProductTable, Loader, Count},
  data() {
    return {
      MY_PORTAL_DOMAIN: 'https://bitrix.ritual59.ru',
      loader: false,
      types: {95: 'product', 96: 'service'},
      reverseTypes: {product: 95, service: 96},
      globalDiscount: 0,
      dealId: '',
      products: []
    }
  },
  mounted() {
    this.calcProductsSum()
    // eslint-disable-next-line no-undef
    this.dealId = deal.entity_id
    this.init()
  },
  methods: {
    async init() {
      await this.getProducts(this.dealId)
      const observeEl = document.querySelector('div.crm-entity-section.wm-products-section')
      const observer = new MutationObserver((mutations) => {
        let styles = window.getComputedStyle(mutations[0].target)
        if (styles.display === 'block') {
          this.getProducts(this.dealId)
        }
      })
      observer.observe(observeEl, { attributes: true, childList: false, characterData: true })
      this.loader = false
    },

    /* ########## API ########## */
    callB24AjaxMethod(component, action, properties = {}) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-undef
        BX.ajax.runComponentAction(component, action, {
          mode: 'class',
          data: properties,
        }).then(response => resolve(response), error => reject(error));
      })
    },

    getProducts(dealId) {
      // eslint-disable-next-line no-undef
      this.callB24AjaxMethod('webmens:products.deal', 'getProductsRow', {dealId}).then(response => {
        console.log(response)
        const DOMAIN = this.MY_PORTAL_DOMAIN
        this.products = response.data.products.map(item => new Object({
          id: item['ID'],
          productId: item['PROPERTY_TOVAR_VALUE'],
          isSale: item['isSale'] === 'Да',
          isCar: item['PROPERTY_AVTO_VALUE'] === 'Да',
          type: this.types[item['PROPERTY_TIP_VALUE']],
          title: item['NAME'],
          img: DOMAIN + (item['img'] ? item['img'] : '/local/templates/.default/vue/src/assets/empty.png'),
          count: parseInt(item['PROPERTY_KOLICHESTVO_VALUE']),
          price: parseInt(item['PROPERTY_PRICE_VALUE']),
          discount: parseInt(item['PROPERTY_SKIDKA_VALUE']),
          comment: item['PROPERTY_KOMENTARIY_VALUE']['TEXT'] || ''
        }))
        this.calcProductsSum()
      }).catch(error => console.error(error))
    },
    editProduct(changed, product) {
      console.log(product, 'editProduct')
      const resProduct = {
        id: product.id,
        type: this.reverseTypes[product.type],
        dealId: this.dealId,
        productId: product.productId,
        count: changed.count,
        comment: changed.comment,
        discount: changed.discount
      }
      this.callB24AjaxMethod('webmens:products.deal', 'update', resProduct).then(response => {
        console.log(response)
        this.calcProductsSum()
      }).catch(error => console.error(error))
    },
    test() {
      const urlEl = document.getElementById('banner-url')
      const imgEl = document.getElementById('banner-img')
      urlEl.href = 'https://marel.com/en/news/global-fishery-forum-seafood-expo-russia-2021-8-10-september'
      imgEl.src = '/bitrix/templates/sfer/img/banners/banner_2021_rus_global_fishery_forum_1720x210.jpg'
    },
    editGlobalDiscount(e) {
      console.log(e)
      const [oldVal, newVal] = Object.values(e);
      const changedProducts = []
      this.products.forEach(item => {
        if (item.discount === oldVal && item.isSale) {
          item.discount = newVal

          const changedProduct = Object.assign({}, item)
          changedProduct.type = this.reverseTypes[changedProduct.type]
          changedProducts.push(changedProduct)
        }
      }, this)
      this.calcProductsSum()
      console.log(this.products)
      this.callB24AjaxMethod('webmens:products.deal', 'updates', {data: changedProducts, dealId: this.dealId})
    },
    calcProductsSum() {
      for (let item of this.products) {
        const total = item.price * item.count
        item.total = item.discount ? total - (total / 100 * item.discount) : total
      }
    },
    deleteProduct(id) {
      console.log(id, 'deleteProduct')
      this.callB24AjaxMethod('webmens:products.deal', 'delete', {id}).then(response => {
        console.log(response)
        const product = this.products.find(item => item.id === id)
        const pos = this.products.indexOf(product)
        this.products.splice(pos, 1)
      }).catch(error => console.error(error))
    }
    /* ########## API ########## */
  }
}
</script>

<style>
@font-face {
  font-family: OpenSans-Regular;
  src: url("/local/components/webmens/shop.deal/templates/.default/vue/assets/opensans.ttf");
}
div#workarea-content, div#products {
  font-family: OpenSans-Regular,sans-serif;
  color: #41456c;
  font-size: 14px;
  background-color: #eef2f4;
}
div.workarea-content-paddings {
  overflow-x: hidden;
}

div.global-discount {
  padding: 5px 10px;
  margin-bottom: 10px;
  background: white;
  border: 1px solid #C4C6DA;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all ease 200ms;
}
div.global-discount > div.count {
  border: none;
}
</style>