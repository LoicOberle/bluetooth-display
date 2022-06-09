import {
    createApp
} from 'vue'


//function to convert the hex color value to the integer rgb components
function hexToRGB(hexString) {
    let temp = hexString.substring(1)
    var aRgbHex = temp.match(/.{1,2}/g);
    var aRgb = [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16)
    ];

    return aRgb
}



let screenMutiplicator = 2
screenPreview.width = screenWidth * screenMutiplicator
screenPreview.height = screenHeight * screenMutiplicator

screenPreview2Send.width = screenWidth
screenPreview2Send.height = screenHeight




/*function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';

    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = ctx.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}*/



/*document.getElementById("testButton").addEventListener("click", () => {
    //console.log(FontFaceSet.check());
})*/

let app = createApp({
    data() {
        return {
            elements: [{
                type: "text",
                content: "Exemple text",
                x: 0,
                y: 20,
                size: 25
            }],
            foregroundColor: "#FFFFFF",
            backgroundColor: "#000000",
            ports: [],
            ctx:undefined,
            ctx2Send:undefined
        }
    },
    methods: {
        updateBackgroundColor(event) {
            let newColor = event.target.value
            this.backgroundColor = newColor
            this.refreshScreens()
        },
        updateforegroundColor(event) {
            let newColor = event.target.value
            this.foregroundColor = newColor
            //console.log(this.foregroundColor);
            this.refreshScreens()
        },
        changingElement(event) {
            this.updateValues(event)
            this.refreshScreens()
        },
        updateValues(event) {

            let property = event.target.dataset.type
            let index = event.target.dataset.index
            let newVal = event.target.value
            //console.log(property, index, newVal);
            eval(`this.elements[${index}].${property}="${newVal}"`)
        },
        //refresh the screen when content is modified
        refreshScreens() {
            let ctx=this.ctx
            let ctx2Send=this.ctx2Send
            ctx.fillStyle = "black"
            ctx2Send.fillStyle = "white"

            ctx.fillRect(0, 0, screenPreview.width, screenPreview.height)
            ctx2Send.fillRect(0, 0, screenPreview2Send.width, screenPreview2Send.height)
            this.elements.forEach(element => {
                // //console.log(element.content);
                // //console.log(element.x);
                ctx.fillStyle = this.foregroundColor
                ctx2Send.fillStyle = "black"
                ctx.strokeStyle = this.foregroundColor
                ctx2Send.strokeStyle = "black"
                ctx.lineWidth = 3
                ctx2Send.lineWidth = 3
                ctx.font = element.size * screenMutiplicator + 'px arial';
                ctx2Send.font = element.size + 'px arial';
                //wrapText(ctx, element.content, element.x, element.y  * screenMutiplicator, screenOverview.width, element.size  * screenMutiplicator)
                //wrapText(ctx2Send, element.content,  element.x, element.y , screenPreview2Send.width, element.size )
                switch (element.type) {
                    case "text":
                        ctx.fillText(element.content, element.x * screenMutiplicator, element.y * screenMutiplicator)
                        ctx2Send.fillText(element.content, element.x, element.y)
                        break;
                    case "square":
                        ctx.strokeRect(element.x * screenMutiplicator, element.y * screenMutiplicator, element.size * screenMutiplicator, element.size * screenMutiplicator)
                        ctx2Send.strokeRect(element.x, element.y, element.size, element.size)
                        break;
                        case "circle":
                            ctx.beginPath();
                            ctx.arc(element.x * screenMutiplicator, element.y * screenMutiplicator, element.size * screenMutiplicator, 0, Math.PI * 2, true);
                            ctx.stroke()
                            ctx.closePath();
                            ctx2Send.beginPath();
                            ctx2Send.arc(element.x, element.y, element.size, 0, Math.PI * 2, true);
                            ctx2Send.stroke()
                            ctx2Send.closePath();
                            break;
                }

            });
        },
        addElement(type) {
            switch (type) {
                case "text":
                    this.elements.push({
                        type: "text",
                        content: "Test",
                        x: 100,
                        y: 50,
                        size: 25
                    })
                    break;
                case "square":
                    this.elements.push({
                        type: "square",
                        content: "",
                        x: 100,
                        y: 50,
                        size: 25
                    })
                    break;
                case "circle":
                    this.elements.push({
                        type: "circle",
                        content: "",
                        x: 100,
                        y: 50,
                        size: 25
                    })
                    break;
            }
            this.refreshScreens()
        },
        sendMessage() {
            let ctx2Send=this.ctx2Send
            let screenData = ctx2Send.getImageData(0, 0, screenWidth, screenHeight).data
            let redChannel = []
            for (let i = 0; i < screenData.length; i += 4) {
                redChannel.push(screenData[i])

            }
            for (let i = 0; i < redChannel.length; i++) {
                let threshold = 127
                if (redChannel[i] < threshold) {
                    redChannel[i] = 0
                }
                if (redChannel[i] >= threshold) {
                    redChannel[i] = 1
                }

            }
            let bitmap = []
            for (let i = 0; i < redChannel.length; i += 8) {
                bitmap.push(redChannel[i] +
                    (redChannel[i + 1] << 1) +
                    (redChannel[i + 2] << 2) +
                    (redChannel[i + 3] << 3) +
                    (redChannel[i + 4] << 4) +
                    (redChannel[i + 5] << 5) +
                    (redChannel[i + 6] << 6) +
                    (redChannel[i + 7] << 7))

            }

            //let backgroundColorArray=hexToRGB(backgroundColor.value)
            //Only black backkgrounds work for now
            let backgroundColorArray = hexToRGB(this.foregroundColor) //Inverting the colors as a fixed, will have to find the cause
            let foregroundColorArray = hexToRGB(this.backgroundColor)
            //let foregroundColorArray=[100,200,40]
            let fullArray = backgroundColorArray.concat(foregroundColorArray).concat(bitmap)
            //console.log(bitmap);


            let options = this.$refs["portListBox"].options
            let index = this.$refs["portListBox"].selectedIndex
            // //console.log(fullArray)
            if (options[index] != undefined) {
                window.api.send("toMain", {
                    port: options[index].value,
                    message: fullArray
                })


            }

        },
        deleteElement(id) {
            this.elements.splice(id, 1)
            this.refreshScreens()
        },
        saveData() {
            localStorage.setItem("elements", JSON.stringify({
                backgroundColor: this.backgroundColor,
                foregroundColor: this.foregroundColor,
                elements: this.elements
            }))
        },
        loadData() {
            if (localStorage.getItem("elements") != undefined) {
                this.elements = JSON.parse(localStorage.getItem("elements")).elements
                this.backgroundColor = JSON.parse(localStorage.getItem("elements")).backgroundColor
                this.foregroundColor = JSON.parse(localStorage.getItem("elements")).foregroundColor

            }
            this.refreshScreens()

        },
        populatePortList() {
            //console.log("fdez");
            //Asks for the available serial ports
            window.api.send("reload", "")

            //Response from the server containing available serial ports
            window.api.receive("fromMain", (data) => {
                //console.log(data);
               // document.getElementById("portList").innerHTML = ""
                this.ports = []
                data.forEach(element => {
                    this.ports.push({
                        name: element.friendlyName,
                        val: element.path
                    })
                    let option = document.createElement("option")
                    option.innerHTML = element.friendlyName
                    option.value = element.path
                 //   document.getElementById("portList").append(option)
                });

            });

        },
        updateX(args) {
            //this.elements[args.id].x+=args.val
            let newX = parseInt(this.elements[args.id].x, 10) //+=amount
            newX += args.val
            this.elements[args.id].x = newX
            this.refreshScreens()
            ////console.log( this.elements[args.id].x);
        },
        updateY(args) {
            let newY = parseInt(this.elements[args.id].y, 10) //+=amount
            newY += args.val
            this.elements[args.id].y = newY
            this.refreshScreens()
            ////console.log(this.elements[args.id].y);
        }
    },
    mounted() {
        this.ctx=this.$refs['screenPreview'].getContext("2d")
        this.ctx2Send=this.$refs['screenPreview2Send'].getContext("2d")
        this.populatePortList()
        if (localStorage.getItem("elements") != undefined) {
            this.loadData()
        } else {

            this.refreshScreens()
        }
        

    },
})
app.mount('#app')
app.component(
    // the registered name
    'dpad',
    // the implementation
    {

        props: ["x", "y", "index"],
        template: `
      <div class="dpad-wrapper"><button class="right" v-on:click="setCoord('x',2)"></button>
      <button class="left" v-on:click="setCoord('x',-2)"></button>
      <button class="down" v-on:click="setCoord('y',2)"></button>
      <button class="up" v-on:click="setCoord('y',-2)"></button></div>`,
        methods: {
            setCoord(coord, amount) {
                if (coord == "x") {
                    this.$root.updateX({
                        id: this.$props.index,
                        val: amount
                    })
                } else {
                    this.$root.updateY({
                        id: this.$props.index,
                        val: amount
                    })
                }

            }
        }
    }
)