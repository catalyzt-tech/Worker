serve:
	pnpm dev


build:
	pnpm run build
	node dist/src/index.js
