<template>
	<div id="app">
		<Header />
		<router-view/>
		<Footer />
	</div>
</template>

<script>
	import Header from './components/header.vue'
	import Footer from './components/footer.vue'
	import Content from './components/content.vue'
	import Alert from './components/alertModal.vue'

	export default {
		name: 'App',
		components : {
			Alert,
			Header,
			Footer,
			Content,
		}
	}
</script>

<style>
	body {
		background-color: #FF8787; 
		color: white;
	}
</style>
