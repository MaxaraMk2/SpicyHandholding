function randIntRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }
  
function prettify(input){
    var output = Math.round(input * 1000000)/1000000;
	return output;
}

function moneyFormat(num){
    let result = Intl.NumberFormat('en-US',{style: 'currency', currency:'USD'}).format(num)
    return result
}

function saveGame(){
    data.time.saveDate = new Date()
    localStorage.setItem("save",JSON.stringify(data));
}

function loadGame(){
    let saveData = JSON.parse(localStorage.getItem("save")) 
    for (i in saveData){
        if (typeof saveData[i] !== "undefined"){
            if (i == 'fanHistory' || i == 'handHistory'){
                continue
            }
            data[i] = saveData[i]
            
            if (i == 'currentFans' || i == 'handHolding'){
                for (let j=0;j<saveData[i].length;j++){
                    for (let k=0;k<saveData[i][j].length;k++){
                        let loadFan = (saveData[i][j][k])
                        data[i][j][k] = Object.assign(new Fan(), loadFan)
                    }
                }
            }
            
        }
    }
    setInitialCost()
    //TODO: load dark mode state
    game.onLoad()
}

function deleteSave(){
    let confirmPhrase = prompt("Type 'delete my save' to confirm save file deletion.")
    if (confirmPhrase === 'delete my save'){
        localStorage.removeItem("save")
        alert('Save file deleted!')
    } else {
        alert('Your save file will remain!')
    }
}

function appear(list=[]){
    for (i=0;i<list.length;i++){
        //console.log(i)
        document.getElementById(list[i]).setAttribute('style', 'display:inline-flex')
    }
}

function disappear(list=[]){
    for (i=0;i<list.length;i++){
        //console.log(i)
        document.getElementById(list[i]).setAttribute('style', 'display:none')
    }
}

function searchID(list=[], target){
    for (let i=0;i<list.length;i++){
        for (let j=0;j<list[i].length;j++){
            if (list[i][j].id == target){
                return [i,j]
            }
        }
    }
}



function searchButton(list=[], target){
    for (let i=0;i<list.length;i++){
        if (list[i].firstChild.id == target){
            return i
        }
    }
}

function findButtonIndex(list=[], target){
    for (let i=0;i<list.length;i++){
        if (list[i].number == target){
            return i
        }
    }
}

function clearSelect(){
    document.getElementById('selectData').innerHTML = 'None'
    disappear(['handButton','deleteButton','fansButton'])
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function formatTime(seconds){
    if (seconds < 3600){
        let date = new Date(seconds * 1000).toISOString().slice(14, 19);
        return date
    } else if (seconds >=3600){
        let date = new Date(seconds * 1000).toISOString().slice(11, 19);
        return date
    }
}

function checkFull(list){
    let fullRows = 0
    for (let i=0;i<list.length;i++){
        switch (list){
        case data.currentFans:
            if (list[i].length == data.fanLimit){
                fullRows++
            }
            break
        case data.handHolding:
            if (list[i].length == 2){
                fullRows++
            }
            break
        }
    }
    return fullRows
}

function checkDays(dayNum, name){
    let isScheduled = -1
    for (let i=0;i<data.studioSlots;i++){
        if (data.streamSchedule[i][dayNum]==name){
            isScheduled = i
        }
    }
    //console.log(isScheduled)
    return isScheduled
}

function disableDays(dayNum, name){
    for (let i=0;i<data.studioSlots;i++){
                document.getElementById('s'+(i+1)+'b'+(dayNum+1)).setAttribute('disabled', true)
    }
}


var numParts = 3    //number of separate sprite parts to combine
function createSprite(id, indexList){
    let canvas = document.getElementById(id)
    let ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0,0,canvas.width,canvas.height);

    let n = 0
    for (let i=0;i<numParts;i++){
        ctx.drawImage(spritesheet, indexList[n]*50, i*50, 50, 50, 0,0, 300,150)
        if (n < indexList.length-1){
            n++
        } else {
            n = 0
        }
    }
}

function toggleDarkMode(){
    switchDarkModeClasses()
    data.lightMode = !data.lightMode
}

function switchDarkModeClasses(){
    if (data.lightMode){
        document.getElementById('darkLightButton').innerHTML = 'LIGHT MODE'
        document.body.className = 'darkMode'
        let list = document.getElementsByClassName('lightTable')
        while (list.length > 0){
            list[0].className = 'darkTable'
        }
    } else {
        document.getElementById('darkLightButton').innerHTML = 'DARK MODE'
        document.body.className = ''
        let list = document.getElementsByClassName('darkTable')
        while (list.length > 0){
            list[0].className = 'lightTable'
        }
    }
}