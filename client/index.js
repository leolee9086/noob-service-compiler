import  * as path from  "/deps/path-browserify"
console.log(path)
const websocketURL = `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host || options.host}/clientws`;
const ws = new WebSocket(`${websocketURL}?id=${window.location.pathname.replace(/\//g,"").replace(/\-/g,'')}`);
ws.onopen = () => {
    console.log(ws)
}
ws.onmessage = (event) => {
    console.log(event)

    if(event.data){
        let data  = JSON.parse(event.data)
        console.log(data.updatePath.split('\\')[0],window.location.pathname.replace(/\//g,''))
        if(data.updatePath.split('\\')[0]==window.location.pathname.replace(/\//g,'')){
            window.location.reload()
        }else if(data.updatePath.split('\\')[0]=="noob-service-compiler"){
            window.location.reload()
        }
    }
};
