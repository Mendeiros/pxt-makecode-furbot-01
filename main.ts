let leituraImagem = ""
let valoresIRs = 0
let lerCarta = false
let mensagemFoto = "{\"FurbotText\": \"TirarFoto\"}"
let direçãoAtual = 0
// (N=0, O=1, S=2, L=3), VIRARDIREITA = +1, VIRARESQUERDA = -1;
let andarReto = true
let sonar = 0
serial.redirect(SerialPin.P12, SerialPin.P13, BaudRate.BaudRate115200)
input.onSound(DetectedSound.Loud, function on_loud_sound() {
    serial.writeLine(mensagemFoto)
    let lerCarta = true
})
function algoritmo_falhas() {
    let viraresquerda: boolean;
    let virardireita: boolean;
    let tireiAndar: string;
    let andarsul: boolean;
    if (leituraImagem.length > 10) {
        if (leituraImagem.includes("q" || "s" || "u")) {
            viraresquerda = true
        } else if (leituraImagem.includes("i" || "t")) {
            virardireita = true
        }
        
    } else if (leituraImagem.includes("and")) {
        tireiAndar = leituraImagem.replace("andar", null)
        if (leituraImagem.includes("u" || "")) {
            andarsul = true
        }
        
    } else if (leituraImagem.includes("vir")) {
        if (leituraImagem.includes("q" || "s" || "u")) {
            viraresquerda = true
        } else if (leituraImagem.includes("i" || "t")) {
            virardireita = true
        }
        
    }
    
}

basic.forever(function on_forever() {
    
    while (andarReto) {
        valoresIRs = turtleBit.LineTracking()
        if (valoresIRs != 0) {
            basic.showLeds(`
                            . # # # .
                            # . # . #
                            # # . # #
                            # . # . #
                            . # # # .
            `)
            basic.pause(100)
            basic.showLeds(`
                            # . . . #
                            . # . # .
                            . . # . .
                            . # . # .
                            # . . . #
            `)
            basic.pause(900)
            turtleBit.state(MotorState.stop)
            basic.clearScreen()
            andarReto = false
            lerCarta = true
        } else {
            turtleBit.run(DIR.Run_forward, 55)
            basic.showLeds(`
                            . # . # .
                            . . . . .
                            # # # # #
                            # # # # #
                            . # # # .
            `)
        }
        
    }
    while (lerCarta) {
        sonar = turtleBit.ultra()
        if (sonar < 12 && sonar < 7) {
            serial.writeLine(mensagemFoto)
            basic.pause(1640)
            leituraImagem = serial.readString()
            leituraImagem.toLowerCase()
        }
        
        if (leituraImagem.includes("{\"furbottext\": \"virardireita\"}")) {
            lerCarta = false
            turtleBit.run(DIR.Run_back, 55)
            basic.pause(280)
            turtleBit.run(DIR.Turn_Right, 55)
            direçãoAtual += 1
            if (direçãoAtual > 3) {
                direçãoAtual = 0
            }
            
            basic.pause(1062)
            turtleBit.run(DIR.Run_forward, 55)
            basic.pause(280)
            turtleBit.state(MotorState.stop)
            lerCarta = true
        } else if (leituraImagem.includes("{\"furbottext\": \"viraresquerda\"}")) {
            lerCarta = false
            turtleBit.run(DIR.Run_back, 55)
            basic.pause(280)
            turtleBit.run(DIR.Turn_Left, 55)
            direçãoAtual += -1
            if (direçãoAtual < 0) {
                direçãoAtual = 3
            }
            
            basic.pause(1145)
            turtleBit.run(DIR.Run_forward, 55)
            basic.pause(280)
            turtleBit.state(MotorState.stop)
            lerCarta = true
        } else if (leituraImagem.includes("{\"furbottext\": \"andarnorte\"}") && direçãoAtual == 0) {
            lerCarta = false
            andarReto = true
        } else if (leituraImagem.includes("{\"furbottext\": \"andaroeste\"}") && direçãoAtual == 1) {
            lerCarta = false
            andarReto = true
        } else if (leituraImagem.includes("{\"furbottext\": \"andarsul\"}") && direçãoAtual == 2) {
            lerCarta = false
            andarReto = true
        } else if (leituraImagem.includes("{\"furbottext\": \"andarleste\"}") && direçãoAtual == 3) {
            lerCarta = false
            andarReto = true
        } else {
            basic.pause(120)
            basic.clearScreen()
            basic.showLeds(`
                            # # . # #
                            . . . . .
                            . # # # .
                            # # . # #
                            # . . . #
            `)
            basic.pause(120)
            basic.showLeds(`
                            # # . # #
                            # . . . .
                            . # # # .
                            # # . # #
                            # . . . #
            `)
            basic.pause(120)
            basic.showLeds(`
                            # # . # #
                            . . . . .
                            # # # # .
                            # # . # #
                            # . . . #
            `)
        }
        
    }
})
