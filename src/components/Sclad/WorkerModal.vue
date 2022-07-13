<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF('unmount')"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" >
      <h3>Заказ</h3> 
      <div class="block">
        <p class='tooltip'>
          <span>Дата заказа: <span style="font-weight: bold;">{{ date_order }}</span> </span>
        </p>
        <p class='tooltip'>
          <span>№ Заказа: <span style="font-weight: bold;">{{ number_order }}</span> </span>
        </p>
        <p>
          <span>Дата план. отгрузки: </span> 
          <DatePicterCustom
            @unmount='change_date_shipments' 
            :dateStart='date_shipments'
          />
        </p>
      </div>
      <div>
        <h3>Примечание</h3>
        <textarea  maxlength='250' v-model='description'></textarea>
      </div>
      <div>
        <h3>Комплектация ({{ worker.type == "metall" ? "Металлообработки" : "Сборки" }})</h3>
        <table>
          <tr>
            <th>№ Заказа</th>
            <th>Артикул</th>
            <th>Наименование</th>
            <th>Кол-во в задании</th>
            <th>Кол-во сделанных</th>
            <th>Перенести в архив</th>
          </tr>
          <tr 
            v-for='izd of komplect' 
            :key='izd'
            class='td-row'
            @dblclick='editWorksType(izd)'>
            <td class='center'>{{ izd.number_order }}</td>
            <td v-if='worker.type == "metall"'>{{ izd.detal?.articl }}</td>
            <td v-else>{{ izd.cbed?.articl }}</td>
            <td v-if='worker.type == "metall"'>{{ izd.detal?.name }}</td>
            <td v-else>{{ izd.cbed?.name }}</td>
            <td class='center'>{{ izd.kolvo_shipments }}</td>
            <td class='center'>{{ izd.kolvo_create }}</td>
            <td class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
              <p class="checkbox_block_del" @click='delPos(izd, "metall")'></p>
            </td>
          </tr>
        </table>
      </div>
      <div class="btn-control out-btn-control" v-if='type_open != "read"'>
        <button class="btn-status btn-black"
          @click='archeves'>
            {{ worker.ban ? "Вернуть из Архива" : "В Архив" }}
        </button>
        <button 
        class="btn-status"
        @click='destroyModalF'>
          Отмена
        </button>
        <button
          class="btn-status"
          @click='update'>
          Обновить
        </button>
      </div>
    </div>
  </div>
  <TreatmentEdit
    v-if='treatment'
    :type_treatment='type_treatment'
    :treatment='treatment'
    :key='treatment_key'
    @unmount_treatment='unmount_treatment'
  />
</div>
</template>
<script>
import { random } from 'lodash';
import { showMessage } from '@/js/';
import MixModal from '../../mixins/mixmodal';
import { mapActions, mapMutations} from 'vuex';
import DatePicterCustom from '@/components/DatePicter';
import TreatmentEdit from '@/components/Sclad/EditTreatment';

export default {
  props: {
    worker: {
      type: Object
    },
    type_open: {
      type: String
    }
  },
  data() {
    return {
      date_order: '',
      number_order: '',
      description: '',
      date_shipments: '',

      komplect: [],

      type_treatment: null,
      treatment: null,
      treatment_key: random(1, 999),
    }
  },
  mixins: [MixModal],
  components: {
    DatePicterCustom,
    TreatmentEdit
  },
  methods: {
    ...mapActions([
      'fetchBannedWorkers',
      'fetchUpdateWorking',
      'fetchMetalloworkingDelete',
    ]),
    ...mapMutations([
      'deleteOneWorkign',
    ]),
    change_date_shipments(date) {
      this.date_shipments = date;
    },
    unmount_treatment() {
      this.$emit('unmount_working', this.worker.id);
      this.treatment = null;
      this.type_treatment = null;
    },
    async delPos(pos, type) {
      if (type == 'metall') {
        const res = await this.fetchMetalloworkingDelete(pos.id);
        if (res) {
          this.komplect = this.komplect.filter(el => el.id !== pos.id);
          return showMessage('', 'Металлообработка перенесана в архив', 's');
        } else showMessage('', 'Произошла ошибка', 'e');
      }
    },
    editWorksType(work) {
      this.treatment = work;
      this.type_treatment = this.worker.type;
      this.treatment_key = random(1, 999);
    },
    endResult(res) {
      if (!res) return showMessage('', 'Произошла ошибка...', 'e');

      this.destroyModalF();
      return showMessage('', `Заказа №${this.number_order} отправлен в производство`, 's');
    },
    async update() {
      const res = await this.fetchUpdateWorking({
        id: this.worker.id,
        date_shipments: this.date_shipments,
        description: this.description,
      });
      if (res) return showMessage('', 'Обновлено', 's');
    },
    init() {
      this.date_order = this.worker.date_order;
      this.number_order = this.worker.number_order;
      this.description = this.worker.description;
      this.date_shipments = this.worker.date_shipments;

      if (this.worker.type == "metall") this.komplect = this.worker.metall;
      else this.komplect = this.worker.assemble;
    },
    async archeves() {
      if (!this.worker.id) return false;

      await this.fetchBannedWorkers(this.worker.id);
      if (!this.worker.ban)
        this.deleteOneWorkign(this.worker.id);

      this.$emit('unmount_working', this.worker.id);
    }
  },
  async mounted() {
    if (!this.worker) return this.destroyModalF();
    this.init();
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