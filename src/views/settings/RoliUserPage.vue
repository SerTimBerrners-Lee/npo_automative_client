<template>
    <div>
        <h3>12. Роли пользователей</h3>
        <div class='header_block'> 
            <div>
                <span class="span-role">Роль: </span>
                <select 
                    name="sel" 
                    v-model='select_model'
                    @change='e => select_model_change(e.target.value)'
                    class="role-select">
                    <option value='Выбрать роль' disabled>Выбрать роль</option>
                    <option 
                        v-for='role in allRoles' 
                        :key='role' 
                        :value='role.id'>{{ role.description }}</option>
                </select>
            </div>

            <div v-if="getRoleAssets && getRoleAssets.assets.settingsAssets.edit">
                <button class="btn-add btn" @click='update' v-if="selectRole">Обновить
                    <unicon name="history" fill="black" />
                </button>
            </div>
        </div>
        <div class="cont-role-user" v-if='selectRole'>
            <div>
                <h3>Доступные разделы</h3>
                <div class="checkboxing-stil">
                    <span>Все: </span>
                    <div>
                        <div class="button r button-3">
                            <input 
                                type="checkbox" 
                                @change="allRasdel"
                                v-model="allChange"
                                class="checkbox" >
                            <div class="knobs"></div>
                            <div class="layer"></div>
                        </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Продукция: </span>
                    <div>
                        <div class="button r button-3">
                           <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.product = !selectRole.assets.product"
                                :checked='selectRole.assets.product'>
                            <div class="knobs"></div>
                            <div class="layer"></div>
                        </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Результаты работы: </span>
                    <div>
                        <div class="button r button-3">
                            <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.workResult = !selectRole.assets.workResult"
                                :checked='selectRole.assets.workResult'>
                            <div class="knobs"></div>
                            <div class="layer"></div>
                        </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Библиотека: </span>
                    <div>
                        <div class="button r button-3">
                            <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.linrary = !selectRole.assets.linrary"
                                :checked='selectRole.assets.linrary'>
                            <div class="knobs"></div>
                            <div class="layer"></div>
                        </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Задачи: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.issue = !selectRole.assets.issue"
                                :checked='selectRole.assets.issue'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>База сборочных едениц: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.baseCbed = !selectRole.assets.baseCbed"
                                :checked='selectRole.assets.baseCbed'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>База деталей: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.baseDetal = !selectRole.assets.baseDetal"
                                :checked='selectRole.assets.baseDetal'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>База материалов: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.baseMaterial = !selectRole.assets.baseMaterial"
                                :checked='selectRole.assets.baseMaterial'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>База инстр. и оснастки: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.baseTools = !selectRole.assets.baseTools"
                                :checked='selectRole.assets.baseTools'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>База оборудования: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.baseEquipment = !selectRole.assets.baseEquipment"
                                :checked='selectRole.assets.baseEquipment'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>База непр. техн. и инв.: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.baseTech = !selectRole.assets.baseTech"
                                :checked='selectRole.assets.baseTech'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>База поставщиков: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.baseProvider = !selectRole.assets.baseProvider"
                                :checked='selectRole.assets.baseProvider'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>База покупателей: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.baseBuyer = !selectRole.assets.baseBuyer"
                                :checked='selectRole.assets.baseBuyer'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>База файлов: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.baseFile = !selectRole.assets.baseFile"
                                :checked='selectRole.assets.baseFile'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Задачи на отгрузку: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.issueShipments = !selectRole.assets.issueShipments"
                                :checked='selectRole.assets.issueShipments'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Склад: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.sclad = !selectRole.assets.sclad"
                                :checked='selectRole.assets.sclad'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Металлообработка: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                            type="checkbox" 
                            class="checkbox" 
                            @change="selectRole.assets.metalloworking = !selectRole.assets.metalloworking"
                            :checked='selectRole.assets.metalloworking'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Сборка: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.assembly = !selectRole.assets.assembly"
                                :checked='selectRole.assets.assembly'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Брак: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.brak = !selectRole.assets.brak"
                                :checked='selectRole.assets.brak'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Отходы: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.trash = !selectRole.assets.trash"
                                :checked='selectRole.assets.trash'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Списание: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.writeOff = !selectRole.assets.writeOff"
                                :checked='selectRole.assets.writeOff'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Отчеты: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.raport = !selectRole.assets.raport"
                                :checked='selectRole.assets.raport'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Рекламация: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.complaint = !selectRole.assets.complaint"
                                :checked='selectRole.assets.complaint'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Архив: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                            type="checkbox" 
                            class="checkbox" 
                            @change="selectRole.assets.archive = !selectRole.assets.archive"
                            :checked='selectRole.assets.archive'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Запасной: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.spare = !selectRole.assets.spare"
                                :checked='selectRole.assets.spare'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
            </div>
            <div>
                <h3>Продукция НПО Автомотив</h3>
                <div class="checkboxing-stil">
                    <span>Просмотр: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                            type="checkbox" 
                            class="checkbox" 
                            @change="selectRole.assets.productAssets.read = !selectRole.assets.productAssets.read"
                            :checked='selectRole.assets.productAssets.read'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Редактировать свое: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.productAssets.writeYour = !selectRole.assets.productAssets.writeYour"
                                :checked='selectRole.assets.productAssets.writeYour'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Редактировать других: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.productAssets.writeSomeone = !selectRole.assets.productAssets.writeSomeone"
                                :checked='selectRole.assets.productAssets.writeSomeone'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
            </div>
            <div>
                <h3>Сотрудники</h3>
                <div class="checkboxing-stil">
                    <span>Скрыть личн. данные: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                            type="checkbox" 
                            class="checkbox" 
                            @change="selectRole.assets.usersListAssets.hideUserData = !selectRole.assets.usersListAssets.hideUserData"
                            :checked='selectRole.assets.usersListAssets.hideUserData'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Просмотр: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.usersListAssets.read = !selectRole.assets.usersListAssets.read"
                                :checked='selectRole.assets.usersListAssets.read'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Редактировать свое: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.usersListAssets.writeYour = !selectRole.assets.usersListAssets.writeYour"
                                :checked='selectRole.assets.usersListAssets.writeYour'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Редактировать других: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.usersListAssets.writeSomeone = !selectRole.assets.usersListAssets.writeSomeone"
                                :checked='selectRole.assets.usersListAssets.writeSomeone'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
            </div>
            <div>
                <h3>Себестоимость</h3>
                <div class="checkboxing-stil">
                    <span>Просмотр: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.costPriceAssets.read = !selectRole.assets.costPriceAssets.read"
                                :checked='selectRole.assets.costPriceAssets.read'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
            </div>
            <div>
                <h3>База файлов</h3>
                <div class="checkboxing-stil">
                    <span>Просмотр: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.basefileAssets.read = !selectRole.assets.basefileAssets.read"
                                :checked='selectRole.assets.basefileAssets.read'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Редактировать свое: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.basefileAssets.writeYour = !selectRole.assets.basefileAssets.writeYour"
                                :checked='selectRole.assets.basefileAssets.writeYour'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Редактировать других: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.basefileAssets.writeSomeone = !selectRole.assets.basefileAssets.writeSomeone"
                                :checked='selectRole.assets.basefileAssets.writeSomeone'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
            </div>
            <div>
                <h3>Технологические операции</h3>
                <div class="checkboxing-stil">
                    <span>Заготовительная:</span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.techProcessAssets.zag = !selectRole.assets.techProcessAssets.zag"
                                :checked='selectRole.assets.techProcessAssets.zag'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Токарная:</span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.techProcessAssets.tok = !selectRole.assets.techProcessAssets.tok"
                                :checked='selectRole.assets.techProcessAssets.tok'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Слесарная:</span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.techProcessAssets.sles = !selectRole.assets.techProcessAssets.sles"
                                :checked='selectRole.assets.techProcessAssets.sles'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Термобработка:</span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.techProcessAssets.termo = !selectRole.assets.techProcessAssets.termo"
                                :checked='selectRole.assets.techProcessAssets.termo'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Фрезерная:</span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.techProcessAssets.hrezer = !selectRole.assets.techProcessAssets.hrezer"
                                :checked='selectRole.assets.techProcessAssets.hrezer'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
            </div>
            <div>
                <h3>Рабочий стол</h3>
                <div class="checkboxing-stil">
                    <span>Задачи для меня: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.userWorkingAssets.myIssue = !selectRole.assets.userWorkingAssets.myIssue"
                                :checked='selectRole.assets.userWorkingAssets.myIssue'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>План по операциям: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.userWorkingAssets.planOperation = !selectRole.assets.userWorkingAssets.planOperation"
                                :checked='selectRole.assets.userWorkingAssets.planOperation'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Результаты работ: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.userWorkingAssets.resultWork = !selectRole.assets.userWorkingAssets.resultWork"
                                :checked='selectRole.assets.userWorkingAssets.resultWork'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Библиотека: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.userWorkingAssets.library = !selectRole.assets.userWorkingAssets.library"
                                :checked='selectRole.assets.userWorkingAssets.library'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
            </div>
            <div>
                <h3>Настройки</h3>
                <div class="checkboxing-stil">
                    <span>Просмотр: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.settingsAssets.read = !selectRole.assets.settingsAssets.read"
                                :checked='selectRole.assets.settingsAssets.read'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Редактирование: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.settingsAssets.edit = !selectRole.assets.settingsAssets.edit"
                                :checked='selectRole.assets.settingsAssets.edit'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Сотрудники: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.settingsAssets.users = !selectRole.assets.settingsAssets.users"
                                :checked='selectRole.assets.settingsAssets.users'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Еденицы измерения: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.settingsAssets.edizm = !selectRole.assets.settingsAssets.edizm"
                                :checked='selectRole.assets.settingsAssets.edizm'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>База Материалов: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.settingsAssets.baseMat = !selectRole.assets.settingsAssets.baseMat"
                                :checked='selectRole.assets.settingsAssets.baseMat'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>База Покупных Деталей: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.settingsAssets.basePokDet = !selectRole.assets.settingsAssets.basePokDet"
                                :checked='selectRole.assets.settingsAssets.basePokDet'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>База Расходных Материалов: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.settingsAssets.baseRash = !selectRole.assets.settingsAssets.baseRash"
                                :checked='selectRole.assets.settingsAssets.baseRash'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                 <div class="checkboxing-stil">
                    <span>База Операции технологического процесса: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.settingsAssets.operation = !selectRole.assets.settingsAssets.operation"
                                :checked='selectRole.assets.settingsAssets.operation'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>База Инструмента и Оснастки: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.settingsAssets.baseTools = !selectRole.assets.settingsAssets.baseTools"
                                :checked='selectRole.assets.settingsAssets.baseTools'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>База Оборудования: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                                type="checkbox" 
                                class="checkbox" 
                                @change="selectRole.assets.settingsAssets.baseEquipment = !selectRole.assets.settingsAssets.baseEquipment"
                                :checked='selectRole.assets.settingsAssets.baseEquipment'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>База непроизводственной Техники и инвентаря: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                            type="checkbox" 
                            class="checkbox" 
                            @change="selectRole.assets.settingsAssets.baseTech = !selectRole.assets.settingsAssets.baseTech"
                            :checked='selectRole.assets.settingsAssets.baseTech'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Дефицит: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                            type="checkbox" 
                            class="checkbox" 
                            @change="selectRole.assets.settingsAssets.deficit = !selectRole.assets.settingsAssets.deficit"
                            :checked='selectRole.assets.settingsAssets.deficit'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Учет рабочего времени: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                            type="checkbox" 
                            class="checkbox" 
                            @change="selectRole.assets.settingsAssets.workTime = !selectRole.assets.settingsAssets.workTime"
                            :checked='selectRole.assets.settingsAssets.workTime'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Роли пользователей: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                            type="checkbox" 
                            class="checkbox" 
                            @change="selectRole.assets.settingsAssets.rols = !selectRole.assets.settingsAssets.rols"
                            :checked='selectRole.assets.settingsAssets.rols'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Должности пользователей: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                            type="checkbox" 
                            class="checkbox" 
                            @change="selectRole.assets.settingsAssets.dolzn = !selectRole.assets.settingsAssets.dolzn"
                            :checked='selectRole.assets.settingsAssets.dolzn'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Библиотека: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                            type="checkbox" 
                            class="checkbox" 
                            @change="selectRole.assets.settingsAssets.library = !selectRole.assets.settingsAssets.library"
                            :checked='selectRole.assets.settingsAssets.library'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>Стоимость норм часа: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                            type="checkbox" 
                            class="checkbox" 
                            @change="selectRole.assets.settingsAssets.priceHors = !selectRole.assets.settingsAssets.priceHors"
                            :checked='selectRole.assets.settingsAssets.priceHors'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
                <div class="checkboxing-stil">
                    <span>База данных: </span>
                    <div>
                        <div class="button r button-3">
                        <input 
                            type="checkbox" 
                            class="checkbox" 
                            @change="selectRole.assets.settingsAssets.baseData = !selectRole.assets.settingsAssets.baseData"
                            :checked='selectRole.assets.settingsAssets.baseData'>
                        <div class="knobs"></div>
                        <div class="layer"></div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        <InformFolder  :title='titleMessage'
            :message = 'message'
            :type = 'type'
            v-if='showInformPanel'
            :key='keyInformTip'
        />
    </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
import { showMessage } from '@/js/';
import InformFolder from '@/components/InformFolder.vue';
export default {
    data() {
        return{
            select_model: 'Выбрать роль',
            selectRole: null,
            allChange: true,

            titleMessage: '',
            message: '',
            type: '',
            showInformPanel: false,
            keyInformTip: 0,
        }
    },
    computed: mapGetters(['allRoles', 'getRoleAssets']),
    components: {InformFolder},
    methods: {
        ...mapActions(['fetchRoles', 'fetchUpdateAssetsRole']),
        select_model_change(e) {
            for(let role of this.allRoles) {
                if(role.id == e) {
                    this.selectRole = {...role, assets: JSON.parse(role.assets)}
                    this.allChange = true
                     Object.keys(this.selectRole.assets).forEach((e) => {
                         if(this.selectRole.assets[e] == false) 
                             this.allChange = false
                     })
                }
            }
        },
        update() {
            if(!this.selectRole)
                return 0;
            
            this.fetchUpdateAssetsRole(JSON.stringify({
                id: this.selectRole.id,
                assets: this.selectRole.assets
            })).then(res => {
               res ? showMessage('', 'Доступы обновлены, перезагрузите страницу чтобы изменения вступили в силу.', 's', this)
                :   showMessage('', 'Неудалось обновить доступы для роли.', 'e', this)
            })
        },
        allRasdel() {
            if(!this.selectRole)
                return 0
            
            Object.keys(this.selectRole.assets).forEach((e) => {
                if(this.selectRole.assets[e] == true 
                    || this.selectRole.assets[e] == false) {

                    this.selectRole.assets[e] = this.allChange
                }
            })
            
        },

    },
    async mounted() {
        this.fetchRoles();
    }
}
</script>

<style scoped>
    .span-role{
        font-size: 17px;
        font-weight: bold;
    }
    .role-select {
        text-align: center;
        padding: 5px;
        width: auto;
        border-radius: 5px;
        border: 1px solid #d3d3d3;
    }
    .cont-role-user>div {
        margin: 10px;
        width: 300px;
        float: left;
    }
    .cont-role-user {
        width: 1050px;
        padding: 20px;
    }
    .checkboxing-stil {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }
    .btn-add{
        margin-left: 100px;
        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;
        width: fit-content;
        padding-left: 20px;
        padding-right: 20px;
        margin-top:0px;
    } 
    .btn-add * {
        margin-left: 10px;
    }
    .header_block{ 
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 700px;
    }
</style>
