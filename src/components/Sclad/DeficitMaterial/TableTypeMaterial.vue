<template>
  <div  class="scroll-table table_material">
    <table style="width: 200px;">
      <tr>
        <th>Категория</th>
      </tr>
      <tr class='td-row' @click='e => instansMaterial(0, e.target)'>
        <td>Все</td>
      </tr>
      <tr class='td-row' @click='e => instansMaterial(1, e.target)'>
        <td>Материалы </td>
      </tr>
      <tr class='td-row' @click='e => instansMaterial(2, e.target)'>
        <td>Покупные детали</td>
      </tr>
      <tr class='td-row' @click='e => instansMaterial(3, e.target)'>
        <td>Расходные материалы</td>
      </tr>
    </table>
    <table style="width: 150px;">
      <tr>
        <th>Тип</th>
      </tr>
      <tr 
        class='td-row' 
        v-for='typ of alltypeM' 
        :key='typ'
        @click='e => clickMat(typ, "type", e.target)'>
        <td>{{ typ.name }}</td>
      </tr>
    </table>
    <table style="width: 150px;">
      <tr>
        <th>Подтип</th>
      </tr>
      <tr 
        class='td-row' 
        v-for='p_type of allPodTypeM' 
        :key='p_type'
        @click='e => clickMat(p_type, undefined, e.target)'>
        <td>{{ p_type.name }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { eSelectSpan } from '@/js/methods';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  computed: mapGetters(['alltypeM', 'allPodTypeM']),
  methods: {
    ...mapActions([
			'getAllTypeMaterial',
			'getAllPodTypeMaterial',
		]),
    ...mapMutations([
			'getInstansMaterial', 
			'filterByNameMaterial',
			'filterMatByPodType',
      'clearCascheMaterial'
		]),
    instansMaterial(instans, span) {
			this.span = eSelectSpan(this.span, span);
			if(this.instansLet == instans) return 0;

      this.getInstansMaterial(instans);
      this.instansLet = instans;
    },
		clickMat(mat, type = 'podT', e) {
			this.filterByNameMaterial(mat);
			if(type == 'type') {
				if(mat.instansMaterial == 1) {
					this.getInstansMaterial(1);
					this.instansLet = 1;
				}
				else this.filterMatByPodType(mat.podMaterials);
				this.e_type_material = eSelectSpan(this.e_type_material, e);
			} else this.e_ptype_material = eSelectSpan(this.e_ptype_material, e);
    }
  },
  async mounted() {
    this.clearCascheMaterial(); // Очищаем все 
    await this.getAllTypeMaterial();
    await this.getAllPodTypeMaterial();
  }
}
</script>

<style scoped>
.table_material {
  height: 600px;
}
.table_material>table {
  height: fit-content;
}
</style>