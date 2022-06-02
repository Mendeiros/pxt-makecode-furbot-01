control.onEvent(irRemote.returnIrButton(), 64, function () {
    direçãoInicial = input.compassHeading()
    rangeNORTE = direçãoInicial + 45
    rangeLESTE = rangeNORTE + 90
    rangeSUL = rangeLESTE + 90
    rangeOESTE = rangeSUL + 90
})
let sonar = 0
let lerCarta = false
let valores = 0
let switchAndar = false
let rangeOESTE = 0
let rangeSUL = 0
let rangeLESTE = 0
let rangeNORTE = 0
let direçãoInicial = 0
irRemote.connectInfrared(DigitalPin.P11)
serial.redirect(
SerialPin.P12,
SerialPin.P13,
BaudRate.BaudRate115200
)
let mensagemFoto = "{\"FurbotText\": \"tirar foto\"}"
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
            turtleBit.run(DIR.Run_forward, 100)
            basic.pause(200)
            basic.showLeds(`
                . # . # .
                # . . . #
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
    while (lerCarta == true) {
        sonar = turtleBit.ultra()
        basic.showNumber(sonar)
        if (sonar < 10 && sonar != 0) {
            let leituraImagem = ""
            serial.writeLine(mensagemFoto)
            basic.pause(5000)
            if (leituraImagem.includes("{\"FurbotText\": \"ANDARNORTE\"}") && (input.compassHeading() < rangeNORTE || input.compassHeading() > rangeOESTE)) {
                switchAndar = true
                lerCarta = false
            } else if (leituraImagem.includes("{\"FurbotText\": \"ANDARSUL\"}") && input.compassHeading() < rangeSUL) {
                switchAndar = true
                lerCarta = false
            } else if (leituraImagem.includes("{\"FurbotText\": \"ANDARLESTE\"}") && input.compassHeading() < rangeLESTE) {
                switchAndar = true
                lerCarta = false
            } else if (leituraImagem.includes("{\"FurbotText\": \"ANDAROESTE\"}") && input.compassHeading() < rangeOESTE) {
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
