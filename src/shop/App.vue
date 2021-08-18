<template>
  <div class="container-fluid">
    <Modal
      :info="selectedProduct" v-if="modal"
      @close="modal = false"
      @buy="addProducts"
    />
    <el-row :gutter="20">
      <el-col :span="6">
        <div id="categories-wrap" v-for="item in categories" :key="item.id"
             @click="changeCategory(item)">
          <div :class="item.title === selectedCategory.title ? 'category-item-selected' : 'category-item'">
            <i class="fas fa-check" :class="item.checked ? 'icon-active-checked' : 'icon-checked'"></i>
            <span>{{ item.title }}</span>
          </div>
        </div>
      </el-col>
      <Loader v-if="loader"/>
      <el-col :span="18" v-else style="display: flex; flex-direction: column">
        <span id="category-title">{{ selectedCategory.title || '' }}</span>
        <div id="sort-wrap">
          <div class="sort-item" id="sort-price-wrap" @click="changeSortState('price')">
            <span id="sort-price">По цене</span>
            <i :class="checkSortState('price')"></i>
          </div>
          <div class="sort-item" id="sort-alphabetic-wrap" @click="changeSortState('alphabetic')">
            <span id="sort-alphabetic">По алфавиту</span>
            <i :class="checkSortState('alphabetic')"></i>
          </div>
        </div>
        <div id="subcategories-wrap">
          <div
            :class="selectedSubcategory === item ? 'subcategories-item-selected' : 'subcategories-item'"
            v-for="item in subcategories" :key="item.id"
            @click="changeSubcategory(item)"
            v-html="item.title"
          />
        </div>
        <div class="products-wrap">
          <product-card
            v-for="card in filteredProducts"
            :key="card.id" :card-prop="card"
            @click="showProductInfo(card)"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Modal from "../components/Modal";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
export default {
  name: 'App',
  components: {Modal, ProductCard, Loader},
  data() {
    return {
      test: true,
      MY_PORTAL_DOMAIN: 'https://bitrix.ritual59.ru',
      IBLOCK_ID: 1,
      IBLOCK_SECTION_ID: 1,
      loader: false,
      modal: false,
      categories: [],
      subcategories: [],
      selectedCategory: {},
      selectedSubcategory: {},
      selectedProduct: {},
      products: [],
      filteredProducts: [],
      sort: {
        priceSort: null,
        alphabeticSort: null
      }
    }
  },
  mounted() {
    for (let i = 0; i < 24; i++) {
      const product = {
        id: i + 1,
        title: `Товар ${i + 1}`,
        categoryId: parseInt(Math.random() * 100 % 3 + 1),
        subcategoryId: parseInt(Math.random() * 100 % 3 + 1),
        fullPrice: +(Math.random() * 10_000).toFixed(2),
        stockPrice: +(Math.random() * 10_000).toFixed(2),
        article: `Артикул: ${i}`,
        imgUrl: '/img/empty.png'
      }
      this.filteredProducts.push(product)
      this.products.push(product)
    }
    this.categories = [
      {id: 1, title: 'Категория1', checked: true},
      {id: 2, title: 'Категория2', checked: false},
      {id: 3, title: 'Категория3', checked: false},
    ]
    this.subcategories = [
      {id: 1, title: 'Все'},
      {id: 2, title: 'Подкатегория1'},
      {id: 3, title: 'Подкатегория2'}
    ]
    this.selectedCategory = this.categories[0]
    this.selectedSubcategory = this.subcategories[0]
    this.init()
  },
  methods: {
    async init() {
      // Методы для получения категорий товаров и самих товаров
      // Для работы с API используются встроенные битриксовые методы

      // await this.getSections()
      // await this.getProducts(this.selectedCategory.id)

      this.loader = false
    },

    /* ########## API ########## */
    callB24AjaxMethod(component, action, properties = {}) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-undef
        BX.ajax.runComponentAction(component, action, {
          mode: 'class',
          data: properties,
        }).then(function (response) {
          resolve(response)
        }, function (error) {
          reject(error)
        });
      })
    },
    async getSections() {
      await this.callB24AjaxMethod('webmens:shop.deal', 'getSections', {
        sectionId: this.IBLOCK_SECTION_ID,
        iblockId: this.IBLOCK_ID
      }).then(response => {
        // Данные с бэка приходили в таком виде: [{1: 'Категория1'}, {2: 'Категория2'}]
        // Поэтому пришлось их вот так некрасиво парсить
        const entries = Object.entries(response.data)
        this.categories = entries.map(item => new Object({id: parseInt(item[0]), title: item[1], checked: false}), this)
        this.categories[0].checked = true;
        this.selectedCategory = this.categories[0];
      })
    },
    async getProducts(categoryId) {
      await this.callB24AjaxMethod('webmens:shop.deal', 'getProducts', {
        sectionId: categoryId,
        iblockId: this.IBLOCK_ID
      }).then(response => {
        const data = response.data.products
        // С системными именами битрикса работать не очень удобно
        // Поэтому беребираю все данные, меняю ключи и беру только необходимые данные
        this.filteredProducts = this.products = data.map(item => {
          return {
            id: parseInt(item.ID),
            title: item.NAME,
            isAuto: false,
            categoryId: parseInt(item.IBLOCK_SECTION_ID),
            subcategoryId: parseInt(item[response.data.mainPropertyName]),
            fullPrice: parseInt(item.CATALOG_PRICE_1).toLocaleString(),
            stockPrice: parseInt(item.CATALOG_PRICE_2).toLocaleString(),
            comment: '',
            article: item.PROPERTY_ARTICUL_VALUE,
            imgUrl: this.MY_PORTAL_DOMAIN + (item.img ? item.img : '/local/templates/.default/vue/src/assets/empty.png')
          }
        })
        const subcatEntries = Object.entries(response.data.mainProperty)
        this.subcategories = this.selectedSubcategory = [{id: 1, title: 'Все'}]
        subcatEntries.forEach(item => {
          this.subcategories.push({id: parseInt(item[0]), title: item[1]})
        }, this)
      }).catch(error => console.error(error))
    },
    async addProducts(product) {
      // eslint-disable-next-line no-undef
      await this.callB24AjaxMethod('webmens:shop.deal', 'addProduct', Object.assign({dealId: deal.entity_id}, product)).then(() => {
        // eslint-disable-next-line no-undef
        BX.Crm.EntityEditor.defaultInstance.reload()
        this.modal = false
      }).catch(error => {
        console.error(error)
        alert('Произошла ошибка при добавлении товара');
      })
    },
    /* ########## API ########## */

    async changeCategory(item) {
      this.loader = true
      item.checked = true
      this.selectedCategory = item
      // await this.getProducts(item.id)
      this.loader = false
    },
    changeSubcategory(subcat) {
      this.selectedSubcategory = subcat
      this.sort.priceSort = this.sort.alphabeticSort = null
      if (subcat.id === 1) {
        this.filteredProducts = this.products
      } else {
        this.filteredProducts = this.products.filter(item => item.subcategoryId === subcat.id)
      }
    },
    checkSortState(type) {
      switch (type) {
        case 'price':
          if (this.sort.priceSort === 'asc') return 'fas fa-sort-up'
          else if (this.sort.priceSort === 'desc') return 'fas fa-sort-down'
          else return 'fas fa-sort'
        case 'alphabetic':
          if (this.sort.alphabeticSort === 'asc') return 'fas fa-sort-up'
          else if (this.sort.alphabeticSort === 'desc') return 'fas fa-sort-down'
          else return 'fas fa-sort'
        default:
          return
      }
    },
    changeSortState(type) {
      type === 'price' ? this.sort.alphabeticSort = null : this.sort.priceSort = null
      switch (type) {
        case 'price':
          if (this.sort.priceSort === 'asc') this.sort.priceSort = 'desc'
          else this.sort.priceSort = 'asc'
          this.sortProducts(type, this.sort.priceSort)
          break;
        case 'alphabetic':
          if (this.sort.alphabeticSort === 'asc') this.sort.alphabeticSort = 'desc'
          else this.sort.alphabeticSort = 'asc'
          this.sortProducts(type, this.sort.alphabeticSort)
          break;
        default:
          return
      }
    },
    sortProducts(type, sort) {
      switch (type) {
        case 'price':
          if (sort === 'asc') this.filteredProducts.sort((a, b) => a.fullPrice > b.fullPrice)
          else this.filteredProducts.sort((a, b) => a.fullPrice < b.fullPrice)
          break;
        case 'alphabetic':
          if (sort === 'asc') this.filteredProducts.sort((a, b) => a.title > b.title)
          else this.filteredProducts.sort((a, b) => a.title < b.title)
      }
    },
    showProductInfo(product) {
      this.selectedProduct = product
      this.modal = true
    }
  }
}
</script>

<style>
body {
  margin: 0;
  overflow-x: hidden;
  background-color: #eef2f4;
}
.grid {
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(2, 1fr);
}
.item {
  background-color: lightgray;
  padding: 100px 0;
  text-align: center;
}
@font-face {
  font-family: OpenSans-Regular;
  src: url("/local/components/webmens/shop.deal/templates/.default/vue/assets/opensans.ttf");
}
div#workarea-content, div#shop {
  /*background-color: #f9f9fb;*/
  font-family: OpenSans-Regular,sans-serif;
  box-sizing: border-box;
  color: #41456c;
  font-size: 16px;
  margin: 0 5%;
}

div.workarea-content-paddings {
  overflow-x: hidden;
}

div.category-item, div.category-item-selected {
  display: flex;
  background-color: #ffffff;
  border-bottom: 3px solid #f9f9fb;
  padding: 15px 5px;
  transition-property: background-color, color;
  transition: .2s;
  cursor: pointer;
}

div.category-item-selected {
  background-color: #41456c;
  color: white;
  font-weight: bold;
  border-right: 10px solid #db620b;
}

div.category-item:hover {
  background-color: #41456c;
  color: white
}

div.category-item-selected:hover {
  background-color: #5e6293;
}

i.fas.icon-checked {
  margin: auto 0;
  padding: 0 10px;
  color: #eeeeee;
}

i.fas.icon-active-checked {
  margin: auto 0;
  padding: 0 10px;
  color: #db620b;
}

span#category-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
}

div#sort-wrap {
  display: flex;
  padding: 10px 0;
}

div.sort-item {
  cursor: pointer;
  user-select: none;
  transition-property: color;
  transition: .1s;
  margin-right: 10px;
}

div.sort-item:hover {
  color: #db620b;
}

i.fas {
  padding: 0 5px;
}

div#subcategories-wrap {
  display: flex;
  margin-bottom: 10px;
}

div.subcategories-item, div.subcategories-item-selected {
  background-color: white;
  cursor: pointer;
  padding: 5px 20px;
  margin-right: 10px;
  border: 1px solid #d3d4dc;
  transition-property: background-color, color;
  transition: .2s;
}

div.subcategories-item-selected {
  background-color: #41456c;
  color: white;
}

div.subcategories-item-selected:hover {
  background-color: #5e6293;
  color: white;
}

div.subcategories-item:hover {
  background-color: #db620b;
  color: white;
}

div.products-wrap {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  grid-gap: 1.5rem;
  padding: 0 20px 60px 0;
  height: 800px;
  flex-grow: 3;
  overflow-x: hidden;
  overflow-y: auto;
}

span.no-products {
  position: absolute;
  left: 50%;
}

button.card-btn {
  height: 40px;
  padding: 0 20px;
  font-weight: bold;
  font-size: 14px;
  border: 2px solid #db620b;
  background-color: #db620b;
  color: white;
  transition: all ease .2s;
  cursor: pointer;
}

button.card-btn:hover {
  background-color: white;
  color: #db620b;
}

button.card-btn.added {
  border-color: #41456c;
  background-color: white;
  color: #41456c;
}

button.card-btn.added:hover {
  border-color: #41456c;
  background-color: white;
  color: #41456c;
}


/* Bitrix Fixes */
span.crm-item-inp-wrap {
  box-sizing: initial;
}

body.crm-iframe-popup {
  overflow-x: hidden;
}
</style>
