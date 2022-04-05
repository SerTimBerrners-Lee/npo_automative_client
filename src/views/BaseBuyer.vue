<template>
  <div> 
    <div class="flex-box-main">
      <div class="left-block-bprovider">
        <h3>База Покупателей</h3>
        <TableBuyer 
          :allBuyer='allBuyer' 
          @unmount='setBuyer'
          :attention='true'
          @sortToDate='sortToDate'
          :hide_filter_responsibil='true'
          @unmount_attention='unmount_attention'
         />
        <div class="btn-control">
          <button class="btn-small btn-add" @click="create">Создать</button>
          <button class="btn-small" @click="edit">Редактировать</button>
          <button class="btn-small" @click="ban">В архив</button>
        </div>
        <h3>Фильтр по изделию</h3> 
        <button class="btn-small">Выбрать изделие</button>
        <button class="btn-small" style='margin-left: 10px;'>Сбросить фильтр</button>
      </div>
      <div class="right-block-bprovider" v-if='buyer'>
        <h3>Подробная информация о покупателе</h3>
        <div class="block">
          <div class="first-block-description">
            <p>
              <span>Наименование: </span><input type="text" :value="obj.name">
            </p>
            <p>
              <span>ИНН: </span><input type="text" :value="obj.inn">
            </p>
            <p>
              <span>КПП: </span><input type="text" :value="obj.cpp">
            </p>
          </div>
          <div>
            <div class="block-d-r">
              <div>
                <div>
                  <h3>Реквизиты</h3>
                  <table class="table_rek">
                    <tr class="td-row" v-for="rek in obj.rekvisit" :key='rek'>
                      <th>{{ rek.name }}</th>
                      <td>{{ rek.description }}</td>
                    </tr>
                  </table>
                </div>
                <div>
                  <h3>Контакты</h3>
                  <table class="table_rek">
                    <tr class="td-row" v-for="cont in obj.contact" :key='cont'>
                      <th> {{ cont.initial }}</th>
                      <th> {{ cont.description }}</th>
                    </tr>
                  </table>
                </div>
                <div>
                    <h3>Описание / примечание</h3>
                    <textarea maxlength='250' :value="obj.description"></textarea>
                </div>
              </div>
                <div>
                  <div>
                    <div>
                      <h3>Документы</h3>
                      <table style="width: 100%">
                        <tr>
                          <th>Файл</th>
                        </tr>
                        <tr class="td-row" 
                          v-for="doc in obj.documents" 
                          :key="doc"
                          @click="clickDoc(doc)">
                          <td> {{ doc.name }} </td>
                        </tr>
                      </table>
                    </div>
                    <h3 class='link_h3'>История изменений</h3>
                    </div>
                </div>
            </div>
            <div>
              <h3>Заказы покупателя</h3>
              <div class="scroll-table" v-if='buyer.shipments && buyer.shipments.length'>
                <table>
                  <tr>
                    <th>№ Заказа</th>
                    <th>Дата заказа</th>
                    <th>Наименование изделия</th>
                    <th>Кол-во, шт.</th>
                    <th>Основание</th>
                    <th>Дата отгрузки</th>
                    <th>Примечание</th>
                    <th>Статус</th>
                  </tr>
                  <tr 
                    v-for="shipments in buyer.shipments" 
                    :key="shipments" 
                    class="td-row">
                    <td>{{ shipments.number_order }}</td>
                    <td>{{ shipments.date_order }}</td>
                    <td>{{ returnNameProduct(shipments.productId) }}</td>
                    <td class='center'>{{ shipments.kol }}</td>
                    <td>{{ shipments.base }}</td>
                    <td>{{ shipments.date_shipments }}</td>
                    <td class='center'>
                      <img src="@/assets/img/link.jpg" @click='openDescription(shipments.description)' class='link_img' atl='Показать' />
                    </td>
                    <td>{{ shipments.status }}</td>
                    </tr>
                  </table>
              </div>
              <div v-else>Нет заказов</div>
            </div>
          </div>
        </div>
        <div>
        <div class="btn-control block endgroup">
          <button class=" btn-black">Печать подробной информации о покупателе</button>
        </div>
        </div>
      </div>
    </div>
    <router-view></router-view>
    <OpensFile 
      :parametrs='itemFiles' 
      v-if="itemFiles"
      :key='keyWhenModalGenerateFileOpen'
    />
    <DescriptionModal
      v-if='descriptionKey'
      :key='descriptionKey'
      :parametrs='description'
      />
    <Loader v-if='loader' />
  </div>
</template>
<script>
import random from 'lodash';
import OpensFile from '@/components/filebase/openfile';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import TableBuyer from '@/components/basebuyer/table-buyer';
import DescriptionModal from '@/components/description-modal';

export default {
  data() {
    return {
      obj: {
        name: '',
        inn: '',
        cpp: '',
        description: '',
        contact: [],
        rekvisit: [],
        documents: []
      },
      buyer: null,
      descriptionKey: null,
      description: '',

      itemFiles: null,
      keyWhenModalGenerateFileOpen: random(10, 999),
      loader: false
    }
  },
  computed: mapGetters(['allBuyer', 'allProduct']),
  components: {OpensFile, DescriptionModal, TableBuyer},
  methods: {
    ...mapActions([
      'fetchAllBuyers', 
      'fetchBuyerBan', 
      'getAllProduct'
    ]),
    ...mapMutations([
      'setBuyerState', 
      'filterToAttentionBuyer',
      'filterBuyerToDate'
    ]),
    setBuyer(buyer) {
      this.setBuyerState(buyer)
      this.buyer = buyer
      this.obj.name = buyer.name
      this.obj.inn = buyer.inn
      this.obj.cpp = buyer.cpp
      this.obj.description = buyer.description
      if(buyer.contacts) 
        this.obj.contact = JSON.parse(buyer.contacts)
      
      if(buyer.rekvisit) 
        this.obj.rekvisit = JSON.parse(buyer.rekvisit)
      
      if(buyer.documents) 
        this.obj.documents = buyer.documents
    },
    unmount_attention() {
      this.filterToAttentionBuyer()
    },
    sortToDate() {
      this.filterBuyerToDate()
    },
    clickDoc(files) {
      if(files) { 
        this.itemFiles = files
        this.keyWhenModalGenerateFileOpen = random(10, 1222)
      }
    },
    create() {
      this.$router.push({path: '/buyer/create'})
    },
    edit() {
      if(!this.buyer)
        return 0;
      this.$router.push({path: '/buyer/edit'})
    },
    ban() {
      if(!this.buyer.id)
        return 0;
      this.fetchBuyerBan(this.buyer.id)
    },
    openDescription(description) {
      this.descriptionKey = random(1, 999)
      this.description = description
    },
    returnNameProduct(id) {
      for(let product of this.allProduct) {
        if(product.id == id)
          return product.name
      }
    }
  },
  async mounted() {
    this.loader = true
    await this.fetchAllBuyers()
    await this.getAllProduct(true)
    this.loader = false
}
}
</script>

<style scoped>
.scroll-table {
  width: 100%;
}
.table_rek{
  width: 420px;
}
.table-filter-bproveder th {
  width: 158px;
}
.left-block-bprovider {
  width: 528px;
  float: left;
}
.left-block-bprovider .btn-control {
  margin-top: 20px;
}
.right-block-bprovider {
  margin-left: 20px;
  width: 1030px;
}
.block {
  display: flex;
  flex-direction: column;
}
.flex-box-main {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.first-block-description p {
  margin-left: 5px;
  float: left;
  width: 30%;
}
.first-block-description input {
  width: 150px;
}
textarea {
  height: 90px;
  width: 350px;
  border: 1px solid #d3d3d3;
  border-radius: 4px;
}
.block-d-r {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}
.block-d-r>div>div {
  margin: 5px;
  margin-top: 10px;
  margin-left: 5px;
}
.block-d-r>div {
  width: 50%;
}
.block-d-r th {
  text-align: start;
}
.btn-black {
  width:max-content;
  height: 45px;
}
.endgroup {
  display: flex;
  justify-content: end;
  margin-top: 20px;
  align-items: end;
}
.provider_table {
  width: 520px;
}
th {
  height: 10px;
}
table * {
  user-select: none;
}
</style>