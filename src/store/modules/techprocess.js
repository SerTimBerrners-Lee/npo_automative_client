
import PATH_TO_SERVER from '@/js/path.js';
export default { 
  actions: {
    async createTechProcess(ctx, data) {
      if(!ctx.getters.getAuth)
        return 0
      data.append('responsibleActionId', ctx.getters.getAuth.id)
      const res = await fetch(`${PATH_TO_SERVER}api/detal/techprocess`, {
        method  :   'post',
        body    :   data
      });

      if(!res.ok) return false;
      const result = await res.json();
      return result 
    },
    async fetchTechProcess(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/detal/techprocess/${id}`);
      if(!res.ok) return false; 
      const result = await res.json()
      console.log(result, 'result');

      return result 
    },
    async fetchAllDetalOperation() {
      const res = await fetch(`${PATH_TO_SERVER}api/detal/operation/include`);

      if(!res.ok) return []
      return await res.json()
    }
  },
}