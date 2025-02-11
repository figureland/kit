import { map } from "../../math/number";
import type { Matrix2D } from "../../math";
import type { Box } from "../../math/box";
import { getScale } from "../../math/matrix2D";
import { transform } from "../../math/style";

export const boxStyle = (box: Box, inset: number = 0): string =>
  `width: ${box.width - inset}px; height: ${box.height - inset}px; transform: ${transform([1, 0, 0, 1, box.x + inset / 2, box.y + inset / 2])}`;

export const getSVGBackgroundPattern = (
  matrix: Matrix2D,
  size: number
): SVGBackgroundPattern => {
  const patternTransform = transform(matrix);

  return {
    width: size,
    height: size,
    patternTransform: patternTransform,
    patternUnits: "userSpaceOnUse",
    opacity: map(getScale(matrix), 0.5, 1, 0.1, 0.5),
  };
};

export type SVGBackgroundPattern = {
  width: number;
  height: number;
  patternTransform: string;
  patternUnits: string;
  opacity: number;
};

const TRANSFORM_NAME = "infinitykit-transform";
const SCALE_NAME = "infinitykit-scale";
const INVERTED_SCALE_NAME = "infinitykit-inverted-scale";

export const staticCanvasStyle = `position: absolute; width: 100%; height: 100%; top: 0px; left: 0px; transform-origin: 0% 0%; transform: var(--${TRANSFORM_NAME});`;

export const getCanvasStyle = (matrix: Matrix2D): string => {
  const scale = getScale(matrix);
  return `--${TRANSFORM_NAME}: ${transform(matrix)}; --${SCALE_NAME}: ${scale}px; --${INVERTED_SCALE_NAME}: ${1.0 / scale}`;
};
