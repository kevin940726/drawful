import brush from '../assets/brush.png';

export const brushImg = () => {
  const img = new Image();
  img.src = brush;

  return img;
}

export const distanceBetween = (point1, point2) => (
  Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2))
);

export const angleBetween = (point1, point2) => (
  Math.atan2(point2.x - point1.x, point2.y - point1.y)
);
