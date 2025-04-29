import { FC, useState } from "react";

type ResizeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (newWidth: number, newHeight: number, method: "nearest" | "bilinear") => void;
  originalWidth: number;
  originalHeight: number;
};

const ResizeModal: FC<ResizeModalProps> = ({ isOpen, onClose, onApply, originalWidth, originalHeight }) => {
  const [width, setWidth] = useState(originalWidth);
  const [height, setHeight] = useState(originalHeight);
  const [keepRatio, setKeepRatio] = useState(true);
  const [method, setMethod] = useState<"nearest" | "bilinear">("bilinear");

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = +e.target.value;
    setWidth(value);
    if (keepRatio) {
      setHeight(Math.round((value * originalHeight) / originalWidth));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = +e.target.value;
    setHeight(value);
    if (keepRatio) {
      setWidth(Math.round((value * originalWidth) / originalHeight));
    }
  };

  if (!isOpen) return null;

  return (
    <dialog open>
      <h2>Масштабирование изображения</h2>
      <p>Исходное разрешение: {originalWidth}x{originalHeight}</p>
      <p>Новое разрешение: {width}x{height}</p>

      <label>Ширина: <input type="number" value={width} onChange={handleWidthChange} /></label>
      <label>Высота: <input type="number" value={height} onChange={handleHeightChange} /></label>

      <label>
        <input type="checkbox" checked={keepRatio} onChange={() => setKeepRatio(!keepRatio)} />
        Сохранять пропорции
      </label>

      <label>Алгоритм интерполяции:
        <select value={method} onChange={e => setMethod(e.target.value as any)}>
          <option value="bilinear">Билинейная интерполяция (плавная)</option>
          <option value="nearest">Ближайший сосед (быстрая)</option>
        </select>
      </label>

      <div>
        <button onClick={() => onApply(width, height, method)}>Применить</button>
        <button onClick={onClose}>Отмена</button>
      </div>
    </dialog>
  );
};

export default ResizeModal;
