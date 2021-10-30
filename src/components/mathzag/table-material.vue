<template>
  <div class="cont scroll-table scrolls-type-490">
    <table class="type-table">
      <tr>
        <th :class="width ? width : 'width-350'">{{ title }}</th>
      </tr>
      <tr>
        <td> 
          <Search 
            :placeholder='`Поиск по ${alltypeM.length} наименованиям`'
            @unmount='keySearch' 
          />
        </td> 
      </tr>
      <tr class="td-row" v-for='mat in alltypeM' :key='mat' @click='e =>  {active(e.target); $emit("clickMat", mat, type);}'>
        <td>{{ mat.name }}</td>
      </tr>
      <tr class="td-row" v-for="i in 20" :key="i">
        <td>...</td>
      </tr>
    </table>
  </div> 
</template>


<script>
import Search from '@/components/search.vue'
export default {
  props: ['alltypeM', 'type', 'title', 'width'],
  data() {
    return {
      element: null
    }
  },
  components: {Search},
  methods: {
    active(e) {
      if(this.element) 
        this.element.classList.remove('td-row-all')
          
      this.element = e
      this.element.classList.add('td-row-all')
    },
    keySearch(key) {
      this.$emit('search', key)
    }
  },
}
</script>