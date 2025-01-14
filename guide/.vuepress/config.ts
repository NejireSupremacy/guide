import path from 'path';
import { defineUserConfig } from 'vuepress-vite';
import type { DefaultThemeOptions, ViteBundlerOptions } from 'vuepress-vite';
import sidebar from './sidebar';

const config = defineUserConfig<DefaultThemeOptions, ViteBundlerOptions>({
	bundler: '@vuepress/vite',
	templateDev: path.join(__dirname, 'templates', 'index.dev.html'),
	templateSSR: path.join(__dirname, 'templates', 'index.ssr.html'),
	lang: 'en-US',
	title: 'Guía de discord.js',
	description: 'Imagina una guía... que explore las múltiples posibilidades de tu bot escrito en discord.js.',
	head: [
		['meta', { charset: 'utf-8' }],
		['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
		['link', { rel: 'icon', href: '/favicon.png' }],
		['meta', { name: 'theme-color', content: '#3eaf7c' }],
		['meta', { name: 'twitter:card', content: 'summary' }],
		['meta', { property: 'og:title', content: 'Guía de discord.js' }],
		['meta', { property: 'og:description', content: 'Imagina una guía... que explore las múltiples posibilidades de tu bot escrito en discord.js.' }],
		['meta', { property: 'og:type', content: 'website' }],
		['meta', { property: 'og:url', content: 'https://discordjs-guide-es.netlify.app/' }],
		['meta', { property: 'og:locale', content: 'es_ES' }],
		['meta', { property: 'og:image', content: '/meta-image.png' }],
	],
	theme: path.join(__dirname, 'theme', 'index.ts'),
	themeConfig: {
		contributors: false,
		sidebar,
		repo: 'NejireSupremacy/guide',
		docsDir: 'guide',
		sidebarDepth: 3,
		editLinks: true,
		editLinkText: 'Edita esta página',
		lastUpdated: true,
		lastUpdatedText: 'Última actualización',
		navbar: [
			{
				text: 'Voz',
				link: '/voice/',
			},
			{
				text: 'Documentación',
				link: 'https://discord.js.org/#/',
			},
		],
		themePlugins: {
			mediumZoom: false,
		},
	},
	plugins: [],
});

const { ALGOLIA_DOCSEARCH_API_KEY, ALGOLIA_DOCSEARCH_APP_ID, GOOGLE_ANALYTICS_ID, NODE_ENV } = process.env;

if (NODE_ENV === 'production' && ALGOLIA_DOCSEARCH_API_KEY && GOOGLE_ANALYTICS_ID) {
	config.plugins.push(
		[
			'@vuepress/plugin-docsearch',
			{
				appId: ALGOLIA_DOCSEARCH_APP_ID,
				apiKey: ALGOLIA_DOCSEARCH_API_KEY,
				indexName: 'discordjs',
				placeholder: 'Search guide',
			},
		],
		[
			'@vuepress/plugin-google-analytics',
			{ id: GOOGLE_ANALYTICS_ID },
		],
	);
}

export default config;
