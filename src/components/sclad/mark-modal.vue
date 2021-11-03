<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
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
						<input type="number" min='1' :max='obj_max_det' v-model='kol'>
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
import { afterAndBeforeOperation } from '@/js/operation.js';
export default {
  props: ['parametrs', 'type_izd'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',
			loader: false,
			titleMessage: '',
      message: '',
      type: '',
      showInformPanel: false,
      keyInformTip: 0,

			obj_name: null,
			obj_max_det: 1,
			obj_before: '',
			obj_curent: '',
			obj_after: '',
			obj_kolvo_create_in_operation: 0,
			obj_kolvo_all: 0, 

			description: '',
			user_id: 1,
			kol: 1,
			date: new Date().toLocaleDateString("ru-RU"),
			operation_id: null
			
    }
  },
	computed: mapGetters(['getUsers', 'getTypeOperations']),
	components: {DatePicterCustom},
  methods: {
		...mapActions([
			'getAllUsers', 
			'getAllTypeOperations',
			'fetchCreateMarks'
		]),
    destroyModalF() {
			this.destroyModalLeft = 'left-block-modal-hidden'
			this.destroyModalRight = 'content-modal-right-menu-hidden'
			this.hiddens = 'display: none;'
			this.$emit('unmount', 'closed')
    },
		change_date_picter(date) {
			this.date = date
		},
		save() {
			let data = {
				date_build: this.date,
				kol: this.kol,
				description: this.description,
				user_id: this.user_id,
				oper_id: this.operation_id,
			}
			if(this.$props.type_izd == 'cb') {
				data.ass_id = this.$props.parametrs.id
			} else if(this.$props.type_izd == 'det') {
				data.metal_id = this.$props.parametrs.id
			}

			this.fetchCreateMarks(data).then(res => {
				this.destroyModalF()
				this.$emit('unmount', res)
			})
		},
		showOperationStep(obj) {
			if(!obj.operation) return false;
				this.obj_curent = `${obj.operation.id}. ${obj.operation.full_name}`
				afterAndBeforeOperation(obj.tp_id, obj.operation_id)
					.then(res => {
						if(res) {
							if(res.before)
								if(res.before.id != obj.operation.id)
									this.obj_before =  `${res.before.id}. ${res.before.full_name}`
							if(res.after) 
								if(res.after.id != obj.operation_id )
									this.obj_after = `${res.after.id}. ${res.after.full_name}`
						}
				})
		}
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;' 
		this.loader = true
		await this.getAllUsers()
		await this.getAllTypeOperations()

		if(this.$props.parametrs) {
			if(this.$props.type_izd == 'cb') {
				let ass = this.$props.parametrs
				this.obj_name = ass.cbed.name
				this.obj_max_det = ass.kolvo_all - ass.kolvo_create
				this.obj_kolvo_create_in_operation = ass.kolvo_create_in_operation
				this.obj_kolvo_all = ass.kolvo_all
				this.operation_id = ass.operation_id

				this.showOperationStep(ass)
			}
			if(this.$props.type_izd == 'det') {
				let metal = this.$props.parametrs
				this.obj_name = metal.detal.name
				this.obj_max_det = metal.kolvo_all - metal.kolvo_create
				this.obj_kolvo_create_in_operation = metal.kolvo_create_in_operation
				this.obj_kolvo_all = metal.kolvo_all
				this.operation_id = metal.operation_id

				this.showOperationStep(metal)
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