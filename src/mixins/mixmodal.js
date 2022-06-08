export default {
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',
    }
  },
  methods: {
    destroyModalF(methodsName = '', ...params) {
      this.destroyModalLeft = 'left-block-modal-hidden';
      this.destroyModalRight = 'content-modal-right-menu-hidden';
      this.hiddens = 'display: none;';

			try {
        this.$emit(methodsName, ...params);
        this.loader = false;
      } catch(err) { console.error(err, 'mixmodal') }
		},
  },
  mounted () {
    this.destroyModalLeft = 'left-block-modal';
    this.destroyModalRight = 'content-modal-right-menu';
    this.hiddens = 'opacity: 1;';
  }
}