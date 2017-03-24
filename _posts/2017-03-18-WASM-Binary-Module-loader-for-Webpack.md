---
title: "WASM Binary Module loader for Webpack"
urlex: "https://github.com/ballercat/wasm-loader"
author:
    name: vainl
    url: "https://github.com/vainl"
categories: [tool]
tags: [JavaScript]
---
A simple .wasm binary file loader for Webpack. Import your wasm modules directly into your bundle as Constructors returning of WebAssembly.Instance. This avoids the need of using fetch and parse for your wasm files. Imported wasm files are converted to Uint8Arrays and become part of the full JS bundle.
