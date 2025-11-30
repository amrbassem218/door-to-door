module.exports = [
"[project]/node_modules/@supabase/node-fetch/lib/index.js [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.resolve().then(() => {
        return parentImport("[project]/node_modules/@supabase/node-fetch/lib/index.js [app-ssr] (ecmascript)");
    });
});
}),
"[externals]/worker_threads [external] (worker_threads, cjs, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/[externals]_worker_threads_a2f38a15._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[externals]/worker_threads [external] (worker_threads, cjs)");
    });
});
}),
];