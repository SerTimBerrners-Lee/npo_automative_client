<template>
        <div class="container">
        <h3>Покупные детали (типы и подтипы)</h3>
        <div class="cont">
            <div class="cont scroll-table scrolls-type-490">
                <table class="type-table">
                    <tr>
                        <th class="width-350">Тип (Категория)</th>
                    </tr>
                    <tr class="td-row" v-for="i in 20" :key="i">
                        <td>...</td>
                    </tr>
                </table>
            </div>
            <div class="btn-control">
                    <button class="btn-small">Удалить</button>
                    <button class="btn-small">Редактировать</button>
                    <button class="btn-add btn-small">Создать</button>
            </div>
        </div>
        <div class="cont">
            <div class="cont scroll-table scrolls-type-490">
                <table class="type-table">
                    <tr>
                        <th class="width-350">Подтип (Материал)</th>
                    </tr>
                    <tr class="td-row" v-for="i in 20" :key="i">
                        <td>...</td>
                    </tr>
                </table>
            </div>
            <div class="btn-control">
                    <button class="btn-small">Удалить</button>
                    <button class="btn-small">Редактировать</button>
                    <button class="btn-add btn-small">Создать</button>
            </div>
        </div>
    </div>
</template>