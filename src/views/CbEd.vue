<template>
    <div class='main_cbed'>
        <div class='block_cb_ed'>
            <h3>База сборочных единиц</h3>
             <div class="main_table_control">
                <div class="scroll-table" >
                <table class="table-base-detal">
                    <tr>
                        <th colspan="3" scope="col">Изделие</th>
                    </tr>
                    <tr>
                        <th>Заводской номер</th>
                        <th>Артикул</th>
                        <th>Наименование</th>
                    </tr>
                    <tr >
                        <td class="tb-title" colspan="3" scope="col"> Без назначенного изделия </td>
                    </tr> 
                    <tr v-for="item in 40" :key="item">
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </table>
                </div>
                <div class="scroll-table" >
                    <table class="table-base-detal">
                        <tr>
                            <th colspan="3" scope="col">Сборочная единица (Тип СБ)</th>
                        </tr>
                        <tr>
                            <th>Артикул</th>
                            <th>Наименование</th>
                            <th>Кол-во СБ на Изделие</th>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <Search 
                                    :placeholder="'Поиск по Артиклу'"
                                    @unmount='keySearch' 
                                />
                            </td>
                        </tr>
                         <tr v-for='cb in allCbed' 
                            :key='cb'
                            class='td-row'
                            @click='e => setDetals(cb, e.target.parentElement)'>
                            <td>{{ cb.articl }}</td>
                            <td>{{ cb.name }}</td>
                            <td></td>
                        </tr>
                        <tr v-for="item in 42" :key="item">
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="btn-control">
                <p>
                        <button class="btn-small btn-add" @click='create'>Создать</button>
                        <button class="btn-small btn-add" @click='createCopy'>Создать копированием</button>
                        <button class="btn-small" @click='editCbEd'>Редактировать</button>
                </p>
                    <p>
                        <button class="btn-small" @click='deleteCbEd'>В архив</button>
                    </p>
            </div>
        </div>
        
        <div class="right_info_block" v-if='selectedCbEd'>
            <h3>Краткая Информация о сборочной единице</h3>
        <div class="block">
            <p>
            <span class="title_span">Наименование: </span><span>{{ selectedCbEd.name }}</span>
            </p>
            <!-- <MediaSlider v-if='equipment.documents.length' :data='equipment.documents' :key='equipment.documents' /> -->
            <div>
            <span>Описание / Примечание</span>
            <textarea style="width: 90%; height: 120px;" cols="30" rows="10" :value='selectedCbEd.description'> </textarea>
            </div>
            <div v-if='selectedCbEd.documents.length > 0'>
                <h3>Документы</h3>
                <table style="width: 100%;">
                    <tr>
                        <th>Файл</th>
                    </tr> 
                    <tr class="td-row" v-for='doc in selectedCbEd.documents' :key='doc'
                         @click='setDocs(doc)'>
                        <td>{{ doc.name }}</td>
                    </tr>
                </table>
                <div class="btn-control" style='width: 100%'>
                <button class="btn-small" @click='openDock'>Открыть</button>
                </div>
                <OpensFile 
                    :parametrs='itemFiles' 
                    v-if="showFile" 
                    @unmount='openFile'
                    :key='keyWhenModalGenerateFileOpen'
                />
            </div> 
        </div>
        </div>
    </div>
</template>
 
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import Search from '@/components/search.vue'
import OpensFile from '@/components/filebase/openfile.vue'
import { random } from 'lodash'

export default {
    data() {
        return {
            selectedCbEd: null,
            tr: null,

            itemFiles: null,
            showFile: false,
            keyWhenModalGenerateFileOpen: random(1, 23123)
        }
    },
    computed: mapGetters(['allCbed']),
    components: {Search, OpensFile},
    methods: {
        ...mapActions(['getAllCbed']),
        ...mapMutations([]),
        setDetals(cbEd, e) {
            this.selectedCbEd = cbEd
             if(this.tr) 
                this.tr.classList.remove('td-row-all')
            
            this.tr = e
            this.tr.classList.add('td-row-all')
        },
        editCbEd() {
            if(!this.selectedCbEd)
                return 0

            // this.$router.push({path: '/detal/edit/false'})
        },
        create() {
            this.$router.push({path: '/cbed/create'})
        },
        createCopy() {
            if(!this.selectedCbEd)
                return 0

            // this.$router.push({path: '/detal/edit/true'})
        },
        keySearch(v) {
                console.log(v)
        },
        deleteCbEd() {
            if(!this.selectedCbEd)
                return 0
        },
        setDocs(dc) {
            this.itemFiles = dc
            this.showFile = true
            this.keyWhenModalGenerateFileOpen = random(1, 23123)
        },

    },


    async mounted() {
        this.getAllCbed()
    }
}
</script>

<style scoped>
    .block_cb_ed {
        width: 870px;
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
        width: 840px;
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
    .right_info_block {
        width: 450px;
        margin-top: 20px;
    }
    .main_cbed {
        display: flex;
    }

</style>