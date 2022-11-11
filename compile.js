import Compilers from "./compilers/index.js"
const express = require('express')
const _path = require('path')
const parseUrl = require('parseurl')
const Mime = require('mime')
const fs = require('fs-extra')
const targets = {
    "ts": 'js',
    "scss": "js",
    "js": "js",
    "html": "html",
    "css.scss":"css",
    "vue":"js"
}
let compiler = new Compilers()
const langs = ['ts', 'js', 'scss']
export default function compile(options) {
    //如果没有传入options就从文件系统读取
    if (!options && fs.existsSync(_path.join(dir, 'compileConfig.json'))) {
        options = fs.readJSONSync(path.join(dir, 'compileConfig.json'), 'utf-8')
    }
    if (!options) {
        throw ('必须传入options')
    }
    let _static = express.static(options.base)
    return async (req, res, next) => {
        let path = parseUrl(req).pathname
        let baseUrl = req.baseUrl
        let extension = ""
        extension = path.split("\.").pop()
        let mime = ""
        console.log(extension)
        if(fs.existsSync(_path.join(options.base,path,"/index.html"))){
            path = _path.join(path,"/index.html")
        }
        for (let ex in targets){
            console.log(ex)
            if(path.endsWith(ex)){
                mime=  ex
            }
        }
        console.log(path)
        if (extension == path) {
            extension = 'html'
        }
        if (!extension) {
            extension = 'html'
        }
        if(
            extension=="/"||extension=="\\"
        ){
            extension = 'html'

        }
        console.log(targets[extension])

        if (targets[extension]) {
            let mimetype = Mime.types[targets[mime?mime:extension]] + '; UTF-8'
            res.setHeader(
                'content-type', mimetype
            )
            res.end(await compiler.compile(path, options, baseUrl,req))
        } else {
            _static(req, res, next)
        }
    }
}