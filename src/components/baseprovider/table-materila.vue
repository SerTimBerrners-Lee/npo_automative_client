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
      'filterByNameMaterial'
    ]),
    clicksGName(material) {
      if(material.providers && material.providers.length)
        this.$emit('unmount', material.providers)
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