precision mediump float;

uniform float u_alpha;
uniform vec4 u_color;

varying vec2 v_posCoord;

void main() {

#ifdef PLUS

  vec2 halfSize = vec2(0.5);
  vec2 pos = v_posCoord - halfSize;

  float d1 = float(abs(pos.x) <= 0.1 * 0.5);
  float d2 = float(abs(pos.y) <= 0.1 * 0.5);

  if (d1 + d2 > 0.0) {
    gl_FragColor = vec4(u_color.rgb, u_color.a);
  } else {
    discard;
  }

#endif

#ifdef CROSS

  vec2 halfSize = vec2(0.5);
  vec2 pos = v_posCoord - halfSize;
  
  float d1 = abs(pos.x - pos.y);
  float d2 = abs(pos.x + pos.y);

  float line1 = float(d1 <= 0.1);
  float line2 = float(d2 <= 0.1);

  if (line1 + line2 > 0.0) {
    gl_FragColor = vec4(u_color.rgb, u_color.a);
  } else {
    discard;
  }

#endif


#ifdef ARROW_RIGHT

  vec2 halfSize = vec2(0.5);
  vec2 pos = v_posCoord - halfSize;

  float shaftWidth = 0.1; 
  float shaftHeight = 0.2; 
  float tipHeight = 0.4;  
  float tipWidth = 0.4; 

  float shaft = float(
    pos.x >= -0.5 &&
    abs(pos.y) <= shaftHeight * 0.5 &&
    pos.x <= 0.5 - tipWidth
  );

  float tip = float(
    pos.x >= 0.5 - tipWidth &&
    abs(pos.y) <= (0.5 - pos.x) * (tipHeight / tipWidth)
  );

  if (shaft + tip > 0.0) {
    gl_FragColor = vec4(u_color.rgb, u_color.a * u_alpha);
  } else {
    discard;
  }

#endif

#ifdef ARROW_LEFT

  vec2 halfSize = vec2(0.5);
  vec2 pos = v_posCoord - halfSize;

  float shaftWidth = 0.1;
  float shaftHeight = 0.2;
  float tipHeight = 0.4;
  float tipWidth = 0.4;

  float shaft = float(
    pos.x <= 0.5 &&
    abs(pos.y) <= shaftHeight * 0.5 &&
    pos.x >= -0.5 + tipWidth
  );

  float tip = float(
    pos.x <= -0.5 + tipWidth &&
    abs(pos.y) <= (pos.x + 0.5) * (tipHeight / tipWidth)
  );

  if (shaft + tip > 0.0) {
    gl_FragColor = vec4(u_color.rgb, u_color.a * u_alpha);
  } else {
    discard;
  }

#endif

}
