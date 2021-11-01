<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens" >
				<h3>Отметка о выполнении</h3>
				<div class='head_block'>
					<div class='first_b'>
						<p>
							<span>{{ type == 'cb' ? 'СБ:' : 'Д' }} </span>
							<span style='font-weight: bold;'>{{ obj_name }}</span>
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
						<span style='font-weight: bold;'>{{ obj_kolvo_create }} из {{obj_kolvo_all}}</span>
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
              v-model='responsible'>
              <option 
                v-for='user in getUsers' 
                :key='user' 
                :value='user.id'>{{ user.login }}</option>
            </select> 
					</p>
					<p>
						<span style='font-weight: bold;'>Количество выполненных деталей:</span>
						<input type="number" min='1' :max='obj_max_det' v-model='kolvo'>
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
import { mapActions, mapGetters } from 'vuex';
import DatePicterCustom from '@/components/date-picter.vue';
import { afterAndBeforeOperation, getTypeOperationName } from '@/js/operation.js';
export default {
  props: ['parametrs', 'type'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',
			loader: false,

			obj_name: null,
			obj_max_det: 1,
			obj_before: '',
			obj_curent: '',
			obj_after: '',
			obj_kolvo_create: 0,
			obj_kolvo_all: 0, 

			description: '',
			responsible: 1,
			kolvo: 1,
			date: new Date().toLocaleDateString("ru-RU"),
			
    }
  },
	computed: mapGetters(['getUsers', 'getTypeOperations']),
	components: {DatePicterCustom},
  methods: {
		...mapActions([
			'getAllUsers', 
			'getAllTypeOperations'
		]),
    destroyModalF() {
			this.destroyModalLeft = 'left-block-modal-hidden'
			this.destroyModalRight = 'content-modal-right-menu-hidden'
			this.hiddens = 'display: none;'
			this.$emit('unmount', this.description)
    },
		change_date_picter(date) {
			this.date = date
		},
		save() {

		},
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;' 
		this.loader = true
		await this.getAllUsers()
		await this.getAllTypeOperations()

		if(this.$props.parametrs) {
			if(this.$props.type == 'cb') {
				let ass = this.$props.parametrs
				this.obj_name = ass.cbed.name
				this.obj_max_det = ass.kolvo_all - ass.kolvo_create
				this.obj_kolvo_create = ass.kolvo_create
				this.obj_kolvo_all = ass.kolvo_all

				// Получаем операции до и после
				let after = null
				afterAndBeforeOperation(
					ass.tp_id, 
					ass.operation_id, 
					undefined,   
				this.getTypeOperations).then(res => {
					if(res) {
						if(res.before)
							this.obj_before =  `${res.before.id}. ${res.before.name}`
						if(res.after)
							after = res.after
					}
				})

				let curent = getTypeOperationName(ass.operation_id, this.getTypeOperations)
				if(curent)
					this.obj_curent = `${curent.id}. ${curent.name}`

				if(after && curent) {
					if (curent.id != after.id) {
						this.obj_after = `${after.id}. ${after.name}`
					}
				}

			}
		}
		this.loader = false

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