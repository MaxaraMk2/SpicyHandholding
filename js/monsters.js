class Fan{
    constructor(name,love,loyalty,money, oshi){
        this.name = name
        this.love = love
        this.loyalty = loyalty
        this.money = money
        this.id = data.totalFans
        this.oshi = oshi        
        this.inProgress = false
    }

    spend() {
        var amt = 0
        for (let i=0;i<this.oshi.length;i++){
            if (checkDays(data.currentDay, this.oshi[i]) >= 0){
                let chance = randIntRange(0,100)
                    if (chance < this.loyalty){
                        amt += prettify(this.money*(this.love/100))
                    }
            }
        }
        if (amt > 0){
            data.funds += amt
            let span = document.createElement('span')
            span.innerHTML = "+$"+amt.toFixed(2)
            span.setAttribute('style','padding:0 25px;color:green')

            let location = searchID(data.currentFans, this.id)
            document.getElementById('fr'+(location[0]+1)+'s'+(location[1]+1)).append(span)
            window.setTimeout(this.removeSpend, 800, 'fr'+(location[0]+1)+'s'+(location[1]+1), span)
        }
    }

    removeSpend(id, span){
        try {
            document.getElementById(id).removeChild(span)
        } catch (error){
            //do nothing
        }
    }
}

class Button{
    constructor(id, onclick){
        this.id = id
        this.onclick = onclick
        this.disabled = false
        this.innerHTML = "Hold hands!"
        this.style = 'white-space:pre'
        this.number = data.totalButtons
    }

    disable(){
        this.innerHTML = "Must have same \nnumber of Oshis!"
        this.disabled = true
    }

    enable(){
        this.innerHTML = "Hold hands!"
        this.disabled = false
    }
}

