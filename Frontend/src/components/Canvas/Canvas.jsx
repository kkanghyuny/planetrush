import React, { useRef, useState, useEffect } from "react";
import * as fabric from "fabric";
import "../../styles/Canvas.css";

//createImg에서 saveImage를 props 받아옴
const Canvas = ({ onSaveImage }) => {
  //캔버스 컴포넌트 호출
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [drawingMode, setDrawingMode] = useState(true);
  const [drawingColor, setDrawingColor] = useState("#FFFFFF");
  const [pixelSize, setPixelSize] = useState(10);
  const [isErasing, setIsErasing] = useState(false);

  class PixelBrush extends fabric.BaseBrush {
    constructor(canvas) {
      super(canvas);
      this.pixelSize = pixelSize;
      this.points = [];
    }

    onMouseDown(pointer) {
      this.points = [];
      this.addPoint(pointer);
    }

    onMouseMove(pointer) {
      this.addPoint(pointer);
    }

    onMouseUp() {
      this.convertToPixelArt();
    }

    addPoint(pointer) {
      const x = Math.floor(pointer.x / this.pixelSize) * this.pixelSize;
      const y = Math.floor(pointer.y / this.pixelSize) * this.pixelSize;
      this.points.push(new fabric.Point(x, y));
      this._render();
    }

    convertToPixelArt() {
      const pixelMap = {};
      this.points.forEach((point) => {
        const key = `${point.x},${point.y}`;
        pixelMap[key] = true;
      });

      Object.keys(pixelMap).forEach((key) => {
        const [x, y] = key.split(",").map(Number);
        const rect = new fabric.Rect({
          left: x,
          top: y,
          width: this.pixelSize,
          height: this.pixelSize,
          fill: this.color,
          selectable: false,
          evented: false,
        });
        this.canvas.add(rect);
      });

      this.canvas.renderAll();
    }

    _render() {
      const ctx = this.canvas.contextTop;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = this.color;

      this.points.forEach((point) => {
        ctx.fillRect(point.x, point.y, this.pixelSize, this.pixelSize);
      });
    }
  }

  useEffect(() => {
    const initCanvas = () => {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: drawingMode,
        backgroundColor: "transparent",
        width: 380,
        height: 380,
        stopContextMenu: true,
        fireRightClick: true,
        enablePointerEvents: true,
      });

      const pixelBrush = new PixelBrush(fabricCanvas);
      pixelBrush.color = drawingColor;
      pixelBrush.width = pixelSize;

      fabricCanvas.freeDrawingBrush = pixelBrush;
      setCanvas(fabricCanvas);
    };

    initCanvas();

    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, []);

  const updateCanvasImage = () => {
    if (canvas) {
      // 캔버스에 객체가 있는지 확인
      if (canvas.getObjects().length > 0) {
        const dataURL = canvas.toDataURL({
          format: "png",
          quality: 1,
        });
        onSaveImage(dataURL);
      } else {
        // 캔버스가 비어있으면 null을 전달
        onSaveImage(null);
      }
    }
  };

  useEffect(() => {
    if (canvas) {
      canvas.on("object:added", updateCanvasImage);
      canvas.on("object:removed", updateCanvasImage);
      canvas.on("object:modified", updateCanvasImage);

      return () => {
        canvas.off("object:added", updateCanvasImage);
        canvas.off("object:removed", updateCanvasImage);
        canvas.off("object:modified", updateCanvasImage);
      };
    }
  }, [canvas]);

  const clearCanvas = () => {
    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = "transparent";
      canvas.renderAll();
      updateCanvasImage();
    }
  };

  const handleErase = (opt) => {
    const pointer = canvas.getPointer(opt.e);
    const objects = canvas.getObjects();
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].containsPoint(pointer)) {
        canvas.remove(objects[i]);
      }
    }
    canvas.renderAll();
    updateCanvasImage();
  };

  const toggleEraser = () => {
    setIsErasing(!isErasing);
    if (canvas) {
      if (isErasing) {
        canvas.off("mouse:down", handleErase);
        const pixelBrush = new PixelBrush(canvas);
        pixelBrush.color = drawingColor;
        pixelBrush.width = pixelSize;
        canvas.freeDrawingBrush = pixelBrush;
      } else {
        canvas.isDrawingMode = false;
        canvas.on("mouse:down", handleErase);
      }
    }
  };

  useEffect(() => {
    if (canvas && canvas.freeDrawingBrush) {
      if (isErasing) {
        canvas.isDrawingMode = false;
        canvas.on("mouse:down", handleErase);
      } else {
        canvas.isDrawingMode = true;
        const pixelBrush = new PixelBrush(canvas);
        pixelBrush.color = drawingColor;
        pixelBrush.width = pixelSize;
        canvas.freeDrawingBrush = pixelBrush;
        canvas.off("mouse:down", handleErase);
      }
    }
  }, [canvas, drawingColor, pixelSize, isErasing]);

  const saveCanvasAsImage = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
      });

      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "planet_image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="canvas-container">
      <div className="canvas-wrapper">
        <canvas ref={canvasRef} />
      </div>
      <div className="controls">
        <button onClick={() => clearCanvas()}>다시 그리기</button>
        <button onClick={() => saveCanvasAsImage()}>다운받기</button>
        <button onClick={() => toggleEraser()}>
          {isErasing ? "그리기 모드" : "지우개 모드"}
        </button>
        <div className="color-size-controls" style={{ marginTop: "10px" }}>
          <label style={{ marginRight: "10px" }}>
            색:
            <input
              type="color"
              value={drawingColor}
              onChange={(e) => setDrawingColor(e.target.value)}
              disabled={isErasing}
            />
          </label>
          <label>
            사이즈:
            <input
              type="range"
              min="1"
              max="50"
              value={pixelSize}
              onChange={(e) => setPixelSize(parseInt(e.target.value, 10))}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
