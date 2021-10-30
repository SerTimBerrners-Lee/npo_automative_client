<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens">
        <h3> Выбрать позиции для прихода</h3>
  <!-- Все материалы -->

        <div class="scroll-table table_material">
          <table style="width: 200px;">
            <tr>
              <th>Категория</th>
            </tr>
            <tr class='td-row' @click='e => instansMaterial(0, e.target.parentElement)'>
              <td>Все</td>
            </tr>
            <tr class='td-row' @click='e => instansMaterial(1, e.target.parentElement)'>
              <td>Материалы </td>
            </tr>
            <tr class='td-row' @click='e => instansMaterial(2, e.target.parentElement)'>
              <td>Покупные детали</td>
            </tr>
            <tr class='td-row' @click='e => instansMaterial(3, e.target.parentElement)'>
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
              @click='clickMat(typ)'>
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
              @click='clickMat(p_type)'>
              <td>{{ p_type.name }}</td>
            </tr>
          </table>
          <table>
            <tr>
              <th>Наименование</th>
            </tr>
            <tr v-for='material of getOnePodMaterial' :key='material'>
              <td 
                @click='e => setMaterial(material, e.target)'
                class='td-row'> {{ material.name }}</td>
            </tr>
          </table>
        </div>

  <!-- Выбранные материалы -->

      <div v-if='material_list.length'>
        <table style='width: 90%'>
          <tr>
            <th>Выбранное</th>
            <th>ЕИ</th>
            <th>Кол-во, м</th>
            <th 
              style='cursor: pointer;'
              @click="allItemsDel">
              <unicon name="glass-tea" fill="#ee0942d0" width='20' />
            </th> 
          </tr>
          <tr v-for='mat of material_list' :key='mat'>
            <td>{{ mat.name }}</td>
            <td v-html='mat.ez'></td>
            <td>{{ mat.kol }}</td>
            <td class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
                  <p class="checkbox_block_del" @click='delProd(mat)'></p>
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

<script>
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
      material_list: [],

      loader: false
    }
  },
  computed: mapGetters(['getOnePodMaterial', 'alltypeM', 'allPodTypeM']),
  components: {},
  methods: {
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
    },
    ...mapActions(['getAllTypeMaterial', 'getAllPodTypeMaterial', 'fetchGetAllPPM']),
		...mapMutations(['getInstansMaterial', 'filterByNameMaterial', 'clearCascheMaterial']),

    instansMaterial(instans, span) {
      if(this.span) 
				this.span.classList.remove('td-row-all')
			if(this.instansLet == instans)
				return 0

      this.span = span
			this.span.classList.add('td-row-all')

      this.getInstansMaterial(instans)
      this.instansLet = instans

    },
		clickMat(mat) {
			this.filterByNameMaterial(mat) 
    },
		setMaterial(material, span) {
			if(this.material && this.material.id == material.id && this.span_material) {
				this.material = null;
				return this.span_material = null
			}
			if(this.span_material)
				this.span_material.classList.remove('td-row-all')
			this.span_material = span
			this.span_material.classList.add('td-row-all')

      let check = true
			for(let mat of this.material_list) {
        if(mat.id == material.id)
          check = false
      }
      if(check)
        this.material_list.push({
          art: '',
          kol: 1,
          ez: this.getKolvoMaterial(material.kolvo),
          name: material.name,
          id: material.id,
          sum: 0,
          description: ''
        })
      else 
        check = true
		},
    getKolvoMaterial(kol) {
			try {
				let pars_json = JSON.parse(kol)
				let str = ''
				if(pars_json.c1) str = '<span> шт </span>'
				if(pars_json.c2) str = str + '<span> л </span>'
				if(pars_json.c3) str = str + '<span> кг </span>'
				if(pars_json.c4) str = str + '<span> м </span>'
				if(pars_json.c5) str = str + '<span> м.куб </span>'
				return str
			} catch (e) {
				console.log(e)
			}
		},
    delProd(mat) {
      this.material_list = this.material_list.filter(m => m.id != mat.id)
    },
    allItemsDel() {
      this.material_list = []
    },
    pushMaterial() {
      this.$emit('unmount', this.material_list)
      this.destroyModalF()
    }
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'

    this.loader = true

    await this.getAllTypeMaterial()
    await this.getAllPodTypeMaterial()
    await this.fetchGetAllPPM()

    this.loader = false
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
  width: 40vw;
}
.left-block-modal {
  width: 60vw;
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
    width: 40vw;
  }
}
@keyframes width-right {
  from {
    width: 0vw;
  }
  to {
    width: 60vw;
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
    width: 40vw;
  }
  to {
    width: 00vw;
  }
}
@keyframes width-right-replace {
  from {
    width: 60vw;
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