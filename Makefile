serve:
	pnpm dev:Serve


build:
	pnpm run build
	node dist/src/index.js
