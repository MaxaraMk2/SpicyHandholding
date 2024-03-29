data = {
    lightMode: true,
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
    numFans: 0,
    totalFans:0,
    totalButtons:0,
    allFans: [],
    fanHistory: [],
    inProgress: [],
    barProgress: [],
    offspring: [],
    debutList: [],
    streamSchedule: [['-','-','-','-','-','-','-']],
    currentDay: 0,
    handSlots: 1,
    fanSlots:1,
    fanLimit: 6,
    studioSlots: 1,
    costOfStreamer: 0,
    costOfFan: 2,
    costOfFanclub: 5000,
    costOfChatroom: 2500,
    costOfStudio: 10000,
}

temp = {
    updateName: '',
    selectedFan: ''
}

game = {
    start: function(){
        gameInterval = window.setInterval(game.tick,1000)
        window.requestAnimationFrame(updateBar)       
        document.getElementById('newFanButton').setAttribute('disabled', true)
        addHandholdRow()
        addFanRow()
        addStudioRow()
        printSchedule()
        setInitialCost()
        switchTo('streamTab')
        switchDarkModeClasses()
        game.tick()
    },
    tick: function(){
        liveMarker()
        for (let i=0;i<data.currentFans.length;i++){
            for (let j=0;j<data.currentFans[i].length;j++){
                if (typeof data.currentFans[i][j] == 'object'){
                    data.currentFans[i][j].spend()
                }
            }
        }
        
        checkPurchasables()

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
        document.getElementById('fundsValue').innerHTML = "Funds: $"+formatMoney(data.funds)
        
        if (data.currentFans.length < data.fanSlots){
            data.currentFans.push([])
        }
        if (data.handHolding.length < data.handSlots){
            data.handHolding.push([])
        }
        if (data.numFans > 0){
            data.costOfFan = 2**data.numFans
        }
        document.getElementById('newFanButton').innerHTML = "NEW FAN ($"+formatMoney(data.costOfFan)+")"

        
    },
    onLoad: function(){
        //resetTables()
        document.getElementById('streamlist').innerHTML = ""
        document.getElementById('fansData').innerHTML = ""
        document.getElementById('handData1').innerHTML = ""
        document.getElementById('handData2').innerHTML = ""
        document.getElementById('scheduleButtons1').innerHTML = ''
        document.getElementById('scheduleButtons2').innerHTML = ''
        document.getElementById('week1').innerHTML = ''
        document.getElementById('week2').innerHTML = ''


        addFanRow()
        addHandholdRow()
        addStudioRow()
        printAllFans()
        printAllHandholding()
        printSchedule()
        checkForButton()
        organiseFans()
        checkPurchasables()

        assign(temp.updateName)

        for  (let i=0;i<data.debutList.length;i++){
            addStreamer(data.debutList[i])
        }

        game.update()
    }
}

var tabList = ['streamTab', 'fansTab', 'handTab', 'shopTab', 'optionsTab']
function switchTo(targetTab){
    for (let i=0; i<tabList.length;i++){
        let tab = document.getElementById(tabList[i])
        if (tabList[i] == targetTab){
            tab.style.display = 'block'
            document.getElementById(tabList[i]+'Button').className = 'activeTabButton'
            document.getElementById(tabList[i]+'Button').setAttribute('disabled', true)
        } else {
            tab.style.display = 'none'
            document.getElementById(tabList[i]+'Button').className = 'tabButton'
            document.getElementById(tabList[i]+'Button').removeAttribute('disabled')
            if (targetTab !== 'fansTab' || targetTab !== 'handTab'){
                document.getElementById('select').style.display = 'none'
            }

        }
    }
    document.getElementById('maxLoveDesc').style.animation = ''
    document.getElementById('maxLoyaltyDesc').style.animation = ''
    document.getElementById('maxBudgetDesc').style.animation = ''
    document.getElementById('select').style.animation = ''
    document.getElementById('scheduleButtons1').style.animation = ''
    document.getElementById('scheduleButtons2').style.animation = ''
    document.getElementById('allScheduleButtons').style.display = 'none'
    unhighlightSelectedFan()
}   


function setInitialCost(){
    // update buttons in beginning
    document.getElementById('newFanButton').innerHTML = "NEW FAN ($"+formatMoney(data.costOfFan)+")"
    if (data.debutList.length > 0){
        document.getElementById('debutButton').innerHTML = "NEW DEBUT ($"+formatMoney(data.costOfStreamer)+")"
    } else {
        document.getElementById('debutButton').innerHTML = "NEW DEBUT (FREE)"
    }
    document.getElementById('upgradeFanclubButton').innerHTML = "Upgrade Fanclub ($"+formatMoney(data.costOfFanclub)+")"
    document.getElementById('upgradeChatroomButton').innerHTML = "Upgrade Chatroom ($"+formatMoney(data.costOfChatroom)+")"
    document.getElementById('upgradeStudioButton').innerHTML = "Upgrade Studio ($"+formatMoney(data.costOfStudio)+")"

    document.getElementById('maxLoveDesc').innerHTML = "Maximum LOVE: "+data.maxLove
    document.getElementById('maxLoyaltyDesc').innerHTML = "Maximum LOYALTY: "+data.maxLoyalty
    document.getElementById('maxBudgetDesc').innerHTML = "Maximum BUDGET: $"+formatMoney(data.maxMoney)
}

var purchaseButtons = ['newFanButton', 'debutButton', 'upgradeFanclubButton', 'upgradeChatroomButton', 'upgradeStudioButton']
function checkPurchasables(){
    // enable/disable buttons based on funds
    for (let i=0;i<purchaseButtons.length;i++){
        button = document.getElementById(purchaseButtons[i])

        switch (i){
            case 0:
                if (data.funds >= data.costOfFan && data.debutList.length > 0){
                    //console.log('checkPurchasables')
                    button.removeAttribute('disabled')
                    disableBuyIfFanclubFull()
                } else {
                    button.setAttribute('disabled', true)
                }
                break
            case 1:
                if (data.funds >= data.costOfStreamer && data.debutList.length < data.oshiName.length) {
                    button.removeAttribute('disabled')
                }else {
                    button.setAttribute('disabled', true)
                }
                break
            case 2:
                if (data.funds >= data.costOfFanclub) {
                    button.removeAttribute('disabled')
                }else {
                    button.setAttribute('disabled', true)
                }
                break
            case 3:
                if (data.funds >= data.costOfChatroom) {
                    button.removeAttribute('disabled')
                }else {
                    button.setAttribute('disabled', true)
                }
                break
            case 4:
                if (data.funds >= data.costOfStudio && data.studioSlots < data.oshiName.length) {
                    button.removeAttribute('disabled')
                }else {
                    button.setAttribute('disabled', true)
                }
                break
            default:
                console.log('checkPurchasable error oh no')
                break
        }
    }
}

function liveMarker(){
    let span = document.createElement('span')
    for (let i=0;i<data.studioSlots;i++){
        if (data.streamSchedule[i][data.currentDay] != "-"){      
            let span = document.createElement('span')    
            span.innerHTML = "\nLIVE"
            span.setAttribute('style','color:red;vertical-align:bottom')
            document.getElementById('s'+(i+1)+'d'+(data.currentDay+1)).append(span)
            setTimeout((id, toRemove) => {try{document.getElementById(id).removeChild(toRemove)} catch {}}, 800, 's'+(i+1)+'d'+(data.currentDay+1), span)
        } else {
            let span = document.createElement('span')
            span.setAttribute('style', 'vertical-align:bottom')
            span.innerHTML = "\nOFFLINE"
            document.getElementById('s'+(i+1)+'d'+(data.currentDay+1)).append(span)
            setTimeout((id, toRemove) => {try {document.getElementById(id).removeChild(toRemove)} catch {}}, 800, 's'+(i+1)+'d'+(data.currentDay+1), span)

        }
    }
}

function addStudioRow(){
    for (let i=0;i<data.studioSlots;i++){
        if(document.getElementById('studio'+(i+1)) === null){
            let table = ""
            if ((i+1) % 2 == 0){
                table = document.getElementById('week2')
                table.style.display = ''
                makeStudioDayLabels('week2')
            } else {
                table = document.getElementById('week1')
                makeStudioDayLabels('week1')
            }
            let newRow = document.createElement('tr')
            newRow.setAttribute('id', 'studio'+(i+1))
            if (localStorage.darkmode){
                newRow.className = 'darkTable'
            } else {
                newRow.className = 'lightTable'
            }

            for (let j=0;j<7;j++){
                let slot = document.createElement('td')
                slot.setAttribute('id', 's'+(i+1)+'d'+(j+1))
                slot.setAttribute('style', "vertical-align: top; height: 75px;text-align: center;white-space: pre;")
                newRow.append(slot)
            }
            table.append(newRow)

        } else {
            //console.log('already max fan rows')
        }

        if (document.getElementById('sButton'+(i+1)) === null){
            let table = ""
            if ((i+1) % 2 == 0){
                table = document.getElementById('scheduleButtons2')
            } else {
                table = document.getElementById('scheduleButtons1')
            }
            let newRow = document.createElement('tr')
            newRow.setAttribute('id', 'sButton'+(i+1))

            for (let j=0;j<7;j++){
                let slot = document.createElement('button')
                slot.setAttribute('id', 's'+(i+1)+'b'+(j+1))
                slot.setAttribute('style', 'display:none')
                let dayName = ''
                switch (j){
                    case 0:
                        dayName = 'MON'
                        break
                    case 1:
                        dayName = "TUE"
                        break
                    case 2:
                        dayName = "WED"
                        break
                    case 3:
                        dayName = "THU"
                        break
                    case 4:
                        dayName = "FRI"
                        break
                    case 5:
                        dayName = "SAT"
                        break
                    case 6:
                        dayName = "SUN"
                        break
                    default:
                        console.log('uh oh')
                        break
                }
                slot.innerHTML = dayName
                newRow.append(slot)
            }
            table.append(newRow)
        }
    }
}

function printSchedule(){
    for (let i=0;i<data.studioSlots;i++){
        for (let j=0;j<7;j++){
            let entry = document.getElementById('s'+(i+1)+'d'+(j+1))//.innerHTML = data.streamSchedule[i][j]
            if (data.streamSchedule[i][j] !== '-'){
                entry.innerHTML = ""
                let pic = document.createElement('img')
                
                pic.setAttribute('src', 'img/mini/mini'+data.streamSchedule[i][j]+'.png')

                pic.setAttribute('style','height:50px')
                entry.append(pic)
            } else {
                entry.innerHTML = data.streamSchedule[i][j]
            }
        }
    }
}

function getRandomStreamer(){
    let index = randIntRange(0, data.oshiName.length-1)
    if (!data.debutList.includes(data.oshiName[index])){
        data.debutList.push(data.oshiName[index])
        addStreamer(data.oshiName[index])
    } else {
        getRandomStreamer()
    }
}

function debutStreamer(){
    let button = document.getElementById('debutButton')
    //console.log(button)
    if (data.funds >= data.costOfStreamer){
        if (data.debutList.length < data.oshiName.length){
            getRandomStreamer()
        } else {
            button.setAttribute('disabled','true')
        }
        data.funds -= data.costOfStreamer
        //game.update()

        if (data.costOfStreamer == 0){
            data.costOfStreamer = 1000
        } else {
            data.costOfStreamer = data.costOfStreamer*2
            //console.log(data.costOfStreamer)
        }
        button.innerHTML = 'NEW DEBUT ($'+formatMoney(data.costOfStreamer)+')'
        if (data.debutList.length == data.oshiName.length){
            button.innerHTML = 'All talents hired!'
        }
    }
    checkPurchasables()
}

function addStreamer(name){
    if (data.funds >= data.costOfFan){
        document.getElementById('newFanButton').removeAttribute('disabled')
        disableBuyIfFanclubFull()
    }
    let newStream = document.createElement('img')
            newStream.innerHTML = name
            newStream.setAttribute('id', name)

            newStream.setAttribute('src', 'img/big/'+name+'.png')

            newStream.setAttribute('style','white-space:pre;vertical-align:top;text-align:center')
            newStream.setAttribute('onclick','assign("'+name+'")')
            newStream.setAttribute('width','100px')
            //newStream.setAttribute('height','120px')
            document.getElementById('streamlist').append(newStream)
}

function assign(name){
    document.getElementById('allScheduleButtons').style.display = 'block'
    document.getElementById('currentStreamer').style.display = 'inline'
    document.getElementById('closeSchedule').style.display = 'inline'
    if (name == ""){
        return
    }
    temp.updateName = name
    
    //make all buttons appear
    for (let i=0;i<data.studioSlots;i++){
        for (let j=0;j<7;j++){
            let button = document.getElementById('s'+(i+1)+'b'+(j+1))
            button.setAttribute('style','display:inline;text-align:center;vertical-align:middle;width:50px')
            button.setAttribute('onclick','addToSchedule("'+name+'",'+i+','+j+')')
            button.className = 'tabButton'
            if (data.streamSchedule[i][j] == name){
                button.setAttribute('disabled', true)
            } else {
                button.removeAttribute('disabled')
            }
        }
        document.getElementById('currentStreamer').innerHTML = 'Assigning for '+name

        if(document.getElementById('sLabel'+(i+1)) === null){
            let label = document.createElement('span')
            label.id = 'sLabel'+(i+1)
            if ((i+1)<10){
                label.innerHTML = 'Studio 0'+(i+1)+': '
            } else {
                label.innerHTML = 'Studio '+(i+1)+': '
            }
            document.getElementById('sButton'+(i+1)).prepend(label)
        }

    }
    document.getElementById('scheduleButtons1').style.animation = 'slideDownScheduleButtons 0.3s'
    document.getElementById('scheduleButtons2').style.animation = 'slideDownScheduleButtons 0.3s'
    document.getElementById('buttonBox').style.animation = 'growSchedule 20ms ease-in-out forwards'
}

function addToSchedule(name, studio, dayNum){
    let check = checkDays(dayNum, name)
    if (check == -1){
        data.streamSchedule[studio][dayNum] = name
    } else if (check >= 0){
        data.streamSchedule[check][dayNum] = '-'
        document.getElementById('s'+(check+1)+'b'+(dayNum+1)).removeAttribute('disabled')
        data.streamSchedule[studio][dayNum] = name
    }
    
    let button = document.getElementById('s'+(studio+1)+'b'+(dayNum+1))
    button.setAttribute('disabled','true')

    if (data.streamSchedule[studio][dayNum] != name){
        button.removeAttribute('disabled')
    }

    document.getElementById('s'+(studio+1)+'d'+(dayNum+1)).innerHTML = name
    printSchedule()
}

function generateFan(){
    if (data.funds >= data.costOfFan){
        data.numFans++
        let oshiNum = randIntRange(0, data.debutList.length-1)
        let oshiIndex = data.oshiName.indexOf(data.debutList[oshiNum])
        let name = data.fanName[oshiIndex]
        let love = randIntRange(1,10)
        let loyalty = randIntRange(1,10)
        let money = randIntRange (1,25)
        let oshi =  [data.oshiName[oshiIndex]]
        let newbie = new Fan(name,love,loyalty,money, oshi, [oshiIndex])

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
        data.funds -= data.costOfFan
        game.onLoad()
    }
    checkPurchasables()
    disableBuyIfFanclubFull()
}

function disableBuyIfFanclubFull(){
    let fullRows = checkFull(data.currentFans)

    if (fullRows == data.fanSlots){
        document.getElementById('newFanButton').setAttribute('disabled',true)
    } else if (data.funds >= data.costOfFan){
        //console.log('disbale if fanclub full')
        document.getElementById('newFanButton').removeAttribute('disabled')
    }
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
                slot.setAttribute('style', 'width:175px;height:175px')
                if (localStorage.darkmode){
                    slot.className = 'darkTable'
                } else {
                    slot.className = 'lightTable'
                }
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
    let insertID = 'fr'+rowNum+'s'+slotNum
    let insert = document.getElementById(insertID)

    if (insertID == temp.selectedFan){
        insert.classList.add('selectedFan')
    }
    insert.setAttribute('style','white-space:pre;vertical-align:top;text-align:center')
    insert.setAttribute('onclick','select('+fan.id+')')
    insert.setAttribute('width','175px')
    insert.setAttribute('height','175px')
    
 
    let printName = fan.name
    if (printName.length > 10){
        printName = printName.slice(0,8)
        printName = printName+'...'
    }
    insert.innerHTML = "\nType: "+printName+"\nLove: "+fan.love.toFixed(2)+"\nLoyalty: "+fan.loyalty.toFixed(2)+"\nBudget: "+fan.money.toFixed(2)+"\nOshis: "+fan.oshi.length+"\n"

    let cnv = document.createElement('canvas')
    cnv.setAttribute('style','width:50px;height:50px')
    cnv.id = 'fr'+rowNum+'s'+slotNum+'img'
    //console.log(cnv)
    insert.prepend(cnv)
    createSprite(cnv.id, fan.oshiIndex)
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

function makeSelectBox(fan){
    document.getElementById('selectData').innerHTML = ''
        if (document.getElementById('descText') !== null){
            document.getElementById('descText').remove()
        }

        let newDiv = document.createElement('div')
        newDiv.id = 'descText'
        newDiv.style.height = '175px'
        newDiv.style.whiteSpace = 'pre'
        newDiv.style.textAlign = 'center'
        newDiv.style.fontSize = '20px'

        for (let i=0;i<5;i++){
            let descLine = document.createElement('p')
            descLine.style.marginBottom = '5px'
            descLine.style.marginTop = '5px'
            switch (i){
                case 0:
                    descLine.innerHTML = fan.name
                    descLine.style.height = '2.5em'
                    descLine.style.whiteSpace = 'pre-wrap'
                    descLine.style.wordWrap = 'break-word'
                    descLine.style.fontWeight = 'bold'
                    break
                case 1:
                    descLine.innerHTML = 'Love: '+fan.love.toFixed(2)
                    break
                case 2:
                    descLine.innerHTML = 'Loyalty: '+fan.loyalty.toFixed(2)
                    break
                case 3:
                    descLine.innerHTML = 'Budget: '+fan.money.toFixed(2)
                    break
                case 4:
                    descLine.innerHTML = 'Oshis: '+fan.oshi.length
                    break
                default:
                    console.log('fan description error')
                    break
            }
            newDiv.append(descLine)
        }

        document.getElementById('selectDataText').prepend(newDiv)

        let cnv = document.createElement('canvas')
        cnv.setAttribute('style','width:175px;height:175px')
        cnv.id = 'selectDataImg'
        document.getElementById('selectData').prepend(cnv)
        createSprite(cnv.id, fan.oshiIndex, false)
}

function select(n){
    document.getElementById('select').style.display = 'block'
    document.getElementById('select').style.animation = ''
    document.getElementById('select').style.animation = 'bringUpSelect 0.3s'
    let location = searchID(data.currentFans, n)
    if (location !== undefined){
        let fan = data.currentFans[location[0]][location[1]]
        console.log(fan)
        temp.selectedFan = 'fr'+(location[0]+1)+'s'+(location[1]+1)

        makeSelectBox(fan)

        let fullRows = checkFull(data.handHolding)
        if (fullRows < data.handSlots){  
            document.getElementById('handButton').innerHTML = "Handholding"
            document.getElementById('handButton').removeAttribute('disabled')
            document.getElementById('handButton').setAttribute('onclick','shift('+n+")")
        } else {
            document.getElementById('handButton').setAttribute('disabled',true)
            document.getElementById('handButton').innerHTML = "Chatroom Full!"
        }
        document.getElementById('deleteButton').setAttribute('onclick','deleteFan('+n+', data.currentFans, true)')
        document.getElementById('deleteButton').innerHTML = 'Delete'
        document.getElementById('deleteButton').style.backgroundColor = ''
        disappear(['fansButton'])
        appear(['handButton','deleteButton'])
    } else{
        let location = searchID(data.handHolding, n)
        let fan = data.handHolding[location[0]][location[1]]
        console.log(fan)
        temp.selectedFan = 'hr'+(location[0]+1)+'s'+(location[1]+1)

        makeSelectBox(fan)
        
        let fullRows = checkFull(data.currentFans)
        if (fullRows < data.fanSlots){
            document.getElementById('fansButton').setAttribute('onclick','shift('+n+')')
            document.getElementById('fansButton').removeAttribute('disabled')
            document.getElementById('fansButton').innerHTML = "Fanclub"
        } else  {
            document.getElementById('fansButton').setAttribute('disabled',true)
            document.getElementById('fansButton').innerHTML = "Fanclub Full!"
        }
        document.getElementById('deleteButton').setAttribute('onclick','deleteFan('+n+', data.handHolding, true)')
        document.getElementById('deleteButton').innerHTML = 'Delete'
        document.getElementById('deleteButton').style.backgroundColor = ''
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
    //document.getElementById('select').style.display = 'none'
    removeSelectBox()
    game.onLoad()
}

function deleteFan(n, list, buttonPressed = false){
    if (buttonPressed){
        let btn = document.getElementById('deleteButton')
        btn.innerHTML = 'Really delete?'
        btn.style.backgroundColor = 'red'
        if (list == data.currentFans){
            list = 'data.currentFans'
        } else {
            list = 'data.handHolding'
        }
        btn.setAttribute('onclick', 'confirmDeletion('+n+','+list+')')
        return
    }
    //console.log(list)
    //console.log(n)
    let index = searchID(list, n)
    list[index[0]].splice(index[1],1)
    game.onLoad()
}

function confirmDeletion(n, list){
    data.numFans--
    removeSelectBox()
    deleteFan(n,list)
}

function makeHandholdEntry(fan, rowNum, slotNum){
    //console.log('hand entry: '+rowNum+','+slotNum)
    let insertID = 'hr'+rowNum+'s'+slotNum
    let insert = document.getElementById(insertID)

    if (insertID == temp.selectedFan){
        insert.classList.add('selectedFan')
    }

    insert.setAttribute('style','white-space:pre;vertical-align:top;text-align:center')
    if (fan.inProgress != true){
        insert.setAttribute('onclick','select('+fan.id+')')
    }
    insert.setAttribute('width','175px')
    insert.setAttribute('height','175px')
    let printName = fan.name
    if (printName.length > 10){
        printName = printName.slice(0,8)
        printName = printName+'...'
    }
    insert.innerHTML = "\nType: "+printName+"\nLove: "+fan.love.toFixed(2)+"\nLoyalty: "+fan.loyalty.toFixed(2)+"\nBudget: "+fan.money.toFixed(2)+"\nOshis: "+fan.oshi.length+'\n'

    let cnv = document.createElement('canvas')
    cnv.setAttribute('style','width:50px;height:50px')
    cnv.id = 'hr'+rowNum+'s'+slotNum+'img'
    //console.log(cnv)
    insert.prepend(cnv)
    createSprite(cnv.id, fan.oshiIndex)
}

function printAllHandholding(){
    document.getElementById('handData1').innerHTML == ""
    document.getElementById('handData2').innerHTML = ""
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
            newButton.setAttribute('style', 'white-space:pre;width:100px')
            newButton.className = 'tabButton'
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
            let table = ""
            if ((i+1) % 2 == 0){
                table = document.getElementById('handData2')
            } else {
                table = document.getElementById('handData1')
            }
            let newRow = document.createElement('tr')
            newRow.setAttribute('id', 'handRow'+(i+1))

            let slot1 = document.createElement('td')
            slot1.setAttribute('id', 'hr'+(i+1)+'s1')
            slot1.setAttribute('style','width:175px;height:175px')
            
            let slot2 = document.createElement('td')
            slot2.setAttribute('id', 'hr'+(i+1)+'s2')
            slot2.setAttribute('style','width:175px;height:175px')

            if (localStorage.darkmode){
                slot1.className = 'darkTable'
                slot2.className = 'darkTable'
            } else {
                slot1.className = 'lightTable'
                slot2.className = 'lightTable'
            }

            let buttonslot = document.createElement('td')
            buttonslot.setAttribute('id', 'hr'+(i+1)+'b')
            buttonslot.setAttribute('style','width:175px;height:175px')
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
    document.getElementById('select').style.display = 'none'
    unhighlightSelectedFan()

    data.numFans--
    game.update()
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
    let loveExcess = 0
    if (parent1.love + parent2.love == data.maxLove*2){
        if (data.maxLove <= 95){
            data.maxLove += 5
            let loveText = document.getElementById('maxLoveDesc')
            loveText.innerHTML = "Maximum LOVE: "+data.maxLove
            if (localStorage.darkmode){
                loveText.style.animation = 'maxUpdateDark 3s'
            } else {
                loveText.style.animation = 'maxUpdateLight 3s'
            }
        }
    }
    
    if (newLove > data.maxLove){
        newLove = data.maxLove
    }

    let newLoyalty = (parent1.loyalty + parent2.loyalty) / (1+(randIntRange(30,70)/100))
    if (parent1.loyalty + parent2.loyalty == data.maxLoyalty*2){
        if (data.maxLoyalty <= 95){
            data.maxLoyalty += 5
            let loyaltyText = document.getElementById('maxLoyaltyDesc')
            loyaltyText.innerHTML = "Maximum LOYALTY: "+data.maxLoyalty
            if (localStorage.darkmode){
                loyaltyText.style.animation = 'maxUpdateDark 3s'
            } else {
                loyaltyText.style.animation = 'maxUpdateLight 3s'
            }
        }
    }
    if (newLoyalty > data.maxLoyalty){
        newLoyalty = data.maxLoyalty
    }

    let newMoney = (parent1.money + parent2.money) / (1+(randIntRange(30,70)/100))
    if (parent1.money + parent2.money == data.maxMoney*2){
        if (data.maxMoney <= 1000){
            data.maxMoney += 10
            let moneyText = document.getElementById('maxBudgetDesc')
            moneyText.innerHTML = "Maximum BUDGET: $"+data.maxMoney
            if (localStorage.darkmode){
                moneyText.style.animation = 'maxUpdateDark 3s'
            } else {
                moneyText.style.animation = 'maxUpdateLight 3s'
            }
        }
    }
    if (newMoney > data.maxMoney){
        newMoney = data.maxMoney
    }


    let newOshi = parent1.oshi.slice()
    let newOshiIndex = parent1.oshiIndex.slice()
    for (let i=0;i<parent2.oshi.length;i++){
        if (!newOshi.includes(parent2.oshi[i])){
            newOshi.push(parent2.oshi[i])
            newOshiIndex.push(parent2.oshiIndex[i])
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
        'oshiIndex':newOshiIndex,
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
    let newbie = new Fan(data.offspring[rowNum-1].name, data.offspring[rowNum-1].love, data.offspring[rowNum-1].loyalty, 
                data.offspring[rowNum-1].money, data.offspring[rowNum-1].oshi, data.offspring[rowNum-1].oshiIndex)
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

        //console.log(id1)
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
    bar.setAttribute('style','background-color:grey;height:15px;width:100px;margin:auto')

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

function updateBar(){
    for (let i=0;i<data.inProgress.length;i++){
        if (data.inProgress[i] == true){
            if (document.getElementById('barProgress'+(i+1)) !== null && document.getElementById('barProgress'+(i+1)) !== undefined){
                let bar = document.getElementById('barProgress'+(i+1))
                bar.setAttribute('style','background-color:green;height:15px;width:'+data.barProgress[i]['green']+'px')
                document.getElementById('timeLeft'+(i+1)).innerHTML = formatTime(data.barProgress[i]['duration'])
                document.getElementById('timeLeft'+(i+1)).setAttribute('style', 'position:relative;')
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
                    document.getElementById('timeLeft'+(i+1)).setAttribute('style', 'position:relative;left:5px;color:red')
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
            if (data.funds >= data.costOfFanclub){
                data.funds -= data.costOfFanclub
                data.fanSlots++
                data.costOfFanclub *= 10
                document.getElementById('upgradeFanclubButton').innerHTML = "Upgrade Fanclub\n($"+formatMoney(data.costOfFanclub)+")"
            }
            break
        case 'handSlots':
            if (data.funds >= data.costOfChatroom){
                data.funds -= data.costOfChatroom
                data.handSlots++
                data.costOfChatroom *= 5
                document.getElementById('upgradeChatroomButton').innerHTML = "Upgrade Chatroom\n($"+formatMoney(data.costOfChatroom)+")"
            }
            break
        case 'studioSlots':
            let button = document.getElementById('upgradeStudioButton')
            if (data.funds >= data.costOfStudio && data.studioSlots < data.oshiName.length){
                data.funds -= data.costOfStudio
                data.studioSlots++
                data.costOfStudio *= 10
                data.streamSchedule.push(['-','-','-','-','-','-','-']) 
                button.innerHTML = "Upgrade Studio\n($"+formatMoney(data.costOfStudio)+")"
            }
            if (data.studioSlots == data.oshiName.length){
                button.innerHTML = 'All Studios Bought!'
                button.setAttribute('disabled', true)
            }
            break
        default:
            console.log('upgrade error oh no')
            break
    }
    game.onLoad()
}