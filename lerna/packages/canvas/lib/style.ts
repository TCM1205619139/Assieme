export type LineStyle = Pick<
  CanvasPathDrawingStyles,
  'lineCap' |
  'lineDashOffset' |
  'lineJoin' |
  'lineWidth' |
  'miterLimit'
> & {
  strokeStyle?: string
}

export type RectStyle = {
  fillStyle: string,
  strokeStyle: string
}

export type CanvasStyle =
  CanvasCompositing &
  Pick<CanvasFillStrokeStyles, 'fillStyle' | 'strokeStyle'> &
  CanvasFilters &
  CanvasImageSmoothing &
  LineStyle &
  RectStyle &
  CanvasShadowStyles &
  CanvasTextDrawingStyles

// export const PRIMARY_TEXT_STYLE: CanvasTextDrawingStyles = {
//   direction: 'inherit',
//   font: '10px sans-serif',
//   textAlign: 'start',
//   textBaseline: 'alphabetic'
// }

export const PRIMARY_LINE_STYLE: LineStyle = {
  lineCap: 'butt',
  lineDashOffset: 0.0,
  lineJoin: 'miter',
  lineWidth: 1,
  miterLimit: 10.0
}

export const PRIMARY_RECT_STYLE: RectStyle = {
  fillStyle: '',
  strokeStyle: ''
}

export const PRIMARY_CANVAS_STYLE: CanvasStyle = {
  globalAlpha: 1,
  globalCompositeOperation: '',
  filter: '',
  imageSmoothingEnabled: true,
  imageSmoothingQuality: 'high',
  shadowBlur: 0,
  shadowColor: 'fully-transparent black',
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  // ...PRIMARY_LINE_STYLE,
  lineCap: 'butt',
  lineDashOffset: 0.0,
  lineJoin: 'miter',
  lineWidth: 1,
  miterLimit: 10.0,
  // ...PRIMARY_TEXT_STYLE,
  direction: 'inherit',
  font: '10px sans-serif',
  textAlign: 'start',
  textBaseline: 'alphabetic',
  // ...PRIMARY_RECT_STYLE,
  fillStyle: '',
  strokeStyle: ''
}
