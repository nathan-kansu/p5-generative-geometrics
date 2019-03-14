import * as p5 from "p5";
import {
  COLOR_SHAPES,
  OPACITY_MIN,
  OPACITY_MAX,
  OPACITY_RATE,
  POINTS_MIN,
  POINTS_MAX,
  RADIUS_MIN,
  RADIUS_MAX,
  STROKE_WEIGHT_MIN,
  STROKE_WEIGHT_MAX,
  TOTAL_SHAPES
} from "./constants";

import { ShapeInterface, VerticiesInterface } from "./interfaces";

export default class Geometry {
  angle: number = 0;
  currentShapeIndex: number = 0;
  p5: p5;
  radius: number = RADIUS_MIN;
  shapes: ShapeInterface[] = [];

  constructor(p5: p5) {
    this.p5 = p5;
    this.generateShapes();
  }

  private getRandomOpacity = () =>
    this.p5.round(this.p5.random(OPACITY_MIN, OPACITY_MAX));

  private getRandomPoints = () =>
    this.p5.round(this.p5.random(POINTS_MIN, POINTS_MAX));

  private getRandomRadius = () =>
    this.p5.round(this.p5.random(RADIUS_MIN, RADIUS_MAX));

  private getRandomStrokeWeight = () =>
    this.p5.round(this.p5.random(STROKE_WEIGHT_MIN, STROKE_WEIGHT_MAX));

  private getAngle = (points: number) => {
    this.p5.angleMode(this.p5.RADIANS);
    return this.p5.TAU / points;
  };

  private getX = (angle: number, increment: number) =>
    this.p5.round(this.p5.cos(angle * increment) * this.radius);

  private getY = (angle: number, increment: number) =>
    this.p5.round(this.p5.sin(angle * increment) * this.radius);

  private getVertices = () => {
    const points = this.getRandomPoints();
    const angle = this.getAngle(points);
    let vertices = [];

    for (let i = 0; i <= points; i++) {
      vertices.push({
        x: this.getX(angle, i),
        y: this.getY(angle, i)
      });
    }
    return vertices;
  };

  private isRenderComplete = () => {
    const length = this.shapes.length - 1;
    const { opacity, maxOpacity } = this.shapes[length];
    return opacity >= maxOpacity;
  };

  private isShapeAnimationComplete = (opacity: number, maxOpacity: number) =>
    opacity >= maxOpacity;

  private getUpdatedOpacity = (opacity: number, index: number) =>
    opacity + OPACITY_RATE / index;

  private generateShapes = () => {
    for (let i = 0; i < TOTAL_SHAPES; i++) {
      this.shapes.push({
        maxOpacity: this.getRandomOpacity(),
        opacity: 0,
        shapeStrokeWeight: this.getRandomStrokeWeight(),
        vertices: this.getVertices()
      });

      this.radius += this.getRandomRadius();
    }
  };

  private renderShape = ({
    opacity,
    shapeStrokeWeight,
    vertices
  }: ShapeInterface) => {
    this.p5.stroke([...COLOR_SHAPES, opacity]);
    this.p5.strokeWeight(shapeStrokeWeight);
    this.p5.beginShape();
    vertices.map(({ x, y }: VerticiesInterface) => this.p5.vertex(x, y));
    this.p5.endShape();
  };

  private resetShapes = () => {
    this.radius = RADIUS_MIN;
    this.generateShapes();
  };

  private reviewShapes() {
    if (this.shapes.length && this.isRenderComplete()) {
      this.shapes.shift();
    } else if (!this.shapes.length) {
      this.resetShapes();
    }
  }

  private updateShapes = (shapes: ShapeInterface[]) => {
    this.shapes = shapes;
  };

  renderShapes() {
    this.updateShapes(
      this.shapes.map((shape: ShapeInterface, shapeIndex: number) => {
        const { maxOpacity, opacity } = shape;
        let shapeOpacity = opacity;

        if (shapeIndex > this.currentShapeIndex) {
          return shape;
        }

        if (!this.isShapeAnimationComplete(opacity, maxOpacity)) {
          shapeOpacity = this.getUpdatedOpacity(opacity, shapeIndex);
        }

        this.renderShape(shape);
        this.currentShapeIndex += 1;

        return {
          ...shape,
          opacity: shapeOpacity
        };
      })
    );

    this.reviewShapes();
  }
}
