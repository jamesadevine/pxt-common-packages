
namespace pxsim.pins {
    export class CommonPin extends Pin {
        used: boolean;
    }

    export class DigitalInOutPin extends CommonPin {
    }

    export class AnalogInOutPin extends CommonPin {

    }

    export class PwmOnlyPin extends CommonPin {

    }

    export class PwmPin extends CommonPin {

    }

    export function markUsed(name: CommonPin) {
        if (!name.used) {
            name.used = true;
            runtime.queueDisplayUpdate();
        }
    }
}

namespace pxsim.DigitalInOutPinMethods {
    export function digitalRead(name: pins.DigitalInOutPin): number {
        return name.digitalReadPin();
    }

    /**
    * Set a pin or connector value to either 0 or 1.
    * @param value value to set on the pin, 1 eg,0
    */
    export function digitalWrite(name: pins.DigitalInOutPin, value: number): void {
        name.digitalWritePin(value);
    }

    /**
    * Configures this pin to a digital input, and generates events where the timestamp is the duration
    * that this pin was either ``high`` or ``low``.
    */
    export function onPulsed(name: pins.DigitalInOutPin, high: boolean, body: RefAction): void {
        onEvent(name, high ? DAL.DEVICE_PIN_EVT_PULSE_HI : DAL.DEVICE_PIN_EVT_PULSE_LO, body);
    }

    export function onEvent(name: pins.DigitalInOutPin, ev: number, body: RefAction): void {
        name.onEvent(ev, body);
    }

    /**
    * Returns the duration of a pulse in microseconds
    * @param value the value of the pulse (default high)
    * @param maximum duration in micro-seconds
    */
    export function pulseIn(name: pins.DigitalInOutPin, high: boolean, maxDuration = 2000000): number {
        name.used = true;
        const pulse = high ? DAL.DEVICE_PIN_EVT_PULSE_HI : DAL.DEVICE_PIN_EVT_PULSE_LO;
        // Always return default value, can't simulate
        return 500;
    }

    /**
    * Configures the pull of this pin.
    * @param pull one of the mbed pull configurations: PullUp, PullDown, PullNone
    */
    export function setPull(name: pins.DigitalInOutPin, pull: number): void {
        name.setPull(pull);
    }

    /**
     * Get the pin state (pressed or not). Requires to hold the ground to close the circuit.
     * @param name pin used to detect the touch
     */
    export function isPressed(name: pins.DigitalInOutPin): boolean {
        return name.isTouched();
    }
}

namespace pxsim.AnalogInPinMethods {
    /**
     * Read the connector value as analog, that is, as a value comprised between 0 and 1023.
     */
    export function analogRead(name: pins.AnalogInOutPin): number {
        pins.markUsed(name);
        return name.analogReadPin();
    }
}

namespace pxsim.AnalogOutPinMethods {
    /**
 * Set the connector value as analog. Value must be comprised between 0 and 1023.
 * @param value value to write to the pin between ``0`` and ``1023``. eg:1023,0
 */
    export function analogWrite(name: pins.AnalogInOutPin, value: number): void {
        pins.markUsed(name);
        name.analogWritePin(value);

    }
}

namespace pxsim.PwmOnlyPinMethods {
    export function analogSetPeriod(name: pins.PwmOnlyPin, micros: number): void {
        name.analogSetPeriod(micros);
    }

    export function servoWrite(name: pins.PwmOnlyPin, value: number): void {
        name.servoWritePin(value);
    }

    export function servoSetPulse(name: pins.PwmOnlyPin, micros: number): void {
        name.servoSetPulse(name.id, micros);
    }
}

namespace pxsim.pins {
    export function pinByCfg(key: number): Pin {
        return pxsim.pxtcore.getPinCfg(key);
    }

    export function pulseDuration(): number {
        // bus last event timestamp
        return 500;
    }

    export function createBuffer(sz: number) {
        return pxsim.BufferMethods.createBuffer(sz)
    }

    export function createI2C(sda: DigitalInOutPin, scl: DigitalInOutPin) {
        const b = board() as EdgeConnectorBoard;
        return b && b.edgeConnectorState && b.edgeConnectorState.createI2C(sda, scl);
    }
   
    export function createSPI(mosi: DigitalInOutPin, miso: DigitalInOutPin, sck: DigitalInOutPin) {
        const b = board() as EdgeConnectorBoard;
        return b && b.edgeConnectorState && b.edgeConnectorState.createSPI(mosi, miso, sck);
    }
}

namespace pxsim.I2CMethods {
    export function readBuffer(i2c: I2C, address: number, size: number, repeat?: boolean): RefBuffer {
        return control.createBuffer(0);
    }

    export function writeBuffer(i2c: I2C, address: number, buf: RefBuffer, repeat?: boolean): number {
        return 0;
    }
}

namespace pxsim.SPIMethods {

    export function write(device: pxsim.SPI, value: number) {
        return device.write(value);
    }

    export function transfer(device: pxsim.SPI, command: RefBuffer, response: RefBuffer) {
        device.transfer(command, response);
    }

    export function setFrequency(device: pxsim.SPI, frequency: number) {
        device.setFrequency(frequency);
    }

    export function setMode(device: pxsim.SPI, mode: number) {
        device.setMode(mode);
    }
}

