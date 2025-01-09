import * as twgl from 'twgl.js'
import { Viewport } from './storage/viewport'
import Color from '../classes/primitives/Color'
import shader from './glsl/shader.glsl'
import { GeneralDaemon } from '../daemons/general'
import { GlDeprecatedBrowserError, GlShaderBuildError } from '../util/Errors'

export class WebGlGraphics {
  private gl: WebGLRenderingContext
  private imageProgramInfo: twgl.ProgramInfo
  private rectProgramInfo: twgl.ProgramInfo
  private buttonProgramInfo: twgl.ProgramInfo
  private buffers: { [key: string]: twgl.BufferInfo } = {}

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl')
    if (!gl) {
      GeneralDaemon.setError(new GlDeprecatedBrowserError())
      throw new Error('Your browser does not support WebGL')
    }
    this.gl = gl

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const errorCallback = (msg: string, lineOffset?: number) => {
      GeneralDaemon.setError(new GlShaderBuildError(msg, lineOffset))
    }

    this.imageProgramInfo = twgl.createProgramInfo(
      gl,
      ['#define VERTEX_SHADER\n' + shader, '#define IMAGE\n' + shader],
      errorCallback
    )

    this.rectProgramInfo = twgl.createProgramInfo(
      gl,
      ['#define VERTEX_SHADER\n' + shader, '#define RECT\n' + shader],
      errorCallback
    )

    this.buttonProgramInfo = twgl.createProgramInfo(
      gl,
      ['#define VERTEX_SHADER\n' + shader, '#define BUTTON\n' + shader],
      errorCallback
    )
  }

  preRender() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.clearColor(0.156, 0.156, 0.156, 1)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
  }

  drawImage(x: number, y: number, src: ImageData, alpha: number = 1) {
    const gl = this.gl

    if (!this.buffers['quad']) {
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

    gl.useProgram(this.imageProgramInfo.program)
    twgl.setBuffersAndAttributes(
      gl,
      this.imageProgramInfo,
      this.buffers['quad']
    )
    twgl.setUniforms(this.imageProgramInfo, uniforms)
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

    if (!this.buffers['quad']) {
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

    const uniforms = {
      u_resolution: [gl.canvas.width, gl.canvas.height],
      u_translation: Viewport.toTranslation(x, y),
      u_scale: Viewport.toScale(width, height),
      u_color: color.toGl(),
      u_alpha: alpha
    }

    gl.useProgram(this.rectProgramInfo.program)
    twgl.setBuffersAndAttributes(gl, this.rectProgramInfo, this.buffers['quad'])
    twgl.setUniforms(this.rectProgramInfo, uniforms)
    twgl.drawBufferInfo(gl, this.buffers['quad'])
  }

  drawButton(
    x: number,
    y: number,
    width: number,
    height: number,
    color: Color,
    borderRadius: number,
    outlineLength: number,
    alpha = 1
  ) {
    const gl = this.gl

    if (!this.buffers['quad']) {
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

    const uniforms = {
      u_resolution: [gl.canvas.width, gl.canvas.height],
      u_translation: Viewport.toTranslation(x, y),
      u_scale: Viewport.toScale(width, height),
      u_color: color.toGl(),
      u_alpha: alpha,
      u_outline_l: outlineLength,
      u_border_radius: borderRadius,
      u_size: [width, height]
    }

    gl.useProgram(this.buttonProgramInfo.program)
    twgl.setBuffersAndAttributes(
      gl,
      this.buttonProgramInfo,
      this.buffers['quad']
    )
    twgl.setUniforms(this.buttonProgramInfo, uniforms)
    twgl.drawBufferInfo(gl, this.buffers['quad'])
  }
}
