<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF('unmount')"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" >
      <h3>Запустить в производство</h3> 
      <div class="block">
        <p class='tooltip'>
          <span>Дата заказа: <span style="font-weight: bold;">{{ date_order }}</span> </span>
          <span class="tooltiptext">{{ date_order }}</span>
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
        <h3>Комплектация</h3>
        <table>
          <tr>
            <th>Тип</th>
            <th>Артикул</th>
            <th>Наименование</th>
            <th>Кол-во по заказам покупателя</th>
            <th>Рекомендация к заказу</th>
            <th>Свое кол-во</th>
          </tr>
          <tr v-for='(izd, idx) of komplect' :key='idx'>
            <td class='center' v-if='parametrs.type == "cbed"'>СБ</td>
            <td class='center' v-if='parametrs.type == "det"'>Д</td>
            <td class='center' v-if='parametrs.type == "prod"'>И</td>
            <td>{{ izd.articl }}</td>
            <td>{{ izd.name }}</td>
            <td class='center'>{{ izd.shipments_kolvo }}</td>
            <td class='center'>{{ izd.min_remaining * 3 + izd.shipments_kolvo }}</td>
            <td class='center input__td'>
              <input 
                type="number" 
                v-model="izd.my_kolvo"
                @change="e => changeKolvo(idx, e.target.value)"></td>
          </tr>
        </table>
      </div>
      <div class="btn-control out-btn-control wh_80p">
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
</div>
</template>
<script>
import { mapActions} from 'vuex';
import { showMessage } from '@/js/';
import MixModal from '@/mixins/mixmodal';
import DatePicterCustom from '@/components/DatePicter';

export default {
  props: ['parametrs'],
  data() {
    return {
      date_order: new Date().toLocaleDateString("ru-RU"),
      number_order: '',
      description: '',
      date_shipments: new Date().toLocaleDateString("ru-RU"),

      komplect: []
    }
  },
  components: {
    DatePicterCustom
  },
  mixins: [MixModal],
  methods: {
    ...mapActions([
      'fetchCreateWorking',
      'fetchWorkingsCount'
    ]),
    change_date_shipments(date) {
      this.date_shipments = date;
    },
    changeKolvo(idx, value) {
      const val = Number(val) > 0 || 1;
      this.komplect[idx].my_kolvo = value;
    },
    start() {
      if (!this.$props.parametrs || !this.$props.parametrs.izd)
        return showMessage('', 'Сначала выберите изделие', 'w');

      const workers_data = {
        date_order: this.date_order,
        number_order: this.number_order,
        description: this.description,
        date_shipments: this.date_shipments,
        type: this.$props.parametrs.type
      };
      const data = {};
      const working = [];

      for (const komplect of this.komplect) {
        if (komplect.my_kolvo == 0) continue;
        data['my_kolvo'] = komplect.my_kolvo;
        data['shipments_kolvo'] = komplect.shipments_kolvo;
        if (this.$props.parametrs.type == 'cbed' || this.$props.parametrs.type == 'prod') {
          working.push({
            ...data,
            cbed_id: komplect.id,
          });
        } else if (this.$props.parametrs.type == 'det') {
          working.push({
            ...data,
            detal_id: komplect.id,
          });
        }
      }

      if (!working.length) 
        return showMessage('', 'Комплектация не определена', 'w');

      this.fetchCreateWorking({ workers_complect: working, workers_data})
        .then(res => this.endResult(res));
    },
    endResult(res) {
      if (!res) return showMessage('', 'Произошла ошибка...', 'e');
      this.destroyModalF('unmount', true);
      return showMessage('', `Заказа №${this.number_order} отправлен в производство`, 's');
    },
  },
  async mounted() {
    if (!this.$props.parametrs) return this.destroyModalF();

    this.komplect = this.$props.parametrs.izd;
    for (const item of this.komplect) {
      if (!item.my_kolvo || item.my_kolvo < 1) 
        item.my_kolvo = item.min_remaining;
    }
    const count = await this.fetchWorkingsCount() || new Date().getTime();
    this.number_order = this.date_order.slice(this.date_order.length-2) + "-" + (count.count + 1);
  },
}
</script>

<style scoped>
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
.input__td>input {
  width: 45px;
}
</style>