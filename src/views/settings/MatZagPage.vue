<template>
    <div class="main-dive">
        <h3>Материалы (типы и подтипы)</h3>
        <div class="cont">
            <div class="cont scroll-table scrolls-type-490">
                <table class="type-table">
                    <tr>
                        <th class="width-350">Тип (Тип профиля заготовки)</th>
                    </tr>
                    <tr class="td-row" v-for='mat in alltypeM' :key='mat' @click='clickMat(mat)'>
                        <td>{{ mat.name }}</td>
                    </tr>
                    <tr class="td-row" v-for="i in 20" :key="i">
                        <td>...</td>
                    </tr>
                </table>
            </div>
            <div class="btn-control">
                <button class="btn-add btn-small" @click='createEditMat("TYPE")'>Создать</button>
                <button class="btn-small"  @click='createEditMat("TYPE", "edit")'>Редактировать</button>
                <button class="btn-small" @click='removeItem("TYPE")'>Удалить</button>
            </div>
        </div>
        <div class="cont">
            <div class="cont scroll-table scrolls-type-490">
                <table class="type-table">
                    <tr>
                        <th class="width-350">Подтип (Материал заготовки)</th>
                    </tr>
                    <tr class="td-row" v-for="i in 20" :key="i">
                        <td>...</td>
                    </tr>
                </table>
            </div>
            <div class="btn-control">
                <button class="btn-add btn-small" @click='createEditMat("PODTYPE")'>Создать</button>
                <button class="btn-small">Редактировать</button>
                <button class="btn-small">Удалить</button>
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

export default {
    data() {
        return {
            typeapp: 'create',
            showIs: false,
            keyModals: random(20, 2132356723547632),
            parametrs: {},
            itemsSelect: null,
            material: null
        }
    },
    computed: mapGetters(['allEdizm', 'alltypeM']),
    components: {addEditMat},
    methods: {
        ...mapActions(['getAllEdizm', 'createTypeM', 'getAllTypeMaterial', 'updateTypeM', 'removeMaterial']),
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
                console.log(res.data)
            }
        },
        createEditMat(typeMat, type = 'create') {
            if(type == 'create') {
                this.parametrs = {
                    type,
                    mat: typeMat,
                    edizm: this.allEdizm
                }
            } else if(type == 'edit') {
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
                if(!this.material) return 0;
                this.parametrs = {
                    type, 
                    material: this.material,
                    mat: typeMat,
                    edizm: this.allEdizm
                }
            }
            this.keyModals = random(20, 2132356723547632)
            this.showIs = true
        },
        clickMat(mat) {
            this.material = mat
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
    }
}
</script>


<style scoped>


 
</style>