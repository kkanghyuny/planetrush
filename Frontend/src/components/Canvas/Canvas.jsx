import React, { useRef, useState, useEffect } from "react";
import * as fabric from "fabric";
import "../../styles/Canvas.css";

const Canvas = ({ onSaveImage }) => {
  // 캔버스 객체
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  // 그림 그리기 모드, 색, 픽셀 사이즈 디폴트
  const [drawingMode, setDrawingMode] = useState(true);
  const [drawingColor, setDrawingColor] = useState("#000000");
  const [pixelSize, setPixelSize] = useState(10);

  // 지우개 모드
  const [isErasing, setIsErasing] = useState(false);

  // PixelBrush 클래스 정의
  class PixelBrush extends fabric.BaseBrush {
    constructor(canvas) {
      super(canvas);
      this.pixelSize = pixelSize;
      this.points = [];
    }

    // 마우스 이벤트 별로 함수 설정
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

    // 마우스 좌표값 받아오기
    addPoint(pointer) {
      const x = Math.floor(pointer.x / this.pixelSize) * this.pixelSize;
      const y = Math.floor(pointer.y / this.pixelSize) * this.pixelSize;
      this.points.push(new fabric.Point(x, y));
      this._render();
    }

    // 픽셀로 바꾸기
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

      // 픽셀 브러쉬 추가
      const pixelBrush = new PixelBrush(fabricCanvas);
      pixelBrush.color = drawingColor;
      pixelBrush.width = pixelSize;

      fabricCanvas.freeDrawingBrush = pixelBrush;
      setCanvas(fabricCanvas);
    };

    // 초기화
    initCanvas();

    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, []);

  // 다시 그리기
  const clearCanvas = () => {
    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = "transparent";
      canvas.renderAll();
    }
  };

  // 지우기 기능
  const handleErase = (opt) => {
    const pointer = canvas.getPointer(opt.e);
    const objects = canvas.getObjects();
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].containsPoint(pointer)) {
        canvas.remove(objects[i]);
      }
    }
    canvas.renderAll();
  };

  // 그리기 모드 전환
  const toggleEraser = () => {
    setIsErasing(!isErasing);
    if (canvas) {
      if (isErasing) {
        // 지우개 모드로 전환
        canvas.off("mouse:down", handleErase);
        const pixelBrush = new PixelBrush(canvas);
        pixelBrush.color = drawingColor;
        pixelBrush.width = pixelSize;
        canvas.freeDrawingBrush = pixelBrush;
      } else {
        // 그리기 모드로 전환
        canvas.isDrawingMode = false;
        canvas.on("mouse:down", handleErase);
      }
    }
  };

  // 그림이 그려질 때 사용
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

  // 이미지 저장 및 다운로드
  const saveCanvasAsImage = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
      });

      // 이미지 다운로드
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "planet_image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 부모 컴포넌트로 이미지 데이터 전달
      onSaveImage(dataURL);
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
              disabled={isErasing} // 지우개 모드일 때 색상 변경 비활성화
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
