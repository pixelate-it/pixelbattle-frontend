import * as twgl from 'twgl.js'
import { Viewport } from './storage/viewport'
import Color from '../classes/primitives/Color'

const generalVertexShader = `
  attribute vec2 position;
attribute vec2 texcoord;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_scale;

varying vec2 v_texCoord;
varying vec2 v_posCoord;

void main() {
  vec2 scaledPosition = (position * u_scale) + u_translation;

  vec2 zeroToOne = scaledPosition / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

  v_texCoord = texcoord;
  v_posCoord = position;
}`

const imageFragmentShader = `
  precision mediump float;

  uniform sampler2D u_image;
  uniform float u_alpha;
  varying vec2 v_texCoord;

  void main() {
    vec4 color = texture2D(u_image, v_texCoord);
    gl_FragColor = vec4(color.rgb, color.a * u_alpha);
  }`

const rectFragmentShader = `
  precision mediump float;

  uniform vec4 u_color;
  uniform float u_alpha;

  void main() {
    gl_FragColor = vec4(u_color.rgb, u_color.a * u_alpha);
  }`

const rectWithOutlineFragmentShader = `
  precision mediump float;

  uniform vec4 u_color;
  uniform vec4 u_outlineColor;
  uniform float u_outlineWidth;
  uniform float u_alpha;
  varying vec2 v_posCoord;

  void main() {
    float border = step(20, v_posCoord.x)

    if (border > 1.0) {
        gl_FragColor = vec4(u_outlineColor.rgb, u_outlineColor.a * u_alpha);
    } else {
        // Если внутри прямоугольника (не на обводке)
        gl_FragColor = vec4(u_color.rgb, u_color.a * u_alpha);
    }
  }`

export class WebGlGraphics {
  private gl: WebGLRenderingContext
  private programInfo: twgl.ProgramInfo
  private pProgramInfo: twgl.ProgramInfo
  private rwoProgramInfo: twgl.ProgramInfo
  private buffers: { [key: string]: twgl.BufferInfo } = {}

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl')
    if (!gl) {
      throw new Error('Your browser does not support WebGL')
    }
    this.gl = gl

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    this.programInfo = twgl.createProgramInfo(gl, [
      generalVertexShader,
      imageFragmentShader
    ])

    this.pProgramInfo = twgl.createProgramInfo(gl, [
      generalVertexShader,
      rectFragmentShader
    ])

    this.rwoProgramInfo = twgl.createProgramInfo(gl, [
      generalVertexShader,
      rectWithOutlineFragmentShader
    ])
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

    const texture = twgl.createTexture(gl, {
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
      u_translation: [
        (x + Viewport.renderX) * Viewport.renderScale,
        (y + Viewport.renderY) * Viewport.renderScale
      ],
      u_scale: [
        src.width * Viewport.renderScale,
        src.height * Viewport.renderScale
      ],
      u_image: texture,
      u_alpha: alpha
    }

    gl.useProgram(this.programInfo.program)
    twgl.setBuffersAndAttributes(gl, this.programInfo, this.buffers['quad'])
    twgl.setUniforms(this.programInfo, uniforms)
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

    const u_color = [
      color.color[0] / 255,
      color.color[1] / 255,
      color.color[2] / 255,
      color.color[3] ? color.color[3] : 1.0
    ]

    const uniforms = {
      u_resolution: [gl.canvas.width, gl.canvas.height],
      u_translation: [
        (x + Viewport.renderX) * Viewport.renderScale,
        (y + Viewport.renderY) * Viewport.renderScale
      ],
      u_scale: [width * Viewport.renderScale, height * Viewport.renderScale],
      u_color,
      u_alpha: alpha
    }

    gl.useProgram(this.pProgramInfo.program)
    twgl.setBuffersAndAttributes(gl, this.pProgramInfo, this.buffers['quad'])
    twgl.setUniforms(this.pProgramInfo, uniforms)
    twgl.drawBufferInfo(gl, this.buffers['quad'])
  }

  /**
   * NOT WORKING!
   */
  drawRectWithOutline(
    x: number,
    y: number,
    width: number,
    height: number,
    color: Color,
    outlineWidth: number,
    outlineColor: Color,
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

    const u_color = [
      color.color[0] / 255,
      color.color[1] / 255,
      color.color[2] / 255,
      color.color[3] ? color.color[3] : 1.0
    ]
    const u_outlineColor = [
      outlineColor.color[0] / 255,
      outlineColor.color[1] / 255,
      outlineColor.color[2] / 255,
      outlineColor.color[3] ? color.color[3] : 1.0
    ]

    const uniforms = {
      u_resolution: [gl.canvas.width, gl.canvas.height],
      u_translation: [
        (x + Viewport.renderX) * Viewport.renderScale,
        (y + Viewport.renderY) * Viewport.renderScale
      ],
      u_scale: [width * Viewport.renderScale, height * Viewport.renderScale],
      u_color,
      u_alpha: alpha,
      u_outlineWidth: outlineWidth,
      u_outlineColor
    }

    gl.useProgram(this.rwoProgramInfo.program)
    twgl.setBuffersAndAttributes(gl, this.rwoProgramInfo, this.buffers['quad'])
    twgl.setUniforms(this.rwoProgramInfo, uniforms)
    twgl.drawBufferInfo(gl, this.buffers['quad'])
  }
}
