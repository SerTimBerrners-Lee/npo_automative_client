<template>
  <div> 
    <h3>Заказано у поставщиков</h3>
    <div>
      <div class="block header_block">
        <DatePicterRange 
          @unmount='changeDatePicterRange'  
        />
      </div>
    </div>

    <MiniNavigation 
      @unmount='filterType' 
      :arrData='[
        "От Поставщика",
        "Только Сборки",
        "Только Металлообработка",
        !arhives ? "Архив" : "Не Архив"
      ]' />

    <div style='width: fit-content;'>
      <div class="scroll-table" style='width: 99%; height: 550px;'>
        <table>
          <tr class='fixed_table_10'>
            <th>№ Заказа</th>
            <th>Дата создания</th>
            <th>Наименование поставщика</th>
            <th>№ счета и Дата</th>
            <th>Сумма, руб.</th>
            <th>Дата прихода</th>
            <th>Статус</th>
            <th>Подробнее</th>
          </tr>
          <tbody
            v-for='order of getAllDeliveries' 
            :key="order">
            <tr 
              class='td-row' 
              v-if='show_dev'
              @click='e => selectOrder(order, e.target.parentElement)'>
              <td class='center'>{{ order.name }}</td>
              <td>{{ order.date_create }}</td>
              <td>{{ order.provider ? order.provider.name : 'Нет поставщика' }}</td>
              <td>{{ order.number_check }}</td>
              <td>{{ order.count }}</td>
              <td>{{ order.date_shipments }}</td>
              <td>Заказано</td>
              <td class='center tooltip' @mousemove="getDetals(order)">
                <div class="tooltiptext">
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
                      v-for='material of detals_order'
                      :key='material'
                      class='td-row'>
                      <td>{{ material.art }}</td>
                      <td>{{ material.name }}</td>
                      <td>
                        <span v-if='material.ez == 1'>шт</span>
                        <span v-if='material.ez == 2'>л</span>
                        <span v-if='material.ez == 3'>кг</span>
                        <span v-if='material.ez == 4'>м</span>
                        <span v-if='material.ez == 5'>м.куб</span>
                      </td>
                      <td>{{ material.kol }}</td>
                      <td
                        class='tooltip'> {{ material.sum }}
                        <span class="tooltiptext" >Общая сумма: {{ Number(material.kol) * Number(material.sum)  }}</span>
                      </td>
                      <td>{{ material.description }}</td>
                    </tr>
                  </table>
                </div>
                <img src="@/assets/img/link.jpg" class='link_img' atl='Показать' />
              </td>
            </tr>
          </tbody>
          
          <!-- Assemblye-->
          <tbody v-for='ass of assembles' :key='ass'>
            <tr 
              class='td-row' 
              v-if='show_ass'
              @click='openWorkers(ass)'>
              <td class='center'>{{ ass.number_order }}</td> <!-- Номер заказа -->
              <td class='center'>{{ ass.date_order }}</td> <!-- Дата заказа -->
              <td class='center'>Сборка</td> <!-- Поставщик -->
              <td class='center'>{{ ass.date_order }}</td> <!-- Номер счета и дата -->
              <td class='center'>-</td> <!-- Сумма -->
              <td class='center'>-</td> <!-- Дата прихода -->
              <td> В работе </td> <!-- Статус -->
              <td class='center tooltip'> <!-- Подробнее -->
                <div class="tooltiptext">
                  <table>
                    <tr>
                      <th>Артикул</th>
                      <th>Наименование</th>
                      <th>Кол-во</th>
                      <th>Примечание</th>
                    </tr>
                    <tbody>
                      <tr v-for='assm of ass.assemble' :key='assm'>
                        <td>{{ assm.cbed?.articl }}</td>
                        <td>{{ assm.cbed?.name }}</td>
                        <td>{{ assm.kolvo_shipments }}</td>
                        <td>{{ assm.description }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <img src="@/assets/img/link.jpg" class='link_img' atl='Показать' />
              </td>
            </tr>
          </tbody>
          <!-- Metalloworking-->
          <tbody v-for='metal of metalloworkings' :key='metal'>
            <tr 
              class='td-row' 
              v-if='show_metall'
              @click='openWorkers(metal)'>
              <td class='center'>{{ metal.number_order }}</td> <!-- Номер заказа -->
              <td class='center'>{{ metal.date_order }}</td> <!-- Дата заказа -->
              <td class='center'>Металлообработка </td> <!-- Поставщик -->
              <td class='center'>{{ metal.date_order }}</td> <!-- Номер счета и дата -->
              <td class='center'>-</td> <!-- Сумма -->
              <td class='center'>-</td> <!-- Дата прихода -->
              <td> В работе </td> <!-- Статус -->
              <td class='center tooltip'> <!-- Подробнее -->
                <div class="tooltiptext">
                  <table>
                    <tbody>
                      <tr>
                        <th>Артикул</th>
                        <th>Наименование</th>
                        <th>Кол-во</th>
                        <th>Примечание</th>
                      </tr>
                    </tbody>
                    <tbody v-for='metall of metal.metall' :key='metall'>
                      <tr>
                        <td>{{ metall.detal?.articl }}</td>
                        <td>{{ metall.detal?.name }}</td>
                        <td>{{ metall.kolvo_shipments }}</td>
                        <td>{{ metall.description }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <img src="@/assets/img/link.jpg" class='link_img' atl='Показать' />
              </td>
            </tr>
          </tbody>
      </table>
      </div>
      <div class='btn-control'>
        <button class="btn-small btn-add" @click='addOrder'> Создать заказ </button>
      </div>
    </div>
    <AddOrder
      v-if='showAddOrder'
      :key='AddOrderKey'
      @unmount='unmount_order'
      :order_parametr='order_parametr'
    />
    <ShipmentsModal 
      :shipments='shipments'
      v-if='shipments.length'
      :key='shipmentKey'
    />
    <WorkerModal
      :worker='select_worker'
      v-if='show_worker && select_worker'
      :key='key_worker'
      @unmount_working='unmount_working'
    />
    <Loader v-if='loader' />
  </div>
</template>
<script>
import { random } from 'lodash';
import AddOrder from './AddOrder';
import WorkerModal from '../WorkerModal';
import { eSelectSpan } from '@/js/methods';
import { comparison, showMessage } from '@/js/'; 
import DatePicterRange from '@/components/DatePicterRange';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import ShipmentsModal from '@/components/Sclad/ShipmentsToIzed';

export default {
	data() {
		return {
      showAddOrder: false,
      AddOrderKey: random(1, 999),
 
      detals_order: [],
      span: null,
      order: null,
      order_parametr: null,

      loader: false,

      shipments: [],
      shipmentKey: random(1, 999),

      assembles: [],
      metalloworkings: [],

      show_dev: true,
      show_ass: true,
      show_metall: true,

      select_worker: null,
      show_worker: false,
      key_worker: random(1, 999),
      arhives: false,
		}
	},
  computed: mapGetters([
    'getAllDeliveries', 
    'getAssembles', 
    'getMetaloworkings',
    'getWorkings'
  ]),
	components: {
    AddOrder,
    DatePicterRange,
    ShipmentsModal,
    WorkerModal,
  },
	methods: { 
    ...mapActions([
      'fetchGetDeliveries',
      'fetchAssemble',
      'fetchMetaloworking',
      'fetchAllWorkings',
      'fetchOneWorking'
    ]),
    ...mapMutations(['deleteOneWorkign']),
    unmount_order() {
      this.fetchGetDeliveries();
      this.order_parametr = null;
    },
    async unmount_working(_id) {
      if (!_id) return false;
      this.deleteOneWorkign(_id);
      const works = await this.fetchOneWorking(_id);
      this.openWorkers(works);

      this.sortWorkers();
    },
    returnShipmentsDateModal(shipments) {
      if(!shipments || shipments.length == 0) return showMessage('', 'Нет заказов', 'i');
      this.shipmentKey = random(1, 999);
      this.shipments = shipments;
    },
    addOrder() {
      this.showAddOrder = true;
      this.AddOrderKey = random(1, 999);
      
      this.order_parametr = null;
    },
    getDetals(order) {
      if (order.product) {
        try {
          const prod = JSON.parse(order.product);
          this.detals_order = prod;
        } catch (e) {console.error(e)}
      }
    },
    selectOrder(order, span) {
      console.log(order);
      this.order = order;
      this.span = eSelectSpan(this.span, span);
    },
    changeDatePicterRange(val) {
      console.log(val);
    },
    returnShipmentsKolvo(shipments) {
      if (!shipments || shipments.length == 0) return '-';
      let end_date = shipments[0];
      for (const ship1 of shipments) {
        for (const ship2 of shipments) {
          if (comparison(ship1.date_shipments, ship2.date_shipments, '<')) 
            end_date = ship1;
        }
      }
      return end_date
    },
    filterType(number) {
      switch(number) {
        case 1:
          this.show_dev = true;
          this.show_ass = true;
          this.show_metall = true;
          break;
        case 2: 
          this.show_dev = true;
          this.show_ass = false;
          this.show_metall = false;
          break;
        case 3:
          this.show_dev = false;
          this.show_ass = true;
          this.show_metall = false;
          break;
        case 4: 
          this.show_dev = false;
          this.show_ass = false;
          this.show_metall = true;
          break;
        case 5: // Получаем архив и заменяем все на Архив
          this.arhives = !this.arhives;
          this.getArchives();
          this.filterType(1);
          break;
      }
    },
    async getArchives() {
      this.loader = true;
      await this.fetchAllWorkings(this.arhives);
      this.sortWorkers();
      this.loader = false;
    },
    openWorkers(obj) {
      this.select_worker = obj;
      this.show_worker = true;
      this.key_worker = random(1, 999);
    },
    sortWorkers() {
      this.assembles = this.getWorkings.filter(el => el.type == 'ass' && el.ban == this.arhives);
      this.metalloworkings = this.getWorkings.filter(el => el.type == 'metall' && el.ban == this.arhives);
    }
	},
	async mounted() {
    this.loader = true;
    await this.fetchGetDeliveries();
    await this.fetchAllWorkings();

    this.sortWorkers();

    this.loader = false;
	}
}
</script>

<style scoped>
.tooltiptext {
  margin-top: 40px;
}
</style>