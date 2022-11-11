const _path =require('path')
export default class scssCompiler {
    async parseFile(path,options,baseUrl){
        console.log(path,options,baseUrl)
        let raw
        if(path.endsWith(".css.scss")){
            raw= true
            path = path.replace(".css.scss",".scss")
        }

        path = _path.join(options.base,path)
        const sass = require('sass');
        const result = sass.renderSync(
            {
               file:path,
               includePaths:[_path.join(window.workspaceDir,'/conf/nooConf/deps/'),_path.join(window.workspaceDir,'/conf/appearance/themes/noob/script/')]
            }               
        );
        if(!raw){
        const func =`
        const str = \`${result.css.toString().replace(/\`/g,'')}\`
        let style =document.createElement("style")
        style.setAttribute('lang','sass')
        style.innerHTML= str
        document.head.append(
            style        )
        export default {}
        `
        return  func
        }else{
            return result.css.toString().replace(/\`/g,'')
        }
    }
}