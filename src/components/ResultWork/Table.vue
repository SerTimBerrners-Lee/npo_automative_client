<template>
  <div class="block header_block">
    <DatePicterRange 
      @unmount='changeDatePicterRange'
      v-if='!loader' 
    />
    <span>Кол-во рабочих дней в период:</span>
    <input type="text">
  </div>

  <div v-if='!loader'>
    <div class="table-scroll" style='margin-left: 5px;'>
      <table>
        <tr>
          <th scope="col" colspan="11"></th>
          <th scope="col" colspan="3">За 1 шт.</th>
          <th scope="col" colspan="3">За партию</th>
          <th scope="col" colspan="7"></th>
        </tr>
        <tr>
          <th>№</th>
          <th>Табельный номер</th>
          <th>Сотрудник</th>
          <th>Дата</th>
          <th>Наименование действий (выполнение задания, выполнение операции с производства или сборки, действия в ПО Конструктор - создал, изменил и т.д.)</th>
          <th>Тип</th>
          <th>Артикул</th>
          <th>Наименование</th>
          <th>Заказ</th>
          <th>Примечание</th>
          <th>Кол-во, шт.</th>
          <th>Подготовит-е время, н.ч.</th>
          <th>Вспомогат-е время, н.ч.</th>
          <th>Машинное время, н.ч.</th>
          <th>Подготовит-е время, н.ч.</th>
          <th>Вспомогат-е время, н.ч.</th>
          <th>Машинное время, н.ч.</th>
          <th>Всего, н.ч.</th>
          <th>Задания, н.ч.</th>
          <th>План за день, н.ч.</th>
          <th>Итого по сотруднику за день</th>
          <th>План за период, н.ч.</th>
          <th>Итого по сотруднику за период, н.ч.</th>
          <th>Потери выработки за период, н.ч.</th>
        </tr>
        <tr v-for='(met, idx) of metall' :key='met.id'>
          <td class='center'><string>{{ idx + 1 }}</string></td>  
          <td class='center'>{{ userObject(met?.mark?.user_id)?.tabel }}</td>
          <td>{{ userObject(met?.mark?.user_id)?.login }}</td>
          <td>{{ met?.mark.date_build }}</td>
          <td>{{ met?.full_name }}</td>
          <td class='center'>Д</td>
          <td>{{ met?.detal?.articl }}</td>
          <td>{{ met?.detal?.name }}</td>
          <td class='center'>{{ met?.number_order }}</td>
          <td>{{ met?.mark.description }}</td>
          <td class='center'>{{ met?.mark.kol }}</td>
          <td class='center'>{{ getTime(met).pt }}</td>
          <td class='center'>{{ getTime(met).ht }}</td>
          <td class='center'>{{ getTime(met).mt }}</td>
          <td class='center'>{{ getTime(met).pt * met.kolvo_shipments }}</td>
          <td class='center'>{{ getTime(met).ht * met.kolvo_shipments }}</td>
          <td class='center'>{{ getTime(met).mt * met.kolvo_shipments }}</td>
          <td class="center">{{ getTime(met).pt + ((Number(getTime(met).ht) + Number(getTime(met).mt)) * met?.mark.kol) }}</td>
        </tr>

        <tr>
          <th scope="col" colspan="20"></th>
          <th>Итого, н.ч.</th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </table>
    </div>
    <div class="btn-control">
      <button class="btn-small">Печать</button>
    </div>

    <Loader v-if='loader' />
  </div>
</template>

<script>
import { OperationTime } from '@/js/operation';
import DatePicterRange from '@/components/DatePicterRange';
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  props: {
    metall: [],
    assemply: [],
  },
  data() {
    return {
      loader: true,
    }
  },
  components: { DatePicterRange },
  computed: mapGetters(['getUsers']),
  methods: {
    ...mapActions(['getAllUsers']),
    ...mapMutations(['filterRangeResultM']),
    userObject(id) {
      for (const user of this.getUsers) {
        if (user.id == id) return user;
      }
      return null
    },
    getTime(operation) {
			if (!operation) return { pt: 0, ht: 0, mt: 0 };
			const ot = new OperationTime(operation);
			return ot;
		},
    changeDatePicterRange(val) {
      this.filterRangeResultM(val);
    }
  },
  async mounted() {
    this.loader = true;

    await this.getAllUsers(true);

    this.loader = false;
  }
}
</script>