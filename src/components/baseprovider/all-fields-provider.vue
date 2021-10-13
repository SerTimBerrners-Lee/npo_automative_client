<template>
<div class="right-menu-modal">
        <div :class='destroyModalLeft' @click="destroyModalF"></div>
        <div :class='destroyModalRight'>
           <div :style="hiddens">
                <div> 
                    <div class="flex-box-main">
                        <div class="left-block-bprovider">
                            <h3>База поставщиков</h3>
                            <div class="scroll-table">
                                <table class="provider_table_modal"> 
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
                                                <textarea maxlength='250' :value="obj.description" class="table_rek"></textarea>
                                                <h3>История изменений</h3>
                                            </div>
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
                    <OpensFile 
                        :parametrs='itemFiles' 
                        v-if="itemFiles != null" 
                        @unmount='openFile'
                        :key='keyWhenModalGenerateFileOpen'
                    />
                </div>
           </div>
        </div>
    </div>

</template>

<script>
import OpensFile from '@/components/filebase/openfile.vue'
import random from 'lodash'

export default {
  props: ['allProvider'],
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
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'opacity: 1;',
      provider: null,
      itemFiles: null,
      keyWhenModalGenerateFileOpen: random(10, 999)
    }
  },
  components: {OpensFile},
  methods: {
    clickDoc(files) {
      if(files) { 
        this.itemFiles = files
        this.keyWhenModalGenerateFileOpen = random(10, 999)
      }
    },
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
    },
    setProvider(provider) {
      this.provider = provider
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
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'
    if(this.$props.allProvider) {
      this.setProvider(this.$props.allProvider[0])
    }
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

.main-fb-modal-block p {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
.main-fb-modal-block {
  display: flex;
  flex-wrap: wrap;
  width: 64%;
  justify-content: space-between;
}
.main-fb-modal-block>p * {
  margin-left: 10px;
}
.fb-img-block {
  width: 36%;
  float: left;
  height: 190px;
}
.scroll-table {
  width: 98%;
  height: 78vh;
}
.out-btn-control {
  margin-top: 10px;
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
  width: 100%;
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

  width: 80vw;
}
.left-block-modal {
  width: 20vw;
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
    width: 80vw;
  }
}
@keyframes width-right {
  from {
    width: 0vw;
  }
  to {
    width: 20vw;
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
    width: 20vw;
  }
  to {
    width: 00vw;
  }
}
@keyframes width-right-replace {
  from {
    width: 80vw;
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