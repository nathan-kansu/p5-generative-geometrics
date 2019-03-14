import * as p5 from "p5";
import Geometry from "./Geometry";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  COLOR_BACKGROUND,
  FRAME_RATE
} from "./constants";

import { GeometryInterface } from "./interfaces";

const sketch = (p5: p5) => {
  let geometry: GeometryInterface;

  p5.setup = () => {
    p5.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    p5.noFill();
    p5.background(COLOR_BACKGROUND);
    p5.frameRate(FRAME_RATE);
    geometry = new Geometry(p5);
  };

  p5.draw = () => {
    p5.background(COLOR_BACKGROUND);
    p5.translate(p5.width / 2, p5.height / 2);
    p5.angleMode(p5.DEGREES);
    p5.rotate(-90);
    geometry.renderShapes();
  };
};

new p5(sketch);
