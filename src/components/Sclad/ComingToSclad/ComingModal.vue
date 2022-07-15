<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF('unmount')"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens">
        <h3>Создать приход. Накладная № 
          {{ parametrs + 1 }} от 
          {{ new Date().toLocaleString('ru-RU').split(',')[0] }} 
        </h3>
        <div class="block header_block">
          <div>
            <span>Поставщик:</span>
            <p v-if='!sclad'>
              <input type="text" :value='provider ? provider.name : ""' >
              <button class="btn-small" @click='addProvider'>Выбрать</button>
            </p>
            <p v-else style='font-weight: bold;'>Склад</p>
          </div>
          <select v-model='typeComing' class='select-small'>
            <option value="Постащики">Постащики</option>
            <option value="Сборка">Сборка</option>
            <option value="Металлообработка">Металлообработка</option>
          </select>
        </div>

        <div>
          <h3>Потенциальные приходы от {{ typeComing }} </h3>
          <div v-if="typeComing === 'Постащики'">
            <div class="table-scroll">
            <table>
              <tr>
                <th
                  style='cursor: pointer;' 
                  @click='allItemsAdd("provider", product)'>
                  <unicon name="check" fill="royalblue" width='20' />
                </th> 
                <th>Артикул</th>
                <th>Тип</th>
                <th>Наименование</th>
                <th>ЕИ</th>
                <th>Кол-во</th>
                <th>Стоимость за ед., руб</th>
                <th>Сумма, руб</th>
              </tr>
              <tr 
                v-for='(prod, inx) of product' :key='prod'
                class='td-row'>
                <td class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
                  <p class="checkbox_block" @click='delProd(prod, selected_products, product)'></p>
                </td>
                <td contenteditable="true" @keyup="e => editArt(inx, e.target.innerText, product)">
                  {{ prod.art }}
                </td>
                <td>{{ returnTypePosition(prod.type) }}</td>
                <td>{{ prod.name }}</td>
                <td>
                  <span :value='prod.ez' v-text='returnEzName(prod.ez)'></span>
                </td>
                <td>
                  <input type="number" 
                    @change="e => editKol(inx, e.target.value, product)"
                    min='0' :value='prod.kol'>
                </td>
                <td
                  class='tooltip'>
                  <input type="number" 
                    @change="e => editSum(inx, e.target.value)"
                    min='0' :value='prod.sum'>
                  <span class="tooltiptext" contenteditable="false">{{ Number(prod.kol) * Number(prod.sum)  }}</span>
                </td>
                <td class='center'>{{ prod.kol * prod.sum }}</td>
              </tr>
            </table>
            </div>
            <div class="btn-control">
              <button
                class="btn-small" @click='newPosition'> Создать новый </button>
            </div>
          </div>
          
          <!-- Металл и Сборка -->
          <div v-if="typeComing !== 'Постащики'">
            <div class="table-scroll">
            <table>
              <tbody class='fixed_table_10'>
                <tr>
                  <th
                    style='cursor: pointer;' 
                    @click='allItemsAdd("sclad", scladArr)'>
                    <unicon name="check" fill="royalblue" width='20' />
                  </th> 
                  <th>Артикул</th>
                  <th>Наименование</th>
                  <th>ЕИ</th>
                  <th>Кол-во/План приход</th>
                  <th>Номер Заказа</th>
                  <th>План. дата прихода</th>
                </tr>
                <tr id='search'>
                  <th colspan="7">
                    <Search 
                      :placeholder="'Поиск по Артиклу и Наименованию'"
                      @unmount='keySearch'
                    />
                  </th>
                </tr>
              </tbody>
              <tr 
                v-for='(prod, inx) of scladArr' :key='prod'
                class='td-row'>
                <td class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
                  <p class="checkbox_block" @click='delProd(prod, scladArrSelected, scladArr)'></p>
                </td>
                <td contenteditable="true" @keyup="e => editArt(inx, e.target.innerText, scladArr)">
                  {{ prod.art }}
                </td>
                <td>{{ prod.name }}</td>
                <td class='center'>шт</td>
                <td>
                  <input type="number" 
                    @change="e => editKol(inx, e.target.value, scladArr)"
                    min='0' :value='prod.kol'>
                </td>
                <td class='center'>{{ typeComing === 'Металлообработка' ? 'М' : 'С' }} {{ prod.number_order }}</td>
                <td class='center'>{{ prod.date }}</td>
              </tr>
            </table>
            </div>
            <div class="btn-control" v-if="typeComing === 'Сборка'">
              <button 
                class="btn-small" @click='openCbedModal'>Добавить Сборку </button>
            </div>
            <div class="btn-control" v-else-if="typeComing === 'Металлообработка'">
              <button 
                class="btn-small" @click="openDetalModal">Добавить Деталь из базы</button>
            </div>
          </div>
        </div>

        <!-- Выбранные позиции -->
        <div>
          <h3>Выбранные позиции</h3>
          <div class="table-scroll">
            <table v-if="typeComing === 'Постащики'" >
              <tr>
                <th 
                  style='cursor: pointer;'
                  @click="allItemsDel('provider', selected_products)">
                  <unicon name="glass-tea" fill="#ee0942d0" width='20' />
                </th> 
                <th>Артикул</th>
                <th>Тип</th>
                <th>Наименование</th>
                <th>ЕИ</th>
                <th>Кол-во</th>
                <th>Стоимость за ед., руб</th>
                <th>Сумма, руб</th>
              </tr>
              <tr 
                v-for='prod of selected_products' :key='prod'
                class='td-row'>
                <td class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
                  <p class="checkbox_block_del" @click='delProd(prod, product, selected_products)'></p>
                </td>
                <td>{{ prod.art }}</td>
                <td>{{ returnTypePosition(prod.type) }}</td>
                <td>{{ prod.name }}</td>
                <td>
                  <span :value='prod.ez' v-text='returnEzName(prod.ez)'></span>
                </td>
                <td class='center'>{{ prod.kol }}</td>
                <td class='center'>{{ prod.sum }}</td>
                <td class='center'>{{ prod.kol * prod.sum }}</td>
              </tr>
            </table>

            <table v-else>
              <tr>
                <th 
                  style='cursor: pointer;'
                  @click="allItemsDel('sclad', scladArrSelected)">
                  <unicon name="glass-tea" fill="#ee0942d0" width='20' />
                </th> 
                <th>Артикул</th>
                <th>Наименование</th>
                <th>ЕИ</th>
                <th>Кол-во</th>
                <th>План. дата прихода</th>
              </tr>
              <tr 
                v-for='prod of scladArrSelected' :key='prod'
                class='td-row'>
                <td class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
                  <p class="checkbox_block_del" @click='delProd(prod, scladArr, scladArrSelected)'></p>
                </td>
                <td>{{ prod.art }}</td>
                <td>{{ prod.name }}</td>
                <td>шт</td>
                <td class='center'>{{ prod.kol }}</td>
                <td class='center'>{{ prod.date }}</td>
              </tr>
            </table>
          </div>
          <h3>Примечание</h3>
          <textarea maxlength='250' class='textarea' v-model='description'></textarea>
        </div>

        <div class="block" style='padding: 5px;'>
          <p style='margin: 5px;'>
            <label for="docsFileSelected" class='btn-small btn-file'>Прикрепить документ</label>
            <input id="docsFileSelected" @change="e => addDock(e)" type="file" style="display:none;" required multiple>
            <span class='active' style='margin-left: 5px;'> {{ document }}</span>
          </p>
        </div>

        <div class="btn-control out-btn-control">
          <button class="btn-status" @click='destroyModalF'>Отменить</button>
          <button class="btn-status">Печать</button>
          <button class="btn-status btn-black" @click='pushToServer'>Создать приход</button>
        </div>
      </div>
    </div>
    <AddFile 
      :parametrs='docFiles' 
      v-if="isChangeFolderFile" 
      @unmount='unmount'
      :typeGetFile='"getfile"'
      :key='keyWhenModalGenerate' />
    <ProviderList 
      :key='key_provider_modal'
      v-if='allProvider.length'
      :allProvider='allProvider'
      :getProvider='true'
      @unmount='unmount_provider'
    />
    <AddPosition 
      :key='key_position'
      v-if='show_position'
      @unmount='unmount_position'
    />
    <BaseDetalModal
      :key='detalModalKey'
      v-if='detalModalIs'
      :getListDetal='scladArr'
      @responsDetal='unmount_product'
    />
    <BaseCbedModal
      :key='cbedModalKey'
      v-if='cbedModalIs'
      :getListCbed='scladArr'
      @responsCbed='unmount_product'
    />
    <Loader v-if='loader' />
  </div>
</template>
<script>
import { showMessage } from '@/js/';
import AddPosition from './NewPosition';
import MixModal from '@/mixins/mixmodal';
import { random, toNumber } from 'lodash';
import { returnEzName } from '@/js/edizm';
import { mapActions, mapGetters } from 'vuex';
import AddFile from '@/components/FileBase/AddFile';
import { returnShipmentsDate } from '@/js/operation';
import BaseCbedModal from '@/components/CbEd/BaseCbedModal';
import BaseDetalModal from '@/components/BaseDetal/BaseDetalModal';
import { returnTypePosition, posToDeliveries } from '@/js/methods';
import ProviderList from '@/components/BaseProvider/AllFieldsProvider';

export default {
  props: ['parametrs'],
  data() {
    return {
      date_shipments: null,
      docFiles: [],
      keyWhenModalGenerate: random(1, 999),
      isChangeFolderFile: false,
      document: '',
      formData: new FormData,

      key_position: random(1, 999),
      show_position: false, 

      key_provider_modal: random(1, 999),
      allProvider: [],
      provider: null,
      sclad: false,

      product: [],
      selected_products: [],

      scladArr: [],
      scladArrSelected: [],
      description: '',

      select_m: null,

      loader: false,
      typeComing: 'Постащики',
      detalModalKey: random(1, 999),
      detalModalIs: false,
      cbedModalKey: random(1, 999),
      cbedModalIs: false,
      middleware_sclad: [],
    }
  },
  computed: {
    ...mapGetters(['getAllDeliveries', 'getMetaloworkings']),
  },
  mixins: [MixModal],
  components: {
    AddFile,
    ProviderList,
    AddPosition,
    BaseDetalModal,
    BaseCbedModal
  },
  watch: {
    typeComing: function(news) {
      if (news !== 'Постащики') this.sclad = true;
      else this.sclad = false;
      this.scladArr = [];
      this.middleware_sclad = [];
      this.scladArrSelected = [];
      this.selected_products = [];
      this.product = [];

      if (news == 'Металлообработка') {
        this.loader = true;
        this.fetchMetalNoConduct().then(() => {
          this.formingMetatall();
          this.loader = false;
        });
      }
    }
  },
  methods: {
    ...mapActions([
      'fetchGetProviders', 
      'fetchPushWaybillCreate', 
      'fetchGetDeliveriesCaming',
      'fetchMetalNoConduct'
    ]),
    unmount(e) {
      if (!e) return 0;
      this.formData = e.formData;
      if (this.formData.get('document'))
        this.document = this.formData.get('document').name;
    },
    unmount_provider(provider) {
      if (provider && provider.product) {
        this.provider = provider;
        this.product = provider.product;
      } 
    },
    unmount_position(position_list) {
      if (!position_list) return false;
      
      for (const item of position_list) {
        const position = item.obj;
        position.type = item.type;

        const result = posToDeliveries(position, this.product);
        if (!result) continue;

        this.product.push(result);
      }
    },
    unmount_product(arr) {
      if (!arr || !arr.length) return false;
      for (const item of arr) {
        const obj = this.typeComing == 'Металлообработка' ? item.det : item.cb;
        this.scladArr.push({
          art: item.art,
          name: obj.name,
          id: obj.id,
          kol: item.kol,
          ez: item.ez,
          description: '',
          sum: 0,
          date: '-',
          number_order: '-'
        });  
      }
    },
    formingMetatall() {
      for (const item of this.getMetaloworkings) {
        if (!item?.detal?.articl || !item?.detal?.name || !item?.detal?.id) continue;
        this.scladArr.push({
          art: item?.detal?.articl,
          name: item?.detal?.name,
          id: item?.detal?.id,
          kol: item.kolvo_shipments,
          ez: 1,
          description: '',
          sum: 0,
          date: returnShipmentsDate(item?.detal?.shipments, 1),
          number_order: item.number_order,
          worker_id: item.id
        });
      }
    },
    keySearch(str) {
      if (!this.middleware_sclad.length)
        this.middleware_sclad = this.scladArr;
      
      this.scladArr = this.middleware_sclad.filter(el => 
        String(el.art)
        .slice(0, String(str).length) == String(str) || 
        ((el.name.toLowerCase()).indexOf(str.toLowerCase(), 0) != -1)
      );
    },
    openDetalModal() {
      this.scladArr = [];
      this.middleware_sclad = [];
      this.detalModalKey = random(1, 999);
      this.detalModalIs = true;
    },
    openCbedModal() {
      this.scladArr = [];
      this.middleware_sclad = [];
      this.cbedModalKey = random(1, 999);
      this.cbedModalIs = true;
    },
    returnEzName (ez) {
      return returnEzName(ez);
    },
    addDock(val) {
      val.target.files.forEach(f => {
        this.docFiles.push(f);
      })
      this.keyWhenModalGenerate = random(10, 999);
      this.isChangeFolderFile = true;
    },
    addProvider() {
      this.key_provider_modal = random(1, 999);
    },
    editVariable() {
      let check = true;
      for (const dev of this.getAllDeliveries) {
        for (let prov = 0; prov < this.allProvider.length; prov++) {
          if (this.allProvider[prov].id == dev.provider.id && this.allProvider[prov].product && this.allProvider[prov].product.length) {
            try {
              const pars = JSON.parse(dev.product);
              for (const d of pars) {
                this.allProvider[prov].product.push(d);
              }
            } catch (e) {console.error(e)}
            check = false;
          }
        }

        if (check) {
          try {
            const prod = JSON.parse(dev.product);
            if (prod && prod.length)
              this.allProvider.push({ ...dev.provider, product: prod});
          } catch(e) {console.error(e)}
        } else check = false;
    }
    },
    returnTypePosition(type) {
      return returnTypePosition(type)[0];
    },
    pushToServer() {
      if (!this.provider && !this.sclad) return showMessage('', 'Выберите поставщика!', 'w');
      if (!this.formData.get('docs') && !this.formData.get('document'))
        return showMessage('', 'Обязательно прикрепите документ!', 'w');

      this.formData.append('provider_id', this.provider?.id || null);
      this.formData.append('sclad', this.sclad);
      this.formData.append('description', this.description);
      this.formData.append('product_list', 
        this.sclad ? JSON.stringify(this.scladArrSelected) :
          JSON.stringify(this.selected_products)
      );
      this.formData.append('typeComing', this.typeComing);

      this.fetchPushWaybillCreate(this.formData);
      this.destroyModalF();
      this.$emit('unmount', null);
    },
    delProd(prod, arr, select_arr) {
      arr.push(prod);
      for (let inx in select_arr) {
        if (select_arr[inx].id == prod.id && select_arr[inx].art == prod.art)
          select_arr.splice(inx, 1);
      }
    },
    allItemsAdd(type, arr) {
      for (const prod of arr) {
        type == 'provider' ?
          this.selected_products.push(prod) : this.scladArrSelected.push(prod);
      }
      type == 'provider' ? this.product = [] : this.scladArr = [];
    },
    allItemsDel(type, arr) {
      for (const prod of arr) {
        type == 'provider' ?
          this.product.push(prod) : this.scladArr.push(prod);
      }
      type == 'provider' ? 
        this.selected_products = [] : this.scladArrSelected = [];
    },
    newPosition() {
      this.key_position = random(1, 999);
      this.show_position = true;
    },
    editArt(inx, val, arr) {
      arr[inx].art = val;
    },
    editKol(inx, val, arr) {
      let check = toNumber(val);
      if (!check) return arr[inx].kol = 0;

      arr[inx].kol = toNumber(val);
    },
    editSum(inx, val) {
      this.product[inx].sum = val;
    },
  },
  async mounted() {
    this.loader = true;
    await this.fetchGetDeliveriesCaming();
    this.editVariable();
    this.loader = false;
      
  },
}
</script>

<style scoped>
.table-scroll {
  height: 450px;
  overflow: auto;
}
input[type='number'] {
  width: 50px;
}
.textarea {
  margin: 10px;
  width: 48%;
  height: 120px;
}
.header_block * {
  margin-left: 5px;
}
label {
  margin: 0px;
  padding: 0px;
  user-select: none;
}
.header_block input[type='checkbox'] {
  width: max-content;
}
.btn-file{
  color: black;
  background: #d3d3d3;
  padding: 6px;
  font-weight: normal;
  font-size: 16px;
  cursor: pointer;
}
.header_block>div>p>input {
  width: 80%;
}
.header_block>div>p {
  width: 74%;
}
.header_block>div {
  display: flex;
  width: 74%;
  align-items: center;
  margin: 0px;
}
.block {
  margin-bottom: 10px;
}
table {
  width: 100%;
}
.two_header * {
  margin:4px;
}
.two_header input{
  width:23%;
}
.two_header  p {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content-modal-right-menu-hidden {
  animation: width-replace 1s 1 ease;
}
.content-modal-right-menu-hidden>div {
  animation: hidden-content-replace 1s 1 ease;
}
.content-modal-right-menu {
  animation: width 1s 1 ease;
  width: 50vw;
}
.left-block-modal {
  width: 50vw;
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
    width: 50vw;
  }
}
@keyframes width-right {
  from {
    width: 0vw;
  }
  to {
    width: 50vw;
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
    width: 50vw;
  }
  to {
    width: 00vw;
  }
}
@keyframes width-right-replace {
  from {
    width: 50vw;
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