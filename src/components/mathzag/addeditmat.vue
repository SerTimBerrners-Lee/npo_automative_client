<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" >
      <div v-if="parametrs.mat == 'TYPE'">
        <h3>{{ titleapp }} типа материала (тип профиля заготовки)</h3>
        <div class="block">
            <p> 
                <span>Наименование: </span>
                <input type="text" v-model.trim='obj.inputs'>
            </p>
        </div>
        <h4>Характеристики</h4>
        <table style="width: 100%;">
            <tr>
                <th>Наименование</th>
                <th>
                    ЕИ
                </th>
                <th>Значение</th>
            </tr>
            <tr>
                <td>Длина (Д)</td>
                <td>
                    <select class="select-small" v-if='parametrs.mat == "TYPE"' v-model="obj.length_selecter">
                        <option>Выберите тип ЕИ</option>
                        <option v-for='edizm of parametrs.edizm' :key='edizm' :value='edizm.id'>{{ edizm.short_name }}</option>
                    </select>
                </td>
                <td class="input_znach">
                  <input type="text" v-model="obj.length_input">
                </td>
            </tr>
            <tr>
                <td>Ширина (Ш)</td>
                <td>
                    <select class="select-small" v-if='parametrs.mat == "TYPE"' v-model="obj.width_selecter">
                        <option>Выберите тип ЕИ</option>
                        <option v-for='edizm of parametrs.edizm' :key='edizm' :value='edizm.id'>{{ edizm.short_name }}</option>
                    </select>
                </td>
                <td class="input_znach">
                  <input type="text" v-model="obj.width_input" >
                </td>
            </tr>
            <tr>
                <td>Высота (В)</td>
                <td>
                    <select class="select-small" v-if='parametrs.mat == "TYPE"' v-model="obj.height_selecter">
                        <option>Выберите тип ЕИ</option>
                        <option v-for='edizm of parametrs.edizm' :key='edizm' :value='edizm.id'>{{ edizm.short_name }}</option>
                    </select>
                </td>
                <td class="input_znach">
                  <input type="text" v-model="obj.height_input">
                </td>
            </tr>
            <tr>
                <td>Толщина стенки (S)</td>
                <td>
                    <select class="select-small" v-if='parametrs.mat == "TYPE"' v-model="obj.wallThickness_selecter">
                        <option>Выберите тип ЕИ</option>
                        <option v-for='edizm of parametrs.edizm' :key='edizm' :value='edizm.id'>{{ edizm.short_name }}</option>
                    </select>
                </td>
                <td class="input_znach">
                  <input type="text" v-model="obj.wallThickness_input">
                </td>
            </tr>
            <tr>
                <td>Наружный Диаметр (D)</td>
                <td>
                    <select class="select-small" v-if='parametrs.mat == "TYPE"' v-model="obj.outsideDiametr_selecter">
                        <option>Выберите тип ЕИ</option>
                        <option v-for='edizm of parametrs.edizm' :key='edizm' :value='edizm.id'>{{ edizm.short_name }}</option>
                    </select>
                </td>
                <td class="input_znach">
                  <input type="text" v-model="obj.outsideDiametr_input">
                </td>
            </tr>
              <tr>
                <td>Толщина </td>
                <td>
                    <select class="select-small" v-if='parametrs.mat == "TYPE"' v-model="obj.thickness_selecter">
                        <option>Выберите тип ЕИ</option>
                        <option v-for='edizm of parametrs.edizm' :key='edizm' :value='edizm.id'>{{ edizm.short_name }}</option>
                    </select>
                </td>
                <td class="input_znach">
                  <input type="text" v-model="obj.thickness_input">
                </td>
            </tr>
            <tr>
                <td>Площадь сечения (A)</td>
                <td>
                    <select class="select-small" v-if='parametrs.mat == "TYPE"' v-model="obj.areaCrossSectional_selecter">
                        <option>Выберите тип ЕИ</option>
                        <option v-for='edizm of parametrs.edizm' :key='edizm' :value='edizm.id'>{{ edizm.short_name }}</option>
                    </select>
                </td>
                <td class="input_znach">
                  <input type="text" v-model="obj.areaCrossSectional_input">
                </td>
            </tr>
        </table>
        <div class="btn-control out-btn-control">
            <button class="btn-status btn-black" @click='addEditMaterial'>Сохранить</button>
            <button class="btn-status" @click='destroyModalF'>Отменить</button>
        </div>
      </div>
        <div v-if="parametrs.mat == 'PODTYPE'">
        <h3>{{ titleapp }} типа материала (тип профиля заготовки)</h3>
        <p class="p-types">
            <span>Тип: &nbsp;</span>
            <span> {{ parametrs.type == 'create' ? parametrs.material.name : parametrs.parentMat.name }}</span>
        </p>
        <div class="block">
            <p> 
                <span>Наименование: </span>
                <input type="text" v-model.trim='obj_podType.inputs'>
            </p>
        </div>
        <h4>Характеристики</h4>
        <table style="width: 100%;">
            <tr>
                <th>Наименование</th>
                <th>
                    ЕИ
                </th>
                <th>Значение</th>
            </tr>
            <tr>
                <td>Плотность</td>
                <td>
                    <select class="select-small" v-if='parametrs.mat == "PODTYPE"' v-model="obj_podType.density_select">
                        <option>Выберите тип ЕИ</option>
                        <option v-for='edizm of parametrs.edizm' :key='edizm' :value='edizm.id'>{{ edizm.short_name }}</option>
                    </select>
                </td>
                <td><input type="text" v-model="obj_podType.density_input"></td>
            </tr>
            
        </table>
        <div class="btn-control out-btn-control" v-if='parametrs.mat != "PODTYPE"'>
            <button class="btn-status btn-black" v-if="parametrs.type == 'create'" @click='addEditMaterial'>Сохранить</button>
            <button class="btn-status btn-black" v-if="parametrs.type == 'edit'" @click='addEditMaterial'>Обновить</button>
            <button class="btn-status" @click='destroyModalF'>Отменить</button>
        </div>
        <div class="btn-control out-btn-control" v-if='parametrs.mat == "PODTYPE"'>
            <button class="btn-status btn-black" v-if="parametrs.type == 'create'" @click='addEditPodMaterial'>Сохранить</button>
            <button class="btn-status btn-black" v-if="parametrs.type == 'edit'" @click='addEditPodMaterial'>Обновить</button>
            <button class="btn-status" @click='destroyModalF'>Отменить</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: ['parametrs'],
  data() {
      return {
          destroyModalLeft: 'left-block-modal',
          destroyModalRight: 'content-modal-right-menu',
          hiddens: 'display: none;',
          inputs: '',
          inputs_short: '',
          titleapp: 'Добавление',
          obj: {
            length_selecter: 'Выберите тип ЕИ',
            width_selecter: 'Выберите тип ЕИ',
            height_selecter: 'Выберите тип ЕИ',
            wallThickness_selecter: 'Выберите тип ЕИ',
            outsideDiametr_selecter: 'Выберите тип ЕИ',
            thickness_selecter: 'Выберите тип ЕИ',
            areaCrossSectional_selecter: 'Выберите тип ЕИ',
            length_input: '',
            width_input: '',
            height_input: '',
            wallThickness_input: '',
            outsideDiametr_input: '',
            thickness_input: '',
            areaCrossSectional_input: '',
            inputs: '',
          },
          obj_podType : {
            inputs: '',
            density_input: '',
            density_select: 'Выберите тип ЕИ'
          }

      }
  },
  mounted() {
      this.destroyModalLeft = 'left-block-modal'
      this.destroyModalRight = 'content-modal-right-menu'
      this.hiddens = 'opacity: 1;'
      if(this.parametrs.type != 'create') {
          this.titleapp = 'Редактирование'
          if(this.parametrs.mat == "TYPE") {
            let el = this.parametrs.element
            this.obj.inputs = el.name
            if(el.length && typeof el.length[0] == 'string') {
              this.obj.length_selecter = JSON.parse(el.length[0]).edizmId.id 
              this.obj.length_input = JSON.parse(el.length[0]).znach 
            } else if(el.length && typeof el.length[0] == 'object') {
              this.obj.length_selecter = el.length[0].edizmId.id 
              this.obj.length_input = el.length[0].znach 
            }
            if(el.width && typeof el.width[0] == 'string') {
              this.obj.width_selecter = JSON.parse(el.width[0]).edizmId.id 
              this.obj.width_input = JSON.parse(el.width[0]).znach 
            } else if(el.width && typeof el.width[0] == 'object') {
              this.obj.width_selecter = el.width[0].edizmId.id 
              this.obj.width_input = el.width[0].znach 
            }
            if(el.height && typeof el.height[0] == 'string') {
              this.obj.height_selecter = JSON.parse(el.height[0]).edizmId.id 
              this.obj.height_input = JSON.parse(el.height[0]).znach 
            } else if(el.height && typeof el.height[0] == 'object') {
              this.obj.height_selecter = el.height[0].edizmId.id 
              this.obj.height_input = el.height[0].znach 
            }
            if(el.wallThickness && typeof el.wallThickness[0] == 'string') {
              this.obj.wallThickness_selecter = JSON.parse(el.wallThickness[0]).edizmId.id 
              this.obj.wallThickness_input = JSON.parse(el.wallThickness[0]).znach 
            } else if(el.wallThickness && typeof el.wallThickness[0] == 'object') {
              this.obj.wallThickness_selecter = el.wallThickness[0].edizmId.id 
              this.obj.wallThickness_input = el.wallThickness[0].znach 
            }
            if(el.outsideDiametr && typeof el.outsideDiametr[0] == 'string') {
              this.obj.outsideDiametr_selecter = JSON.parse(el.outsideDiametr[0]).edizmId.id 
              this.obj.outsideDiametr_input = JSON.parse(el.outsideDiametr[0]).znach 
            } else if(el.outsideDiametr && typeof el.outsideDiametr[0] == 'object') {
              this.obj.outsideDiametr_selecter = el.outsideDiametr[0].edizmId.id 
              this.obj.outsideDiametr_input = el.outsideDiametr[0].znach 
            }
            if(el.thickness && typeof el.thickness[0] == 'string') {
              this.obj.thickness_selecter = JSON.parse(el.thickness[0]).edizmId.id 
              this.obj.thickness_input = JSON.parse(el.thickness[0]).znach 
            } else if(el.thickness && typeof el.thickness[0] == 'object') {
              this.obj.thickness_selecter = el.thickness[0].edizmId.id 
              this.obj.thickness_input = el.thickness[0].znach 
            }
            if(el.areaCrossSectional && typeof el.areaCrossSectional[0] == 'string') {
              this.obj.areaCrossSectional_selecter = JSON.parse(el.areaCrossSectional[0]).edizmId.id 
              this.obj.areaCrossSectional_input = JSON.parse(el.areaCrossSectional[0]).znach 
            } else if(el.areaCrossSectional && typeof el.areaCrossSectional[0] == 'object') {
              this.obj.areaCrossSectional_selecter = el.areaCrossSectional[0].edizmId.id 
              this.obj.areaCrossSectional_input = el.areaCrossSectional[0].znach 
            }
            
          }

          if(this.parametrs.mat == "PODTYPE") {
            this.obj_podType.inputs = this.parametrs.material.name
            if(this.parametrs.material.density) {
              // Делаем проверку когда мы добавляем новый под тип он сохраняется как обьект 
              // Когда он приходит с сервера он приходит в json и его нужно распарсить в объект
              if(typeof this.parametrs.material.density[0] == 'string') {
                this.obj_podType.density_input = JSON.parse(this.parametrs.material.density).znach
                this.obj_podType.density_select = JSON.parse(this.parametrs.material.density).edizmId.id
              } else {
                this.obj_podType.density_input = this.parametrs.material.density[0].znach
                this.obj_podType.density_select = this.parametrs.material.density[0].edizmId.id
              }
            }
          }
      } 
  },
  methods: {
      destroyModalF() {
          this.destroyModalLeft = 'left-block-modal-hidden'
          this.destroyModalRight = 'content-modal-right-menu-hidden'
          this.hiddens = 'display: none;'
          this.$emit('unmount', 0) 
      },
      addEditPodMaterial() {
          if(this.obj_podType.inputs.length < 2) return 0;
          if(this.parametrs.type == 'create') {
            this.$emit('unmount', {
              type: 'createPodMaterial',
              data: {
                density: this.obj_podType.density_select != 'Выберите тип ЕИ' ? {
                  edizmId: this.obj_podType.density_select,
                  znach: this.obj_podType.density_input
                } : {},
                parentId: this.parametrs.material.id,
                name: this.obj_podType.inputs
              }
            })
          }

          if(this.parametrs.type == 'edit') {
            this.$emit('unmount', {
              type: 'editPodMaterial',
              data: {
                density: this.obj_podType.density_select != 'Выберите тип ЕИ' ? {
                  edizmId: this.obj_podType.density_select,
                  znach: this.obj_podType.density_input
                } : {},
                parentId: this.parametrs.parentMat.id,
                name: this.obj_podType.inputs,
                id: this.parametrs.material.id
              }
            })
          }
        this.destroyModalF()
      },
      addEditMaterial() {
          if(this.obj.inputs.length > 2) {
            let dat = this.obj
            let data = {
                    name: dat.inputs,
                    length: dat.length_selecter != 'Выберите тип ЕИ' ? {
                      edizmId: dat.length_selecter,
                      znach: dat.length_input
                    } : {} ,
                    width: dat.width_selecter != 'Выберите тип ЕИ' ? {
                      edizmId: dat.width_selecter,
                      znach: dat.width_input
                    } : {} ,
                    height: dat.height_selecter != 'Выберите тип ЕИ' ? {
                      edizmId: dat.height_selecter,
                      znach: dat.height_input
                    } : {},
                    wallThickness: dat.wallThickness_selecter != 'Выберите тип ЕИ' ? {
                      edizmId: dat.wallThickness_selecter,
                      znach: dat.wallThickness_input
                    } : {},
                    outsideDiametr: dat.outsideDiametr_selecter != 'Выберите тип ЕИ' ? {
                      edizmId: dat.outsideDiametr_selecter,
                      znach: dat.outsideDiametr_input
                    } : {},
                    thickness: dat.thickness_selecter != 'Выберите тип ЕИ' ? {
                      edizmId: dat.thickness_selecter,
                      znach: dat.thickness_input
                    } : {},
                    areaCrossSectional: dat.areaCrossSectional_selecter != 'Выберите тип ЕИ' ? {
                      edizmId: dat.areaCrossSectional_selecter,
                      znach: dat.areaCrossSectional_input
                    } : {}
                  }
              if(this.parametrs.type == 'create') {
                  this.$emit('unmount', {
                      type: 'create',
                      data
                  })
              } else if (this.parametrs.type == 'edit'){
                  if(this.parametrs.mat == "TYPE") {
                    data.id = this.parametrs.element.id
                    this.$emit('unmount', {
                        type: 'edit',
                        data
                    })
                  }
              }
              this.destroyModalF()
          } else {
              this.$emit('unmount', {
                  type: 'error',
                  message: 'Слишком короткое наименование'
              })
              return 0
          }
      }
  }
}
</script>

<style scoped>
  .right-menu-p>input {
      width: 70%;
  }
  .input_znach {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .select-small{
      font-size: 14px;
      padding: 5px;
      font-weight: bolder;
  }
  .block p * {
      margin-left: 10px;
  }
  .block p {
      display: flex;
      justify-content: space-between;
  }
  .block p input {
      width: 76%;
  }
  .select-small {
      width : 100%;
      height: 100%;
      margin: 0;
      border: none;
  }
  .out-btn-control{
      margin-top: 10px;
  }
  .p-types{
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
  }
  .p-types span:first-child {
      font-weight: bold;
  }
</style>