
import Req from '../../js/req';
import { sortState } from '@/js/index';

export default {
  state: {
    setOneTypeM: {},
    typeM: [], // тип
    instansTypeM: [],
    podTypeM: [], // под тип
    instansPodTypeM: [],

    tmp_attention: [],
    
    podMaterial: [], // материал c
    onePPT: {},
    linkId: 0,

    sTypeM: [],
    sPTypeM: [], 
    sProviderPM: [],

    stateMaterialTime: [],
    statePodMaterialTime: [],

    searchTypeM: [],
    searchPTypeM: [],
    searchMaterial: [],

    date_is: '<'
  },
  getters: {
    alltypeM(state) {
      return state.typeM;
    },
    allPodTypeM(state) {
      return state.podTypeM;
    },
    getOnePodMaterial(state) {
      return state.podMaterial;
    },
    getOnePPT(state) {
      return state.onePPT;
    },
    getLinkId(state) {
      return state.linkId;
    }
  },
  actions: { 
    async getAllTypeMaterial(ctx) {
      const res =  await Req(`api/settings/material`);
      const result = await res.json();

      await ctx.commit("getTypeMaterial", result);
      return result;
    },
    async getOneTypeMaterial(ctx, _id) {
      const res =  await Req(`api/settings/materials/one/${_id}`);
      if(!res.ok) return false; 
      const result = await res.json();

      return result;
    },
    async getAllPodTypeMaterial(ctx, instans = 'all') {
      const res = await Req(`api/settings/typematerial/${instans}`);
      const result = await res.json();

      await ctx.commit('filterMatByPodType', result);
      return result;
    },
    async createTypeM(ctx, material) {
      const res = await Req(`api/settings/material`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...material
        })
      });
      
      const result = await res.json();
      ctx.commit('addTypeMaterial', result);
    },
    async createPodType(ctx, pod_type) {
      const res = await Req(`api/settings/podtype`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...pod_type
        })
      });
      if(!res.ok) return false;

      const result = await res.json();
      ctx.commit('createPodType', result);
    },
    async removeMaterial(ctx, id) {
      const res =  await Req(`api/settings/material/${id}`, {
        method: 'delete'
      });
      if(!res.ok) return false;

      ctx.commit('deleteMaterial', id);
    },
    async updateTypeM(ctx, material) {
      const res = await Req(`api/settings/material/update`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...material
        })
      });

      const result = await res.json();
      ctx.commit('updateMaterial', result);
    },
    async updatePodMaterial(ctx, podM) {
      const res = await Req(`api/settings/podtype/update`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...podM
        })
      });

      const result = await res.json();
      ctx.commit('updatePodMaterial', {result, matId: podM.parentId});
    },
    async deletePodType(ctx, id) {
      const res = await Req(`api/settings/podtype/${id}`, {
        method: 'delete'
      });
      if(!res.ok) return false;
      ctx.commit('deletePodMaterial', id)
    },
    async getOnePodType(ctx, id) {
      const res = await Req(`api/settings/typematerialid/${id}`);
      const result = await res.json();
      if(!res.ok) return false;

      ctx.commit('addOnePodType', result);
      return result;
    },
    async createNewPodPodMaterial(ctx, data) {
      const res = await Req(`api/settings/podpodtype/`, {
        method: 'post',
        body: data
      });
      if(!res.ok) return false;

      ctx.commit('onePPTClear');
      return true;
    },
    async removePPM(ctx, id) {
      const res =  await Req(`api/settings/podpodtype/${id}`, {
        method: 'delete'
      });
      if(!res.ok) return false;
      ctx.dispatch('getAllTypeMaterial');
    },
    async bannedPPM(ctx, id) {
      const res =  await Req(`api/settings/podpodtype/${id}`);
      if(!res.ok) return false;

      ctx.dispatch('getAllTypeMaterial');
      ctx.commit('bannedPPM', id);
    },
    async fetchGetOnePPM(ctx, id) {
      const res = await Req(`api/settings/podpodtype/get/${id}`);
      if(!res.ok) return false;

      const result = await res.json();
      ctx.commit('addOnePPTyep', result);
      return result;
    },
    async fetchGetAllPPM(ctx) {
      const res = await Req(`api/settings/podpodtype`);
      if(!res.ok) return false;
      const result = await res.json();
      ctx.commit('pushAllPPT', result);
      return result;
    },
    async fetchGetArchivePPM(ctx) {
      const res = await Req(`api/settings/podpodtype/archive/`);
      if(!res.ok) return false;
      const result = await res.json();
      
      ctx.commit('pushAllPPT', result);
      return result;
    },
    async fetchPPMNoLight(ctx) {
      const res = await Req(`api/settings/materials/podtypematerial`);
      if(!res.ok) return false;

      const result = await res.json();
      ctx.commit('pushAllPPT', result);
      return result;
    },
    async fetchAllProviderMaterial(ctx) {
      const res = await Req(`api/settings/materialprovider`);
      if(!res.ok) return false;

      const result = await res.json();
      ctx.commit('sortPPMtoParent', result);
      return result;
    },
    async fetchAllProviderMaterialById(ctx, id) {
      const res = await Req(`api/settings/materialprovider/${id}`);
      if(!res.ok) return false;

      const result = await res.json();
      ctx.commit('materialForProvider', result);
      return result;
    },
    async fetchGetAllShipmentsPPM(ctx) {
      const res = await Req(`api/settings/materialshipment`);
      if(!res.ok) return false;

      const result = await res.json();
      let new_result = [];
      for(let obj of result) {
        new_result.push({...obj.mat, dev: obj.dev});
      }
      ctx.commit('sortPPMtoParent', new_result);
      return result;
    },
    async attachFileToMaterial(ctx, data) {
      const res = await Req(`api/settings/files/${data.mat_id}/${data.file_id}`);
      if(!res.ok) return false;
      const result = await res.json();
      return result;
    },
  },
  mutations: { 
    sortPPMtoParent(state, result) {
      state.podMaterial = result
      state.typeM = []
      state.podTypeM = []

      for(let mat of result) {
        let check = false
        if(mat.material) {
          for(let inx in state.typeM) {
            if(state.typeM[inx].id == mat.material.id) {
              check = true
              state.typeM[inx].podPodMaterials.push(mat)
            }
          }
          if(!check)  
            state.typeM.push({ ...mat.material, podPodMaterials: [mat]})        
            else check = false 
          if(!state.typeM.length)
            state.typeM.push({ ...mat.material, podPodMaterials: [mat]})
        }

        check = false
        if(mat.podMaterial) {
          for(let inx in state.podTypeM) {
            if(state.podTypeM[inx].id == mat.podMaterial.id) {
              check = true
              if(state.podMaterial[inx] && state.podMaterial[inx].podPodMaterials && state.podMaterial[inx].podPodMaterials.length) 
                state.podMaterial[inx].podPodMaterials.push(mat)
              else if(state.podMaterial[inx])
                state.podMaterial[inx]['podPodMaterials'] = [mat]
            }
          }
          if(!check) 
            state.podTypeM.push({ ...mat.podMaterial, podPodMaterials: [mat]})        
            else check = false 
          if(!state.podTypeM.length)
            state.podTypeM.push({ ...mat.podMaterial, podPodMaterials: [mat]})
        } 
      }
    },
    sortAllForeficitMaterial(state, result) {
      for(const item of state.podTypeM) {
        const materials = [];
        for(const inx in item.podPodMaterials) {
          for(const mat of result) {
            if(mat.id == item.podPodMaterials[inx].id) materials.push(mat);
          }
        }
        item.podPodMaterials = materials;
      }

      for(const item of state.typeM) {
        const materials = [];
        for(const item2 of item.podPodMaterials) {
          for(const mat of result) {
            if(mat.id == item2.id) materials.push(mat);
          }
        }
        item.podPodMaterials = materials

        for(const inx in item.podMaterials) {
          for(const pt of state.podTypeM) {
            if(pt.id == item.podMaterials[inx].id) item.podMaterials[inx] = pt;
          }
        }
      }

      state.podMaterial = result;
    },
    throwInstans(state) {
      state.instansTypeM = []
      state.instansPodTypeM = []
      state.linkId = 0
    },
    getInstansMaterial(state, instans) {
      state.searchMaterial = []
      state.searchPTypeM = []
      state.searchTypeM = []
      
      state.podMaterial = []
      if(instans == 0) {
        state.typeM = state.instansTypeM
        state.podTypeM = state.instansPodTypeM
        state.typeM.forEach(el => {
          el.podPodMaterials.forEach(e => {
            state.podMaterial.push(e)
          })
        })
        state.linkId = 0
        return 0
      }
      if(state.instansTypeM.length == 0) 
        state.instansTypeM = state.typeM
      if(state.instansPodTypeM.length == 0)
        state.instansPodTypeM = state.podTypeM

      state.linkId = instans
      
      state.typeM = state.instansTypeM.filter(mat => mat.instansMaterial == instans)
      state.podTypeM = state.instansPodTypeM.filter(mat => mat.instansMaterial == instans)
      state.typeM.forEach(el => {
        el.podPodMaterials.forEach(e => {
          state.podMaterial.push(e)
        })
      })
    },
    addTypeMaterial(state, material) {
      state.typeM.push(material)
    },
    getTypeMaterial(state, materisls) {
      state.typeM = materisls
    },
    updateMaterial(state, material) {
      state.typeM = state.typeM.filter(mat => mat.id != material.id)
      state.typeM.push(material)
    },
    filterMatByPodType(state, podMaterials) {
      state.podTypeM = podMaterials
    }, 
    deleteMaterial(state, id) {
      state.typeM = state.typeM.filter(typ => typ.id != id)
    },
    deletePodMaterial(state, id) {
      state.podTypeM = state.podTypeM.filter(typ => typ.id != id)
    },
    updatePodMaterial(state, data) {
      state.podTypeM = state.podTypeM.filter(typ => typ.id != data.result.id)
      state.podTypeM.push(data.result)
      state.typeM.forEach(res => {
        if(data.matId == res.id) {
          res.podMaterials = res.podMaterials.filter(podM => podM.id != data.result.id)
          res.podMaterials.push(data.result)
        }
      })
    },
    createPodType(state, data) { 
      state.podTypeM.push(data)
    },
    addOnePodType(state, typMaterial) {
      if(typMaterial.podPodMaterials && state.setOneTypeM) {

        let new_arr = []
        for(let item of state.setOneTypeM.podPodMaterials) {
          let check = false
          for(let item_two of typMaterial.podPodMaterials) {
            if(item_two.id == item.id) check = true
          }
          if(check && !item.ban) {
            new_arr.push(item)
            check = false
          }
        }
        return state.podMaterial = new_arr
      }
      state.podMaterial = typMaterial.podPodMaterials.filter(material => !material.ban)
    },
    addOnePPTyep(state, PPT) {
      state.onePPT = PPT
    },
    bannedPPM(state, id) {
      state.podMaterial = state.podMaterial.filter(ppm => ppm.id != id)
    },
    filterMaterialById(state, id) {
      state.typeM = state.typeM.filter(m => m.id == id)
    },
    filterPodMaterialById(state, id) {
      state.podTypeM = state.podTypeM.filter(m => m.id == id)
    },
    onePPTClear(state) {
      state.onePPT = {}
    },
    toEmptyPPT(state) {
      state.podMaterial = []
    },
    filterByNameMaterial(state, mat) {
      state.podMaterial = mat.podPodMaterials
    },

    /**
     * Фильтрует тип и подтипы в находящиеся 
     * обьекте подпод материала
     * @param {*} state 
     * @param {*} mat 
     */
    filterByNameMaterialPodMat(state, mat) {
      if (state.stateMaterialTime.length == 0) state.stateMaterialTime = state.podMaterial;
      if (state.statePodMaterialTime.length == 0) state.statePodMaterialTime = state.podTypeM;

      state.podMaterial = mat.podPodMaterials;
      state.podTypeM = [];
      for (let name_m of mat.podPodMaterials) {
        if(!name_m.podMaterial) continue
        for (const pm of state.statePodMaterialTime) {
          if (pm.id == name_m.podMaterial.id) {
            let check = true
            for (const pm_two of state.podTypeM) {
              if (pm_two.id == pm.id) check = false
            }
            if (check) {
              state.podTypeM.push(pm)
              continue
            } else check = false
          }
        }
      }
    },
    filterByNameMaterialById(state, mat) {
      if (!mat.podPodMaterials && !mat.podPodMaterials.length) return [];
      if (!state.searchMaterial.length)
        state.searchMaterial = state.podMaterial;
      let new_arr = state.searchMaterial.map(e => {
        for (const podm of mat.podPodMaterials) {
          if (podm.id == e.id) return e
        }
      })
      state.podMaterial = new_arr.filter(e => e);
    },
    pushAllPPT(state, data) {
      state.podMaterial = data
    },
    searchTypeMutation(state, tm) {
      if(!state.searchTypeM.length) 
        state.searchTypeM =  state.typeM

      state.typeM = state.searchTypeM
      if (!tm) return;

      state.typeM = state.typeM
        .filter(t => ((t.name.toLowerCase()).indexOf(tm.toLowerCase(), 0) != -1))
    },
    searchPTypeMutation(state, tm) {
      if (!state.searchPTypeM.length) 
        state.searchPTypeM = state.podTypeM;
      state.podTypeM = state.searchPTypeM;
      if (!tm) return;
          
      state.podTypeM = state.podTypeM
        .filter(t => ((t.name.toLowerCase()).indexOf(tm.toLowerCase(), 0) != -1))
    },
    searchMaterialMutation(state, tm) {
      if(!state.searchMaterial.length) 
        state.searchMaterial = state.podMaterial;

      state.podMaterial = state.searchMaterial;
      if (!tm) return;
      state.podMaterial = state.podMaterial
        .filter(t => ((t.name.toLowerCase()).indexOf(tm.toLowerCase(), 0) != -1))
    },
    clearCascheMaterial(state) {
      state.typeM = [];
      state.instansTypeM = [];
      state.podTypeM = [];
      state.instansPodTypeM = [];
      state.podMaterial = [];
      state.stateMaterialTime = [];
      state.onePPT = {}
    },
    filterToAttentionMat(state) {
      if (state.tmp_attention.length == 0)
        state.tmp_attention = state.podMaterial;
      else {
        state.podMaterial = state.tmp_attention;
        return state.tmp_attention  = [];
      }
      state.podMaterial = state.podMaterial.filter(detal => detal.attention);
    },
    filterMaterialToDate(state) {
      state.date_is = sortState(state.podMaterial, state.date_is);
    },
    /**
     * 
     * @param {*} state 
     * @param {{status: 'order', val}} params 
     */
    filterMaterialStatus(state, params) {
      if(state.stateMaterialTime.length == 0) state.stateMaterialTime = state.podMaterial;
      state.podMaterial = state.stateMaterialTime;
      if(params.status == 'all') return null;
     
      if(params.val == 'yes')
        state.podMaterial = state.stateMaterialTime.filter(m => m.deliveries_kolvo > 0);
      if(params.val == 'no')
        state.podMaterial = state.stateMaterialTime.filter(m => m.deliveries_kolvo <= 0);

      if(params.val == 'def') {
        state.podMaterial = state.stateMaterialTime.filter(m => (m.material_kolvo - m.min_remaining+m.shipments_kolvo) < 0)
        state.podMaterial.sort((a, b) =>
        (a.material_kolvo - (a.min_remaining+a.shipments_kolvo)) - (b.material_kolvo - (b.min_remaining+b.shipments_kolvo)))
      }
      if(params.val == 'ship') {
        state.podMaterial = state.stateMaterialTime.filter(m => m.shipments_kolvo > 0)
        state.podMaterial.sort((a, b) => b.shipments_kolvo - a.shipments_kolvo)
      }

      if(params.val == 'all_def') {
        state.podMaterial = state.stateMaterialTime.filter(m => (m.material_kolvo - m.min_remaining+m.shipments_kolvo) < 0)
        
        state.podMaterial = state.stateMaterialTime.filter(m => m.shipments_kolvo > 0)
        state.podMaterial.sort((a, b) => b.shipments_kolvo - a.shipments_kolvo)
      }
    },
    setOneTypeMMytation(state, typeM) {
      state.setOneTypeM = typeM;
    },
    // Кладем 
    setDeficitToPlan(state, mats) {
      if(!state.stateMaterialTime.length) state.stateMaterialTime = state.podMaterial;
      state.podMaterial = mats;
    },
    unsetSortMaterial(state) {
      if(state.stateMaterialTime.length) state.podMaterial = state.stateMaterialTime;
      state.stateMaterialTime = [];
    }
  }
}