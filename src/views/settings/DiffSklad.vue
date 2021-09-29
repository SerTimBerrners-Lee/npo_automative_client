<template>
    <div>
        <h3>10. Настройки для отображения</h3>
        <div class="block">
            <div>
                <span>Минимальный остаток: </span>
                <p>
                    <input type="text" 
                        v-model="minRemainder"
                        @keyup="update"
                    >
                    <span>мес. потребление</span> 
                </p>
            </div>
            <div>
                <span>Рекомендуемый остаток: </span>
                <p>
                    <input type="text"  
                        v-model="recommendedRemainder"
                        @keyup="update"
                    >
                    <span>мес. потребление</span> 
                </p>
            </div>
        </div>

           <div class="btn-control out-btn-control" 
                 v-if='updateDeficit' style='margin-top: 30px;'>
                <button class="btn-status btn-black" 
                        style="height: 0px;" 
                        @click='setUpdate' >
                        Обновить значения</button>
            </div>
    </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'
export default {
    data() {
        return {
            minRemainder: 0,
            recommendedRemainder: 0,
            id: null,

            updateDeficit: false
        }
    },
    computed: mapGetters(['getDeficit']),
    methods: {
        ...mapActions(['fetchDeficit', 'fetchUpdateDeficit']),
        update() {
            if(isNaN(this.minRemainder) || isNaN(this.recommendedRemainder) ||
                this.minRemainder.length > 1 || this.recommendedRemainder.length > 1) {
                if(this.getDeficit && this.getDeficit.length) {
                    this.minRemainder = this.getDeficit[0].minRemainder
                    this.recommendedRemainder = this.getDeficit[0].recommendedRemainder
                }
                return false
            }

            this.updateDeficit = true

        },

        setUpdate() {
            this.fetchUpdateDeficit({
                minRemainder: Number(this.minRemainder),
                recommendedRemainder: Number(this.recommendedRemainder),
                id: this.id
            })

            this.updateDeficit = false
        }
    },
    async mounted() {
        await this.fetchDeficit()
        if(this.getDeficit && this.getDeficit.length) {
            this.minRemainder = this.getDeficit[0].minRemainder
            this.recommendedRemainder = this.getDeficit[0].recommendedRemainder
            this.id = this.getDeficit[0].id
        }
    }
}
</script>

<style scoped>
    .block>div * {
        margin: 5px;
    }
    .block>div input {
        width: 10px;
        padding: 5px;
    }
    .block>div {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>