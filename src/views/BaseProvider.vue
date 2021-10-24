<template>
    <div> 
        <div class="flex-box-main">
            <div class="left-block-bprovider">
                 <h3>База поставщиков</h3>
                <div class="scroll-table">
                    <table class="provider_table"> 
                        <tr> 
                            <th>ИНН</th>
                            <th style="width: 440px;">Наименование поставщика</th>
                        </tr>
                        <tr v-for="provider in allProvider" 
                        :key="provider" 
                        class="td-row"
                        @click="setProvider(provider)">
                            <td>{{ provider.inn }}</td>
                            <td>{{ provider.name }}</td>
                        </tr>
                        <tr v-for="i in 10" :key="i">
                            <td>...</td><td>...</td>
                        </tr>
                    </table>
                </div>
                <div class="btn-control">
                    <button class="btn-small btn-add" @click="$router.push({path: '/baseprovider/addedit/add'})">Создать</button>
                    <button class="btn-small" @click="editProvider">Редактировать</button>
                    <button class="btn-small" @click="banProvider">В архив</button>
                </div>
                <h3>Фильтр по материалу</h3>
               <div >
                
                                    <div class="scroll-table" style="width: 100%; display: flex; height: fit-content;   " >
                                        <table style="width: 33%; height: max-content;"> 
                                            <tr>
                                                <th>Тип</th>
                                            </tr>
                                             <tr>
                                                <td>
                                                    <Search 
                                                        :placeholder='`Поиск `'
                                                       @unmount='searchGT' 
                                                    />
                                                </td>
                                             </tr>
                                            <tr v-for='t in getGlobalProviderTypeM' 
                                                :key='t'
                                                class='td-row'>
                                                <td>{{ t.name }}</td>
                                            </tr>
                                        </table>
                                        <table style="width: 33%; height: max-content;"> 
                                            <tr>
                                                <th>Подтип</th>
                                            </tr>
                                             <tr>
                                                <td>
                                                    <Search 
                                                        :placeholder='`Поиск `'
                                                        @unmount='searchGPT' 
                                                    />
                                                </td>
                                             </tr>
                                            <tr v-for='t in getGlobalProviderPTypeM' 
                                                :key='t'
                                                class='td-row'
                                                >
                                                <td>{{ t.name }}</td>
                                            </tr>
                                        </table>
                                        <table style="width: 33%; height: max-content;"> 
                                            <tr>
                                                <th>Наименование</th>
                                            </tr>
                                             <tr>
                                                <td>
                                                    <Search 
                                                        :placeholder='`Поиск `'
                                                        @unmount='searchGName' 
                                                    />  
                                                </td>
                                             </tr>
                                            <tr 
                                                class='td-row' 
                                                v-for='t in getGlobalProviderPM' 
                                                :key='t'
                                                @click='clicksGName(t)'>
                                                <td >{{ t.name}}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            <div class="btn-control">
                                <button class="btn-small" @click='clearFilter'>Сбросить фильтр </button>
                            </div>
            </div>
            <div class="right-block-bprovider">
                <h3>Подробная информация о поставщике</h3>
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
                                    <h3>История изменений</h3>
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
                                </div>
                                <div >
                                    <h3>Поставляемый материал</h3>
                                    <div class="scroll-table" style="width: 100%; display: flex; height: fit-content;   " >
                                        <table style="width: 33%; height: max-content;"> 
                                            <tr>
                                                <th>Тип</th>
                                            </tr>
                                             <tr>
                                                <td>
                                                    <Search 
                                                        :placeholder='`Поиск `'
                                                        @unmount='searchMat' 
                                                    />
                                                </td>
                                             </tr>
                                            <tr v-for='t in getproviderTypeM' 
                                                :key='t'
                                                class='td-row'
                                                @click='filterByType(t)'>
                                                <td>{{ t.name }}</td>
                                            </tr>
                                        </table>
                                        <table style="width: 33%; height: max-content;"> 
                                            <tr>
                                                <th>Подтип</th>
                                            </tr>
                                             <tr>
                                                <td>
                                                    <Search 
                                                        :placeholder='`Поиск `'
                                                        @unmount='searchPT' 
                                                    />
                                                </td>
                                             </tr>
                                            <tr v-for='t in getproviderPTypeM' 
                                                :key='t'
                                                class='td-row'
                                                @click='filterByPType(t)'>
                                                <td>{{ t.name }}</td>
                                            </tr>
                                        </table>
                                        <table style="width: 33%; height: max-content;"> 
                                            <tr>
                                                <th>Наименование</th>
                                            </tr>
                                             <tr>
                                                <td>
                                                    <Search 
                                                        :placeholder='`Поиск `'
                                                        @unmount='searchName' 
                                                    />
                                                </td>
                                             </tr>
                                            <tr v-for='t in getproviderMaterial' :key='t'>
                                                <td>{{ t.name}}</td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div class="btn-control">
                                        <button class="btn-small" @click='clearFilterByNode'>Сбросить</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3>Поставки поставщиков</h3>
                            <div class="scroll-table">
                                <table>
                                    <tr>
                                        <th>№ Заказа</th>
                                        <th>Дата создания</th>
                                        <th>№ счета и Дата</th>
                                        <th>Сумма, руб.</th>
                                        <th>Дата прихода</th>
                                        <th>Статус</th>
                                        <th>Подробнее</th>
                                    </tr>
                                    <tr v-for="uu in 40" :key="uu" class="td-row">
                                        <td>...</td>
                                        <td>...</td>
                                        <td>...</td>
                                        <td>...</td>
                                        <td>...</td>
                                        <td>...</td>
                                        <td>...</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                <div class="btn-control block endgroup">
                    <button class=" btn-black">Печать подробной информации о поставщике</button>
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
    </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import OpensFile from '@/components/filebase/openfile.vue'
import random from 'lodash'
import Search from '@/components/search.vue'

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
      materials: [],
      provider: null,

      itemFiles: null,
      keyWhenModalGenerateFileOpen: random(10, 1222),

      sName: '',
      sPT: '',
      sMat: ''
    }
  },
  computed: mapGetters(['allProvider', 
    'getproviderTypeM', 
    'getproviderPTypeM', 
    'getproviderMaterial',
    'getGlobalProviderTypeM',
    'getGlobalProviderPTypeM',
    'getGlobalProviderPM']),
  components: {OpensFile, Search},
  methods: {
    ...mapActions(['fetchGetProviders', 
        'fetchProviderBan', 
        'getAllTypeMaterial', 
        'getAllPodTypeMaterial', 
        'fetchGetAllPPM']),
    ...mapMutations(['setProviderState', 
    'filterMaterialByProvider', 
    'filterByProviderPM',
    'filterByProviderPTypeM',
    'filterByProviderTypeM',
    'filterToClickProviderTypeM',
    'filterToClickProviderPTypeM',
    'globalProviderFilter',
    
    'filterByProviderGTypeM',
    'filterByProviderGPTypeM',
    'filterByProviderGNameM',

    'filterPByMaterial',
    'clearFilterProviders'
    ]),
    setProvider(provider) {
      this.materials = provider.materials;
      if(this.materials) 
        this.filterMaterialByProvider(this.materials);
      this.provider = provider
      this.setProviderState(provider)
      this.obj.name = provider.name
      this.obj.inn = provider.inn
      this.obj.cpp = provider.cpp
      this.obj.description = provider.description
      if(provider.contacts) 
        this.obj.contact = JSON.parse(provider.contacts)
      
      if(provider.rekvisit) 
        this.obj.rekvisit = JSON.parse(provider.rekvisit)
      
      if(provider.documents) 
        this.obj.documents = provider.documents
        
    },
    clickDoc(files) {
      if(files) { 
        this.itemFiles = files
        this.keyWhenModalGenerateFileOpen = random(10, 1222)
      }
    },
    banProvider() {
      if(!this.provider.id)
        return 0;
      this.fetchProviderBan(this.provider.id)
    },
    editProvider() {
      if(!this.provider)
        return 0;
      this.$router.push({path: '/baseprovider/addedit/edit'})
    },
    keySearch(key) {
      console.log(key)
    },
    sNameF(str) {
      this.sName = str
    },
    sPTF(str) {
      this.sPT = str
    },
    sMatF(str) {
      this.sMat = str
    },
    searchName(str) {
      this.filterByProviderPM(str)
    },
    searchPT(str) {
      this.filterByProviderPTypeM(str)
    },
    searchMat(str) {
      this.filterByProviderTypeM(str)
    },


    filterByType(t) {
      this.filterToClickProviderTypeM(t)
    },
    filterByPType(t) {
      this.filterToClickProviderPTypeM(t)
    },

    searchGT(t) {
      this.filterByProviderGTypeM(t)
    },
    searchGPT(t) {
      this.filterByProviderGPTypeM(t)
    },
    searchGName(t) {
      this.filterByProviderGNameM(t)
    },
    clicksGName(t) {
      this.filterPByMaterial(t)
    },


    clearFilter() {
      this.clearFilterProviders()
    },
    clearFilterByNode() {
      if(this.materials.length)
        this.filterMaterialByProvider(this.materials);
    }
  },
  async mounted() {
    await this.fetchGetProviders()
    await this.getAllTypeMaterial()
    await this.getAllPodTypeMaterial()
    // При загрузки страницы начинаем фильтровать материал 
    this.globalProviderFilter(this.allProvider)
  }
}
</script>

<style scoped>
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
  width: 99%;
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