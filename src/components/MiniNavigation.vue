<template>
	<div>
		<p :class='pos == "x" ? "pos_x menu_span" : "pos_y menu_span"'>
			<span class='td-row'
				ref="one"
				@click='e => clcikSpan(1, e.target)' v-if='default_item'>Все</span>
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
	props: {
		arrData: [],
		pos: {
			type: String,
			default: 'x' // 'x', 'y'
		},
		default_item: {
			type: Boolean,
			default: true
		}
	},
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
		if (this.$refs.one) this.clcikSpan(1, this.$refs.one);
	}
}
</script>

<style>
.pos_y {
	display: flex;
  flex-direction: column;
}
.pos_y>span:not(:last-child) {
	border-bottom: 1px solid #d3d3d3;
}

.pos_y>span {
	font-size: 14px;
	padding: 10px 5px 10px 5px;
}

</style>