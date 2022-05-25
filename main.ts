let infraRED = 0
let valores = 0
let VARIAVELdoMUSICAremoverDEPOIS = true
irRemote.connectInfrared(DigitalPin.P11)
music.setVolume(33)
let lista_Direções = [
"N",
"O",
"S",
"L"
]
let direçãoAtual = 0
let switchAndar = false
let lerCarta = true
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
            turtleBit.run(DIR.Run_forward, 60)
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
        infraRED = irRemote.returnIrButton()
        if (infraRED == 74) {
            turtleBit.Motor(LR.LeftSide, MD.Forward, 80)
            turtleBit.Motor(LR.RightSide, MD.Back, 70)
            direçãoAtual += 1
            if (direçãoAtual == 4) {
                direçãoAtual = 0
            }
            basic.pause(750)
            turtleBit.state(MotorState.stop)
        } else if (infraRED == 66) {
            turtleBit.Motor(LR.RightSide, MD.Forward, 80)
            turtleBit.Motor(LR.LeftSide, MD.Back, 70)
            direçãoAtual += -1
            if (direçãoAtual == -5) {
                direçãoAtual = 3
            }
            basic.pause(750)
            turtleBit.state(MotorState.stop)
        } else if (infraRED == 70 && lista_Direções[direçãoAtual] == "N") {
            switchAndar = true
            lerCarta = false
        } else if (infraRED == 68 && lista_Direções[direçãoAtual] == "O") {
            switchAndar = true
            lerCarta = false
        } else if (infraRED == 67 && lista_Direções[direçãoAtual] == "L") {
            switchAndar = true
            lerCarta = false
        } else if (infraRED == 21 && lista_Direções[direçãoAtual] == "S") {
            switchAndar = true
            lerCarta = false
        } else {
            basic.pause(120)
            if (VARIAVELdoMUSICAremoverDEPOIS) {
                music.playTone(277, music.beat(BeatFraction.Whole))
            }
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
            if (VARIAVELdoMUSICAremoverDEPOIS) {
                music.playTone(139, music.beat(BeatFraction.Whole))
            }
            basic.showLeds(`
                # # . # #
                . . . . .
                . # # # .
                # # . # #
                # . . . #
                `)
            VARIAVELdoMUSICAremoverDEPOIS = false
        }
    }
})
