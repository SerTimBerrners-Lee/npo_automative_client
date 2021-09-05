<template>
    <div class="cont scroll-table scrolls-type-490">
        <table class="type-table">
            <tr>
                <th :class="width ? width : 'width-350'">{{ title }}</th>
            </tr>
            <tr class="td-row" v-for='mat in alltypeM' :key='mat' @click='$emit("clickMat", mat, type)'>
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
    props: ['alltypeM', 'type', 'title', 'width']
}
</script>