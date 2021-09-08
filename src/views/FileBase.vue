<template>
    <div>
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
                    <Tables v-if="nowType == 'all'" :documents='allFiles' @pushFile='getFilesToClick' />
                    <Tables v-if="nowType == 'banned'" :documents='banFiles' @pushFile='getFilesToClick'   />
                    <Tables v-if="nowType == 'typesFile'" :documents='arrFileGet' @pushFile='getFilesToClick'   />
                </div>
                <div class="pointer-files-to-add">
                        <label for="docsFileSelected">Перенесите сюда файлы или кликните для добавления с вашего компьютера.</label>
                        <input id="docsFileSelected" @change="e => addDock(e)" type="file" style="display:none;" required multiple>
                </div>
                <div class="btn-control">
                    <select class="select-small" v-model='changeType' @change="changeTypeF">
                        <option value="Изменить тип">Изменить тип</option>
                        <option value="МД">Медиа (тип МД)</option>
                        <option value="КД">Конструкторская документация (тип КД)</option>
                        <option value="ЧЖ">Чертижи (тип ЧЖ)</option>
                        <option value="СД">Сопутствующие документы (тип СД)</option>
                    </select>
                    <button class="btn-small">Присвоить к...</button>
                    <button class="btn-small">Редактировать</button>
                </div>
                <div class="btn-control">
                    <button class="btn-small" v-if='nowType == "banned"' @click='changeBanned'>Вернуть из архива</button>
                    <button class="btn-small" v-if='nowType != "banned"' @click='changeBanned'>В архив</button>
                </div>
            </div>
            <div class="right-div-bfp">
                <h3>Принадлежность</h3>
                <div class="block">
                    <h3>Изделие</h3>
                    <div class="scroll-table table-fbp">
                        <table>
                        <tr>
                            <th>Артикул </th>
                            <th>Наименование</th>
                        </tr>
                        <tr class="td-row" v-for="r in 2" :key="r">
                            <td>...</td>
                            <td>...</td>
                        </tr>
                    </table>
                    </div>
                    <h3>Сборочная единица</h3>
                    <div class="scroll-table table-fbp">
                        <table>
                        <tr class="td-row">
                            <th>Артикул </th>
                            <th>Наименование</th>
                        </tr>
                        <tr v-for="u in 50" :key="u" class="td-row">
                            <td>...</td>
                            <td>...</td>
                        </tr>
                    </table>
                    </div>
                    <h3>Деталь</h3>
                    <div class="scroll-table table-fbp">
                        <table>
                        <tr class="td-row">
                            <th>Артикул </th>
                            <th>Наименование</th>
                        </tr>
                        <tr class="td-row" v-for="r in 3" :key="r">
                            <td>...</td>
                            <td>...</td>
                        </tr>
                    </table>
                    </div>
                </div>
                <div class="btn-control">
                    <button class="btn-small">
                        Сохранить в виде отчета EXEL
                    </button>
                </div>
            </div>
        </div>
        <InformFolder  :title='titleMessage'
            :message = 'message'
            :type = 'type'
            v-if='showInformPanel'
            :key='keyInformTip'
        />
        <AddFile :parametrs='docFiles' 
                v-if="isChangeFolderFile" 
                @unmount='unmount'
                :return_files="push"
                :key='keyWhenModalGenerate' />
        <OpensFile 
                :parametrs='itemFiles' 
                v-if="itemFiles != null" 
                @unmount='unmount'
                :key='keyWhenModalGenerateFileOpen'
            />
    </div>
</template> 

<script>

import { mapGetters, mapActions } from 'vuex'
import { getReversDate, showMessage } from '@/js/'
import InformFolder from '@/components/InformFolder.vue'
import Tables from '@/components/filebase/tables.vue'
import AddFile from '@/components/filebase/addfile.vue'
import OpensFile from '@/components/filebase/openfile.vue'
import { random }  from 'lodash'

export default {
    data() {
        return {
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
            nowFileType: '',
            docFiles: [],
            isChangeFolderFile: false,
            keyWhenModalGenerate: random(10, 384522333213313324),
            keyWhenModalGenerateFileOpen: random(10, 384522333213313324)
        }
    },
    computed: {
        ...mapGetters(['allFiles', 'banFiles']),
    },
    components: {InformFolder, Tables, AddFile, OpensFile},
    methods: {
        ...mapActions(['fetchFiles', 'bannedFiles', 'checkedType']),
        getDateRevers(date) {
            return getReversDate(date).date
        },
        getFilesToClick(file) {
            this.itemFiles = file
            this.keyWhenModalGenerateFileOpen = random(5, 93732542367452)
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
        addDock(val) {
            val.target.files.forEach(f => {
                this.docFiles.push(f)
            })
            this.keyWhenModalGenerate = random(10, 384522333213313324)
            this.isChangeFolderFile = true
        }
    },
    async mounted() {
        this.targetLink = this.$refs.allFilesLink
        this.fetchFiles().then(() => {
            this.getType('all')
        })
    }
}
</script>

<style scoped>
    .table-fbp {
        width:100%;
        max-height: 250px;
        height: auto;
    }
    .table-fbp table {
        width: 100%
    }
    .nav-base-file-page {
        display: flex;
    }
    .right-div-bfp {
        width: 414px;
        margin-left: 10px;
    }
    .pointer-files-to-add {
        height: 120px;
        display: flex;
        width: 100%;
    }
    .pointer-files-to-add label {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
</style>