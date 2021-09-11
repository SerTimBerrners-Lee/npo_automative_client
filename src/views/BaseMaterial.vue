<template>
    <div>
        <div class="nav-base-file-page">
            <div class="left-div-bfp">
                <h3>База материалов</h3>
                <div class="type-issue">
                    <span ref="all" class='active' @click='e => instansMaterial(0, e.target)'>Все</span>
                    <span @click='e => instansMaterial(1, e.target)'>Материалы для деталей</span>
                    <span @click='e => instansMaterial(2, e.target)'>Покупные детали</span>
                    <span @click='e => instansMaterial(3, e.target)'>Расходные материалы</span>
                </div>
                <div class="cont">
                   <div>
                        <TableMaterial :alltypeM='alltypeM' :title='"Тип (Тип профиля заготовки)"' :type='"type"' @clickMat='clickMat' />
                        <TableMaterial :alltypeM='allPodTypeM' :title='"Подтип (Материал заготовки)"' :type='"podM"' @clickMat='clickMat' />
                        <TableMaterial :alltypeM='getOnePodMaterial' :title='"Наименование (Марка / типоразмер)"' :type='"podPM"' @clickMat='clickMat' />
                   </div>
                    <div class="btn-control" style="margin-top: 10px;">
                        <button class="btn-small btn-add" @click="$router.push({path: '/material/add/create'}) ">Создать</button>
                        <button class="btn-small btn-add" >Создать копированием</button>
                        <button class="btn-small" @click="editMaterial">Редактировать</button>
                    </div>  
                    <div class="btn-control">
                    <button class="btn-small" @click='banPPM'>В архив</button>
                </div>
                </div>
            </div>
            <div class="right-div-bfp">
                <h3>Принадлежность</h3>
                <div class="block" style='width: 400px;'>
                    <h3>Изделие</h3>
                    <div class="scroll-table table-fbp">
                        <table>
                        <tr>
                            <th>Артикул </th>
                            <th>Наименование</th>
                        </tr>
                        <tr class="td-row">
                            <td>...</td>
                            <td>...</td>
                        </tr>
                        <tr class="td-row">
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
                        <tr class="td-row" v-for='i in 3' :key='i'>
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
            <OpensFile 
                :parametrs='itemFiles' 
                v-if="itemFiles != null" 
                @unmount='openFile'
                :key='keyWhenModalGenerateFileOpen'
            />
        </div>
    </div>
</template> 

<script>

import TableMaterial from '@/components/mathzag/table-material.vue'
import OpensFile from '@/components/filebase/openfile.vue'
import random from 'lodash'

import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
    data() {
        return {
            material: null,
            podMaterial: null,
            podPodMaterial: null,
            itemFiles: null,
            keyWhenModalGenerateFileOpen: random(10, 384522333213313324),
            span: null
        }
    },
    components:{TableMaterial, OpensFile},
    computed: mapGetters(['alltypeM', 'allPodTypeM', 'getOnePodMaterial']),
    methods: {
        ...mapActions(['getAllTypeMaterial', 'getOnePodType', 'bannedPPM', 'fetchGetOnePPM', 'getAllPodTypeMaterial']),
        ...mapMutations(['filterMatByPodType', 'addOnePPTyep', 'getInstansMaterial', 'throwInstans']),
        instansMaterial(instans, span) {
            this.getInstansMaterial(instans)

            if(!this.span)
                this.span = (this.$refs.all)
            this.span.classList.remove('active')
            span.classList.add('active')
            this.span = span
        },
        clickMat(mat, type) {
            if(type == 'type') 
                this.material = mat

            if(type == 'podM') this.getOnePodType(mat.id)
            if(type == 'podPM') {
                this.podPodMaterial = mat
                this.fetchGetOnePPM(mat.id).then((material) => {
                    this.podPodMaterial = material
                    if(this.podPodMaterial.documents && this.podPodMaterial.documents.length > 0) { 
                        this.itemFiles = this.podPodMaterial.documents
                        this.keyWhenModalGenerateFileOpen = random(10, 384522333213313324)
                    }
                })
            }
        },
        editMaterial() {
            if(!this.podPodMaterial) return 0
            this.addOnePPTyep(this.podPodMaterial)
            this.$router.push({path: '/material/add/edit'}) 
        },
        banPPM() {
            if(!this.podPodMaterial) return 0
            this.bannedPPM(this.podPodMaterial.id)
        },
        openFile(res) {
            console.log(res)
        }
    },
    async mounted() {
        this.getAllTypeMaterial()
        this.getAllPodTypeMaterial()
    }
}
</script>

<style scoped>
    .type-issue {
     user-select: none;   
    }
    .table-fbp {
        width:100%;
        max-height: 250px;
        height: auto;
    }
    .cont {
        display: flex;
        flex-direction: column;
    }
    .nav-base-file-page {
        display: flex;
    }
    .right-div-bfp {
        width: 414px;
        margin-left: 10px;
    }
    th {
        width: 350px;
    }
    .active {
        color: rgb(12, 64, 221);
    }
</style>