data = {
    time: {
        saveDate: 0,
        currentDate:0,
        offline:0
    },
    fanName : ["Chumbud", "Takodachi", "Deadbeat", "ChicKFP", "Teamate", 
                "Krony", "Hooman", "Sapling", "Brat", "GuyRys"],
    oshiName: ["Gura", "Ina", "Calli", "Kiara", "Ame",
            "Kronii", "Mumei", "Fauna", "Bae", "IRyS"],
    fanPrefix:["Chum", "Tako", "Dead", "Chic", "Tea",
                'Kro',"Hoo","Sap",'Brat',"Guy"],
    fanSuffix:["Bud", "Dachi", 'Beat', 'KFP', 'Mate',
                'Rony', "Man", "Ling", "Rat", "Rys"],
    currentFans : [[]],
    handHolding: [[]],
    maxLove: 20,
    maxLoyalty: 20,
    maxMoney: 50,
    funds: 10,
    totalFans:0,
    totalButtons:0,
    allFans: [],
    fanHistory: [],
    inProgress: [],
    barProgress: [],
    offspring: [],
    debutList: [],
    streamSchedule: ["-","-","-","-","-","-","-"],
    currentDay: 0,
    handSlots: 1,
    fanSlots:1,
    fanLimit: 6,
}

game = {
    start: function(){
        gameInterval = window.setInterval(game.tick,1000)
        window.requestAnimationFrame(updateBar)       
        document.getElementById('newFanButton').setAttribute('disabled',true)
        for (let i=0;i<7;i++){
            document.getElementById('day'+i).innerHTML = data.streamSchedule[i]
        }
        addHandholdRow()
        addFanRow()
    },
    tick: function(){
        let span = document.createElement('span')
        if (data.streamSchedule[data.currentDay] != "-"){
            span.innerHTML = "\nLIVE"
            span.setAttribute('style','color:red')
            document.getElementById('day'+data.currentDay).append(span)
            setTimeout((id, toRemove) => {try{document.getElementById(id).removeChild(toRemove)} catch {}}, 800, 'day'+data.currentDay, span)
        } else {
            span.innerHTML = "\nOFFLINE"
            document.getElementById('day'+data.currentDay).append(span)
            setTimeout((id, toRemove) => {try {document.getElementById(id).removeChild(toRemove)} catch {}}, 800, 'day'+data.currentDay, span)

        }
        for (let i=0;i<data.currentFans.length;i++){
            for (let j=0;j<data.currentFans[i].length;j++){
                if (typeof data.currentFans[i][j] == 'object'){
                    data.currentFans[i][j].spend()
                }
            }
        }
        
        for (let i=0; i< data.barProgress.length;i++){
            let fullRows = checkFull(data.currentFans)
            if (data.inProgress[i] === true && (data.barProgress[i] !== null || undefined )&& fullRows<data.fanSlots){
                incrementBar(data.barProgress[i].args[0], data.barProgress[i].args[1], data.barProgress[i].args[2], data.barProgress[i].args[3])
                //window.requestAnimationFrame(updateBar)
                if (data.barProgress[i].done == true){
                    offspring(data.barProgress[i].args[0], data.barProgress[i].args[2], data.barProgress[i].args[3])
                }
            }
        }

        game.update()
        if (data.currentDay < 6){
            data.currentDay++
        } else {
            data.currentDay = 0
        }
    },
    update: function (){
        document.getElementById('fundsValue').innerHTML = "$"+data.funds.toFixed(2)
        
        if (data.currentFans.length < data.fanSlots){
            data.currentFans.push([])
        }
        if (data.handHolding.length < data.handSlots){
            data.handHolding.push([])
        }
    },
    onLoad: function(){
        //resetTables()
        document.getElementById('streamlist').innerHTML = ""
        document.getElementById('fansData').innerHTML = ""
        document.getElementById('handData').innerHTML = ""
        //console.log(data.currentFans)
        //console.log('loading..')
        
        addFanRow()
        addHandholdRow()
        printAllFans()
        printAllHandholding()
        checkForButton()
        organiseFans()

        for  (let i=0;i<data.debutList.length;i++){
            addStreamer(data.debutList[i])
        }

        game.update()
    }
}

function debutStreamer(){
    let index = randIntRange(0, data.oshiName.length-1)
    if (data.debutList.length < data.oshiName.length){
        if (!data.debutList.includes(data.oshiName[index])){
            data.debutList.push(data.oshiName[index])
            addStreamer(data.oshiName[index])
        } else {
            debutStreamer()
        }
    } else {
        document.getElementById('debutButton').setAttribute('disabled','true')
    }
}

function addStreamer(name){
    document.getElementById('newFanButton').removeAttribute('disabled')
    let newStream = document.createElement('td')
            newStream.innerHTML = name
            newStream.setAttribute('id', name)
            newStream.setAttribute('style','white-space:pre;vertical-align:top;text-align:center')
            newStream.setAttribute('onclick','assign("'+name+'")')
            newStream.setAttribute('width','50px')
            newStream.setAttribute('height','20px')
            document.getElementById('streamlist').append(newStream)
}

function generateFan(){
    let oshiNum = randIntRange(0, data.debutList.length-1)
    let name = data.fanName[data.oshiName.indexOf(data.debutList[oshiNum])]
    let love = randIntRange(1,data.maxLove)
    let loyalty = randIntRange(1,data.maxLoyalty)
    let money = randIntRange (1,data.maxMoney)
    let oshi =  [data.oshiName[data.oshiName.indexOf(data.debutList[oshiNum])]]
    let newbie = new Fan(name,love,loyalty,money, oshi)

    let startLength  = data.currentFans.length
    if (startLength < data.fanSlots){
        data.currentFans.push([])
    }
    for (let i=0;i<startLength;i++){
        if (data.currentFans[i].length == data.fanLimit){
            continue
        } else {
            let slot = data.currentFans[i].length
            if (slot<data.fanLimit){
                console.log('slot: '+(slot+1))
                data.currentFans[i].push(newbie)
                data.allFans.push(newbie)
                data.totalFans++
                break
            } else {
                console.log('max fans')
            }
        }
    }  
    game.onLoad()
}

function resetTables(){
    
    fanTable.rows = 1
    fanTable.entries = 0
    fanTable.numFans = 0
    handTable.rows = 1
    handTable.entries = 0
    handTable.numFans = 0
    
}

fanTable= {
    rows:1,
    entries:0,
    numFans:0
},
handTable= {
    rows:1,
    entries:0,
    numFans:0
}

function addFanRow(){
    for (let i=0;i<data.fanSlots;i++){
        if(document.getElementById('fanRow'+(i+1)) === null){
            let table = document.getElementById('fansData')
            let newRow = document.createElement('tr')
            newRow.setAttribute('id', 'fanRow'+(i+1))

            for (let j=0;j<data.fanLimit;j++){
                let slot = document.createElement('td')
                slot.setAttribute('id', 'fr'+(i+1)+'s'+(j+1))
                slot.setAttribute('style', 'width:150px;border:black solid 1px;height:100px')
                newRow.append(slot)
            }
            table.append(newRow)

        } else {
            //console.log('already max fan rows')
        }
    }
}

function makeFanEntry(fan, rowNum, slotNum){
    //console.log("fan entry: "+rowNum+','+slotNum)
    let insert = document.getElementById('fr'+rowNum+'s'+slotNum)

    insert.setAttribute('style','white-space:pre;vertical-align:top;border:black solid 1px')
    insert.setAttribute('onclick','select('+fan.id+')')
    insert.setAttribute('width','150px')
    insert.setAttribute('height','100px')
    insert.innerHTML = "Type: "+fan.name+"\nLove: "+fan.love.toFixed(2)+"\nLoyalty: "+fan.loyalty.toFixed(2)+"\nBudget: "+fan.money.toFixed(2)+"\n"
}

function printAllFans(){
    game.update()
    document.getElementById('fansData').innerHTML == ""
    if (data.currentFans[0].length > 0){
        for (let i=0; i<data.fanSlots;i++){
            addFanRow()
            let row = document.getElementById('fanRow'+(i+1))

            for (let j=0;j<data.currentFans[i].length;j++){
                let fan = data.currentFans[i][j]
                if (fan !== undefined){
                    makeFanEntry(fan, i+1, j+1)
                }
            }   
        }
    }
}

function organiseFans(){
    for (let i=0;i<data.currentFans.length-1;i++){
        if (data.currentFans[i].length == 0 || data.currentFans[i].length == data.fanLimit){
            continue
        }
        if (data.currentFans[i].length < data.fanLimit
            && (i+1)<data.currentFans.length
            && data.currentFans[i+1].length > 0){
            let startLength = data.currentFans[i+1].length
            for (let j=0;j<startLength;j++){
                if (data.currentFans[i].length < data.fanLimit){
                    data.currentFans[i].push(data.currentFans[i+1][j])
                    data.currentFans[i+1].splice(0,1)
                } else {
                    break
                }
            }
        }
    }
}

function assign(name){
    console.log(name)
    let week = document.getElementsByClassName('weekButtons')
    for (let i=0;i<7;i++){
        week[i].setAttribute('style','display:inline-flex')
        if (data.streamSchedule[i] == name){
            week[i].setAttribute('disabled','true')
        } else {
            week[i].removeAttribute('disabled')
        }
        week[i].setAttribute('onclick','addToSchedule("'+name+'",'+i+')')
    }
    document.getElementById('currentStreamer').innerHTML = 'Assigning for '+name+": "
}

function addToSchedule(name, dayNum){
    data.streamSchedule[dayNum] = name
    let week = document.getElementsByClassName('weekButtons')
    week[dayNum].setAttribute('disabled','true')
    if (data.streamSchedule[dayNum] != name){
        week[dayNum].removeAttribute('disabled')
    }
    document.getElementById("day"+dayNum).innerHTML = name
}

function select(n){
    let location = searchID(data.currentFans, n)
    if (location !== undefined){
        let fan = data.currentFans[location[0]][location[1]]
        console.log(fan)
        document.getElementById('selectData').innerHTML = ("Type: "+fan.name+"\nLove: "+fan.love.toFixed(2)+"\nLoyalty: "+fan.loyalty.toFixed(2)+"\nBudget: "+fan.money.toFixed(2))
        let fullRows = checkFull(data.handHolding)
        if (fullRows < data.handSlots){  
            document.getElementById('handButton').innerHTML = "Handholding"
            document.getElementById('handButton').removeAttribute('disabled')
            document.getElementById('handButton').setAttribute('onclick','shift('+n+")")
        } else {
            document.getElementById('handButton').setAttribute('disabled',true)
            document.getElementById('handButton').innerHTML = "Chatroom Full!"
        }
        document.getElementById('deleteButton').setAttribute('onclick','deleteFan('+n+', data.currentFans)')
        disappear(['fansButton'])
        appear(['handButton','deleteButton'])
    } else{
        let location = searchID(data.handHolding, n)
        let fan = data.handHolding[location[0]][location[1]]
        console.log(fan)
        document.getElementById('selectData').innerHTML = ("Type: "+fan.name+"\nLove: "+fan.love.toFixed(2)+"\nLoyalty: "+fan.loyalty.toFixed(2)+"\nBudget: "+fan.money.toFixed(2))
        let fullRows = checkFull(data.currentFans)
        if (fullRows < data.fanSlots){
            document.getElementById('fansButton').setAttribute('onclick','shift('+n+')')
            document.getElementById('fansButton').removeAttribute('disabled')
            document.getElementById('fansButton').innerHTML = "Fanclub"
        } else  {
            document.getElementById('fansButton').setAttribute('disabled',true)
            document.getElementById('fansButton').innerHTML = "Fanclub Full!"
        }
        document.getElementById('deleteButton').setAttribute('onclick','deleteFan('+n+', data.handHolding)')
        disappear(['handButton'])
        appear(['fansButton','deleteButton'])
    }
    game.onLoad()
}

function shift(n){
    let location = searchID(data.currentFans, n)
    if(location !== undefined){
        let startLength  = data.handHolding.length
        if (startLength < data.handSlots){
            data.handHolding.push([])
        }
        for (let i=0;i<startLength;i++){
            if (data.handHolding[i].length == 2){
                continue
            } else {
                let slot = data.handHolding[i].length
                switch (data.handHolding[i].length){
                    case 0:
                    case 1:
                        console.log('slot: '+(slot+1))
                        data.handHolding[i].push(data.currentFans[location[0]][location[1]])
                        deleteFan(n, data.currentFans)
                        break
                    default:
                        console.log('shift to handholding error')
                        break
                }
                break
            }
        }
        
    } else {
        let location = searchID(data.handHolding, n)
        let startLength  = data.currentFans.length
        if (startLength < data.fanSlots){
            data.currentFans.push([])
        }
        for (let i=0;i<startLength;i++){
            if (data.currentFans[i].length == data.fanLimit){
                continue
            } else {
                let slot = data.currentFans[i].length
                if (slot<data.fanLimit){
                    console.log('slot: '+(slot+1))
                    data.currentFans[i].push(data.handHolding[location[0]][location[1]])
                    deleteFan(n, data.handHolding)
                    break
                }
            }
        }  
    }
    game.onLoad()
}

function deleteFan(n, list){
    //console.log(list)
    //console.log(n)
    let index = searchID(list, n)
    list[index[0]].splice(index[1],1)
    clearSelect()
    game.onLoad()
}

function makeHandholdEntry(fan, rowNum, slotNum){
    //console.log('hand entry: '+rowNum+','+slotNum)
    let insert = document.getElementById('hr'+rowNum+'s'+slotNum)

    insert.setAttribute('style','white-space:pre;vertical-align:top;border: black solid 1px')
    if (fan.inProgress != true){
        insert.setAttribute('onclick','select('+fan.id+')')
    }
    insert.setAttribute('width','150px')
    insert.setAttribute('height','100px')
    insert.innerHTML = "Type: "+fan.name+"\nLove: "+fan.love.toFixed(2)+"\nLoyalty: "+fan.loyalty.toFixed(2)+"\nBudget: "+fan.money.toFixed(2)+"\n"
}

function printAllHandholding(){
    document.getElementById('handData').innerHTML == ""
    for (let i=0; i<data.handHolding.length;i++){
        addHandholdRow()
        let row = document.getElementById('handRow'+(i+1))

        let firstFan = data.handHolding[i][0]
        if (firstFan !== undefined){
            makeHandholdEntry(firstFan, i+1, 1)
        }

        let secondFan = data.handHolding[i][1]
        if (secondFan !== undefined){
            makeHandholdEntry(secondFan, i+1, 2)
        }       
    }
}

function checkForButton(){
    for (let i=0;i<data.handHolding.length;i++){
        if (data.handHolding[i].length == 2 && data.inProgress[i] != true){
            let newButton = document.createElement('button')
            newButton.setAttribute('id', 'button'+(i+1))
            newButton.setAttribute('onclick','holdHands('+[(i+1), data.handHolding[i][0].id, data.handHolding[i][1].id]+')')
            newButton.setAttribute('style', 'white-space:pre')
            let fullRows = checkFull(data.currentFans)
            if (fullRows == data.fanSlots) { 
                newButton.setAttribute('disabled', true)
                newButton.innerHTML = "No room\nin Fanclub!"
            } else if (data.handHolding[i][0].oshi.length == data.handHolding[i][1].oshi.length){
                newButton.removeAttribute('disabled')
                newButton.innerHTML = "Hold hands!"
            } else {
                newButton.setAttribute('disabled', true)
                newButton.innerHTML = "Must have same\nnumber of Oshis!"
            }
            document.getElementById('hr'+(i+1)+'b').append(newButton)
        } else if (data.inProgress[i] == true){
            document.getElementById('hr'+(i+1)+'s1').removeAttribute('onclick')
            document.getElementById('hr'+(i+1)+'s2').removeAttribute('onclick')
            makeBar(i+1)
        }
    }
}

function addHandholdRow(){
    for (let i=0;i<data.handSlots;i++){
        if(document.getElementById('handRow'+(i+1)) === null){
            let table = document.getElementById('handData')
            let newRow = document.createElement('tr')
            newRow.setAttribute('id', 'handRow'+(i+1))

            let slot1 = document.createElement('td')
            slot1.setAttribute('id', 'hr'+(i+1)+'s1')
            slot1.setAttribute('style','width:150px;border:black solid 1px;height:100px')
            
            let slot2 = document.createElement('td')
            slot2.setAttribute('id', 'hr'+(i+1)+'s2')
            slot2.setAttribute('style','width:150px;border:black solid 1px;height:100px')

            let buttonslot = document.createElement('td')
            buttonslot.setAttribute('id', 'hr'+(i+1)+'b')
            //buttonslot.setAttribute('style','vertical-align:top')

            newRow.append(slot1)
            newRow.append(slot2)
            newRow.append(buttonslot)

            table.append(newRow)
        } else {
            //console.log('already max handholding rows')
        }
    }
}

function holdHands(rowNum, firstID, secondID){
    let firstEntry = document.getElementById('hr'+rowNum+'s1')
    let secondEntry = document.getElementById('hr'+rowNum+'s2')

    firstEntry.removeAttribute('onclick')
    secondEntry.removeAttribute('onclick')

    document.getElementById('hr'+rowNum+'b').innerHTML = ""
    
    holding(firstID, secondID)
}

function deleteButton(rowID){
    for (let i=0;i<data.allButtons.length;i++){
        if (data.allButtons[i].id ){
            continue
        }
    }
    data.allButtons.splice(index, 1)
    game.onLoad()
}

async function holding(id1, id2){
    let index1 = searchID(data.handHolding, id1)
    let index2 = searchID(data.handHolding, id2)
    
    let parent1 = data.handHolding[index1[0]][index1[1]]
    let parent2 = data.handHolding[index2[0]][index2[1]]
    
    parent1.inProgress = true
    parent2.inProgress = true

    let newLove = (parent1.love + parent2.love) / (1+(randIntRange(30,70)/100))
    if (parent1.love + parent2.love == data.maxLove*2){
        if (data.maxLove <= 95){
            data.maxLove += 5
        }
    }
    if (newLove > data.maxLove){
        newLove = data.maxLove
    }

    let newLoyalty = (parent1.loyalty + parent2.loyalty) / (1+(randIntRange(30,70)/100))
    if (parent1.loyalty + parent2.loyalty == data.maxLoyalty*2){
        if (data.maxLoyalty <= 95){
            data.maxLoyalty += 5
        }
    }
    if (newLoyalty > data.maxLoyalty){
        newLoyalty = data.maxLoyalty
    }

    let newMoney = (parent1.money + parent2.money) / (1+(randIntRange(30,70)/100))
    if (parent1.money + parent2.money == data.maxMoney*2){
        if (data.maxMoney <= 1000){
            data.maxMoney += 10
        }
    }
    if (newMoney > data.maxMoney){
        newMoney = data.maxMoney
    }


    let newOshi = parent1.oshi.slice()
    for (let i=0;i<parent2.oshi.length;i++){
        if (!newOshi.includes(parent2.oshi[i])){
            newOshi.push(parent2.oshi[i])
        }
    }

    var newName = ""
    if(newOshi.length == 1){
        newName = data.fanName[data.oshiName.indexOf(newOshi[0])]
    } else { 
        for (i=0;i<newOshi.length;i++){
            //console.log(newOshi[i])
            if (i < newOshi.length/2){
                newName = newName.concat(data.fanPrefix[data.oshiName.indexOf(newOshi[i])])
            } else {
                newName = newName.concat(data.fanSuffix[data.oshiName.indexOf(newOshi[i])])
            }
            //console.log(newName)
        }
        newName = newName.toLowerCase()
        newName = newName[0].toUpperCase() + newName.slice(1) 
    }

    data.offspring[index1[0]] = {
        'name': newName,
        'love': newLove,
        'loyalty': newLoyalty,
        'money': newMoney,
        'oshi':newOshi,
    }

    if (data.inProgress[index1[0]] != true || parent1.inProgress){
        holdingProgress(index1[0]+1, newOshi.length, id1, id2)
        while (data.inProgress[index1[0]] == true){
            await sleep(100)
        }
        //offspring(index1[0]+1, id1, id2)
    }
}

//add offspring stats to new object
function offspring(rowNum, id1, id2){
    //console.log(rowNum)
    let newbie = new Fan(data.offspring[rowNum-1].name, data.offspring[rowNum-1].love, data.offspring[rowNum-1].loyalty, data.offspring[rowNum-1].money, data.offspring[rowNum-1].oshi)
        let startLength  = data.currentFans.length
        if (startLength < data.fanSlots){
            data.currentFans.push([])
        }
        for (let i=0;i<startLength;i++){
            if (data.currentFans[i].length == data.fanLimit){
                continue
            } else {
                let slot = data.currentFans[i].length
                if (slot<8){
                    console.log('slot: '+(slot+1))
                    data.currentFans[i].push(newbie)
                    data.allFans.push(newbie)
                    data.totalFans++
                    break
                } else {
                    console.log('max fans')
                }
            }
        }  

        if (newbie.name.length > 10){
            let shortName = newbie.name.slice(0,8)
            var addText = document.createTextNode("Type: "+shortName+"...\nLove: "+newbie.love.toFixed(2)+"\nLoyalty: "+newbie.loyalty.toFixed(2)+"\nBudget: "+newbie.money.toFixed(2)+"\n")
        } else {
            var addText = document.createTextNode("Type: "+newbie.name+"\nLove: "+newbie.love.toFixed(2)+"\nLoyalty: "+newbie.loyalty.toFixed(2)+"\nBudget: "+newbie.money.toFixed(2)+"\n")
        }
        console.log(id1)
        deleteFan(id1, data.handHolding)
        deleteFan(id2, data.handHolding)
        data.barProgress[rowNum-1] = null
        game.onLoad()
}

async function holdingProgress(rowNum, oshiNum, id1, id2){
    data.inProgress[rowNum-1] = true
    if (data.barProgress[rowNum-1] === null || data.barProgress[rowNum-1] === undefined){
        data.barProgress[rowNum-1] = {
            'args': [rowNum, oshiNum, id1, id2],
            'progress': 0,
            'duration': (10*Math.pow(oshiNum,1.5)),
            'delta': 100/(10*Math.pow(oshiNum,1.5)),
            'green': 0,
            'done': false
        }
    }
    
    makeBar(rowNum)
    

}

function makeBar(rowNum){
    let barSlot = document.getElementById('hr'+rowNum+'b')
    barSlot.innerHTML = ""
    let bar = document.createElement('div')
    bar.setAttribute('style','background-color:grey;height:15px;width:100px')

    let barProgress = document.createElement('div')
    barProgress.setAttribute('style','background-color:green;height:15px;width:0px')
    barProgress.setAttribute('id', 'barProgress'+rowNum)

    let timeAmt = document.createElement('span')
    timeAmt.setAttribute('id','timeLeft'+rowNum)

    barSlot.append(timeAmt)
    bar.append(barProgress)
    barSlot.append(bar)
}

function incrementBar(rowNum, oshiNum, id1, id2){
    if (data.barProgress[rowNum-1]['progress']<(10*Math.pow(oshiNum,1.5))){
        data.barProgress[rowNum-1]['progress']++
        if (data.barProgress[rowNum-1]['duration']-1 <= 0){
            data.barProgress[rowNum-1]['duration'] = 0
        } else {
            data.barProgress[rowNum-1]['duration']--
        }
        data.barProgress[rowNum-1]['green'] += data.barProgress[rowNum-1]['delta']
    } else {
        data.barProgress[rowNum-1].done = true
        data.inProgress[rowNum-1] = false
    }
}

function updateBar(timestamp){
    for (let i=0;i<data.inProgress.length;i++){
        if (data.inProgress[i] == true){
            if (document.getElementById('barProgress'+(i+1)) !== null && document.getElementById('barProgress'+(i+1)) !== undefined){
                let bar = document.getElementById('barProgress'+(i+1))
                bar.setAttribute('style','background-color:green;height:15px;width:'+data.barProgress[i]['green']+'px')
                document.getElementById('timeLeft'+(i+1)).innerHTML = formatTime(data.barProgress[i]['duration'])
                document.getElementById('timeLeft'+(i+1)).setAttribute('style', 'position:relative;left:25px')
                if (checkFull(data.currentFans) == data.fanSlots){
                    /*
                    if (document.getElementById('full'+(i+1)) === null){
                        let error = document.createElement('span')
                        error.setAttribute('id','full'+(i+1))
                        error.setAttribute('style','color:red')
                        error.innerHTML = 'Fanclub Full!'
                        document.getElementById('hr'+(i+1)+'b').append(error)
                    }*/
                    document.getElementById('timeLeft'+(i+1)).innerHTML = formatTime(data.barProgress[i]['duration']) + '⏸'
                    document.getElementById('timeLeft'+(i+1)).setAttribute('style', 'position:relative;left:20px;color:red')
                }
            }
        } else {
            if (document.getElementById('barProgress'+(i+1)) !== null && document.getElementById('barProgress'+(i+1)) !== undefined){
                let bar = document.getElementById('barProgress'+(i+1))
                bar.parentElement.parentElement.innerHTML = ""
            }
        }

    }
    window.requestAnimationFrame(updateBar)
}

function upgrade(item){
    switch (item){
        case "fanSlots":
            data.fanSlots++
            game.onLoad()
            break
        case 'handSlots':
            data.handSlots++
            game.onLoad()
            break
    }
}