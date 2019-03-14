export interface ShapeInterface {
  maxOpacity: number;
  opacity: number;
  shapeStrokeWeight: number;
  vertices: VerticiesInterface[];
}

export interface VerticiesInterface {
  x: number;
  y: number;
}

export interface GeometryInterface {
  radius: number;
  shapes: ShapeInterface[];
  renderShapes(): void;
}
