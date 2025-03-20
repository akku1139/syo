# id

- lowercase
- remove symbols
- do not start with numbers

# Twoslash cache

# Write farm config in `syo.config.js`

# `syo.config.ts`

# Commandline config

# Dev Server

# basePath

- favicon
- link ( `/...` -> `http://host/{basePath}/...`, `//...` -> `http://host/...`)

# preload css

- `<link rel="preload stylesheet" href="hoge.css" as="style">`

# 404 page

# preloading

# create menu (sort filename `00-hoge.md`)

# auto reload routing

# SourceMap control

# use `@farmfe/plugin-mdx`

- https://github.com/farm-fe/plugins/issues/124

# import alias (sync with tsconfig)

# fix null char error

```ts
/syo # FARM_DEBUG_HTML_MINIFY=1 pnpm run docs

> syo@0.2.0 docs /syo
> cd docs && node ../bin/syo.mjs

(node:141) ExperimentalWarning: glob is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[ building ] ⠄ render index_5afb                                                                                                                                                                                     Can not minify html index.html due to html syntax error: Parse `index.html` failed.
 Error:   × Unexpected null character
    ╭─[index.html:15:1]
 12 │
 13 │
 14 │
 15 │ <script src=./index_92ac.7e4b1fc4.js data-farm-resource=true></script><script src=./index_5afb.18ce84cb.js data-farm-resource=true></script><script src=./index_3a8c.8ab54bfd.js data-farm-resource=true></script><script>window['f081367f80fe14896375a9f8b8918ca3'].__farm_module_system__.setInitialLoadedResources(['index_3a8c.8ab54bfd.js','index_5afb.18ce84cb.js','index_92ac.7e4b1fc4.js']);</script><script>window['f081367f80fe14896375a9f8b8918ca3'].__farm_module_system__.setDynamicModuleResourcesMap([{ path: 'index_92ac.7e4b1fc4.js', type: 0 },{ path: 'virtual:syo:routes_b95e.105ef1e7.js', type: 0 },{ path: 'pages_index_a912.a708f1ce.js', type: 0 },{ path: 'pages_index_b2f5.a5abc126.js', type: 0 }],{ '61d7f349': [0,1],'bb4300d1': [2,3] });</script><script>window['f081367f80fe14896375a9f8b8918ca3'].__farm_module_system__.setPublicPaths(['./']);</script><script>window['f081367f80fe14896375a9f8b8918ca3'].__farm_module_system__.bootstrap();</script><script>window['f081367f80fe14896375a9f8b8918ca3'].__farm_module_system__.require("5735a851")</script>
    ·                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           ─
    ╰────

Potential Causes:
1.The module have syntax error.
2.This kind of module is not supported, you may need plugins to support it

[ Farm ] Error: Failed to build: Error: nul byte found in provided data at position: 0
 ELIFECYCLE  Command failed with exit code 1.
```

`virtual:syo:routes_b95e.105ef1e7.js`

https://github.com/farm-fe/plugins/blob/a4ba6c6208f3e3da517dba7d5d269ada42d7be2f/rust-plugins/virtual/src/lib.rs#L18

```rs
const VIRTUAL_PREFIX: &str = "\0virtual:";
```

# tsconfig for client code

- https://swc.rs/docs/migrating-from-tsc
