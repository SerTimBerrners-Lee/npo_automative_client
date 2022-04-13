<template>
	<div>
		<h3>Комплектация производства - Заготовительная операция - Резка круга / профиля</h3>
		<!-- <div>
			<div class="block header_block">
				<DatePicterRange 
          @unmount='changeDatePicterRange'  
        />
				<div>
					<span>Быстрые фильтры: </span>
					<label for="process">По статусу "В процессе"</label>
					<input id='process' type="checkbox">
					<label for="not_zag">По статусу "Нет заготовки"</label>
					<input id='not_zag' type="checkbox" >
				</div>
			</div>
		</div> -->

    <!-- <div class='table_block'>
      <div class="table-scroll">
        <table>
          <tr>
            <th><unicon name="check" fill="royalblue" /></th>
            <th>Заказ покупателя из задач на отгрузку</th>
            <th>Дата отгрузки покупателю</th>
          </tr>
           <tr v-for='order of getShipments' :key='order'>
            <td class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
              <p class="checkbox_block" @click='e => toSetOrders(order, e.target)'></p>
            </td>
            <td>{{ order.number_order }}</td>
            <td>{{ order.date_shipments }}</td>
          </tr>
        </table>
      </div>
			<div class="scroll-table table_material" style='margin-left: 5px;'>
				<table>
					<tr>
						<th colspan='6'></th>
						<th colspan='3'>Заготовки по КД</th>
						<th colspan='3'>Заготовка выданная по факту</th>
						<th colspan='17'></th>
					</tr>
					<tr>
						<th>
							<unicon name="check" fill="royalblue" />
						</th> 
						<th>№ Заказа склада</th>
						<th>Артикул детали</th>
						<th>Наименование детали</th>
						<th>Кол-во Всего по заказу склад, шт</th>
						<th>Кол-во в т.ч. по заказу покупателя, шт.</th>
						<th>Тип заготовки</th>
						<th>Габариты заготовки, мм.</th>
						<th>Масса заготовки, кг</th>
						<th>Тип заготовки</th>
						<th>Габариты заготовки, мм</th>
						<th>Масса заготовки, кг</th>
						<th>Перерасход, кг</th>
						<th>Предыдущая операция</th>
						<th>Статус</th>
						<th>Сделано шт</th>
						<th>Осталось шт</th>
						<th>Норма времени на 1 шт., ч</th>
						<th>Дата исполнения </th>
						<th>Кол-во, шт.</th>
						<th>Ширина пропила, мм</th>
						<th>Норма расхода на 1 шт., кг</th>
						<th>Итого отходы, кг</th>
						<th>Исполнитель </th>
						<th>Следующая операция</th>
						<th>Документы</th>
						<th>Примечание</th>
						<th>Дата отметки</th>
						<th>Отметка о выполнении</th>
					</tr>
				</table>
			</div> 
		</div> -->
		
		<OpPgMetalloworking 
			v-if='showTableOperation'
			:type_operation_id='type_operation_id'
			:name_operaiton='name_operaiton'
		/>

		<div v-if='!type_operation_id' style='margin-top: 20px;'>
			Операций не найдено
		</div>
		
		<div class="btn-control">
			<button class="btn-small">Печать задания</button>
			<button class="btn-small btn-add">Создать накладную на передачу заготовок на металлообработку</button>
		</div> 

		<Loader v-if='loader' />
	</div>
</template>

<script> 
import { mapGetters, mapActions } from 'vuex';
import OpPgMetalloworking from '@/components/Metalloworking/table-operation.vue';
export default {
	data() {
		return {
			name_operaiton: '', 
			type_operation_id: null,
			showTableOperation: false,


			loader: false
		}
	},
	components: {OpPgMetalloworking},
	computed: mapGetters(['getTypeOperations']),
	methods: {
		...mapActions(['getAllTypeOperations']),

	},
	async mounted() {
		// Получить все операции найти тип с отметкой и тогда показать 
		this.loader = true
		await this.getAllTypeOperations()
		

		for(let item of this.getTypeOperations) {
			if(item.square) {
				this.type_operation_id = item.id
				this.name_operation = item.name
				this.showTableOperation = true
				break;
			}
		}
		this.loader = false
	}
}
</script>
