<template>
    <div class="cont scroll-table scrolls-type-490">
        <table class="type-table">
            <tr>
                <th :class="width ? width : 'width-350'">{{ title }}</th>
            </tr>
            <tr class="td-row" v-for='mat in alltypeM' :key='mat' @click='e =>  {active(e.target); $emit("clickMat", mat, type);}'>
                <td>{{ mat.name }}</td>
            </tr>
            <tr class="td-row" v-for="i in 20" :key="i">
                <td>...</td>
            </tr>
        </table>
    </div> 
</template>


<script>
export default {
    props: ['alltypeM', 'type', 'title', 'width'],
    data() {
        return {
            element: null
        }
    },
    methods: {
        active(e) {
            if(this.element) 
                this.element.classList.remove('td-row-all')
                
            this.element = e
            this.element.classList.add('td-row-all')
        }
    }
}
</script>