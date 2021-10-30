<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" >
      <h3>Запустить в производство</h3> 
      <div class="block">
        <p class='tooltip'>
          <span>Дата заказа: </span>
          <input type="text" v-model='date_order'>
          <span class="tooltiptext">{{ date_order }}</span>
        </p>
        <p class='tooltip'>
          <span>№ Заказа: </span>
          <input type="text" v-model='number_order'>
          <span class="tooltiptext" style='margin-top: 200px;'>{{ number_order }}</span>
        </p>
        <p class='tooltip'>
          <span>Дата выполнения: </span>
          <input type="text" v-model='date_shipments'>
          <span class="tooltiptext">{{ date_shipments }}</span>
        </p>
      </div>
      <div>
        <h3>Примечание</h3>
        <textarea  maxlength='250' v-model='description'></textarea>
      </div>
      <div>
        <h3>Комплектация</h3>
        <table>
          <tr>
            <th>Тип</th>
            <th>Артикул</th>
            <th>Наименование</th>
            <th>Кол-во</th>
          </tr>
          <tr v-for='izd of komplect' :key='izd'>
            <td>{{ izd.type }}</td>
            <td>{{ izd.art }}</td>
            <td>{{ izd.name }}</td>
            <td>{{ izd.kol }}</td>
          </tr>
        </table>
      </div>
      <div class="btn-control out-btn-control">
        <button 
        class="btn-status"
        @click='destroyModalF'>
          Отмена
        </button>
        <button class="btn-status btn-black"
          @click='start'>
            В производство
        </button>
      </div>
    </div>
  </div>
  <InformFolder  
    :title='titleMessage'
    :message = 'message'
    :type = 'type'
    v-if='showInformPanel'
    :key='keyInformTip'
    />
</div>
</template>

<script>
import { showMessage } from '@/js/';
import {random} from 'lodash';
import InformFolder from '@/components/InformFolder.vue';
import { mapActions} from 'vuex'
export default {
  props: ['parametrs'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',

      message: '',
      type: '',
      showInformPanel: false,
      keyInformTip: random(1, 999),
      
      date_order: '',
      number_order: '',
      date_shipments: '',
      description: '',
      kolvo_order_buyer: 0,
      kolvo_all: 0,

      komplect: []
    }
  },
  components: {InformFolder},
  methods: {
    ...mapActions(['fetchCreateAssemble', 'fetchCreateMetaloworking']),
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
    },
    start() {
      if(!this.$props.parametrs || !this.$props.parametrs.shipments || !this.$props.parametrs.izd)
        return showMessage('', 'Сначала выберите изделие', 'w', this)

      const data = {
        date_order: this.date_order,
        number_order: this.number_order,
        date_shipments: this.date_shipments,
        description: this.description,
        shipments_id: this.$props.parametrs.shipments.id,
        kolvo_order_byer: this.$props.parametrs.kolvo_order_byer,
        kolvo_all: Number(this.$props.parametrs.kolvo_all)
      }

      if(this.$props.parametrs.type == 'cb') {
        this.fetchCreateAssemble({
          ...data,
          cbed_id: this.$props.parametrs.izd.id
        }).then(res => this.endResult(res))
      }
      if(this.$props.parametrs.type == 'det') {
        this.fetchCreateMetaloworking({
          ...data,
          detal_id: this.$props.parametrs.izd.id
        }).then(res => this.endResult(res))
      }
    },
    endResult(res) {
      if(res) {
        this.destroyModalF()
        return showMessage('', 'Изделие отправлено в производство', 's', this)
      } else return showMessage('', 'Произошла ошибка...', 'e', this)
    }
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;' 

    if(this.$props.parametrs && this.$props.parametrs.shipments) {
      if(!Number(this.$props.parametrs.kolvo_all)) {
        setTimeout(() => this.destroyModalF(), 2000)
        return showMessage('', 'Выбраннове количество должно быть числом и больше 0', 'w', this)
      }
        
      
      this.date_order = this.$props.parametrs.shipments.date_order
      this.number_order = this.$props.parametrs.shipments.number_order
      this.date_shipments = this.$props.parametrs.shipments.date_shipments
      this.description = this.$props.parametrs.shipments.description
    }
    if(this.$props.parametrs && this.$props.parametrs.izd) {
      let izd = this.$props.parametrs.izd
      if(izd.listCbed) {
        let cb = JSON.parse(izd.listCbed)
        for(let iz of cb) {
          this.komplect.push({
            type: 'СБ',
            art: iz.art,
            name: iz.cb.name,
            kol: iz.kol
          })
        }
      }
      if(izd.listDetal) {
        let cb = JSON.parse(izd.listDetal)
        for(let iz of cb) {
          this.komplect.push({
            type: 'Д',
            art: iz.art,
            name: iz.det.name,
            kol: iz.kol
          })
        }
      }
      if(izd.listPokDet) {
        let cb = JSON.parse(izd.listPokDet)
        for(let iz of cb) {
          this.komplect.push({
            type: 'ПД',
            art: iz.art,
            name: iz.mat.name,
            kol: iz.kol
          })
        }
      }
      if(izd.materialList) {
        let cb = JSON.parse(izd.materialList)
        for(let iz of cb) {
          this.komplect.push({
            type: 'РМ',
            art: iz.art,
            name: iz.mat.name,
            kol: iz.kol
          })
        }
      }
    }
  },
}
</script>

<style scoped>
.out-btn-control {
  width: 96%;
}
table{ 
  width: 100%;
  margin-bottom: 50px;
}
.block input {
  width: 50px;
}
.block * {
  margin: 3px;
}
.block {
  display: flex;
}
.block p {
  display: flex;
  align-items: center;
  font-size: 13px;
}
textarea {
  height: 130px;
}
</style>