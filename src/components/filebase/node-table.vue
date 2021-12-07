<template>
  <div class="right-div-bfp">
    <h3>Принадлежность</h3>
    <div class="block scroll-table node_item">
      <h3 class="link_h3" @click='showIzd = !showIzd'>Изделие
        {{ file.products ? file.products.length : '' }} </h3>
      <div class="scroll-table table-fbp" v-if='showIzd'>
        <table>
          <tr>
            <th>Артикул </th>
            <th>Наименование</th>
          </tr>
          <tr v-for='product in file.products' 
            :key="product"
            class="td-row"
          >
            <td>{{ product.articl }}</td>
            <td>{{ product.name }}</td>
          </tr>
          <tr class="td-row">
            <td>...</td>
            <td>...</td>
          </tr>
        </table>
      </div>
      <h3 class="link_h3" @click='showSB = !showSB'>Сборочная единица
        {{ file.cbeds ? file.cbeds.length : '' }} </h3>
      <div class="scroll-table table-fbp" v-if='showSB'>
        <table>
          <tr class="td-row">
            <th>Артикул </th>
            <th>Наименование</th>
          </tr>
          <tr v-for='cbed in file.cbeds' 
            :key="cbed"
            class="td-row"
          >
            <td>{{ cbed.articl }}</td>
            <td>{{ cbed.name }}</td>
          </tr>
          <tr class="td-row">
            <td>...</td>
            <td>...</td>
          </tr>
        </table>
      </div>
      <h3 class="link_h3" @click='showDetal = !showDetal'>
        Деталь {{ file.detals ? file.detals.length : '' }} </h3>
      <div class="scroll-table table-fbp" v-if='showDetal'>
        <table>
          <tr class="td-row">
            <th>Артикул </th>
            <th>Наименование</th>
          </tr>
          <tr v-for='detal in file.detals' 
            :key="detal"
            class="td-row"
            @click='e => setDetals(detal, e.target.parentElement)'
          >
            <td>{{ detal.articl }}</td>
            <td>{{ detal.name }}</td>
          </tr>
          <tr class="td-row">
            <td>...</td>
            <td>...</td>
          </tr>
        </table>
      </div>

      <h3 class="link_h3" @click='showMat = !showMat'>
        Материал {{ file.materials ? file.materials.length : '' }} </h3>
      <div class="scroll-table table-fbp" v-if='showMat'>
        <table>
          <tr class="td-row">
            <th>Наименование</th>
          </tr>
          <tr v-for='material in file.materials' 
            :key="material"
            class="td-row"
            @click='e => setTr(e.target.parentElement)'
          >
            <td>{{ material.name }}</td>
          </tr>
          <tr class="td-row">
            <td>...</td>
          </tr>
        </table>
      </div>

      <h3 class="link_h3" @click='showEQ = !showEQ'>
        Оборудование {{ file.equipments ? file.equipments.length : '' }} </h3>
      <div class="scroll-table table-fbp" v-if='showEQ'>
        <table>
          <tr class="td-row">
            <th>Наименование</th>
          </tr>
          <tr v-for='equipment in file.equipments' 
            :key="equipment"
            class="td-row"
            @click='e => setEq(equipment, e.target.parentElement)'
          >
            <td>{{ equipment.name }}</td>
          </tr>
          <tr class="td-row">
            <td>...</td>
          </tr>
        </table>
      </div>

      <h3 class="link_h3" @click='showProvider = !showProvider'>
        Поставищики {{ file.providers ? file.providers.length : '' }} </h3>
      <div class="scroll-table table-fbp" v-if='showProvider'>
        <table>
          <tr class="td-row">
            <th>Наименование</th>
          </tr>
          <tr v-for='provider in file.providers' 
            :key="provider"
            class="td-row"
            @click='e => setProvider(provider, e.target.parentElement)'
          >
            <td>{{ provider.name }}</td>
          </tr>
          <tr class="td-row">
            <td>...</td>
          </tr>
        </table>
      </div>

      <h3 class="link_h3" @click='showUsers = !showUsers'>
        Пользователи {{ file.users ? file.users.length : '' }} </h3>
      <div class="scroll-table table-fbp" v-if='showUsers'>
        <table>
          <tr class="td-row">
            <th>Инициалы</th>
          </tr>
          <tr v-for='user in file.users' 
            :key="user"
            class="td-row"
            @click='e => setTr(e.target.parentElement)'
          >
            <td>{{ user.initial }}</td>
          </tr>
          <tr class="td-row">
            <td>...</td>
          </tr>
        </table>
      </div>

      <h3 class="link_h3" @click='showInstrument = !showInstrument'>
        Инструмент и оснатка {{ file.instrument ? file.instrument.length : '' }} </h3>
      <div class="scroll-table table-fbp" v-if='showInstrument'>
        <table>
          <tr class="td-row">
            <th>Инициалы</th>
          </tr>
          <tr v-for='instr in file.instrument' 
            :key="instr"
            class="td-row"
            @click='e => setTr(e.target.parentElement)'
          >
            <td>{{ instr.name }}</td>
          </tr>
          <tr class="td-row">
            <td>...</td>
          </tr>
        </table>
      </div>

      <h3 class="link_h3" @click='showInventary = !showInventary'>
        Техника и Инвентарь  {{ file.inventary ? file.inventary.length : '' }} </h3>
      <div class="scroll-table table-fbp" v-if='showInventary'>
        <table>
          <tr class="td-row">
            <th>Инициалы</th>
          </tr>
          <tr v-for='inv in file.inventary' 
            :key="inv"
            class="td-row"
            @click='e => setTr(e.target.parentElement)'
          >
            <td>{{ inv.name }}</td>
          </tr>
          <tr class="td-row">
            <td>...</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="btn-control">
      <button class="btn-small">
        Сохранить в виде отчета EXEL
      </button>
    </div>
    <DetalModal
      :key='detalModalKey'
      :id='parametrs_detal'
      v-if='parametrs_detal'
    />
    <EquipmentModal
      :key='eqModalKey'
      v-if='eq_modal_id'
      :id='eq_modal_id'
    />
    <ShowProvider
      :allProvider='provider' 
      :key='keyProvidersModal'
      v-if='provider'
    /> 
</div>
</template>
<script>
import { random } from 'lodash';
import DetalModal from '@/components/basedetal/detal-modal.vue';
import EquipmentModal from "@/components/equipment/modal-information.vue"
import ShowProvider from '@/components/baseprovider/all-fields-provider.vue';
export default {
  props: ['file'],
  data() {
    return {
      showIzd: false,
      showSB: false,
      showDetal: false,
      showMat: false,
      showEQ: false,
      showProvider: false,
      showUsers: false,
      showInstrument: false,
      showInventary: false,

      tr: null,

      detalModalKey: random(1, 999),
      parametrs_detal: null,

      eqModalKey: random(1, 999),
      eq_modal_id: null,

      keyProvidersModal: random(10, 999),
      provider: null
    }
  },
  components: {DetalModal, EquipmentModal, ShowProvider},
  methods: {
    setDetals(detal, e) {
      this.setTr(e)
      this.parametrs_detal = detal.id
			this.detalModalKey = random(1, 999)
    },
    setEq(eq, e) { 
      this.setTr(e)
      this.eq_modal_id = eq.id;
      this.eqModalKey = random(1, 999)
    },
    setProvider(provider, e) {
      this.setTr(e)
      this.provider = [provider]
      this.keyProvidersModal = random(1, 999)
    },
    setTr(e) {
      if(this.tr) 
        this.tr.classList.remove('td-row-all')
      this.tr = e
      this.tr.classList.add('td-row-all')
    }
  }
}
</script>
<style scoped>
.right-div-bfp {
  width: 414px;
  margin-left: 10px;
}
th {
  width: 350px;
}
.node_item {
  width: 400px;
  height: 700px;
}
.table-fbp {
  width:100%;
  max-height: 250px;
  height: auto;
}
</style>