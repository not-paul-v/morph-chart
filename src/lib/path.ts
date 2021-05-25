const parseSVG = require("parse-svg-path");
const absSVG = require("abs-svg-path");
const normalizeSVG = require("normalize-svg-path");
import { Vector, cubicBezierYForX } from "./math";

type SVGCloseCommand = ["Z"];
type SVGMoveCommand = ["M", number, number];
type SVGCurveCommand = ["C", number, number, number, number, number, number];
type SVGNormalizedCommands = [
    SVGMoveCommand,
    ...(SVGCurveCommand | SVGCloseCommand)[]
];

interface Curve {
    to: Vector;
    c1: Vector;
    c2: Vector;
}

export type Path = {
    move: Vector;
    curves: Curve[];
    close: boolean;
};

export const parse = (d: string): Path => {
    const segments: SVGNormalizedCommands = normalizeSVG(absSVG(parseSVG(d)));
    const path = createPath({ x: segments[0][1], y: segments[0][2] });
    segments.forEach((segment) => {
        if (segment[0] === "Z") {
            close(path);
        } else if (segment[0] === "C") {
            addCurve(path, {
                c1: {
                    x: segment[1],
                    y: segment[2]
                },
                c2: {
                    x: segment[3],
                    y: segment[4]
                },
                to: {
                    x: segment[5],
                    y: segment[6]
                }
            });
        }
    });
    return path;
};

export const createPath = (move: Vector): Path => {
    "worklet";
    return {
        move,
        curves: [],
        close: false
    };
};

export const close = (path: Path) => {
    "worklet";
    path.close = true;
};

export const addCurve = (path: Path, c: Curve) => {
    "worklet";
    path.curves.push({
        c1: c.c1,
        c2: c.c2,
        to: c.to
    });
};

interface SelectedCurve {
    from: Vector;
    curve: Curve;
}

interface NullableSelectedCurve {
    from: Vector;
    curve: Curve | null;
}

const curveIsFound = (c: NullableSelectedCurve): c is SelectedCurve => {
    "worklet";
    return c.curve !== null;
};

export const selectCurve = (path: Path, x: number): SelectedCurve => {
    "worklet";
    const result: NullableSelectedCurve = {
        from: path.move,
        curve: null
    };
    for (let i = 0; i < path.curves.length; i++) {
        const c = path.curves[i];
        const contains =
            result.from.x > c.to.x
                ? x >= c.to.x && x <= result.from.x
                : x >= result.from.x && x <= c.to.x;
        if (contains) {
            result.curve = c;
            break;
        }
        result.from = c.to;
    }
    if (!curveIsFound(result)) {
        throw new Error(`No curve found at ${x}`);
    }
    return result;
};

export const getYForX = (path: Path, x: number, precision = 2) => {
    "worklet";
    const c = selectCurve(path, x);
    return cubicBezierYForX(
        x,
        c.from,
        c.curve.c1,
        c.curve.c2,
        c.curve.to,
        precision
    );
};
