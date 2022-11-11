
export default function esmModulePlugin(fix){
    return {
        name:"vite-plugin-esm",
        resolveId(id){
            let reg = /^[\w@](?!.*:\/\/)/
            if(fix.hasOwnProperty(id)){
                if(!fix[id]){
                    return fix[id]
                }else{
                    return  id
                }
            }
            if(reg.test(id)&&!id.startsWith("D")&&!id.startsWith("@esmCache:")){
                return  `@esmCache:${id}`
            }

        },
        async load(id){
            console.log(id)
            if(id.startsWith("@esmCache:")){
                let name = id.replace("@esmCache:","")
                let url =  `http://127.0.0.1:6809/deps/${name}`
                console.log(await (await fetch(url)).text())
                return await (await fetch(url)).text()
            }
            if(id.startsWith("http://127.0.0.1:6809/deps")){
                return await (await fetch(id)).text()
            }
        }
    }
}