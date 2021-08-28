<template>
    <div class="main-dive">
        <h3>База инструмента и оснастки (типы и подтипы)</h3>
        <div class="cont">
            <div class="cont scroll-table scrolls-type-490">
                <table class="type-table">
                    <tr>
                        <th class="width-350">Тип инструмента или оснастки</th>
                    </tr>
                    <tr class="td-row" v-for="i in 20" :key="i">
                        <td>...</td>
                    </tr>
                </table>
            </div>
            <div class="btn-control">
                <button class="btn-add btn-small">Создать</button>
                <button class="btn-add btn-small">Редактировать</button>
                    <button class="btn-small">Удалить</button>
            </div>
        </div>
        <div class="cont">
            <div class="cont scroll-table scrolls-type-490">
                <table class="type-table">
                    <tr>
                        <th class="width-350">Подтип</th>
                    </tr>
                    <tr class="td-row" v-for="i in 20" :key="i">
                        <td>...</td>
                    </tr>
                </table>
            </div>
            <div class="btn-control">
                <button class="btn-add btn-small">Создать</button>
                <button class="btn-small">Редактировать</button>
                <button class="btn-small">Удалить</button>
            </div>
        </div>
    </div>
</template>