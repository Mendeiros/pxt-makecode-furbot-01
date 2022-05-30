leituraImagem = ""
valoresIRs = 0
lerCarta = False
mensagemFoto = "{\"FurbotText\": \"tirar foto\"}"
direçãoAtual = 0 #(N=0, O=1, S=2, L=3), VIRARDIREITA = +1, VIRARESQUERDA = -1;
andarReto = True
sonar = 0

serial.redirect(SerialPin.P12, SerialPin.P13, BaudRate.BAUD_RATE115200)

def on_loud_sound():
    serial.write_line(mensagemFoto)
    lerCarta = True
input.on_sound(DetectedSound.LOUD, on_loud_sound)

def on_forever():
    global valoresIRs, andarReto, lerCarta, sonar, leituraImagem, direçãoAtual
    while andarReto:
        valoresIRs = turtleBit.line_tracking()
        if valoresIRs > 0:
            basic.show_leds("""
                            . # # # .
                            # . # . #
                            # # . # #
                            # . # . #
                            . # # # .
            """)
            basic.pause(100)
            basic.show_leds("""
                            # . . . #
                            . # . # .
                            . . # . .
                            . # . # .
                            # . . . #
                        """)
            basic.pause(1100)
            turtleBit.state(MotorState.STOP)
            basic.clear_screen()
            andarReto = False
            lerCarta = True
        else:
            turtleBit.run(DIR.RUN_FORWARD, 55)
            basic.show_leds("""
                            . # . # .
                            . . . . .
                            # # # # #
                            # # # # #
                            . # # # .
            """)
    while lerCarta:
        sonar = turtleBit.ultra()
        if sonar < 12 and sonar < 7:
            serial.write_line(mensagemFoto)
            basic.pause(2500)
            leituraImagem = "" #serial.read *bla bla bla*
            if leituraImagem.includes("{\"FurbotText\": \"VIRARDIREITA\"}"):
                lerCarta = False
                turtleBit.run(DIR.RUN_BACK, 55)
                basic.pause(280)
                turtleBit.run(DIR.TURN_RIGHT, 55)
                direçãoAtual += 1
                if direçãoAtual > 3:
                    direçãoAtual = 0
                basic.pause(1062)
                turtleBit.run(DIR.RUN_FORWARD, 55)
                basic.pause(280)
                turtleBit.state(MotorState.STOP)
                lerCarta = True
            elif leituraImagem.includes("{\"FurbotText\": \"VIRARESQUERDA\"}"):
                lerCarta = False
                turtleBit.run(DIR.RUN_BACK, 55)
                basic.pause(280)
                turtleBit.run(DIR.TURN_LEFT, 55)
                direçãoAtual += -1
                if direçãoAtual < 0:
                    direçãoAtual = 3
                basic.pause(1145)
                turtleBit.run(DIR.RUN_FORWARD, 55)
                basic.pause(280)
                turtleBit.state(MotorState.STOP)
                lerCarta = True
            elif leituraImagem.includes("{\"FurbotText\": \"ANDARNORTE\"}") and direçãoAtual == 0:
                lerCarta = False
                andarReto = True
            elif leituraImagem.includes("{\"FurbotText\": \"ANDAROESTE\"}") and direçãoAtual == 1:
                lerCarta = False
                andarReto = True
            elif leituraImagem.includes("{\"FurbotText\": \"ANDARLESTE\"}") and direçãoAtual == 2:
                lerCarta = False
                andarReto = True
            elif leituraImagem.includes("{\"FurbotText\": \"ANDARSUL\"}") and direçãoAtual == 3:
                lerCarta = False
                andarReto = True
            else:
                basic.pause(120)
                basic.clear_screen()
                basic.show_leds("""
                                    # # . # #
                                    # . . . .
                                    . # # # .
                                    # # . # #
                                    # . . . #
                """)
                basic.pause(120)
                basic.show_leds("""
                                    # # . # #
                                    . . . . .
                                    # # # # .
                                    # # . # #
                                    # . . . #
                """)
                basic.pause(120)
                basic.show_leds("""
                                    # # . # #
                                    . . . . .
                                    . # # # .
                                    # # . # #
                                    # . . . #
                """)

basic.forever(on_forever)
