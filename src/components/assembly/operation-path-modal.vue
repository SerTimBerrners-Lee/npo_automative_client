<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens">
        <h3>Путь сборочной единицы</h3>
        <div class="block"> 
					<table>
						<tr>
							<th>№ Заказа</th>
							<th>Срок отгрузки</th>
							<th>Изделие</th>
							<th>Сборочная единица</th>
							<th>Артикул</th>
							<th>Кол-во, шт</th>
							<th>Готовность %</th>
							<th>Готовность к сборке</th>
						</tr>
						<tr v-for='sh of assemble.shipments' :key='sh'>
							<td>{{ sh.number_order }}</td>
							<td>{{ sh.date_shipments }}</td>
							<td>{{ shipments ? shipments.product.name : '' }}</td>
							<td>{{ assemble.cbed.name}}</td>
							<td>{{ shipments ? shipments.product.articl : '' }}</td>
							<td>{{ assemble.kolvo_all }}</td>
							<td>{{ 0 }}</td>
							<td>{{ 0 }}</td>
						</tr>
					</table>
        </div> 
				<div>
					<h3>Комплектация</h3>
					<table>
						<tr>
							<th>Артикул</th>
							<th>Наименование</th>
							<th>Ед.</th>
							<th>Кол-во на 1 СБ</th>
							<th>Кол-во всего, шт</th>
							<th>Дефицит всего, шт.</th>
						</tr>
						<tr v-for='komp of komplect' :key='komp'>
							<td>{{ komp.art }}</td>
							<td>{{ komp.name }}</td>
							<td class='center'>
								<span v-if="komp.ez == 1"> шт</span> 
								<span v-if="komp.ez == 2"> л </span>
								<span v-if="komp.ez == 3"> кг</span> 
								<span v-if="komp.ez == 4"> м </span>
								<span v-if="komp.ez == 5"> м.куб</span>
							</td>
							<td class='center'>{{ komp.kol }}</td>
							<td></td>
							<td></td>
						</tr>
					</table>
				</div>

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
                <td :rowspan='operation.marks ? operation.marks.length + 1 : 1'>{{ getOperationName(operation.tOperationId) }}</td>
                <td
                  :rowspan='operation.marks ? operation.marks.length + 1 : 1' 
                  class='center'>{{ Number(operation.preTime) + Number(operation.mainTime) + Number(operation.helperTime) }}</td>
                <td 
                  :rowspan='operation.marks ? operation.marks.length + 1 : 1'
                  class='center'>{{ (Number(operation.preTime) + Number(operation.mainTime) + Number(operation.helperTime)) * assemble.kolvo_all  }}</td>
                <td :rowspan='operation.marks ? operation.marks.length + 1 : 1'></td>
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
				</div>
				<div class="btn-control out-btn-control" style='position:fixed; bottom: 10px; width: 58%;'>
					<button class="btn-status btn-black" 
						style="height: 0px;">Печать</button>
          </div>
      </div>
    </div>
     <Loader v-if='loader' />
     <DescriptionModal 
      v-if='show_des'
      :key='descriptionKey'
      :parametrs='description'
    />
  </div>
</template>

<script>
import { random } from 'lodash';
import DescriptionModal from '@/components/description-modal.vue';
import { mapActions, mapGetters } from 'vuex';

export default { 
  props: ['assemble'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'opacity: 1;',
      description: '',
      descriptionKey: random(1, 999),
      show_des: false,

			shipments: null,
      tp: null,
      operation_list: [],
			komplect: [],

      loader: false,

      typeOperation: null
    }
  },
  components: {DescriptionModal},
  computed: mapGetters(['getUsers']),
  methods: {
    ...mapActions(['fetchAllShipmentsById', 'fetchTechProcess', 'getAllTypeOperations', 'getAllUsers']),
		destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
    },
    returnStatus(oper) {
      let creater = this.returnKolvoCreate(oper)
      if(creater)
        return 1
      else return 0
    },
    getOperationName(to_id) {
      if(!this.typeOperation) {
        this.getAllTypeOperations(to_id).then(res => {
          this.typeOperation = res;
          return operationReturn(res)
        })
      } else 
        return operationReturn(this.typeOperation)
      function operationReturn(to) {
        for(let t of to) {
          if(t.id == to_id)
            return t.name
        }
      }
    },
    openDescription(des) {
      this.descriptionKey = random(1, 999)
      this.show_des = true
      this.description = des
    },
    userWork() {
      for(let user of this.getUsers) {
        if(user.id == this.$props.assemble.cbed.responsibleId)
          return user.login
      }
    },
    pushMarks(marks) {
      for(let oper = 0; oper < this.operation_list.length; oper++) {
        for(let mark of marks) {
          if(this.operation_list[oper].id == mark.oper_id){
            if(!this.operation_list[oper].marks) 
              this.operation_list[oper].marks = [mark]
            else 
              this.operation_list[oper].marks.push(mark)
          }
        }
      }
    },
    returnKolvoBefore(oper) {
      let create = this.returnKolvoCreate(oper)
      return this.$props.assemble.kolvo_all - create < 0 ? 0 : this.$props.assemble.kolvo_all - create
    },
    returnKolvoCreate(oper) {
      if(!oper.marks || !oper.marks.length) return false
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
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'

    this.loader = true
    await this.getAllUsers(true)

    if(this.$props.assemble && this.$props.assemble.tp_id){
      let res = await this.fetchTechProcess(this.$props.assemble.tp_id)
      if(!res || !res.operations) return false
 
      this.operation_list = res.operations
      this.pushMarks(this.$props.assemble.marks)
    }
    
		if(this.$props.assemble && this.$props.assemble.shipments) 
			this.fetchAllShipmentsById(this.$props.assemble.shipments[0].id).then(response => this.shipments = response)

		if(this.$props.assemble && this.$props.assemble.cbed) {
				let izd = this.$props.assemble.cbed
				if(izd.listCbed) {
					let cb = JSON.parse(izd.listCbed)
					for(let iz of cb) {
						this.komplect.push({
							type: 'СБ',
							art: iz.art,
							name: iz.cb.name,
							kol: iz.kol,
							ez: iz.ez,
						})
					}
				}
				if(izd.listDetal) {
					let cb = JSON.parse(izd.listDetal)
					for(let iz of cb) {
						this.komplect.push({
							type: 'Д',
							art: iz.art,
							name: iz.det.name,
							kol: iz.kol,
							ez: iz.ez,
						})
					}
				}
				if(izd.listPokDet) {
					let cb = JSON.parse(izd.listPokDet)
					for(let iz of cb) {
						this.komplect.push({
							type: 'ПД',
							art: iz.art,
							name: iz.mat.name,
							kol: iz.kol,
							ez: iz.ez,
						})
					}
				}
				if(izd.materialList) {
					let cb = JSON.parse(izd.materialList)
					for(let iz of cb) {
						this.komplect.push({
							type: 'РМ',
							art: iz.art,
							name: iz.mat.name,
							kol: iz.kol,
							ez: iz.ez,
						})
					}
			}
		}

    this.loader = false
  }
}
</script>

<style scoped>
.table-end {
  margin-bottom: 100px;
}
.span-type-files-pdf {
  height: 500px;
}
#viewer-frame-pdf {
  width: 100%;
  height: 100%;
}
.abnf{
  padding: 10px;
  cursor: pointer;
}
.slider {
  margin: 5px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  padding: 10px;
  user-select: none;
}
.left-block {
  width: 40%;
}
.left-block p {
  margin-top: 8px;
}
.left-block p span {
  padding: 2px;
}
.right-block{ 
  width: 60%;
  display: flex;
  justify-content: end;
  flex-direction: column;
}
textarea {
  height: 90px;
  width: 90%;
  border: 1px solid #d3d3d3;
  border-radius: 4px;
}
h4 {
  font-weight: inherit;
  font-size: 20px;
}
.main-fb-modal-block p {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
.main-fb-modal-block {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
}
.main-fb-modal-block>p * {
  margin-left: 10px;
}
.fb-img-block {
  width: 100%;
  height: 300px;
}
.scroll-table {
  width: 98%;
  height: 78vh;
}
.out-btn-control {
  margin-top: 10px;
}
table{
  width: 100%;
}
table th {
  text-align: start;
}
.span-type-files {
  width: 100%;
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  font-size: 70px;
  color: #606060;
  background: #a4a4a4;
}
.imgShow-modal {
  height: 100%;
  max-width: 100%;
}
.imgShow-modal-div {
  display: flex;
  justify-content: center;
  widows: 100%;
  height: 100%;
}
.content-modal-right-menu-hidden {
  animation: width-replace 1s 1 ease;
}
.content-modal-right-menu-hidden>div {
  animation: hidden-content-replace 1s 1 ease;
}
.content-modal-right-menu {
  animation: width 1s 1 ease;

  width: 60%;
}
.left-block-modal {
  width: 40%;
  animation: width-right 1s 1 ease;
}
.left-block-modal-hidden {
  animation: width-right-replace 1s 1 ease;
}
.content-modal-right-menu>div {
  animation: hidden-content 1s 1 ease;
}
@keyframes width {
  from {
    width: 1vw;
  }
  to {
    width: 60%;
  }
}
@keyframes width-right {
  from {
    width: 0vw;
  }
  to {
    width: 60%;
  }
}
@keyframes hidden-content {
  from {
    opacity: 0;
  }
  80% {
    opacity: 0;
  }
  90% {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}
@keyframes width-replace {
  from {
    width: 40%;
  }
  to {
    width: 00vw;
  }
}
@keyframes width-right-replace {
  from {
    width: 40%;
  }
  to {
    width: 0vw;
  }
}
@keyframes hidden-content-replace {
  from {
    opacity: 1;
  }
  20% {
    opacity: 0;
  }
  to {
    opacity: 0;
  }
}
</style>