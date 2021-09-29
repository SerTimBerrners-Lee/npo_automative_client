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
                        <TableMaterial 
                            :alltypeM='alltypeM' 
                            :title='instansLet != 0 && instansLet != 1 ? "Тип (Категория)" : "Тип (Тип профиля заготовки)"' 
                            :type='"type"' 
                            @search='searchTypeM'
                            @clickMat='clickMat' />
                        <TableMaterial 
                            :alltypeM='allPodTypeM' 
                            :title='instansLet != 0 && instansLet != 1 ? "Подтип (Материал)" : "Подтип (Материал заготовки)"' 
                            :type='"podM"' 
                            @search='searchPT'
                            @clickMat='clickMat' />
                        <TableMaterial 
                            :alltypeM='getOnePodMaterial' 
                            :title='"Наименование (Марка / типоразмер)"' 
                            :type='"podPM"' 
                            @search='searchM' 
                            @clickMat='clickMat' />
                   </div>
                    <div class="btn-control" style="margin-top: 10px;">
                        <button class="btn-small btn-add" @click="$router.push({path: '/material/add/create'}) ">Создать</button>
                        <button class="btn-small btn-add" @click='createCopy'>Создать копированием</button>
                        <button class="btn-small" @click="editMaterial">Редактировать</button>
                    </div>  
                    <div class="btn-control">
                    <button class="btn-small" @click='banPPM'>В архив</button>
                </div>
                </div>
            </div>
            <TableNode  
                v-if='this.podPodMaterial' 
                :material='podPodMaterial'
            />
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
import TableNode from '@/components/mathzag/table-node.vue'

import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
    data() {
        return {
            material: null,
            podMaterial: null,
            podPodMaterial: null,
            itemFiles: null,
            keyWhenModalGenerateFileOpen: random(10, 4e4),
            span: null,
            instansLet: 0
        }
    },
    components:{TableMaterial, OpensFile, TableNode},
    computed: mapGetters(['alltypeM', 'allPodTypeM', 'getOnePodMaterial']),
    methods: {
        ...mapActions(['getAllTypeMaterial', 
            'getOnePodType', 
            'bannedPPM', 
            'fetchGetOnePPM', 
            'getAllPodTypeMaterial',
            'fetchGetAllPPM']),
        ...mapMutations(['filterByNameMaterial', 'filterMatByPodType',
            'addOnePPTyep', 
            'getInstansMaterial', 
            'throwInstans',
            'searchTypeMutation', 
            'searchPTypeMutation', 
            'searchMaterialMutation']),
        instansMaterial(instans, span) {
            if(!this.span)
                this.span = (this.$refs.all)
            if(span.classList.contains('active')) 
                return 0  
            this.span.classList.remove('active')
            span.classList.add('active')
            this.span = span

            this.getInstansMaterial(instans)
            this.instansLet = instans

        },
        clickMat(mat, type) {
            if(type == 'type') {
                this.material = mat
                this.filterByNameMaterial(mat) 
                if(mat.podMaterials && this.instansLet != 1)
                    this.filterMatByPodType(mat.podMaterials)
            }
                

            if(type == 'podM') this.getOnePodType(mat.id)
            if(type == 'podPM') {
                this.podPodMaterial = mat
                this.fetchGetOnePPM(mat.id).then((material) => {
                    this.podPodMaterial = material
                    if(this.podPodMaterial.documents && this.podPodMaterial.documents.length > 0) { 
                        this.itemFiles = this.podPodMaterial.documents
                        this.keyWhenModalGenerateFileOpen = random(10, 384e4)
                    }
                })
            }
        },
        editMaterial() {
            if(!this.podPodMaterial) return 0
            this.addOnePPTyep(this.podPodMaterial)
            this.$router.push({path: '/material/add/edit'}) 
        },
        createCopy( ) {
            if(!this.podPodMaterial) return 0
            this.addOnePPTyep(this.podPodMaterial)
            this.$router.push({path: '/material/add/copy'}) 
        },
        banPPM() {
            if(!this.podPodMaterial) return 0
            this.bannedPPM(this.podPodMaterial.id)
        },
        openFile(res) { 
            console.log(res)
        },
        searchTypeM(val) {
            this.searchTypeMutation(val)
        },
        searchPT(val) {
            this.searchPTypeMutation(val)
        },
        searchM(val) {
            this.searchMaterialMutation(val)
        }
    },
    async mounted() {
        this.getAllTypeMaterial()
        this.getAllPodTypeMaterial()
        this.fetchGetAllPPM()
    }
}
</script>

<style scoped>
    .cont {
        display: flex;
        flex-direction: column;
    }
    .nav-base-file-page {
        display: flex;
    }
</style>