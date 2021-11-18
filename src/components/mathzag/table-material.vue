<template>
  <div class="cont scroll-table scrolls-type-490">
    <table class="type-table">
      <tr>
        <th :class="width ? width : 'width-350'">
          {{ title }}
          <span 
            class='exclamation tooltip' v-if='attention' 
            @click='$emit("unmount_attention")'>
            <unicon name="exclamation" fill="red" />
            <span class='tooltiptext'>Соритировать по отметке</span>
          </span> 
          </th>
      </tr>
      <tr>
        <td> 
          <Search 
            :placeholder='`Поиск по ${alltypeM.length} наименованиям`'
            @unmount='keySearch' 
          />
        </td> 
      </tr>
      <tr 
        class="td-row" 
        v-for='mat in alltypeM' 
        :key='mat' 
        @click='e =>  {active(e.target); $emit("clickMat", mat, type);}'
        @dblclick='e =>  {active(e.target); $emit("dbClickMat", mat, type);}'>
        <td>{{ mat.name }}<span class='exclamation_item' v-if='mat.attention'>!</span></td>
      </tr>
      <tr class="td-row">
        <td>...</td>
      </tr>
    </table>
  </div> 
</template>


<script>
import Search from '@/components/search.vue';
export default {
  props: ['alltypeM', 'type', 'title', 'width', 'attention'],
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