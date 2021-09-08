<template>
    <div class="main-dive">
        <h3>Материалы (типы и подтипы)</h3>
        <div class="cont">
            <TableMaterial :title='"Тип (Тип профиля заготовки)"' :alltypeM="alltypeM" :type='"type"' @clickMat="clickMat"/>
            <div class="btn-control">
                <button class="btn-add btn-small" @click='createEditMat("TYPE")'>Создать</button>
                <button class="btn-small"  @click='createEditMat("TYPE", "edit")'>Редактировать</button>
                <button class="btn-small" @click='removeItem("TYPE")'>Удалить</button>
            </div>
        </div>
        <div class="cont">
            <TableMaterial :title='"Подтип (Материал заготовки)"' :alltypeM="allPodTypeM" :type="'podT'" @clickMat="clickMat"/>
            <div class="btn-control">
                <button class="btn-add btn-small" @click='createEditMat("PODTYPE")'>Создать</button>
                <button class="btn-small" @click="createEditMat('PODTYPE', 'edit')">Редактировать</button>
                <button class="btn-small" @click="removePodType">Удалить</button>
            </div>
        </div>
        <addEditMat
                @unmount='unmount' 
                :parametrs='parametrs' 
                v-if='showIs'
                :key='keyModals' />
    </div>
</template>

<script>
import addEditMat from '@/components/mathzag/addeditmat.vue'
import { random } from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import TableMaterial from '@/components/mathzag/table-material.vue'

export default {
    data() {
        return {
            typeapp: 'create',
            showIs: false,
            keyModals: random(20, 2132356723547632),
            parametrs: {},
            itemsSelect: null,
            material: null,
            podType: null
        }
    },
    computed: mapGetters(['allEdizm', 'alltypeM', 'allPodTypeM']), 
    components: {addEditMat, TableMaterial},
    methods: {
        ...mapActions(['getAllEdizm', 
            'createTypeM', 
            'getAllTypeMaterial', 
            'updateTypeM', 
            'removeMaterial', 
            'createPodType', 
            'deletePodType',
            'updatePodMaterial',
            'getAllPodTypeMaterial'
        ]),
        unmount(res) {
            if(!res)
                return 0;
            if(res.type == 'create') {
                this.createTypeM(res.data)
            }
            if(res.type == 'edit') {
                this.updateTypeM(res.data)
            }
            if(res.type == 'createPodMaterial') {
                this.createPodType(res.data)
            }
            if(res.type == 'editPodMaterial') {
                this.updatePodMaterial(res.data)
            }
        },
        createEditMat(typeMat, type = 'create') {
            if(typeMat == 'TYPE' && type == 'create') {
                this.parametrs = {
                    type,
                    mat: typeMat,
                    edizm: this.allEdizm
                }
            } else if(typeMat == 'TYPE' && type == 'edit') {
                if(!this.material)
                    return 0;

                this.parametrs = { 
                    type,
                    mat: typeMat,
                    element: this.material,
                    edizm: this.allEdizm
                }
            }

            if(typeMat == 'PODTYPE' && type == 'create') {
                this.parametrs = {
                    type,
                    mat: typeMat,
                    edizm: this.allEdizm
                }
            }

            if(typeMat == 'PODTYPE' && type == 'edit') {
                if(!this.podType) return 0;
                this.parametrs = {
                    type,
                    material: this.podType,
                    mat: typeMat,
                    edizm: this.allEdizm 
                }
            }
            this.keyModals = random(20, 2132356723547632)
            this.showIs = true
        },
        clickMat(mat, type) {
            if(type == 'type') {
                this.material = mat
            }
            if(type == 'podT') {
                this.podType = mat
            }
        },
        removePodType() {
            if(!this.podType) return null
            this.deletePodType(this.podType.id)
        },
        removeItem(type = 'TYPE') {
            if(!this.material) return 0;
            if(type == 'TYPE') {
                this.removeMaterial(this.material.id)
                this.material = null
            }
        }
    },
    async mounted() {
        this.getAllEdizm()
        this.getAllTypeMaterial()
        this.getAllPodTypeMaterial()
    }
}
</script>


<style scoped>


 
</style>