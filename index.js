import compile from "./compile.js"
const express = require('express')
const fs = require("fs-extra")
const app = express()
const http = require('http')
const compress = require("compression")()
const complieServer = http.createServer(app)
const path = require('path')
const json = require("body-parser").json()
const urlencoded = require("body-parser").urlencoded({
    //此项必须在 bodyParser.json 下面,为参数编码
    limit: '1024mb',
    extended: true,
})
const compression = require("compression")()
const allowCors = function (req, res, next) {
    res.setHeader("Access-Control-Allow-Private-Network", true);
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
}
//import addDevSurppoert from '../noob-service-sypublisher/middleWares/dependenciesParser.js'
import { apiProxy, proxy as syProxy } from '../noob-service-sypublisher/middleWares/syProxy.js';
import { wsProxy } from "../noob-service-sypublisher/middleWares/wsProxy.js"
//启动esmsh服务器
import { esm } from "./esm/index.js"
import addEsmSurrport from "./esm/esmProxy.js"
let { 解析用户设置 } = await import(workspaceDir + `/conf/appearance/themes/noob/script/util/config.js`)

esm("6810")
//解析json
app.use(json); //body-parser 解析json格式数据
//解析url
app.use(urlencoded);
//压缩gzip
app.use(compression);
//允许跨域请求
app.use(allowCors);
//允许跨域请求
//app.use(json解析器);
addEsmSurrport(app, "6810")
ipcRenderer.on(
    "setPath", (event, dirs) => {
        dirs.forEach(dirSet => {
            app.use(dirSet, compile(dirs(dirSet)))
        });
    }
)
//compile会在收到请求的时候自动将源代码转换成ems返回.
let options = {
    defs: {
        APP: false,
        MOBILE: false,
        BROWSER: true
    },
    verbose: true,
    tripleSlash: true,
    fillWithBlanks: false,
    uncommentPrefixString: false,
    hackPath: "",
    replace: {
        path: "path-browserify",
        "@simonwep/pickr": "/deps/@simonwep/pickr"
    },
    alias: {
        "@simonwep/pickr": "/deps/@simonwep/pickr"
    },
    base: path.join(workspaceDir, "\\conf\\appearance\\themes\\noob\\script\\siyuanAPP")
}
app.use('/siyuan/', compile(options))
app.use('/stage/', express.static(path.join(appDir, 'stage')))
app.use('/appearance/', express.static(path.join(workspaceDir, "\\conf\\appearance")))
app.use('/api', (req, res) => apiProxy(req, res))
app.use('/assets', (req, res) => syProxy(req, res))
app.use('/fonts/', express.static(path.join(workspaceDir, "\\conf\\appearance\\themes\\noob\\script\\siyuanAPP\\src\\assets\\fonts")))
app.use("/client", express.static(_selfPath + "/client"))
app.use("/ws", wsProxy)
app.post("/setting/addPath", (req, res, next) => {
    let data = req.body
    let route = data.route
    let options = data.options
    app.use(route, compile(options))
})
/*complieServer.on('upgrade',
) */
const { WebSocketServer } = require('ws');

function ws(app) {
    complieServer.on(`upgrade`, (req, socket, head) => {
        if (req.url.indexOf("/ws?app") >= 0) {
            wsProxy.upgrade(req, socket, head)
        } else {
            console.log(req.url)
            let _url = new URL(`http://127.0.0.1${req.url}`)
            console.log(_url)
            const obj = app.wsRoute[_url.pathname]
            console.log(app.wsRoute)
            obj ? obj.wss.handleUpgrade(req, socket, head, ws => obj.mid(ws, req)) : socket.destroy()
        }
    })
    app.ws = (route, mid) => {
        app.wsRoute = app.wsRoute || {}
        app.wsRoute[route] = {
            wss: new WebSocketServer({ noServer: true }),
            mid,
        }
    }
}
ws(app)
complieServer.listen(6809, () => {
    console.log("SSC服务器已经启动")
    ipcRenderer.send('服务启动完成', "ssc服务已经在6809端口启动")
})
ipcRenderer.on(
    "addPath", (event, msg) => {
        console.log(msg)
    }
)
let 设置 = await 解析用户设置()
let 服务解析路径
if (设置.额外设置 && 设置.额外设置.开发模式额外设置 && 设置.额外设置.开发模式额外设置.第三方服务解析路径) {
    服务解析路径 = 设置.额外设置.开发模式额外设置.第三方服务解析路径
}
else 服务解析路径 = workspaceDir + '/conf/noobConf/servicies'
console.log(服务解析路径)
let list = fs.readdirSync(服务解析路径 + '/')
console.log(list)
list.forEach(
    async 服务名 => {
        let options = {
            defs: {
                APP: false,
                MOBILE: false,
                BROWSER: true
            },
            verbose: true,
            tripleSlash: true,
            fillWithBlanks: false,
            uncommentPrefixString: false,
            hackPath: "",
            replace: {
                path: "path-browserify",
                "@simonwep/pickr": "/deps/@simonwep/pickr"
            },
            alias: {
                "@simonwep/pickr": "/deps/@simonwep/pickr"
            },
            base: path.join(服务解析路径, 服务名)
        }

        if (fs.existsSync(path.join(服务解析路径, 服务名, 'noobCompilerConfig.js'))) {
            console.log(服务名)
            app.use(`/${服务名}/`, compile(options))
            ipcRenderer.send(
                'noobCompilerService', {
                服务名: 服务名,
            }
            )
        }
    }
)
app.ws(
    "/clientws", (ws, req) => {
        fs.watch(服务解析路径+'/', {
            persistent: true,
            recursive: true,
        }, (type, fileName) => {
            ws.send(JSON.stringify({updatePath:fileName}))
        })
    }
)

