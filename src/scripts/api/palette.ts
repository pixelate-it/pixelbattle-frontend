import { Color, ColorSource } from "pixi.js";
import { app } from "../app";
import { config } from "../config";
import { getRandomId } from "../lib/random";

interface PaletteButtons {
    create: HTMLDivElement;
    remove: HTMLButtonElement;
}

interface PaletteColor {
    color: Color;
    id: string;
}

interface FlatPaletteColor {
    color: string;
    id: string;
}

export class PaletteController {
    public colors: PaletteColor[];
    public container = document.getElementById("palette");
    public buttons: PaletteButtons = {} as PaletteButtons;
    private selectedColorId: string;

    constructor() {
        this.loadColors();
        this.render();
    }

    public setup() {

    }

    get selectedColor() {
        return this.colors.find(c => c.id === this.selectedColorId)
    }

    public isDefaultColor(color: PaletteColor) {
        return this.colors
            .slice(0, config.colors.palette.length)
            .find(c => c.id === color.id) !== undefined
    }

    public setSelectedColor(id: string) {
        this.selectedColorId = id
        localStorage.setItem("selected-color", id);
        this.setColors()
        this.render()
    }



    public loadColors() {
        const storedColors = localStorage.getItem("palette")

        if (!storedColors) {
            const defaultColors = config.colors.palette.map((c, i) => ({
                color: c,
                id: getRandomId()
            }));
            this.colors = defaultColors
            this.selectedColorId = defaultColors[0].id

            return;
        };

        this.colors = (JSON.parse(storedColors) as FlatPaletteColor[])
            .map(c => ({
                color: new Color(c.color),
                id: c.id
            }));

        this.setSelectedColor(localStorage.getItem("selected-color")) 
    }

    public setColors() {
        const flatColors: FlatPaletteColor[] = this.colors.map(c => ({
            color: c.color.toHex(),
            id: c.id
        }))

        localStorage.setItem("palette", JSON.stringify(flatColors));
    }

    public addColor(color: Color) {
        const id = getRandomId()
        this.colors.push({
            color,
            id
        });
        this.setColors()
        this.setSelectedColor(id)
        this.render()
    }

    public removeColor(id: string) {
        const colorIndex = this.colors.findIndex(c => c.id === id);

        this.colors = this.colors
            .slice(0, colorIndex)
            .concat(this.colors.slice(colorIndex + 1));

        this.setColors()
        this.setSelectedColor(this.colors.at(-1).id)
        this.render()
    }

    public render() {
        this.container.innerHTML = "";

        this.colors.forEach((color) => this.renderColor(color));

        this.renderCreateButton()
        this.renderRemoveButton()
    }

    public renderColor(color: PaletteColor) {
        const colorElement = document.createElement('input');
        const hexColor = color.color.toHex();

        colorElement.type = 'radio';
        colorElement.name = 'palette';
        colorElement.value = hexColor;
        colorElement.dataset.id = color.id.toString();
        colorElement.checked = color.id === this.selectedColor.id;
        colorElement.style.backgroundColor = hexColor;
        colorElement.classList.add('color');


        colorElement.addEventListener('change', (e: InputEvent) => {
            const target = e.target as HTMLInputElement

            this.setSelectedColor(target.dataset.id);
            this.buttons.remove.disabled = this.isDefaultColor(color)
        });

        this.container.appendChild(colorElement);
    }

    private renderRemoveButton() {
        this.buttons.remove = document.createElement('button')
        this.buttons.remove.classList.add('remove-color')
        this.buttons.remove.disabled = this.isDefaultColor(this.selectedColor)

        this.buttons.remove.addEventListener('click', (e) => {
            e.preventDefault()

            this.removeColor(this.selectedColor.id);
        })

        this.container.appendChild(this.buttons.remove);
    }

    private renderCreateButton() {
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.value = config.colors.create.toHex();
        colorPicker.addEventListener('change', (e: InputEvent) => {
            const target = e.target as HTMLInputElement

            this.addColor(new Color(target.value));
        })

        const createButton = document.createElement('div');
        createButton.classList.add('new-color');
        createButton.appendChild(colorPicker);

        this.buttons.create = createButton
        this.container.appendChild(createButton);
    }
}