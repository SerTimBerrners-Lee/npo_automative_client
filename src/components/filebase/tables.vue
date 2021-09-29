<template>
    <table>
        <tr >
            <th>Тип</th>
            <th>Наименование</th>
            <th>Дата</th>
            <th>Примечание</th>
        </tr>
       <tr>
            <td colspan="4">
                <Search 
                    :placeholder="'Поиск по Артиклу'"
                    @unmount='keySearch' 
                />
            </td>
        </tr>
        <tr v-for="file in documents" 
            :key="file" 
            class="td-row" 
            @click="propEvent(file)"
            @dblclick="dbEvent(file)"
            >
            <td>{{ file.type }}</td>
            <td width="400px">{{ file.name }}</td>
            <td>{{ file.updatedAt ?
                getDateRevers(file.updatedAt)
                : '...' }}</td>
            <td class="width-350">{{ file.description }}</td>
        </tr>
        <tr v-for="h in 20" :key="h" class="td-row">
            <td>...</td>
            <td width="400px">...</td>
            <td>...</td>
            <td class="width-350">...</td>
        </tr>
    </table>
</template>

<script>
import { getReversDate } from '@/js/'
import Search from '@/components/search.vue'

export default {
    props: ['documents'],
    components: {Search},
    methods: {
        getDateRevers(date) {
            return getReversDate(date).date
        },
        propEvent(file) {
            this.$emit('pushFile', file)
        },
        dbEvent(file) {
            this.$emit('dbPushFile', file)
        },
        keySearch(str) {
            this.$emit('keySearch', str)
        }
    }
}
</script>

<style scoped>
table{
    user-select: none;
}
</style>