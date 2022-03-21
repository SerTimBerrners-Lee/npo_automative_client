<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" >
			<h3>Отгрузка</h3>
			<div class="block head_block">
        <span>№ Заказа: </span>
        <input type="text" v-model='number_order'>
        <span>Заводской №: </span>
        <input type="text" v-model='fabric_number'>
        <span>Дата заказа: </span>
        <input type="text" v-model='date_order'>
        <span>Дата выполнения: </span>
        <input type="text" v-model='date_shipments'>
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
              <td></td>
              <td class='center'>{{ shipments?.product?.fabricNumber }}</td>
              <td class='center'>{{ shipments.date_shipments }}</td>
              <td></td>
              <td></td>
            </tr>
          </table>
        </div>
      </div>

      <div>
        <h3>Примечание</h3>
        <textarea maxlength='250' v-model='description'></textarea>
      </div>

      <div>
        <h3>Файлы</h3>
        <div class="block">
          <label class="btn-small btn_file" for="docsFileSelected">Добавить</label>
          <input id="docsFileSelected" @change="e => addDock(e)" type="file" style="display:none;" required multiple>
          <span class='active' @click='openFiles()'>{{ name_check }}</span>
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
		/>
    <InformFolder
      :message = 'message'
      :type = 'type'
      v-if='message'
      :key='keyInformTip'
      :title="''"
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
    <Loader v-if='loader' />
  </div>
</div>
</template>

<script>
import { random } from 'lodash';
import { mapActions } from 'vuex';
import { showMessage } from '@/js/';
import AddFile from '@/components/filebase/addfile';
import OpensFile from '@/components/filebase/openfile';
import KomplectModal from '@/components/issueshipment/komplect-modal';

export default {
  props: {
    shipments_id: {
      type: Number
    },
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

      shipments: null,

      message: '',
      type: '',
      keyInformTip: random(1, 999),
      
      date_order: '',
      number_order: '',
      date_shipments: '',
      fabric_number: '',
      description: '',
      
      name_check: '',

      loader: false
    }
  },
  components: { KomplectModal, OpensFile, AddFile },
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
    addDock(val) {
      val.target.files.forEach(f => {
        this.docFiles.push(f);
      });

      this.keyWhenModalGenerate = random(10, 999);
      this.isChangeFolderFile = true;
    },
    async save() {
      this.formData.append('date_order', this.date_order.id);
      this.formData.append('number_order', this.number_order);
      this.formData.append('date_shipments', this.date_shipments);
      this.formData.append('fabric_number', this.fabric_number);
      this.formData.append('description', this.description);
      this.formData.append('name_check', this.name_check);
      this.formData.append('shipments_id', this.shipments_id);

      const saveResult = await this.fetchCreateShComplit(this.formData);
      if(saveResult) 
        showMessage('', 'Отгрузка произошла успешно', 's', this);
      else showMessage('', 'Произошла ошибка при Отгрузки!', 'e', this);
        
      return this.destroyModalF();
    },
    async openDocuments(shipments) {	
			if(!shipments.id) return showMessage('', 'Документов нет', 'w', this);
			const ships = await this.fetchDocumentsShipments(shipments.id);

			if(ships.documents && ships.documents.length) {
				for(const doc of ships.documents) {
					if(doc.name == shipments.base) {
						this.keyWhenModalGenerateFileOpen = random(1, 999);
						this.itemFiles = [doc];
					}
				}
			} else showMessage('', 'Документов нет', 'w', this);
    },
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal';
    this.destroyModalRight = 'content-modal-right-menu';
    this.hiddens = 'opacity: 1;';
    this.loader = true;

    if(!this.shipments_id) return this.destroyModalF();
    const result = await this.fetchAllShipmentsById({id: this.shipments_id, light: false});
    if(!result) return this.destroyModalF();

    this.shipments = result;
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