<template>
  <div class="scroll-table" style="width: 100%; display: flex; height: fit-content;   " >
    <table style="width: 33%; height: max-content;"> 
      <tr>
        <th>Тип</th>
      </tr>
      <tr>
        <td>
          <Search 
            :placeholder='`Поиск `'
            @unmount='searchT' 
          />
        </td>
      </tr>
      <tr 
        v-for='t in alltypeM' 
        :key='t'
        @click='e => clickMat(t, e.target)'
        class='td-row'>
        <td>{{ t.name }}</td>
      </tr>
    </table>
    <table style="width: 33%; height: max-content;"> 
      <tr>
        <th>Подтип</th>
      </tr>
      <tr>
        <td>
          <Search 
            :placeholder='`Поиск `'
            @unmount='searchPT' 
          />
        </td>
      </tr>
      <tr 
        v-for='t in allPodTypeM' 
        :key='t'
        @click='e => clickPodMat(t, e.target)'
        class='td-row'
        >
        <td>{{ t.name }}</td>
      </tr>
    </table>
    <table style="width: 33%; height: max-content;"> 
      <tr>
        <th>Наименование</th>
      </tr>
      <tr>
        <td>
          <Search 
            :placeholder='`Поиск `'
            @unmount='searchN' 
          />  
        </td>
      </tr>
      <tr 
        class='td-row' 
        v-for='t in getOnePodMaterial' 
        :key='t'
        @click='clicksGName(t)'>
        <td >{{ t.name}}</td>
      </tr>
    </table>
  </div>    
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import Search from '@/components/search.vue';
export default {
  props: ['return'],
  data() {
    return {
      span_type: null
    }
  },
  computed: mapGetters(['alltypeM', 'allPodTypeM', 'getOnePodMaterial']),
  components: {Search},
  methods: {
    ...mapActions(['fetchAllProviderMaterial']),
    ...mapMutations([
      'searchTypeMutation',
      'searchPTypeMutation',
      'searchMaterialMutation',
      'filterByNameMaterialPodMat',
      'filterByNameMaterial'
    ]),
    clicksGName(material) {
      if(material.providers && material.providers.length)
        this.$emit('unmount', material.providers)
    },
    clickMat(mat, e) {
      this.filterByNameMaterialPodMat(mat) 
      if(this.span_type) this.span_type.classList.remove('td-row-all')
      this.span_type = e
      this.span_type.classList.add('td-row-all')
    },
    clickPodMat(mat, e) {
      this.filterByNameMaterial(mat) 
      if(this.span_type) this.span_type.classList.remove('td-row-all')
      this.span_type = e
      this.span_type.classList.add('td-row-all')
    },
    searchT(val) {
      this.searchTypeMutation(val)
    },
    searchPT(val) {
      this.searchPTypeMutation(val)
    },
    searchN(val) {
      this.searchMaterialMutation(val)
    },
    clickGType(mat) {
      this.filterByNameMaterial(mat) 
    },
    clickGPType(mat) {
      this.filterByNameMaterial(mat) 
    }
  },
  async mounted() {
    await this.fetchAllProviderMaterial()
  }
}
</script>