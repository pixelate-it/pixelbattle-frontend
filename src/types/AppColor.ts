import { Color, ColorSource } from "pixi.js";


export class AppColor extends Color {
    constructor(value: ColorSource) {
        super(value);
    }

    public equals(color: Color) {
        return this.toNumber() === color.toNumber();
    }

    public getReadableColor() {
        const [red, green, blue] = this.toUint8RgbArray()

        // https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color/3943023#3943023
        const isBlack = (red * 0.299 + green * 0.587 + blue * 0.114) > 186
    
        return isBlack ? new AppColor('black') : new AppColor('white');
    }
 
    static getRandom() {
        return new AppColor(Math.floor(Math.random() * 0xffffff))
    }
}