<template>
<div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
        <div :class='destroyModalRight'>
           <div :style="hiddens">

                <div class="nav-base-file-page"> 
            <div class="left-div-bfp">
                <h3>База файлов</h3>
                <div class="type-issue">
                    <span @click="e => getType('all', e.target)" ref="allFilesLink">Все</span>
                    <span @click="e => getType('banned', e.target)">Архив</span>
                    <span @click="e => getType('noInstans', e.target)">Неприсвоенные</span>
                    <span @click="e => getType('NonType', e.target)">Без типа</span>
                </div>
                <div class="type-issue">
                    <span @click="e => getType('МД', e.target)">Медиа (тип МД)</span>
                    <span @click="e => getType('КД', e.target)">Конструкторская документация (тип КД)</span>
                    <span @click="e => getType('ЧЖ', e.target)">Чертижи (тип ЧЖ)</span>
                    <span @click="e => getType('СД', e.target)">Сопутствующие документы (тип СД)</span>
                </div> 

                <div class="scroll-table" style="height: 600px;">
                    <Tables v-if="nowType == 'all'" 
                        :documents='allFiles' 
                        @pushFile='getFilesToClick' 
                        @dbPushFile='dbPushFile'
                        @keySearch='keySearch'/>
                    <Tables v-if="nowType == 'banned'" 
                        :documents='banFiles' 
                        @pushFile='getFilesToClick'
                        @dbPushFile='dbPushFile'
                        @keySearch='keyBanSearch'   />
                    <Tables v-if="nowType == 'typesFile'" 
                        :documents='arrFileGet' 
                        @pushFile='getFilesToClick'
                        @dbPushFile='dbPushFile'
                        @keySearch='keySearch'   />
                </div>
                <div class="btn-control">
                    <button class="btn-small btn-add"
                        @click='addFile'>Выбрать</button>
                </div>

                <!-- File List -->
                 <div v-if='modalArrFiles.length > 0'>
                    <table>
                        <tr>
                            <th>Выбранное</th>
                            <th>Действие</th>
                        </tr>
                        <tr v-for='file of modalArrFiles' :key='file'>
                            
                            <td>{{ file.name }}</td>
                            <td class='delete_span' 
                                @click='delFile(file.id)'>удалить</td>
                        </tr>
                    </table>
                </div>
                <div class="btn-control out-btn-control">
                    <button class="btn-status btn-black" 
                            style="height: 0px;" 
                            @click='returmFileSelectList' 
                            v-if='modalArrFiles'>
                            Добавить выбранное</button>
                </div>
            </div>
        </div>
        <InformFolder  :title='titleMessage'
            :message = 'message'
            :type = 'type'
            v-if='showInformPanel'
            :key='keyInformTip'
        />
        <OpensFile 
                :parametrs='itemFiles' 
                v-if="WhenModalGenerateFileOpenShow" 
                @unmount='unmount'
                :key='keyWhenModalGenerateFileOpen'
            />
               
         </div>
        </div>
</div> 
</template>

<script>

import { mapGetters, mapActions, mapMutations } from 'vuex'
import { getReversDate, showMessage } from '@/js/'
import InformFolder from '@/components/InformFolder.vue'
import Tables from '@/components/filebase/tables.vue'
import OpensFile from '@/components/filebase/openfile.vue'
import { random }  from 'lodash'

export default {

  props: ['fileArrModal'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'opacity: 1;',

        itemFiles: null,
            changeType: 'Изменить тип',
            titleMessage: '',
            message: '',
            type: '',
            showInformPanel: false,
            keyInformTip: 0,
            typeDocs: ['МД', 'КД', 'ЧЖ', 'СД'],
            targetLink: null,
            nowType: 'all',
            arrFileGet: [],
            searchToArr: [],
            nowFileType: '',
            searchFileType: '',
            docFiles: [],
            keyWhenModalGenerate: random(10, 38444),
            keyWhenModalGenerateFileOpen: random(10, 38444),

            WhenModalGenerateFileOpenShow: false,
            
            modalArrFiles: [],
    }
  },
   computed: {
        ...mapGetters(['allFiles', 'banFiles']),
    },
 components: {InformFolder, Tables, OpensFile},
  methods: {
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
    },
    ...mapActions(['fetchFiles', 'bannedFiles', 'checkedType', 'fetchFileById', 'setDetalForFile']),
    ...mapMutations(['searchToFiles', 'searchToBanFiles']),
    getDateRevers(date) {
            return getReversDate(date).date
        },
        getFilesToClick(file) {
            // this.fetchFileById(file.id).then((res) => {
            //     this.itemFiles = res
            // })
            this.itemFiles = file

        },
        addFile() {
            if(!this.itemFiles)
                return
            this.modalArrFiles.push(this.itemFiles)
        },
        dbPushFile(file) {
            if(this.itemFiles) {
                this.keyWhenModalGenerateFileOpen = random(5, 9373e2)
                this.WhenModalGenerateFileOpenShow = true
            }else {
                this.fetchFileById(file.id).then((res) => {
                this.itemFiles = res
                this.keyWhenModalGenerateFileOpen = random(5, 9373e2)
                this.WhenModalGenerateFileOpenShow = true
                })
            }
        },
        addingFileToDetal() {
            if(this.itemFiles) {
                this.generateKeyBFM = random(5, 9373e2)
                this.showBFM = true
            }
        },
        changeTypeF() {
            if(!this.itemFiles)
                return showMessage('', 'Вы не выбрали файл', 'w', this)
            if(this.itemFiles.type == this.changeType)
                return showMessage('', 'Файлу уже присвоен выбранный вами Тип', 'w', this)
            this.typeDocs.forEach(type => {
                if(type == this.changeType) 
                    this.checkedType({id: this.itemFiles.id, type: this.changeType})
                    .then(f => {
                        showMessage('', f.message, f.type, this);
                        if(this.nowType == 'typesFile') 
                            this.getType(this.itemFiles.type, this.targetLink, this.itemFiles.id)
                        this.changeType = 'Изменить тип'
                    })
            })
        },
        changeBanned() {
             if(!this.itemFiles)
                return showMessage('', 'Вы не выбрали файл', 'w', this)

            this.bannedFiles(this.itemFiles).then(f => {
                showMessage('', f.message, f.type, this)
                this.getType(this.nowType)
            })
        },
        getType(types, e = this.targetLink, id = null) {
            if(this.targetLink)
                this.targetLink.style.color = 'black'
                
            this.targetLink = e
            if(this.nowType == 'typesFile')
                this.nowFileType = types
            this.targetLink.style.color = '#0c40dd'
            switch(types) {
                case 'all':
                    this.nowType = 'all'
                    break;
                case 'banned':
                    this.nowType = 'banned'
                    break;
                case 'МД':
                    this.nowType = 'typesFile'
                    if(id)
                        return this.arrFileGet = this.arrFileGet.filter(f => f.id != id) 
                    this.arrFileGet = this.allFiles.filter(f => f.type == 'МД')
                    break;
                case 'КД':
                    this.nowType = 'typesFile'
                    if(id)
                        return this.arrFileGet = this.arrFileGet.filter(f => f.id != id) 
                    this.arrFileGet = this.allFiles.filter(f => f.type == 'КД')
                    break;
                case 'ЧЖ':
                    this.nowType = 'typesFile'
                    if(id)
                        return this.arrFileGet = this.arrFileGet.filter(f => f.id != id) 
                    this.arrFileGet = this.allFiles.filter(f => f.type == 'ЧЖ')
                    break;
                case 'СД':
                    this.nowType = 'typesFile'
                    if(id)
                        return this.arrFileGet = this.arrFileGet.filter(f => f.id != id) 
                    this.arrFileGet = this.allFiles.filter(f => f.type == 'СД')
                    break;
                case 'noInstans': 
                    this.nowType = 'typesFile'
                    this.arrFileGet = this.allFiles.filter(f => f.nameInstans == '')
                    break;
                case 'NonType':
                    this.nowType = 'typesFile'
                    if(id)
                        return this.arrFileGet = this.arrFileGet.filter(f => f.id != id) 
                    this.arrFileGet = this.allFiles.filter(f => f.type == '')
                    break;
            }   
        },
        unmount(res){
            if(!res) {
                this.docFiles = []
                return 0;
            }
            showMessage('', res.message, res.type, this)
            this.fetchFiles()
            this.getType('all')
        },
        keySearch(str) {
            if(this.nowType == 'all') {
                this.searchToFiles(str)
            }
            if(!this.searchToArr.length ) {
                this.searchToArr = this.arrFileGet
                this.searchFileType = this.nowFileType
            }

            this.arrFileGet = this.searchToArr
            this.arrFileGet = this.arrFileGet.filter(file => 
                file.name.slice(0, str.length).toLowerCase() == str.toLowerCase()
                )
        },
        keyBanSearch(str) {
            this.searchToBanFiles(str)
        },
        delFile(id) {
            this.modalArrFiles = this.modalArrFiles.filter(file => file.id != id)
        },
        returmFileSelectList() {
            this.$emit('unmount', this.modalArrFiles)
            this.destroyModalF()
        }
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'
    
    this.targetLink = this.$refs.allFilesLink
    this.fetchFiles().then(() => {
        this.getType('all')
    })

    if(this.$props.fileArrModal) 
        this.modalArrFiles = this.$props.fileArrModal
    
  }
}
</script>

<style scoped>
    .delete_span {
        padding-top: 2px;
    }
    .out-btn-control {
        margin-top: 20px;
    }
    .table-base-detal {
        float: left;
        width: 400px;
    }
    .table-base-detal tr {
        height: 65px;
    }
    .scroll-table {
        height: 600px;
        
    }
    .tb-title {
        height: 50px;
        text-align: center;
    }
    .btn-control {
        width: 94%;
        margin-top: 20px;
        flex-direction: column;
        align-items: flex-end;
    }
    .btn-control button {
        margin: 2px;
    }
    table {
        font-size: 14px;
    }
    .main_table_control {
        display: flex;
    }
    
.content-modal-right-menu-hidden {
    animation: width-replace 1s 1 ease;
}
.content-modal-right-menu-hidden>div {
    animation: hidden-content-replace 1s 1 ease;
}
.content-modal-right-menu {
    animation: width 1s 1 ease;
    height: 10000px;
    width: 50%;
}
.left-block-modal {
    width: 50%;
    height: 10000px;
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
        width: 1%;
    }
    to {
        width: 50%;
    }
}
@keyframes width-right {
    from {
        width: 0%;
    }
    to {
        width: 50%;
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
        width: 30vw;
    }
    to {
        width: 00vw;
    }
}
@keyframes width-right-replace {
    from {
        width: 70vw;
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