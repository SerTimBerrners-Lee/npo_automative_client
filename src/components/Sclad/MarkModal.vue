<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF('unmount', 'closed')"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens" >
				<h3>Отметка о выполнении</h3>
				<div class='head_block'>
					<div class='first_b'>
						<p>
							<span>{{ type_izd == 'cb' ? 'СБ:' : 'Д' }} </span>
							<span style='font-weight: bold; margin-left: 10px;'>{{ obj_name }}</span>
						</p>
						<p class='flex_p'>
							<span>Дата отметки: </span>
							<span>{{ new Date().toLocaleString('ru-RU').split(',')[0] }}</span>
						</p>
					</div> 
					<p>
						<span>Операция: </span>
						<span class='small_hide'>{{ obj_before }} ></span>
						<span style='font-weight: bold;'>{{ obj_curent }} ></span>
						<span class='small_hide'>{{ obj_after }}</span>
					</p>
					<p>
						<span>Выполнено: </span>
						<span style='font-weight: bold;'>{{ obj_kolvo_create_in_operation }} из {{obj_kolvo_all}}</span>
					</p>
				</div>

				<h3>Поля для заполнения</h3>
				<div>
					<p class='flex_p'>
						<span style='font-weight: bold;'>Дата исполнения:</span>
						<DatePicterCustom 
							@unmount='change_date_picter' 
							:dateStart='date'
						/>
					</p>
					<p>
						<span style='font-weight: bold;'>Исполнитель:</span>
						<select 
              class="select-small sle"  
              v-model='user_id'>
              <option 
                v-for='user in getUsers' 
                :key='user' 
                :value='user.id'>{{ user.login }}</option>
            </select> 
					</p>
					<p>
						<span style='font-weight: bold;'>Количество выполненных {{ type_izd == "det" ? "деталей" :"сборочных едениц" }}:</span>
						<input type="number" :min='min_det' :max='obj_max_det' v-model='kol'>
					</p>
				</div>

        <h3>Примечание</h3>
        <textarea maxlength='250' v-model='description'></textarea>

				<div class="btn-control out-btn-control">
					<button 
						class="btn-status btn-black"
						@click='save'>
						Сохранить Отметку
					</button>
				</div>
      </div>
    </div>
		<Loader v-if='loader' />
  </div>
</template>
<script>
import { showMessage } from '@/js';
import MixModal from '@/mixins/mixmodal';
import { mapActions, mapGetters } from 'vuex';
import DatePicterCustom from '@/components/DatePicter';
import { afterAndBeforeOperation, returnKolvoCreate } from '@/js/operation';

export default {
  props: ['parametrs', 'type_izd'],
  data() {
    return {
			loader: false,

			obj_name: null,
			obj_max_det: 1,
			obj_before: '',
			obj_curent: '',
			obj_after: '',
			obj_kolvo_create_in_operation: 0,
			obj_kolvo_all: 0,
			min_det: 1,
			assemble_id: null,
			metaloworking_id: null,

			description: '',
			user_id: 1,
			kol: 1,
			date: new Date().toLocaleDateString("ru-RU"),
			operation_id: null
    }
  },
	computed: mapGetters(['getUsers', 'getTypeOperations']),
	components: { DatePicterCustom },
	mixins: [MixModal],
  methods: {
		...mapActions([
			'getAllUsers',
			'getAllTypeOperations',
			'fetchCreateMarks'
		]),
		change_date_picter(date) {
			this.date = date;
		},
		async save() {
			if (!this.min_det) return showMessage('', 'Вы выполнили все', 'w');
			const data = {
				date_build: this.date,
				kol: this.kol,
				description: this.description,
				user_id: this.user_id,
				oper_id: this.operation_id,
				assemble_id: this.assemble_id,
				metaloworking_id: this.metaloworking_id
			}

			const res = await this.fetchCreateMarks(data);
			this.destroyModalF();
			this.$emit('unmount', res);
		},
		showOperationStep(obj) {
			this.obj_curent = `${obj.name}. ${obj.full_name}`;
			const res = afterAndBeforeOperation(obj.tech_process, obj.operation_id);
			if (res) {
				if (res.before)
					if (res.before.id != obj.name)
						this.obj_before =  `${res.before.name}. ${res.before.full_name}`;
				if (res.after) 
					if (res.after.id != obj.operation_id)
						this.obj_after = `${res.after.name}. ${res.after.full_name}`;
			}
		}
  },
  async mounted() {
		this.loader = true;
		await this.getAllUsers(true);
		await this.getAllTypeOperations();

		if (this.$props.parametrs) {
			const izd = this.$props.parametrs;
			if (this.$props.type_izd == 'cb') {
				this.obj_name = izd.cbed.name;
				this.assemble_id = izd.id;
			} else {
				this.obj_name = izd.detal.name;
				this.metaloworking_id = izd.id;
			}

			this.obj_max_det = izd.kolvo_shipments - returnKolvoCreate(izd);
			this.obj_kolvo_create_in_operation = returnKolvoCreate(izd);
			this.obj_kolvo_all = izd.kolvo_shipments;
			this.operation_id = izd.operation_id;
			this.showOperationStep(izd);
			
			if (this.obj_max_det <=0) this.min_det = 0;
		}
		this.loader = false;
  },
}
</script>

<style scoped>
textarea {
  height: 130px;
  width: 99%;
}

.head_block {
  display: flex;
  background: #c1c1c1c0;
  padding-left: 10px;
  padding-right: 10px;
	flex-direction: column;
	border-radius: 3px;
}
.first_b {
	display: flex;
	justify-content: space-around;
}
.first_b>p {
	width: 50%;
}
.out-btn-control {
	position: fixed;
	bottom: 10px;
	width: 28%;
}
input[type='number'] {
	width: 30px;
}
input[type='text'] {
	width: 100px;
}
input {
	margin-left: 10px;
}
select {
	width: 148px;
}
.flex_p {
	display: flex;
}
.picter {
	margin-left: 10px;
}
.small_hide {
	opacity: 0.6;
	font-weight: small;
	font-size: 13px;
}
</style>