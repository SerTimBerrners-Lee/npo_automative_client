<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" >
			<h3>Отгрузка</h3>
			<div class="block head_block">
        <p>
          <span>№ Заказа: </span>
          <input type="text" v-model='number_order'>
          <span>Заводской №: </span>
          <input type="text" v-model='fabric_number'>
          <span>Дата заказа: </span>
          <input type="text" v-model='date_order'>
        </p>
        <span style='display: flex; align-items: center;'>
          <span>Дата выполнения: </span>
          <DatePicterCustom
            :dateStart='date_create'
          />
        </span>
        <p>
          <span>Дата отгрузки по договору: </span>
          <input type="text" v-model='date_shipments'>
          <span>Транспортная компания: </span>
          <input type="text" v-model='transport'>
        </p>
      </div>

      <div>
        <h3>Комплектация</h3>
        <div class="table-scroll">
          <table v-if='shipments'>
            <tr>
              <th>Наименование изделия</th>
              <th>Комплектация, особенности заказа</th>
              <th>Кол-во</th>
              <th>Основание</th>
              <th>Покупатель</th>
              <th>Потребность к отгрузке</th>
              <th>Заводской №</th>
              <th>Дата отгрузки</th>
              <th>ФИО сборщика</th>
              <th>ФИО контроль</th>
              <!-- Выбор сотрудника - контроль отгрузки  -->
              <!-- Создается промежуточная модель отгрузки  -->
            </tr>
            <tr>
              <td class='center'>{{ shipments?.product?.name }}</td>
              <td class='center' @click='openComplectation(shipments.list_cbed_detal)' >
                <img 
                  src="@/assets/img/link.jpg" 
                  class='link_img' 
                  atl='Показать'
                  v-if='shipments.list_cbed_detal' />
                <p v-else>Нет комплектации</p>
              </td>
              <td class='center'>{{ shipments.kol }}</td>
              <td style='width:50px; word-break: break-all;' class='click center active'  
                @click='openDocuments(shipments)' >
                {{ shipments.base }}
              </td>
              <td class='center'>{{ shipments?.buyer?.name }}</td>
              <td class='center'>0</td> <!-- Потребность к отгрузке -->
              <td class='center'>{{ shipments?.product?.fabricNumber }}</td>
              <td class='center'>{{ shipments.date_shipments }}</td>
              <td class='center cursor' @click='selectUser("executor")'>
                {{ creater_user ? creater_user?.initial : 'Выбрать' }}
              </td>
              <td class='center cursor' @click='selectUser("controller")'>
                {{ responsible_user ? responsible_user?.initial : 'Выбрать' }}
              </td>
            </tr>

            <tbody v-if='childrens && childrens.length'>
              <tr v-for='sh of childrens' :key='sh'>
                <td class='center'>{{ sh?.product?.name }}</td>
                <td class='center' @click='openComplectation(sh.list_cbed_detal)' >
                  <img 
                    src="@/assets/img/link.jpg" 
                    class='link_img' 
                    atl='Показать'
                    v-if='sh.list_cbed_detal' />
                  <p v-else>Нет комплектации</p>
                </td>
                <td class='center'>{{ sh.kol }}</td>
                <td style='width:50px; word-break: break-all;' class='click center active'  
                  @click='openDocuments(sh)' >
                  {{ sh.base }}
                </td>
                <td class='center'>{{ sh?.buyer?.name }}</td>
                <td class='center'>0</td> <!-- Потребность к отгрузке -->
                <td class='center'>{{ sh?.product?.fabricNumber }}</td>
                <td class='center'>{{ sh.date_shipments }}</td>
                <td class='center cursor' @click='selectUser("executor")'>
                  {{ creater_user ? creater_user?.initial : 'Выбрать' }}
                </td>
                <td class='center cursor' @click='selectUser("controller")'>
                  {{ responsible_user ? responsible_user?.initial : 'Выбрать' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3>Примечание</h3>
        <textarea maxlength='250' v-model='description'></textarea>
      </div>

      <div class="wh_50p">
        <TableDocument 
          v-if='documentsData.length' 
          :title='""' 
          :key='table_document_key'
          :documents='documentsData'/>
      </div>

      <div>
        <h3>Файлы</h3>
        <div style='height: 50px;'>
          <FileLoader 
            :typeGetFile='"getfile"'
            @unmount='file_unmount'
          />
        </div>
      </div>

      <div class="btn-control out-btn-control">
        <button class="btn-status" @click='destroyModalF'>Отменить</button>
        <button class="btn-status btn-black" @click='save'>Отгрузить</button>
      </div>
    </div>
    <KomplectModal
			v-if='parametrs_komplect'
			:key='komplect_generate_key'
			:parametrs='parametrs_komplect'
      :change_complect='change_complect'
      :is_change_komplit='true'
		/>
    <AddFile 
      :parametrs='docFiles' 
      v-if="isChangeFolderFile" 
      @unmount='unmount'
      :typeGetFile='"getfile"'
      :key='keyWhenModalGenerate'
    />
    <OpensFile 
      :parametrs='docFiles' 
      v-if="showModalFiles" 
      :key='keyWhenModalGenerateFileOpen'
    />
    <ModalUsersList 
      v-if='showModalUser'
      :key='keyModalUser'
      :get_one='true'
      @unmount='unmount_user_modal'
    />
    <Loader v-if='loader' />
  </div>
</div>
</template>

<script>
import { random } from 'lodash';
import { mapActions } from 'vuex';
import { showMessage } from '@/js/';
import AddFile from '@/components/FileBase/addfile';
import OpensFile from '@/components/FileBase/openfile';
import DatePicterCustom from '@/components/date-picter';
import ModalUsersList from '@/components/Users/modal-list-user';
import TableDocument from '@/components/FileBase/table-document';
import KomplectModal from '@/components/IssueShipment/komplect-modal';

export default {
  props: {
    shipments_id: {
      type: Number
    },
    change_complect: {},
    is_change_komplit: {},
    selected_sh: []
  },
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',

      docFiles: [],
      keyWhenModalGenerate: random(1, 999),
      keyWhenModalGenerateFileOpen: random(1, 999),
      showModalFiles: false,
      isChangeFolderFile: false,
      formData: new FormData(),

      parametrs_komplect: null,
			komplect_generate_key: random(1, 999),
      showModalUser: false, 
      keyModalUser: random(1, 999),

      shipments: null,
      
      date_order: '',
      number_order: '',
      date_shipments: '',
      fabric_number: '',
      description: '',
      
      name_check: '',

      responsible_user: '',
      creater_user: '',
      typeOpen: '',

      loader: false,
      date_create: new Date().toLocaleDateString("ru-RU"),
      transport: '',
      childrens: [],
      lastFormData: null,
      documentsData: [],
      table_document_key: random(10, 999),
    }
  },
  components: { 
    KomplectModal,
    OpensFile,
    AddFile,
    ModalUsersList,
    DatePicterCustom,
    TableDocument
  },
  methods: {
    ...mapActions([
      'fetchAllShipmentsById',
      'fetchDocumentsShipments',
      'fetchCreateShComplit',
    ]),
    destroyModalF() {
			this.destroyModalLeft = 'left-block-modal-hidden';
			this.destroyModalRight = 'content-modal-right-menu-hidden';
			this.hiddens = 'display: none;';

      this.$emit('unmount', this.shipments_id);
      this.loader = false;
    },
    unmount_user_modal(data) {
      if(!data) return false;

      if(this.typeOpen == 'executor') this.creater_user = data;
      if(this.typeOpen == 'controller') this.responsible_user = data;
      this.typeOpen = '';
    },
    file_unmount(e) { 
      if(!e) return 0;
      this.formData = e.formData;
      this.name_check = '';
      this.lastFormData = this.formData;
      this.table_document_key = random(1, 999);
      for(const fd of this.formData.getAll('document')) {
        this.documentsData.push(fd);
        this.name_check += ` ${fd.name}`;
      }
    },
    update() {
      this.date_order = this.shipments.date_order;
      this.number_order = this.shipments.number_order;
      this.date_shipments = this.shipments.date_shipments;
      this.fabric_number = this.shipments?.product?.fabricNumber;
    },
    openComplectation(komplect) {
			this.komplect_generate_key = random(1, 999);
			this.parametrs_komplect = komplect;
		},
    openFiles() { 
      console.log('openFiles')
      this.keyWhenModalGenerateFileOpen = random(1, 999);
      this.showModalFiles = true;
    },
    selectUser(type) {
      this.typeOpen = type;

      this.showModalUser = true;
      this.keyModalUser = random(1, 999);
    },
    async save() {
      await this.fetchSave();
      if (!this.childrens || !this.childrens.length) return false;
      
      for(const item of this.childrens) {
        this.formData = new FormData();
        if (this.lastFormData) {
          if (this.lastFormData.getAll('docs')) this.formData.append('docs', this.lastFormData.getAll('docs'));
          if (this.lastFormData.getAll('document')) {
            for (const file of this.lastFormData.getAll('document')) {
              this.formData.append('document', file);
            }
          }
        }
        await this.fetchSave(item.id);
      }
    },
    async fetchSave(sh_id = this.shipments.id) {
      if (!sh_id) return showMessage('', 'Выберите задачу, ошибка в ID', 'w');

      this.formData.append('date_order', this.date_order.id);
      this.formData.append('number_order', this.number_order);
      this.formData.append('date_shipments', this.date_shipments);
      this.formData.append('fabric_number', this.fabric_number);
      this.formData.append('description', this.description);
      this.formData.append('name_check', this.name_check);
      this.formData.append('date_create', this.date_create);
      this.formData.append('transport', this.transport);
      this.formData.append('shipments_id', sh_id);
      this.formData.append('responsible_user_id', this.responsible_user.id || '');
      this.formData.append('creater_user_id', this.creater_user.id || '');

      const saveResult = await this.fetchCreateShComplit(this.formData);
      if(saveResult) showMessage('', 'Отгрузка произошла успешно ' + this.number_order, 's');
      else showMessage('', 'Произошла ошибка при Отгрузки!', 'e');

      return this.destroyModalF();
    },
    async openDocuments(shipments) {	
			if(!shipments.id) return showMessage('', 'Документов нет', 'w');
			const ships = await this.fetchDocumentsShipments(shipments.id);

			if(ships.documents && ships.documents.length) {
				for(const doc of ships.documents) {
					if(doc.name == shipments.base) {
						this.keyWhenModalGenerateFileOpen = random(1, 999);
						this.itemFiles = [doc];
					}
				}
			} else showMessage('', 'Документов нет', 'w');
    },
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal';
    this.destroyModalRight = 'content-modal-right-menu';
    this.hiddens = 'opacity: 1;';
    this.loader = true;

    if (!this.shipments_id && !this.selected_sh.length) {
      showMessage('', 'Выберите задачу на отгрузку', 'w');
      return this.destroyModalF();
    }

    if (!this.selected_sh.length) { // Если заказов нет и только один переданный
      const result = await this.fetchAllShipmentsById({id: this.shipments_id, light: true});
      if(!result) return this.destroyModalF();
      this.shipments = result;
    } else {
      this.shipments = this.selected_sh[0];
      this.childrens = this.selected_sh.filter(el => el.id !== this.shipments.id);
    }
    
    this.update();
    this.loader = false;
  },
}
</script>

<style scoped>
.head_block * {
  margin: 5px;
}
.head_block input {
  width: 90px;
}
table{ 
  width: 100%;
  font-size: 14px;
}
textarea {
  width: 100%;
  height: 140px;
}
.out-btn-control {
  margin-top: 100px;
}
.content-modal-right-menu-hidden {
  animation: width-replace 1s 1 ease;
}
.content-modal-right-menu-hidden>div {
  animation: hidden-content-replace 1s 1 ease;
}
.content-modal-right-menu {
  animation: width 1s 1 ease;
  width: 60vw;
}
.left-block-modal {
  width: 40vw;
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
    width: 60vw;
  }
}
@keyframes width-right {
  from {
    width: 0vw;
  }
  to {
    width: 40vw;
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
    width: 60vw;
  }
  to {
    width: 00vw;
  }
}
@keyframes width-right-replace {
  from {
    width: 40vw;
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