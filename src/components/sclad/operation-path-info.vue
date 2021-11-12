<template>
	<div v-if='operation_list.length'>
		<h3>Сборка</h3>
		<table class='table-end'>
			<tr>
				<th>№</th>
				<th>Операции</th>
				<th>Норма времени на 1 шт.,час</th>
				<th>Норма времени, итого</th>
				<th>Выполнено в н/ч</th>
				<th>Статус</th>
				<th>Сделано, шт.</th>
				<th>Осталось сделать, шт.</th>
				<th>Дата исполнения</th>
				<th>Кол-во сделано, шт.</th>
				<th>Исполнитель</th>
				<th>Примечание</th>
			</tr>
			<tbody  v-for='(operation, inx) of operation_list' :key='operation'>
				<tr>
					<td :rowspan='operation.marks ? operation.marks.length + 1 : 1'>{{ inx + 1 }}</td>
					<td :rowspan='operation.marks ? operation.marks.length + 1 : 1'>{{ operation.full_name }}</td>
					<td
						:rowspan='operation.marks ? operation.marks.length + 1 : 1'
						class='center'>{{ worksHors(operation) }}</td>
					<td 
						:rowspan='operation.marks ? operation.marks.length + 1 : 1'
						class='center'>{{ worksHors(operation, izdeles.shipments_kolvo)  }}</td>
					<td :rowspan='operation.marks ? operation.marks.length + 1 : 1' class='center'>
						{{ workingForMarks(operation, operation.marks) }}</td>
					<td 
						:rowspan='operation.marks ? operation.marks.length + 1 : 1'
						v-if='returnStatus(operation)'
						class='success_operation'
						>Готово</td>
					<td 
						:rowspan='operation.marks ? operation.marks.length + 1 : 1'
						v-else
						class='work_operation'
						>В процессе</td>
					<td 
						:rowspan='operation.marks ? operation.marks.length + 1 : 1'
						class='center'>{{ returnKolvoCreate(operation) }}</td>
					<td 
						:rowspan='operation.marks ? operation.marks.length + 1 : 1'
						class='center'>{{ returnKolvoBefore(operation) }}</td>
				</tr>
				<tr v-for='mark of operation.marks ? operation.marks : []' :key='mark'>
					<td class='center'>
						{{ mark.date_build }}
					</td>
					<td class='center'>
						{{ mark.kol }}
					</td>
					<td class='center'>
						{{ returnUser(mark.user_id) }}
					</td>
					<td class='center'>
						<img 
							src="@/assets/img/link.jpg" 
							@click='openDescription(mark.description)' 
							class='link_img' 
							atl='Показать' />
					</td>
				</tr>
			</tbody>
		</table>
		<DescriptionModal 
      v-if='show_des'
      :key='descriptionKey'
      :parametrs='description'
    />
	</div>
</template>

<script>
import DescriptionModal from '@/components/description-modal.vue';
import  { worksHors, workingForMarks }  from '@/js/operation.js';
import { mapActions, mapGetters } from 'vuex';
import { random } from 'lodash';
export default {
	props: ['tp', 'izdeles'],
	data() {
		return {
			description: '',
      descriptionKey: random(1, 999),
      show_des: false,

			operation_list: [],
		}
	},
	components: {DescriptionModal},
	computed: mapGetters(['getUsers']),
	methods: {
		...mapActions(['getAllUsers']),
		returnStatus(oper) {
      let creater = this.returnKolvoCreate(oper)
      if(creater)
        return 1
      else return 0
    },
    openDescription(des) {
      this.descriptionKey = random(1, 999)
      this.show_des = true
      this.description = des
    },
    worksHors(operation, kolvo_all = 1) {
      return worksHors(operation, kolvo_all)
    },
    workingForMarks(operation, marks) {
     return workingForMarks(operation, marks)
    },
    returnKolvoBefore(oper) {
      let create = this.returnKolvoCreate(oper)
      return this.$props.izdeles.kolvo_shipments - create < 0 ? 0 : this.$props.izdeles.kolvo_shipments - create
    },
    returnKolvoCreate(oper) {
      if(!oper.marks || !oper.marks.length) return 0
      let kol = 0
      for(let mark of oper.marks) {
        kol = kol + mark.kol
      }
      return kol
    },
    returnUser(user_id) {
      for(let user of  this.getUsers) {
        if(user.id == user_id) 
          return user.login
      }
    }
	},
	async mounted() {
		if(!this.$props.tp) return 0

    this.operation_list = this.$props.tp.operations
		await this.getAllUsers(true)
	}
}
</script>