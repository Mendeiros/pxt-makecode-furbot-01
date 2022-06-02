def on_on_event():
    global direçãoInicial, rangeNORTE, rangeLESTE, rangeSUL, rangeOESTE
    direçãoInicial = input.compass_heading()
    rangeNORTE = direçãoInicial + 45
    rangeLESTE = rangeNORTE + 90
    rangeSUL = rangeLESTE + 90
    rangeOESTE = rangeSUL + 90
control.on_event(irRemote.return_ir_button(), 64, on_on_event)

sonar = 0
lerCarta = False
valores = 0
switchAndar = False
rangeOESTE = 0
rangeSUL = 0
rangeLESTE = 0
rangeNORTE = 0
direçãoInicial = 0
irRemote.connect_infrared(DigitalPin.P11)
serial.redirect(SerialPin.P12, SerialPin.P13, BaudRate.BAUD_RATE115200)
mensagemFoto = "{\"FurbotText\": \"tirar foto\"}"

def on_forever():
    global valores, switchAndar, lerCarta, sonar
    while switchAndar:
        valores = turtleBit.line_tracking()
        if valores > 0:
            basic.show_leds("""
                . # # # .
                                # . . . #
                                # # # # #
                                # . . . #
                                . # # # .
            """)
            basic.pause(1500)
            turtleBit.state(MotorState.STOP)
            basic.clear_screen()
            switchAndar = False
            lerCarta = True
        else:
            turtleBit.run(DIR.RUN_FORWARD, 100)
            basic.pause(200)
            basic.show_leds("""
                . # . # .
                                . . . . .
                                # # # # #
                                # # # # #
                                . # # # .
            """)
            basic.pause(200)
            basic.show_leds("""
                . # . # .
                                . . . . .
                                # . . . #
                                . # # # .
                                . . . . .
            """)
    while lerCarta == True:
        sonar = turtleBit.ultra()
        basic.show_number(sonar)
        if sonar < 10 and sonar != 0:
            leituraImagem = ""
            serial.write_line(mensagemFoto)
            basic.pause(5000)
            if leituraImagem.includes("{\"FurbotText\": \"ANDARNORTE\"}") and (input.compass_heading() < rangeNORTE or input.compass_heading() > rangeOESTE):
                switchAndar = True
                lerCarta = False
            elif leituraImagem.includes("{\"FurbotText\": \"ANDARSUL\"}") and input.compass_heading() < rangeSUL:
                switchAndar = True
                lerCarta = False
            elif leituraImagem.includes("{\"FurbotText\": \"ANDARLESTE\"}") and input.compass_heading() < rangeLESTE:
                switchAndar = True
                lerCarta = False
            elif leituraImagem.includes("{\"FurbotText\": \"ANDAROESTE\"}") and input.compass_heading() < rangeOESTE:
                switchAndar = True
                lerCarta = False
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
                basic.pause(200)
                basic.show_leds("""
                    # # . # #
                                        . . . . .
                                        # # # # .
                                        # # . # #
                                        # . . . #
                """)
                basic.pause(200)
                basic.show_leds("""
                    # # . # #
                                        . . . . .
                                        . # # # .
                                        # # . # #
                                        # . . . #
                """)
basic.forever(on_forever)
