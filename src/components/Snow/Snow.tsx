import { useContext, useEffect, useRef } from "preact/hooks"
import styles from "./Snow.module.css"
import { Application, Color, Graphics, ParticleContainer, Sprite, Texture } from "pixi.js";
import { SnowParticle } from "./SnowParticle";
import { random } from "../../lib/random";
import { config } from "../../config";
import { SettingsContext } from "../../managers/settings";



export function Snow() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const settings = useContext(SettingsContext)
    
    settings.load()

    if (!settings.settings.value.enableSnow) 
        return null


    function setup() {
        const app = new Application({
            width: window.innerWidth,
            height: window.innerHeight,
            resizeTo: window,
            view: canvasRef.current!,
            backgroundAlpha: 0,
            antialias: true
        })

        SnowParticle.texture = app.renderer.generateTexture(SnowParticle.graphics);
        SnowParticle.app = app;

        const particles = SnowParticle.getRandomParticles(config.snow.amount)
        const particleContainer = new ParticleContainer(config.snow.amount, {
            scale: true,
            position: true
        })

        particles.forEach(particle => particleContainer.addChild(particle))

        app.stage.addChild(particleContainer)

        app.ticker.add(time => particles.forEach(particle => particle.update(time)))
    }

    useEffect(setup, [])
    useEffect(setup, [settings.settings.value])

    return <canvas ref={canvasRef} className={styles.snow}></canvas>
}