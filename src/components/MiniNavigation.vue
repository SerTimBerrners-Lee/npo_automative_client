<template>
	<div>
		<p class='menu_span'>
			<span class='td-row'
				ref="one"
				@click='e => clcikSpan(1, e.target)'>Все</span>
			<span class='td-row'
				v-for='(dat, inx) of arrData'
				:key='dat'
				@click='e => clcikSpan(inx + 2, e.target)'>{{ dat }}</span>
		</p>
	</div>
</template>

<script>
import { eSelectSpan } from '@/js/methods';

export default {
	props: ['arrData'],
	data() {
		return {
			span: null
		}
	},
	methods: {
		clcikSpan(number, e) {
			this.span = eSelectSpan(this.span, e);
			this.$emit('unmount', number);
		}
	},
	mounted() {
		this.clcikSpan(1, this.$refs.one);
	}
}
</script>