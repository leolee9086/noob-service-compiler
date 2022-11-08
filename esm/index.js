import { shellCmd } from "../util/shell.js"
const path = require("path")
let esmPath =  path.join(workspaceDir,'conf/noobConf/servicies/noob-service-compiler/esm/kernel')
let kernelPath = path.join(esmPath,'esmsh-win64.exe')
let cachePath = path.join(workspaceDir,'temp','noobCache','esm').replace(/\\/g,"/")
console.log(kernelPath)
export function esm(port){
    let cmd =`--port=${port}  --npm-registry=http://registry.npmmirror.com/  -etc-dir=${cachePath}`
    shellCmd(kernelPath.replace(/\\/g,"/"),cmd)
}