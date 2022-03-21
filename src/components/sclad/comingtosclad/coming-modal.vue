<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens">
        <h3>Создать приход. Накладная № 
          {{ parametrs + 1 }} от 
          {{ new Date().toLocaleString('ru-RU').split(',')[0] }} 
        </h3>
        <div class="block header_block">
          <span>Выбор поставщика:</span>
          <input type="text" :value='provider ? provider.name : ""' >
          <button class="btn-small" @click='addProvider'>Выбрать</button>
          <label for='prod'>Производство:</label>
          <input type="checkbox" id="prod">
        </div>

        <div>
          <h3>Потенциальные приходы от поставщика </h3>
          <div class="table-scroll">
            <table>
              <tr>
                <th
                  style='cursor: pointer;' 
                  @click='allItemsAdd'>
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
                  <p class="checkbox_block" @click='setProd(prod)'></p>
                </td>
                <td contenteditable="true" @keyup="e => editArt(inx, e.target.innerText)">
                  {{ prod.art }}
                </td>
                <td>{{ returnTypePosition(prod.type) }}</td>
                <td>{{ prod.name }}</td>
                <td>
                  <span :value='prod.ez' v-text='returnEzName(prod.ez)'></span>
                </td>
                <td>
                  <input type="number" 
                    @change="e => editKol(inx, e.target.value)"
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

        <div>
          <h3>Выбранные позиции</h3>
          <div class="table-scroll">
            <table>
              <tr>
                <th 
                  style='cursor: pointer;'
                  @click="allItemsDel">
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
                  <p class="checkbox_block_del" @click='delProd(prod)'></p>
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
    <Loader v-if='loader' />
    <InformFolder  
      :title='titleMessage'
      :message = 'message'
      :type = 'type'
      v-if='message'
      :key='keyInformTip'
    />
  </div>
</template>
<script>
import { showMessage } from '@/js/';
import { random, toNumber } from 'lodash';
import { returnEzName } from '@/js/edizm.js';
import AddPosition from './new-position.vue';
import { mapActions, mapGetters } from 'vuex';
import AddFile from '@/components/filebase/addfile.vue';
import { returnTypePosition, posToDeliveries } from '@/js/methods.js';
import ProviderList from '@/components/baseprovider/all-fields-provider.vue';

export default {
  props: ['parametrs'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'opacity: 1;',   

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

      product: [],
      selected_products: [],
      description: '',

      titleMessage: '',
      message: '',
      type: '',
      keyInformTip: 0,

      select_m: null,

      loader: false
    }
  },
  computed: {
    ...mapGetters(['getAllDeliveries']),
  },
  components: {AddFile, ProviderList, AddPosition},
  methods: {
    ...mapActions([
      'fetchGetProviders', 
      'fetchPushWaybillCreate', 
      'fetchGetDeliveriesCaming',
    ]),
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden';
      this.destroyModalRight = 'content-modal-right-menu-hidden';
      this.hiddens = 'display: none;';
    },
    unmount(e) {
      if(!e) return 0;
      this.formData = e.formData;
      if(this.formData.get('document'))
        this.document = this.formData.get('document').name;
    },
    unmount_provider(provider) {
      if(provider && provider.product) {
        this.provider = provider;
        this.product = provider.product;
      }
    },
    unmount_position(position_list) {
      if(!position_list) return false;
      
      for(const item of position_list) {
        const position = item.obj;
        position.type = item.type;

        const result = posToDeliveries(position, this.product);
        console.log(result, 'result');
        if(!result) continue;

        this.product.push(result);
      }
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
      // mampping providers
      let check = true
      for(let dev of this.getAllDeliveries) {
        for(let prov = 0; prov < this.allProvider.length; prov++) {
          if(this.allProvider[prov].id == dev.provider.id && this.allProvider[prov].product && this.allProvider[prov].product.length) {
            try {
              const pars = JSON.parse(dev.product);
              for(let d of pars) {
                this.allProvider[prov].product.push(d);
              }
            } catch (e) {console.error(e)}
            check = false;
          }
        }

        if(check) {
          try {
            const prod = JSON.parse(dev.product);
            if(prod && prod.length)
              this.allProvider.push({ ...dev.provider, product: prod});
          } catch(e) {console.error(e)}
        } else check = false;
    }
    },
    returnTypePosition(type) {
      return returnTypePosition(type)[0];
    },
    pushToServer() {
      if(!this.provider) return showMessage('', 'Выберите поставщика!', 'w', this);
      if(!this.formData.get('docs') && !this.formData.get('document'))
        return showMessage('', 'Обязательно прикрепите документ!', 'w', this);

      this.formData.append('provider_id', this.provider.id);
      this.formData.append('description', this.description);
      this.formData.append('product_list', JSON.stringify(this.selected_products));

      this.fetchPushWaybillCreate(this.formData);
      this.destroyModalF();
      this.$emit('unmount', null);
    },
    setProd(prod) {
      this.selected_products.push(prod);
      for(let inx in this.product) {
        if(this.product[inx].id == prod.id && this.product[inx].art == prod.art)
          this.product.splice(inx, 1);
      }
    },
    delProd(prod) {
      this.product.push(prod);
      for(let inx in this.selected_products) {
        if(this.selected_products[inx].id == prod.id && this.selected_products[inx].art == prod.art)
          this.selected_products.splice(inx, 1);
      }
    },
    allItemsAdd() {
      for(let prod of this.product) {
        this.selected_products.push(prod);
      }
      this.product = [];
    },
    allItemsDel() {
      for(let prod of this.selected_products) {
        this.product.push(prod);
      }
      this.selected_products = [];
    },
    newPosition() {
      this.key_position = random(1, 999);
      this.show_position = true;
    },
    editArt(inx, val) {
      this.product[inx].art = val;
    },
    editKol(inx, val) {
      let check = toNumber(val);
      if(!check) return this.product[inx].kol = 0;

      this.product[inx].kol = toNumber(val);
    },
    editSum(inx, val) {
      this.product[inx].sum = val;
    },
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal';
    this.destroyModalRight = 'content-modal-right-menu';
    this.hiddens = 'opacity: 1;';

    this.loader = true;
    await this.fetchGetDeliveriesCaming();
    this.editVariable();
    this.loader = false;
      
  },
}
</script>

<style scoped>
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
.header_block input{
  width: 50%;
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