let leituraImagem = ""
let sonar = 0
let lerCarta = false
let valores = 0
serial.redirect(
SerialPin.P12,
SerialPin.P13,
BaudRate.BaudRate115200
)
let lista_Direções = [
"N",
"O",
"S",
"L"
]
let direçãoAtual = 0
let mensagemFoto = "{\"FurbotText\": \"tirar foto\"}"
let switchAndar = true
basic.forever(function () {
    while (switchAndar) {
        valores = turtleBit.LineTracking()
        if (valores > 0) {
            basic.showLeds(`
                . # # # .
                # . . . #
                # # # # #
                # . . . #
                . # # # .
                `)
            basic.pause(1500)
            turtleBit.state(MotorState.stop)
            basic.clearScreen()
            switchAndar = false
            lerCarta = true
        } else {
            turtleBit.run(DIR.Run_forward, 75)
            basic.pause(200)
            basic.showLeds(`
                . # . # .
                . . . . .
                # # # # #
                # # # # #
                . # # # .
                `)
            basic.pause(200)
            basic.showLeds(`
                . # . # .
                . . . . .
                # . . . #
                . # # # .
                . . . . .
                `)
        }
    }
    while (lerCarta) {
        sonar = turtleBit.ultra()
        basic.showNumber(sonar)
        if (sonar < 10 && sonar < 7) {
            leituraImagem = ""
            serial.writeLine(mensagemFoto)
            basic.pause(5000)
            if (leituraImagem.includes("{\"FurbotText\": \"VIRARDIREITA\"}")) {
                turtleBit.Motor(LR.LeftSide, MD.Forward, 75)
                turtleBit.Motor(LR.RightSide, MD.Back, 65)
                direçãoAtual += 1
                if (direçãoAtual == 4) {
                    direçãoAtual = 0
                }
            } else if (leituraImagem.includes("{\"FurbotText\": \"VIRARESQUERDA\"}")) {
                turtleBit.Motor(LR.RightSide, MD.Forward, 75)
                turtleBit.Motor(LR.LeftSide, MD.Back, 65)
                direçãoAtual += -1
                if (direçãoAtual == -5) {
                    direçãoAtual = 3
                }
            } else if (leituraImagem.includes("{\"FurbotText\": \"ANDARNORTE\"}") && lista_Direções[direçãoAtual] == "N") {
                switchAndar = true
                lerCarta = false
            } else if (leituraImagem.includes("{\"FurbotText\": \"ANDAROESTE\"}") && lista_Direções[direçãoAtual] == "O") {
                switchAndar = true
                lerCarta = false
            } else if (leituraImagem.includes("{\"FurbotText\": \"ANDARLESTE\"}") && lista_Direções[direçãoAtual] == "L") {
                switchAndar = true
                lerCarta = false
            } else if (leituraImagem.includes("{\"FurbotText\": \"ANDARSUL\"}") && lista_Direções[direçãoAtual] == "S") {
                switchAndar = true
                lerCarta = false
            } else {
                basic.pause(120)
                basic.clearScreen()
                basic.showLeds(`
                    # # . # #
                    # . . . .
                    . # # # .
                    # # . # #
                    # . . . #
                    `)
                basic.pause(200)
                basic.showLeds(`
                    # # . # #
                    . . . . .
                    # # # # .
                    # # . # #
                    # . . . #
                    `)
                basic.pause(200)
                basic.showLeds(`
                    # # . # #
                    . . . . .
                    . # # # .
                    # # . # #
                    # . . . #
                    `)
            }
        }
    }
})
