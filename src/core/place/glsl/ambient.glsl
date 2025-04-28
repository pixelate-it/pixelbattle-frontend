#ifdef VERTEX_SHADER

attribute vec2 position;
attribute vec2 texcoord;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_scale;
uniform vec2 u_viewport;

varying vec2 v_texCoord;

void main() {
  
  vec2 rotatedPosition = vec2(
     position.x * u_rotation.y + position.y * u_rotation.x,
     position.y * u_rotation.y - position.x * u_rotation.x);

  vec2 scaledPosition = (rotatedPosition * u_scale) + u_translation;

  vec2 zeroToOne = scaledPosition / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

  v_texCoord = texcoord;
}

#endif 

#ifdef SPRING

precision mediump float;

uniform sampler2D u_image;

varying vec2 v_texCoord;

void main() {
  gl_FragColor = texture2D(u_image, v_texCoord);
}

#endif