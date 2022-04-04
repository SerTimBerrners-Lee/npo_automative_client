<template>
  <div class="cont scroll-table scrolls-type-490">
    <QuickFilter 
      v-if='attention'
      @attention='$emit("unmount_attention")'
      @date_first='$emit("sortToDate")'
      @my_object='$emit("sortToMyObject")'
      :hide_filter_responsibil='hide_filter_responsibil'
    />
    <table class="type-table">
      <tbody class='fixed_table_10'>
        <tr>
          <th :class="width ? width : 'width-350'">
            {{ title }}
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
      </tbody>
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
import Search from '@/components/search';

export default {
  props: ['alltypeM', 'type', 'title', 'width', 'attention', 'hide_filter_responsibil'],
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