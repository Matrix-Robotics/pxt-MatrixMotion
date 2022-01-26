MxMotion.init()
basic.forever(function () {
    serial.writeString("roll=")
    serial.writeLine("" + (MxMotion.readEular(EularType.Roll)))
    serial.writeString("pitch=")
    serial.writeLine("" + (MxMotion.readEular(EularType.Pitch)))
    serial.writeString("yaw=")
    serial.writeLine("" + (MxMotion.readEular(EularType.Yaw)))
})
