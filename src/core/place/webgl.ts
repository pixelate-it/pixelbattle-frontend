import * as twgl from 'twgl.js'
import { GlDeprecatedBrowserError, GlShaderBuildError } from '../util/errors'

// Shaders
import shader from './glsl/shader.glsl'
import icons from './glsl/icons.glsl'
import { Viewport } from '../storage'
import Color from '../util/сolor'
import { ErrorDaemon } from '../daemons/error'

export enum IconsType {
  CROSS = 'cross',
  PLUS = 'plus',
  ARROW_LEFT = 'arrow_left',
  ARROW_RIGHT = 'arrow_right',
  OUTLINE = 'outline'
}

export enum AmbientEffectType {
  SPRING = 'spring_ambient'
}

export const shaders: Record<string, [string, string, boolean?]> = {
  image: [shader, 'IMAGE'],
  rect: [shader, 'RECT'],
  button: [shader, 'BUTTON'],
  outline: [shader, 'OUTLINE'],
  plus: [icons, 'PLUS'],
  cross: [icons, 'CROSS'],
  arrow_left: [icons, 'ARROW_LEFT'],
  arrow_right: [icons, 'ARROW_RIGHT']
}

export class WebGlGraphics {
  gl: WebGLRenderingContext
  private programs: Record<keyof typeof shaders, twgl.ProgramInfo> = {}
  private buffers: { [key: string]: twgl.BufferInfo } = {}

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl')
    if (!gl) {
      ErrorDaemon.setError(new GlDeprecatedBrowserError())
      throw new Error('Your browser does not support WebGL')
    }
    this.gl = gl

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    for (const i in shaders) {
      this.programs[i] = twgl.createProgramInfo(
        gl,
        [
          shaders[i][2]
            ? '#define VERTEX_SHADER\n' + shaders[i][0]
            : '#define VERTEX_SHADER\n' + shader,
          `#define ${shaders[i][1]}\n` + shaders[i][0]
        ],
        (msg, lineOffset) =>
          ErrorDaemon.setError(new GlShaderBuildError(msg, i, lineOffset))
      )
    }

    this.buffers['quad'] = twgl.createBufferInfoFromArrays(gl, {
      position: {
        numComponents: 2,
        data: [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]
      },
      texcoord: {
        numComponents: 2,
        data: [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]
      }
    })
  }

  preRender() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.clearColor(0.156, 0.156, 0.156, 1)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
  }

  drawImage(x: number, y: number, src: ImageData, alpha: number = 1) {
    const gl = this.gl

    let texture = twgl.createTexture(gl, {
      src: src.data,
      width: src.width,
      height: src.height,
      format: gl.RGBA,
      min: gl.LINEAR,
      mag: gl.NEAREST,
      wrap: gl.CLAMP_TO_EDGE
    })

    const uniforms = {
      u_resolution: [gl.canvas.width, gl.canvas.height],
      u_translation: Viewport.toTranslation(x, y),
      u_scale: Viewport.toScale(src.width, src.height),
      u_image: texture,
      u_alpha: alpha
    }

    gl.useProgram(this.programs['image'].program)
    twgl.setBuffersAndAttributes(
      gl,
      this.programs['image'],
      this.buffers['quad']
    )
    twgl.setUniforms(this.programs['image'], uniforms)
    twgl.drawBufferInfo(gl, this.buffers['quad'])
  }

  drawRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: Color,
    alpha = 1
  ) {
    const gl = this.gl

    const uniforms = {
      u_resolution: [gl.canvas.width, gl.canvas.height],
      u_translation: Viewport.toTranslation(x, y),
      u_scale: Viewport.toScale(width, height),
      u_color: color.toGl(),
      u_alpha: alpha
    }

    gl.useProgram(this.programs['rect'].program)
    twgl.setBuffersAndAttributes(
      gl,
      this.programs['rect'],
      this.buffers['quad']
    )
    twgl.setUniforms(this.programs['rect'], uniforms)
    twgl.drawBufferInfo(gl, this.buffers['quad'])
  }

  drawVerities(
    x: number,
    y: number,
    width: number,
    height: number,
    color: Color,
    vertices: Float32Array,
    name: string,
    alpha = 1
  ) {
    const gl = this.gl

    if (this.buffers[name] == undefined) {
      this.buffers[name] = twgl.createBufferInfoFromArrays(gl, {
        position: {
          numComponents: 2,
          data: vertices
        }
      })
    }

    const uniforms = {
      u_resolution: [gl.canvas.width, gl.canvas.height],
      u_translation: Viewport.toTranslation(x, y),
      u_scale: Viewport.toScale(width, height),
      u_color: color.toGl(),
      u_alpha: alpha
    }

    gl.useProgram(this.programs['rect'].program)
    twgl.setBuffersAndAttributes(gl, this.programs['rect'], this.buffers[name])
    twgl.setUniforms(this.programs['rect'], uniforms)
    twgl.drawBufferInfo(gl, this.buffers[name])
  }

  drawIcon(
    x: number,
    y: number,
    width: number,
    height: number,
    color: Color,
    type: IconsType,
    alpha = 1
  ) {
    const gl = this.gl

    const uniforms = {
      u_resolution: [gl.canvas.width, gl.canvas.height],
      u_translation: Viewport.toTranslation(x, y),
      u_scale: Viewport.toScale(width, height),
      u_color: color.toGl(),
      u_alpha: alpha
    }

    gl.useProgram(this.programs[type].program)
    twgl.setBuffersAndAttributes(gl, this.programs[type], this.buffers['quad'])
    twgl.setUniforms(this.programs[type], uniforms)
    twgl.drawBufferInfo(gl, this.buffers['quad'])
  }

  drawButton(
    x: number,
    y: number,
    width: number,
    height: number,
    color: Color,
    borderRadius: number,
    alpha = 1
  ) {
    const gl = this.gl

    const uniforms = {
      u_resolution: [gl.canvas.width, gl.canvas.height],
      u_translation: Viewport.toTranslation(x, y),
      u_scale: Viewport.toScale(width, height),
      u_color: color.toGl(),
      u_alpha: alpha,
      u_border_radius: borderRadius,
      u_size: [width, height]
    }

    gl.useProgram(this.programs['button'].program)
    twgl.setBuffersAndAttributes(
      gl,
      this.programs['button'],
      this.buffers['quad']
    )
    twgl.setUniforms(this.programs['button'], uniforms)
    twgl.drawBufferInfo(gl, this.buffers['quad'])
  }
}
