<template>
	<p>
		Si quieres comparar tu código con el código que hemos construido hasta ahora, puedes revisarlo en el repositorio de GitHub
		<a :href="githubLink" target="_blank" rel="noopener noreferrer">
			aquí <OutboundLink />
		</a>.
	</p>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { usePageData } from '@vuepress/client';

const codeSamplesURL = 'https://github.com/NejireSupremacy/guide/tree/main/code-samples/';

const props = defineProps({
	path: String,
});

const githubLink = ref(codeSamplesURL);
const page = usePageData();

onMounted(() => {
	githubLink.value += props.path || page?.value.path.slice(1).replace('.html', '');
});
</script>
