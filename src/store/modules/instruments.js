import Req from '../../js/req';

export default {
  state: {
    TInstrument: [],
    PTInstrument: [],
    PPTInstrument: [],
    nameInstrument: {},

    tmp_attention: [],

    instansTInstrument: [], 
    instansPTInstrument: [],
    linkId: 0,

    searchTypeInst: [], 
    searchPTypeInst: [],
    searchNameInst: []
  },
  getters: {
    allTInstrument(state) {
      return state.TInstrument;
    },
    allPTInstrument(state) {
      return state.PTInstrument;
    },
    allPPTInstrument(state) {
      return state.PPTInstrument;
    },
    getOneNameInstrument(state) {
      return state.nameInstrument;
    },
    getLinkIdInstrument(state) {
      return state.linkId;
    },
  },
  actions: { 
    async fetchAllInstruments(ctx) {
      const res = await Req(`api/instrument`)
      const result = await res.json()
      ctx.commit('addAllTInstrument', result)
    },
    async addNewTInstrument(ctx, data) {
      const res = await Req(`api/instrument`, {
        method: 'post',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data
        })
      })

      if (!res.ok) return false;

      const result = await res.json();
      ctx.dispatch('fetchAllInstruments');
      ctx.commit('addOneTInstrument', result);
    },
    async removeTInstrument(ctx, id) {
      const res = await Req(`api/instrument/${id}`, {
        method: 'delete'
      });
      
      if (!res.ok) return false;
      ctx.commit('removeTInstrument', id)
    },
    async updateTInstrument(ctx, data) {
      const res = await Req(`api/instrument/update`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data
        })
      })
      
      if (!res.ok) return false;
      ctx.dispatch('fetchAllInstruments')
    },
    async addNewPTInstrument(ctx, data) {
      const res = await Req(`api/instrument/pt`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data
        })
      });

      if (!res.ok) return false;
      const result = await res.json();
      ctx.commit('addOnePTInstrument', result);
    },
    async removePTInstrument(ctx, id) {
      const res = await Req(`api/instrument/pt/${id}`, {
        method: 'delete'
      });

      if (!res.ok) return false
      ctx.commit('removePTInstrument', id)
      ctx.dispatch('fetchAllInstruments')
    },
    async updatePTInstryment(ctx, data) {
      const res = await Req(`api/instrument/pt/update`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data
        })
      });

      if (!res.ok) return false;
      const result = await res.json();
      ctx.commit('updatePTInstrument', result);
      ctx.dispatch('fetchAllInstruments');
    },
    async getAllPTInstances(ctx, id) {
      const res = await Req(`api/instrument/pt/${id}`);
      const result = await res.json();
      ctx.commit('getAllName', result);
    },

    async getPTInstrumentList(ctx) {
      const res = await Req(`api/instrument/pt/`);
      const result = await res.json();

      ctx.commit('pushPTInstrumentList', result);
    },
    async addNameInstrument(ctx, data) {
      const res = await Req(`api/instrument/nameinstrument`, {
        method: 'post',
        body: data
      });

      if (!res.ok) return false;
      const result = await res.json();
      ctx.dispatch('fetchAllInstruments');
      ctx.dispatch('getAllNameInstrument');
      return result;
    },
    async fetchOneNameInstrument(ctx, id) {
      const res = await Req(`api/instrument/name/${id}`);
      const result = await res.json();
      ctx.commit('addOneNameInstrument', result);
    },
    async removeFileInstrument(ctx, id) {
      await Req(`api/instrument/file/${id}`, {
        method: 'delete'
      });
    },
    async updateNameInstrument(ctx, data) {
      const res = await Req(`api/instrument/nameinstrument/update`, {
        method: 'post',
        body: data
      });

      if (!res.ok) return false;
      const result = await res.json();
      return result;
    },
    async banNameInstrument(ctx, id) {
      await Req(`api/instrument/ban/${id}`, {
        method: 'delete'
      });
      ctx.commit('hideNameInstrument', id);
    },
    async getAllNameInstrument(ctx) {
      const res = await Req(`api/instrument/nameinstrument`);

      if (!res.ok) return false;
      const result = await res.json();
      ctx.commit('pushAllNameInstrument', result);
    },
    async getAllNameInstrumentArchive(ctx) {
      const res = await Req(`api/instrument/nameinstrument/archive/`);

      if (!res.ok) return false;
      const result = await res.json();
      ctx.commit('pushAllNameInstrument', result);
    },
    async attachFileToInstrument(ctx, data) {
      const res = await Req(`api/instrument/files/${data.instr_id}/${data.file_id}`);
      if (!res.ok) return false;
      const result = await res.json();
      return result;
    },
    async fetchGetAllDeficitInsrument(ctx) {
      const res = await Req(`api/instrument/instrumentdeficit`);

      if (!res.ok) return false;
      const result = await res.json();
      ctx.commit('sortInstrumentToParent', result);
      return result;
    },
  },
  mutations: { 
    sortInstrumentToParent(state, result) {
      console.log(result)
      // state.podMaterial = result
      // for(let mat of result) {
      //   let check = false
      //   if(mat.material) {
      //     for(let inx in state.typeM) {
      //       if(state.typeM[inx].id == mat.material.id) {
      //         check = true
      //         state.typeM[inx].podPodMaterials.push(mat)
      //       }
      //     }
      //     if(!check) 
      //       state.typeM.push({ ...mat.material, podPodMaterials: [mat]})        
      //       else check = false 
      //     if(!state.typeM.length)
      //       state.typeM.push({ ...mat.material, podPodMaterials: [mat]})
      //   }

      //   check = false
      //   if(mat.podMaterial) {
      //     for(let inx in state.podTypeM) {
      //       if(state.podTypeM[inx].id == mat.podMaterial.id) {
      //         check = true
      //         if(state.podMaterial[inx] && state.podMaterial[inx].podPodMaterials && state.podMaterial[inx].podPodMaterials.length) 
      //           state.podMaterial[inx].podPodMaterials.push(mat)
      //         else if(state.podMaterial[inx])
      //           state.podMaterial[inx]['podPodMaterials'] = [mat]
      //       }
      //     }
      //     if(!check) 
      //       state.podTypeM.push({ ...mat.podMaterial, podPodMaterials: [mat]})        
      //       else check = false 
      //     if(!state.podTypeM.length)
      //       state.podTypeM.push({ ...mat.podMaterial, podPodMaterials: [mat]})
      //   } 
      // }

    },
    pushAllNameInstrument(state, data) {
      state.PPTInstrument = data;
    },
    pushPTInstrumentList(state, data) {
      state.PTInstrument = data;
    },
    hideNameInstrument(state, id) {
      state.PPTInstrument = state.PPTInstrument.filter(inst => inst.id != id)
      // Найти родителя и удалиться из него
      state.TInstrument.forEach(el => {
        el.nameInstruments = el.nameInstruments.filter((e) => e.id != id)
      })
      state.instansTInstrument.forEach(el => {
        el.nameInstruments = el.nameInstruments.filter((e) => e.id != id)
      })
      state.PTInstrument.forEach(el => {
        el.nameInstrument = el.nameInstrument.filter((e) => e.id != id)
      })
    },
    addOneNameInstrument(state, nameInstrument) {
      state.nameInstrument = nameInstrument
    },
    getAllName(state, data) {
      state.PPTInstrument = data.nameInstrument.filter(nameInstrument => !nameInstrument.ban)
    },
    addAllTInstrument(state, instruments) {
      state.TInstrument = instruments
    },
    addOneTInstrument(state, instrument) {
      state.TInstrument.push(instrument)
    },
    removeTInstrument(state, id) {
      state.TInstrument = state.TInstrument.filter(instr => instr.id != id)
    },
    addOnePTInstrument(state, PTInstrument) {
      if(!state.PTInstrument)
        state.PTInstrument = []
      state.PTInstrument.push(PTInstrument)
    },
    filterAllpInstrument(state, instrument) {
      if(!instrument.pInstruments)   
        state.PTInstrument = []

      state.PTInstrument = instrument.pInstruments
      if(!instrument.nameInstruments)
        state.PPTInstrument = []
      state.PPTInstrument = instrument.nameInstruments.filter(el => !el.ban)
    },
    removePTInstrument(state, id) {
      state.PTInstrument = state.PTInstrument.filter(pI => pI.id != id)
    },
    updatePTInstrument(state, result) {
      state.PTInstrument = state.PTInstrument.map(pt => pt.id == result.id ? result : pt)
    },
    filterAllInstrumentNyId(state, id) {
      state.TInstrument = state.TInstrument.filter(pI => pI.id == id.type)
      state.PTInstrument = state.PTInstrument.filter(p => p.id == id.pType)
    },
    throwInstansInstruments(state) {
      state.instansTInstrument = []
      state.instansPTInstrument = []
      state.PPTInstrument = []
      state.linkId = 0
    },
    getInstansTools(state, instans) {
      state.searchTypeInst = []
      state.searchPTypeInst = []
      state.searchNameInst = []

      if(instans == 0) {
        state.TInstrument = state.instansTInstrument
        state.PTInstrument = state.instansPTInstrument
        state.PPTInstrument = []
        state.PTInstrument.forEach(el => {
          el.nameInstrument.forEach(name => {
            if(!name.ban)
              state.PPTInstrument.push(name)
          })
        })
        state.linkId = 0
        return 0
      }
      if(state.instansTInstrument.length == 0) 
        state.instansTInstrument = state.TInstrument
      if(state.instansPTInstrument.length == 0)
        state.instansPTInstrument = state.PTInstrument

      state.linkId = instans

      state.TInstrument = state.instansTInstrument
        .filter(inst => inst.instans == instans)
      if(state.instansPTInstrument.length && state.instansPTInstrument[0].instruments.length) {
        state.PTInstrument = state.instansPTInstrument
          .filter(inst => inst.instruments[0].instans == instans)
      }
      

      state.PPTInstrument = []
      state.PTInstrument.forEach(el => {
        el.nameInstrument.forEach(name => {
          if(!name.ban)
            state.PPTInstrument.push(name)
        })
          
      })
    },
    searchTypeInst(state, inst) {
      if(!state.searchTypeInst.length) 
        state.searchTypeInst =  state.TInstrument

      state.TInstrument = state.searchTypeInst
      if(!inst) 
        return

      state.TInstrument = state.TInstrument
        .filter(t =>  (t.name.slice(0, inst.length).toLowerCase()) == inst.toLowerCase())
    },
    searchPTInst(state, inst) {
      if(!state.searchPTypeInst.length) 
        state.searchPTypeInst =  state.PTInstrument

      state.PTInstrument = state.searchPTypeInst
      if(!inst) 
        return

      state.PTInstrument = state.PTInstrument
        .filter(t =>  (t.name.slice(0, inst.length).toLowerCase()) == inst.toLowerCase())

    },
    searchNameInst(state, inst) {
      if(!state.searchNameInst.length) 
        state.searchNameInst =  state.PPTInstrument;

      state.PPTInstrument = state.searchNameInst;
      if(!inst) return;

      state.PPTInstrument = state.PPTInstrument
        .filter(t =>  (t.name.slice(0, inst.length).toLowerCase()) == inst.toLowerCase())
    },
    clearCascheInstrument(state) {
      state.PPTInstrument = []
      state.TInstrument = []
      state.PTInstrument = []
    },
    filterToAttentionTools(state) {
      if(state.tmp_attention.length == 0)
        state.tmp_attention = state.PPTInstrument
      else {
        state.PPTInstrument = state.tmp_attention 
        return state.tmp_attention  = []
      }
      state.PPTInstrument = state.PPTInstrument.filter(detal => detal.attention)
    }
  }
}