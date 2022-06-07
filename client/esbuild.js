

const isDev = process.env.NODE_ENV === "development"


const esbuild = require('esbuild')
// clients bundlers
const {sassPlugin} = require('esbuild-sass-plugin')
esbuild.build({
	entryPoints: ["src/main.tsx"],
	bundle: true,
	minify: !isDev,
	sourcemap:  isDev,
	outdir: "build/asserts",
	chunkNames: "chunks/[name]-[hash]",
	target: ['chrome90'],
	format:"esm",
	watch: isDev ?  {
		onRebuild(error, result) {
			if (error) {
				console.error('client watch build failed:', error)
			} else {
				console.log('client watch build succeeded:', result)
			}
		},
	} : false,
	incremental: false,
	splitting: true,
	plugins: [sassPlugin()]
})
	.then(r=>{
		console.log("client building...")
	})
	.catch(ex=>{
		process.exit(1)
		console.log(ex)
	})

