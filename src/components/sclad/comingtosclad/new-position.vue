<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens">
        <h3> Добавить поставку</h3>
        <div class="scroll-table table_material">
          <table style="width: 200px;">
            <tr>
              <th>Категория</th>
            </tr>
            <tr class='td-row' @click='e => getAllDeficit(e.target.parentElement)'>
              <td>Все</td>
            </tr>
            <tr class='td-row' @click='e => getOnlyMaterialDeficit(e.target.parentElement)'>
              <td>Материалы </td>
            </tr>
            <tr class='td-row' @click='e => getOnlyInstrumentDeficit(e.target.parentElement)'>
              <td>Инструмент</td>
            </tr>
            <tr class='td-row' @click='e => getOnlyEquipmentDeficit(e.target.parentElement)'>
              <td>Обдование</td>
            </tr>
            <tr class='td-row' @click='e => getOnlyInventarytDeficit(e.target.parentElement)'>
              <td>Техника и Инвенарь</td>
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
              @click='clickMat(typ, "type")'> 
              <td>{{ typ.name }}</td>
            </tr>
            <tr 
              class='td-row' 
              v-for='typ of allEquipmentType' 
              :key='typ'
              @click='clickEq(typ, "type")'> 
              <td>{{ typ.name }}</td>
            </tr>
            <tr 
              class='td-row' 
              v-for='typ of allTInstrument' 
              :key='typ'
              @click='clickTools(typ, "type")'> 
              <td>{{ typ.name }}</td>
            </tr>
            <tr 
              class='td-row' 
              v-for='typ of getTInventary' 
              :key='typ'
              @click='clickInventary(typ, "type")'> 
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
              @click='clickMat(p_type, "podM")'>
              <td>{{ p_type.name }}</td>
            </tr>
            <tr 
              class='td-row' 
              v-for='p_type of allEquipmentPType' 
              :key='p_type'
              @click='clickEq(p_type, "podT")'>
              <td>{{ p_type.name }}</td>
            </tr>
            <tr 
              class='td-row' 
              v-for='p_type of allPTInstrument' 
              :key='p_type'
              @click='clickTools(p_type, "podT")'>
              <td>{{ p_type.name }}</td>
            </tr>
            <tr 
              class='td-row' 
              v-for='p_type of getPTInventary' 
              :key='p_type'
              @click='clickInventary(p_type, "podT")'>
              <td>{{ p_type.name }}</td>
            </tr>
          </table>
          <table>
            <tr>
              <th>Наименование</th>
            </tr>
            <tr v-for='material of getOnePodMaterial' :key='material'>
              <td 
                @click='e => setProd(material, e.target, "mat")'
                class='td-row'> {{ material.name }}</td>
            </tr>
            <tr v-for='instrument of allPPTInstrument' :key='instrument'>
              <td 
                @click='e => setProd(instrument, e.target, "tools")'
                class='td-row'> {{ instrument.name }}</td>
            </tr>
            <tr v-for='equipment of allEquipment' :key='equipment'>
              <td 
                @click='e => setProd(equipment, e.target, "eq")'
                class='td-row'> {{ equipment.name }}</td>
            </tr>
            <tr v-for='inventary of getInventary' :key='inventary'>
              <td 
                @click='e => setProd(inventary, e.target, "inventary")'
                class='td-row'> {{ inventary.name }}</td>
            </tr>
          </table>
        </div>

        <div v-if='position_list.length'>
          <table style='width: 90%'>
            <tr>
              <th>Выбранное</th>
              <th>Тип</th>
              <th>ЕИ</th>
              <th>Кол-во, м</th>
              <th 
                style='cursor: pointer;'
                @click="allItemsDel">
                <unicon name="glass-tea" fill="#ee0942d0" width='20' />
              </th> 
            </tr>
            <tr v-for='pos of position_list' :key='pos'>
              <td>{{ pos.name }}</td>
              <td>{{ returnTypePosition(pos.type) }}</td>
              <td v-html='pos.ez'></td>
              <td>{{ pos.kol }}</td>
              <td class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
                <p class="checkbox_block_del" @click='delProd(pos)'></p>
              </td>
            </tr>
          </table>
        </div>

        <div class="btn-control out-btn-control">
          <button class="btn-status" @click='destroyModalF'>Отменить</button>
          <button class="btn-status btn-black" @click="pushMaterial">Добавить выбранное</button>
        </div>
      </div>
    </div>
    <Loader v-if='loader' />
  </div>
</template>
<script scoped>
import { returnSpanEz } from '@/js/edizm.js';
import { eSelectSpan } from '@/js/methods.js';
import { returnTypePosition } from '@/js/methods.js';
import { mapActions, mapGetters, mapMutations } from 'vuex';
export default {
  props: ['parametrs'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'opacity: 1;',   

      span: null,
      instansLet: 0,
      span_material: null,
      position_list: [],

      loader: false
    }
  },
  computed: mapGetters([
    'alltypeM', 
		'allPodTypeM', 
		'getOnePodMaterial', 
		'allTInstrument',
		'allPTInstrument',
		'allPPTInstrument',
		'allEquipmentType',
		'allEquipmentPType',
		'allEquipment',
		'getTInventary',
		'getPTInventary',
		'getInventary'
  ]),
  components: {},
  methods: {
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden';
      this.destroyModalRight = 'content-modal-right-menu-hidden';
      this.hiddens = 'display: none;';
    },
    ...mapActions([
      'getAllTypeMaterial',
      'bannedPPM', 
      'fetchGetOnePPM', 
      'getAllPodTypeMaterial',
      'fetchPPMNoLight',
			'fetchGetAllDeficitInsrument',
			'getAllNameInstrument',
			'fetchAllEquipment',
			'fetchAllNameInventary',
			'getAllEquipmentPType',
			'fetchAllEquipmentType',
			'getOneEquipmentPType',
			'fetchAllInstruments',
			'getPTInstrumentList',
			'getAllPTInstances',
			'fetchAllInventary',
			'fetchAllPInventary'
    ]),
		...mapMutations([
      'filterByNameMaterialById', 
			'filterMatByPodType',
      'filterByNameMaterial',
      'addOnePPTyep', 
      'throwInstans',
      'searchTypeMutation', 
      'searchPTypeMutation', 
      'searchMaterialMutation', 
      'clearCascheMaterial',
			'clearCascheInstrument',
			'clearCascheEquipment',
			'clearCascheInventary',
			'filterAllPTEquipment',
			'filterAllpInstrument',
			'filterNameInventaryByPT'
    ]),
		clickMat(mat) {
			this.filterByNameMaterial(mat);
    },
    returnTypePosition(type) {
      return returnTypePosition(type)[0];
    },
    setProd(obj, span, type) {
			this.span_material = eSelectSpan(this.span_material, span);

      let check = true;
			for(let mat of this.position_list) {
        if(mat.obj.id == obj.id && mat.type == type) check = false;
      }
      
      if(check) 
        this.position_list.push({
          kol: 1,
          ez: returnSpanEz(obj.kolvo) || '<span> шт </span>',
          name: obj.name,
          obj: obj, 
          type: type
        })
      else
        check = true;
    },
    clickEq(eq, type) {
			if(type == 'type') 
				this.filterAllPTEquipment(eq);
      if(type == 'podT') 
				this.getOneEquipmentPType(eq.id);
		},
		clickTools(tools, type) {
			if(type == 'type') 
				this.filterAllpInstrument(tools);
      if(type == 'podT') 
				this.getAllPTInstances(tools.id);
		},
		clickInventary(inventary, type) {
			if(type == 'type') 
				this.filterNameInventaryByPT(inventary.inventary);
      if(type == 'podT') 
				this.filterNameInventaryByPT(inventary.inventary);
		},
    getAllDeficit() {
			this.clearAllState();

			this.getOnlyMaterialDeficit();
			this.getAllNameInstrument();
		},
		getOnlyMaterialDeficit() {
			this.clearAllState();

			this.getAllTypeMaterial();
			this.getAllPodTypeMaterial();
			this.fetchPPMNoLight();
		},
		getOnlyInstrumentDeficit() {
			this.clearAllState();
			this.getAllNameInstrument();
			this.fetchAllInstruments();
			this.getPTInstrumentList();
		},
		getOnlyEquipmentDeficit() {
			this.clearAllState();
			this.fetchAllEquipment();
			this.getAllEquipmentPType();
			this.fetchAllEquipmentType();
		},
		getOnlyInventarytDeficit() {
			this.clearAllState();
			this.fetchAllInventary();
			this.fetchAllPInventary();
			this.fetchAllNameInventary();
		},
		clearAllState() {
			this.clearCascheMaterial();
			this.clearCascheInstrument();
			this.clearCascheEquipment();
			this.clearCascheInventary();
		},
    delProd(mat) {
      const arr = []
      for(let item of this.position_list) {
        if((item.obj.id == mat.obj.id) && (item.obj.type == mat.obj.type)) continue;
        arr.push(item);
      }
      this.position_list = arr;
    },
    allItemsDel() {
      this.position_list = [];
    },
    pushMaterial() {
      this.$emit('unmount', this.position_list);
      this.destroyModalF();
    }
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal';
    this.destroyModalRight = 'content-modal-right-menu';
    this.hiddens = 'opacity: 1;';

    this.loader = true;

    this.clearCascheMaterial();
    await this.getAllTypeMaterial();
    await this.getAllPodTypeMaterial();
    await this.fetchPPMNoLight();
    await this.getAllNameInstrument();
		await this.fetchAllEquipment();
		await this.fetchAllNameInventary();

    this.loader = false;
  },
}
</script>

<style scoped>
.out-btn-control {
  position: fixed;
  bottom: 10px;
  width: 36%;
}
.table_material {
  display: flex;
  height: 500px;
  width: 880px;
}
.checkbox_parent {
  height: 15px;
}
table {
  height: fit-content;
}
.content-modal-right-menu-hidden {
  animation: width-replace 1s 1 ease;
}
.content-modal-right-menu-hidden>div {
  animation: hidden-content-replace 1s 1 ease;
}
.content-modal-right-menu {
  animation: width 1s 1 ease;
  width: 50vw;
}
.left-block-modal {
  width: 50vw;
  animation: width-right 1s 1 ease;
}
.left-block-modal-hidden {
  animation: width-right-replace 1s 1 ease;
}
.content-modal-right-menu>div {
  animation: hidden-content 1s 1 ease;
}
@keyframes width {
  from {
    width: 1vw;
  }
  to {
    width: 50vw;
  }
}
@keyframes width-right {
  from {
    width: 0vw;
  }
  to {
    width: 50vw;
  }
}
@keyframes hidden-content {
  from {
    opacity: 0;
  }
  80% {
    opacity: 0;
  }
  90% {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}
@keyframes width-replace {
  from {
    width: 50vw;
  }
  to {
    width: 00vw;
  }
}
@keyframes width-right-replace {
  from {
    width: 50vw;
  }
  to {
    width: 0vw;
  }
}
@keyframes hidden-content-replace {
  from {
    opacity: 1;
  }
  20% {
    opacity: 0;
  }
  to {
    opacity: 0;
  }
}
</style>