import sfcCompiler from './vue.js'
import tsComplier from './ts.js'
import scssCompiler from './scss.js'
export default class compilers{
    constructor(){
        this.js = new tsComplier()
        this.ts = new tsComplier()
        this.sass = new scssCompiler()
        this.scss = new scssCompiler()
        this["html"] ={
            parseFile(path,options,baseUrl,req){
                let filePath = require("path").join(options.base,path)
                let content = ""
                if(require("fs-extra").existsSync(filePath)){
                    content= require("fs-extra").readFileSync(filePath)
                }else{
                    content=  require("fs-extra").readFileSync(filePath+'/index.html')
                }
                let doc = new DOMParser().parseFromString(content, "text/html")
                let script = doc.createElement("script")
                script.setAttribute('src','/client/index.js')
                script.setAttribute('type','module')

                doc.head.append(script)
                return `<!DOCTYPE html>
                <html>          
                ${doc.querySelector("html").innerHTML}
                </html>
                `;
            }
        }
        this.vue={

            parseFile(filePath,options,baseUrl,req){
                if(filePath.startsWith(baseUrl)){
                    filePath=filePath.replace(baseUrl,"")
                }
                filePath=require("path").join(options.base,filePath)
            
                return sfcCompiler(filePath,req,options)
            }
        }
    }
    compile=(path,options,baseUrl,req)=>{
        if(!options){
          throw("必须传入options对象")
        }
        let ex=   path.split(".").pop()
        console.error(ex)
        if(!ex||ex==path){
            ex="html"
        }
        console.error(this[ex])
        return this[ex].parseFile(path,options,baseUrl,req)
    }
}