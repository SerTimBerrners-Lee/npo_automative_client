<template>
	<div class="right-menu-modal">
		<div :class='destroyModalLeft' @click="destroyModalF"></div>
		<div :class='destroyModalRight'>
			<div :style="hiddens" >
				<h3>Выбрать сотрудника</h3>
					<div class="scroll-table" style="height: 690px;">
						<table> 
							<tr>
								<th style='width:10%;'>Табельный номер</th>
								<th style='width:40%;'>Должность</th>
								<th style='width:50%;'>Инициалы</th>
							</tr>
							<tr 
								class="td-row" 
								v-for="user in getUsers" 
								:key="user" @click="e => setUser(user, e.target.parentElement)"
								>
								<td class="tabel-td">{{ user.tabel }}</td>
								<td>{{ user.role ? user.role.description : '' }}</td>
								<td> {{ user.initial }}</td>
							</tr>
							<tr class="td-row"  v-for="iten in 70" :key="iten">
								<td style='height: 10px;'></td> 
								<td></td>
								<td></td>
							</tr>
						</table> 
					</div>
					<div class="btn-control">
						<button class="btn-add btn-small" @click='addUserToList'>Выбрать</button>
					</div>

					<div v-if='userListArr.length'>
						<table>
							<tr v-for='(user, inx) in userListArr' :key='user'>
								<th>{{ inx+1 }}</th>
								<th>{{ user.login }}</th>
								<th class='delete_span' @click='deleteUser(user)'>удалить</th>
							</tr>
						</table>
					</div>

					<div class="btn-control out-btn-control" style='margin-top: 100px;'>
					<button class="btn-status" 
						@click='destroyModalF'>Отменить</button>
							<button class="btn-status btn-black" @click='response'>Сохранить</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {  mapActions, mapGetters } from 'vuex'

export default {
  props: ['usersList'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',

			selectUser: null,
			tr: null,

			userListArr: []
    }
  },
	computed: mapGetters(['getUsers']),
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;' 

		this.getAllUsers();
		

		if(this.$props.usersList && this.$props.usersList.length)
			this.userListArr = this.$props.usersList
  },
  methods: {
		...mapActions(['getAllUsers']),
    destroyModalF() {
			this.destroyModalLeft = 'left-block-modal-hidden'
			this.destroyModalRight = 'content-modal-right-menu-hidden'
			this.hiddens = 'display: none;'

    },
		setUser(user, e) {
			this.selectUser = user;

			if(this.tr)
				this.tr.classList.remove('td-row-all')
			this.tr = e;
			this.tr.classList.add('td-row-all')
		},
		response() {
			this.$emit('unmount', this.userListArr)
			this.destroyModalF()
		},
		addUserToList() {
			if(!this.selectUser)
				return 0
				
			let check = true;
			for(let user of this.userListArr) {
				if(user.id == this.selectUser.id)
					check = false
			}
			
			if(check) {
				this.userListArr.push({
					id: this.selectUser.id,
					login: this.selectUser.login,
					tabel: this.selectUser.tabel
				})
			}
		
		},
		deleteUser(user) {
			this.userListArr = this.userListArr.filter(u => u.id != user.id)
		}
  }
}
</script>

<style scoped>
  textarea {
    height: 130px;
  }
	table td:first-child {
		text-align: center;
	}
 
</style>