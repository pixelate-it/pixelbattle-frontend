export class InternalError extends Error {}

export class GlError extends InternalError {}

export class GlShaderBuildError extends GlError {
  lineOffset?: number
  shaderName: string

  constructor(msg: string, shaderName: string, lineOffset?: number) {
    super()
    this.message = msg
    this.shaderName = shaderName
    this.lineOffset = lineOffset
  }
}

export class GlDeprecatedBrowserError extends GlError {}

export class RenderError extends GlError {}

export class PluginError extends InternalError {}

export class DomEventError extends PluginError {}

export class PluginBusError extends PluginError {}
