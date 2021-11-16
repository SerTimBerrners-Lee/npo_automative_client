<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens">
        <h3>Создание заказа поставщика</h3>
        <div class="block header_block">
          <span>Выбор поставщика:</span>
          <input type="text" :value='provider ? provider.name : ""' >
          <button class="btn-small" @click='addProvider'>Выбрать</button>
        </div>
        
        <div class="block two_header">
          <p>
            <span>№ Счета: </span>
            <input type="text" v-model='number_check'> 
            <span>Сумма счета, руб:</span>
            <input type="text" v-model='count'>
          </p>
          <p>
            <span>Планируемая дата прихода:</span>
            <DatePicterCustom 
              @unmount='unmount_date_picters'  
              :dateStart='date_shipments'
            />
            <span>НДС: </span>
            <input type="text" v-model='nds'>
          </p>
        </div>

        <div class="block" style='padding: 5px;'>
          <p style='margin: 5px;'>
            <label for="docsFileSelected" class='btn-small btn-file'>Загрузить счет</label>
            <input id="docsFileSelected" @change="e => addDock(e)" type="file" style="display:none;" required multiple>
            <span class='active'>{{ name_check }}</span>
          </p>
        </div>

        <div>
          <h3>Дефицитный материал</h3>
          <div class="table-scroll">
            <table>
              <tr>
                <th>Наименование</th>
                <th>ЕИ</th>
                <th>Дефицит</th>
              </tr>
              <tr 
                v-for='material of getOnePodMaterial' 
                class='td-row'
                @click='e => selectDeficitMaterial(material, e.target.parentElement)'
                :key="material">
                <td>{{ material.name }}</td>
                <td class='center' v-html='getKolvoMaterial(material.kolvo)'></td>
                <td class='center'>{{ material.shipments_kolvo }}</td>
              </tr>
            </table>
          </div>
          <div class="btn-control">
            <button 
              class="btn-small btn-add"
              @click='pushMaterial'>Добавить к поставщику </button>
          </div>
        </div>

        <div>
          <h3>Список поставляемого поставщиком</h3>
        </div>

        <div>
          <h3 
            class='link_h3'
            @click='newPosition'>Выбранные позиции</h3>
          <div class="table-scroll">
            <table>
              <tr>
                <th>Артикул</th>
                <th>Наименование</th>
                <th>ЕИ</th>
                <th>Кол-во</th>
                <th>Сумма, руб (за шт.)</th>
                <th>Примечание</th>
              </tr>
              <tr 
                v-for='(material, inx) of material_lists'
                :key='material'
                class='td-row'
                @click='setSelected(material)'>
                <td 
                  @keyup="e => editArt(inx, e.target.innerText)"
                  contenteditable="true">{{ material.art }}</td>
                <td >{{ material.name }}</td>
                <td class='center' v-html='material.ez'></td>
                <td
                  @keyup="e => editKol(inx, e.target.innerText)"
                  contenteditable="true">{{ material.kol }}</td>
                <td
                  class='tooltip'>
                  <input type="number" 
                    @change="e => editSum(inx, e.target.value)"
                    min='0' :value='material.sum'>
                  <span class="tooltiptext" contenteditable="false">{{ Number(material.kol) * Number(material.sum)  }}</span>
                </td>
                <td
                  @keyup="e => editDescription(inx, e.target.innerText)"
                  contenteditable="true">{{ material.description }}</td>
              </tr>
            </table>
          </div>
          <div class="btn-control">
            <button class="btn-small" @click='clear'>Очистить</button>
            <button class="btn-small" @click='clearToSelect'>Удалить выбранное</button>
          </div>
          <h3>Примечание</h3>
          <textarea maxlength='250' class='textarea'  v-model='description'></textarea>
        </div>

        <div class="btn-control out-btn-control">
          <button class="btn-status" @click='destroyModalF'>Отменить</button>
          <button class="btn-status btn-black" @click='save'>Сохранить</button>
        </div>
      </div>
    </div>
    <AddFile 
      :parametrs='docFiles' 
      v-if="isChangeFolderFile" 
      @unmount='unmount'
      :typeGetFile='"getfile"'
      :key='keyWhenModalGenerate' />
    <ProviderList 
      :key='key_provider_modal'
      v-if='allProvider.length'
      :allProvider='allProvider'
      :getProvider='true'
      @unmount='unmount_provider'
    />
    <AddPosition 
      :key='key_position'
      v-if='show_position'
      @unmount='unmount_position'
    />
  </div>
</template>
<script>
import DatePicterCustom from '@/components/date-picter.vue';
import AddFile from '@/components/filebase/addfile.vue';
import { random, toNumber } from 'lodash';
import ProviderList from '@/components/baseprovider/all-fields-provider.vue';
import { mapActions, mapGetters } from 'vuex';
import AddPosition from '@/components/sclad/comingtosclad/new-position.vue';
export default {
  props: ['parametrs', 'order_parametr'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'opacity: 1;',   

      date_shipments: new Date().toLocaleString('ru-RU').split(',')[0],
      docFiles: [],
      keyWhenModalGenerate: random(1, 999),
      isChangeFolderFile: false,
      name_check: '',
      formData: new FormData,

      key_provider_modal: random(1, 999),
      allProvider: [],
      provider: null,
      number_check:  '',
      nds: '',
      count: 0,
      material_lists: [],
      description: '',

      selected_material: null,
      span_deff: null,

      select_m: null,
      key_position: random(1, 999),
      show_position: false
    }
  },
  computed: mapGetters(['getOnePodMaterial']),
  components: {
    DatePicterCustom, 
    AddFile, 
    ProviderList,
    AddPosition
  },
  methods: {
    ...mapActions(['fetchGetProviders', 'fetchGetAllDeficitPPM', 'fetchNewDeliveries', 'updateDeliveries']),
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
    },
    unmount_position(material_lists) {
      console.log(material_lists)
      // if(material_list && material_list.length) {
      //   material_list.forEach(e => this.product.push(e))
      // }
    },
    unmount(e) {
      if(!e) 
        return 0
      this.formData = e.formData
      if(this.formData.get('document'))
        this.name_check = this.formData.get('document').name
    },
    unmount_provider(provider) {
      if(provider)
        this.provider = provider
    },
    unmount_date_picters(val) {
      this.date_shipments = val
    },
    addDock(val) {
      val.target.files.forEach(f => {
        this.docFiles.push(f)
      })
      this.keyWhenModalGenerate = random(10, 1111)
      this.isChangeFolderFile = true
    },
    addProvider() {
      this.fetchGetProviders().then(res => {
        this.allProvider = res
        this.key_provider_modal = random(1, 999)
      })
    },
    selectDeficitMaterial(mat, span) {
      this.selected_material = mat
      if(this.span_deff)
        this.span_deff.classList.remove('td-row-all')
      
      this.span_deff = span
      this.span_deff.classList.add('td-row-all')
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
    pushMaterial() {
      if(!this.selected_material)
        return 0
      let material = this.selected_material
      for(let mat of this.material_lists) {
        if(material.id == mat.id) return 0
      }
      this.material_lists.push({
        art: '',
        name: material.name,
        ez: this.getKolvoMaterial(material.kolvo),
        kol: material.shipments_kolvo,
        sum: 0,
        description: '',
        id: material.id
      })
    },
    editArt(inx, val) {
      this.material_lists[inx].art = val
    },
    editKol(inx, val) {
      let check = toNumber(val)
      if(!check) return this.material_lists[inx].kol = 0

      this.material_lists[inx].kol = toNumber(val)
    },
    editSum(inx, val) {
      this.material_lists[inx].sum = val
      this.changeMainSum()
    },
    editDescription(inx, val) {
      this.material_lists[inx].description = val
    },
    changeMainSum() {
      this.count = 0
      if(this.material_lists.length) {
        this.material_lists.forEach(s => 
          this.count = Number(this.count) + (Number(s.sum) * Number(s.kol))
        )
      }
    },
    newPosition() {
      this.key_position = random(1, 999)
      this.show_position = true
    },
    clear() {
      this.material_lists = []
      this.count = 0
    },
    clearToSelect() {
      if(!this.select_m) return 0
      this.material_lists = this.material_lists.filter(e => e.id != this.select_m.id)
    },
    setSelected(material) {
      this.select_m = material
    },
    save() {
      if(!this.provider || !this.material_lists.length)
        return 

      this.formData.append('provider_id', this.provider.id)
      this.formData.append('number_check', this.number_check)
      this.formData.append('nds', this.nds)
      this.formData.append('count', this.count)
      this.formData.append('material_lists', JSON.stringify(this.material_lists))
      this.formData.append('date_shipments', this.date_shipments)
      this.formData.append('description', this.description)


      if(this.$props.order_parametr) {
        this.formData.append('id', this.$props.order_parametr.id)
          this.updateDeliveries(this.formData).then(res => {
            if(res) {
              this.$emit('unmount', res)
              return this.destroyModalF()
            }
          })
      } else {
        this.fetchNewDeliveries(this.formData).then(res => {
          if(res) {
            this.$emit('unmount', res)
            return this.destroyModalF()
          }
        })
      }
    },
    editVariables(order) {
      this.provider = order.provider
      this.number_check = order.number_check
      this.nds = order.nds
      this.count = order.count
      this.description = order.description
      if(order.product) {
        try {
          this.material_lists = JSON.parse(order.product)
        } catch (e) {
          console.log(e)
        }
      }

      if(order.documents && order.documents.length) 
        this.name_check = order.documents[0].name
      
      this.date_shipments = order.date_shipments
    }
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'

    this.fetchGetAllDeficitPPM()

    if(this.$props.order_parametr) {
      this.editVariables(this.$props.order_parametr)
    }
  },
}
</script>

<style scoped>
.textarea {
  margin: 10px;
  width: 48%;
  height: 120px;
}
.header_block * {
  margin-left: 6px;
}
.btn-file{
  color: black;
  background: #d3d3d3;
  padding: 6px;
  font-weight: normal;
  font-size: 16px;
  cursor: pointer;
}
.header_block input{
  width: 50%;
}
.block {
  margin-bottom: 10px;
}
table {
  width: 100%;
}
.two_header * {
  margin:4px;
}
.two_header input{
  width:23%;
}
.two_header  p {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
    width: 60vw;
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