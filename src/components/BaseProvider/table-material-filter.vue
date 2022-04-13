<template>
  <div class="scroll-table" style="width: 100%; display: flex; height: fit-content;">
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
        v-for='t in getMaterialTProvider' 
        :key='t'
        class='td-row'
        @click='e => clickGType(t, e.target)'>
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
        v-for='t in getMaterialPTProvider' 
        :key='t'
        class='td-row'
        @click='e => clickGPType(t, e.target)'
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
        v-for='t in getMaterialProvider'
        :key='t'
        @click='e => clickGPPT(t, e.target)'>
        <td >{{ t.name}}</td>
      </tr>
    </table>
  </div>
  <MiniLoader v-if='loader' />
</template>
<script>
import Search from '@/components/search.vue';
import { eSelectSpan } from '@/js/methods.js';
import { mapGetters, mapActions, mapMutations } from 'vuex';
export default {
  props: ['id_product', 'is_empty'],
  data() {
    return {
      loader: false,
      span_gt: null,
      span_gpt: null,
      span_gppt: null
    }
  },
  computed: mapGetters([
    'getMaterialProvider', 
    'getMaterialTProvider', 
    'getMaterialPTProvider'
  ]),
  components: {Search},
  methods: {
    ...mapActions(['fetchAllProviderMaterialById']),
    ...mapMutations([
      'searchProviderMaterial',
      'searchProviderTMaterial',
      'searchProviderPTMaterial',
      'filterByNameMaterial',
      'clearMaterialCurrentProducts'
    ]),
    searchN(val) {
      this.searchProviderMaterial(val);
    },
    searchT(val) {
      this.searchProviderTMaterial(val);
    },
    searchPT(val) {
      this.searchProviderPTMaterial(val);
    },
    clickGType(mat, span) {
      this.this.span_gt = eSelectSpan(this.span_gt, span);
      // this.filterByNameMaterial(mat);
    },
    clickGPType(mat, span) {
      this.span_gpt = eSelectSpan(this.span_gpt, span);
      // this.filterByNameMaterial(mat);
    },
    clickGPPT(mat, span) {
      console.log(mat);
      this.span_gppt = eSelectSpan(this.span_gppt, span);
      this.$emit('unmount_material', mat);
    }
  },
  async mounted() {
    this.loader = true;

    if(this.$props.id_product)
      await this.fetchAllProviderMaterialById(this.$props.id_product);
    if(this.$props.is_empty)
      this.clearMaterialCurrentProducts();
      
    this.loader = false;
  }
}
</script>