enum AxisType
{
	X = 0,
	Y,
	Z
}

enum EularType
{
	Roll = 0,
	Pitch,
	Yaw
}

enum FilterType
{
	NONE = 0, 
	GYRO, // Gyro angle data
	CPLTY, // Complimentary_filter
	KALMAN // Kalman Filter
}

//% weight=8 Motion=#000016 icon="\uf0b2" block="MxMotion"
namespace MxMotion{

    const MxMotion_ADDR = 0x23

    enum MotionReg
    {
		Device_ID = 1,
		Device_CONFIG,
		ROLL_H,
		ROLL_L,
		YAW_H,
		YAW_L,
		PITCH_L,
		GYRO_X_H,
		GYRO_X_L,
		GYRO_Y_H,
		GYRO_Y_L,
		GYRO_Z_H,
		GYRO_Z_L,
		ACCEL_X_H,
		ACCEL_X_L,
		ACCEL_Y_H,
		ACCEL_Y_L,
		ACCEL_Z_H,
		ACCEL_Z_L,
		Temp
    }

    /**
     *start up the motion sensor
     *@param filter [0-3] set the type of filter; eg: 0, 1
    */
    //%block="start up the motion sensor|set filter %filter"
    //%weight=994 inlineInputMode="external" %blockID="MxMotion_init"
    export function init(filter: FilterType): void {
        let setting = 0x04
        setting += <number>filter

        if(i2cRead(MotionReg.Device_ID) == 0x44){
            i2cWrite(MotionReg.Device_CONFIG, 0x08); // reset
            basic.pause(500);
            i2cWrite(MotionReg.Device_CONFIG, setting); // enable
        }
    }

    /**
     *read Motion eular data from sensor
     *@param axis [0-2] set the data of axis; eg: 0, 1
    */
    //%block="read eular angle %axis from sensor"
    //%weight=94 %blockID="MxMotion_eular"
    export function readEular(axis: EularType): number {
        let out = 0

        switch(axis){
            case 0:
                out = i2cRead(MotionReg.ROLL_H) << 8 | i2cRead(MotionReg.ROLL_L)
                if(out > 32767){
                    out -= 65536
                }
                break
            case 1:
                out = i2cRead(MotionReg.PITCH_L)
                if(out > 180){
                    out = -1
                }
                else{
                    out -= 90
                }
                break
            case 2:
                out = i2cRead(MotionReg.YAW_H) << 8 | i2cRead(MotionReg.YAW_L)
                if(out > 32767){
                    out -= 65536
                }
                break
            default:
                break
        }
        return out
    }

    /**
     *read Motion accel data from sensor
     *@param axis [0-2] set the data of axis; eg: 0, 1
    */
    //%block="read accel data %axis from sensor(mm/s^2)"
    //%weight=94 %blockID="MxMotion_accel"
    export function readAccel(axis: AxisType): number {
        let out = 0

        switch(axis){
            case 0:
                out = i2cRead(MotionReg.ACCEL_X_H) << 8 | i2cRead(MotionReg.ACCEL_X_L)
                break
            case 1:
                out = i2cRead(MotionReg.ACCEL_Y_H) << 8 | i2cRead(MotionReg.ACCEL_Y_L)
                break
            case 2:
                out = i2cRead(MotionReg.ACCEL_Z_H) << 8 | i2cRead(MotionReg.ACCEL_Z_L)
                break
            default:
                break
        }
        if(out > 32767){
            out -= 65536
        }
        return out
    }

    /**
     *read Motion gyro data from sensor
     *@param axis [0-2] set the data of axis; eg: 0, 1
    */
    //%block="read gyro data %axis from sensor(dgree/s)"
    //%weight=94 %blockID="MxMotion_gyro"
    export function readGyro(axis: AxisType): number {
        let out = 0

        switch(axis){
            case 0:
                out = i2cRead(MotionReg.GYRO_X_H) << 8 | i2cRead(MotionReg.GYRO_X_L)
                break
            case 1:
                out = i2cRead(MotionReg.GYRO_Y_H) << 8 | i2cRead(MotionReg.GYRO_Y_L)
                break
            case 2:
                out = i2cRead(MotionReg.GYRO_Z_H) << 8 | i2cRead(MotionReg.GYRO_Z_L)
                break
            default:
                break
        }
        if(out > 32767){
            out -= 65536
        }
        return out
    }

    function i2cWrite(reg: number, value: number): void {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(MxMotion_ADDR, buf)
    }  
    
    function i2cRead(reg: number): number {
        pins.i2cWriteNumber(MxMotion_ADDR, reg, NumberFormat.UInt8LE)
        return pins.i2cReadNumber(MxMotion_ADDR, NumberFormat.UInt8LE, false)
    } 
}
