import React, { useRef, useState, useEffect } from "react";
import * as fabric from "fabric";
import "../../styles/Canvas.css";

const Canvas = ({ selectedImage, onSaveImage }) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [drawingMode, setDrawingMode] = useState(true);
  const [drawingColor, setDrawingColor] = useState("#000000");
  const [pixelSize, setPixelSize] = useState(10);

  useEffect(() => {
    const initCanvas = async () => {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: drawingMode,
        backgroundColor: "transparent",
        width: 380,
        height: 380,
        stopContextMenu: true,
        fireRightClick: true,
        enablePointerEvents: true,
      });

      //커스텀 브러쉬 만드는 함수 //픽셀로
      //fabric.BaseBursh를 상속받아서 수정해줌
      class PixelBrush extends fabric.BaseBrush {
        constructor(canvas) {
          super(canvas);
          this.pixelSize = pixelSize;
          this.points = [];
        }

        //마우스 이벤트 별로 함수 설정
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

        //마우스 좌표값 받아오기
        addPoint(pointer) {
          const x = Math.floor(pointer.x / this.pixelSize) * this.pixelSize;
          const y = Math.floor(pointer.y / this.pixelSize) * this.pixelSize;
          this.points.push(new fabric.Point(x, y));

          this._render();
        }

        //픽셀로 바꾸기
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

      //픽셀 브러쉬 선택
      const pixelBrush = new PixelBrush(fabricCanvas);
      pixelBrush.color = drawingColor;
      pixelBrush.width = pixelSize;

      fabricCanvas.freeDrawingBrush = pixelBrush;
      setCanvas(fabricCanvas);
    };

    //넣어준다
    initCanvas();

    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, []);

  //드로잉 모드가 되면? render 해줘라
  useEffect(() => {
    if (canvas) {
      canvas.isDrawingMode = drawingMode;
      canvas.renderAll();
    }
  }, [drawingMode, canvas]);

  //그림이 그려질 때 사용
  useEffect(() => {
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = drawingColor;
      canvas.freeDrawingBrush.pixelSize = pixelSize;
    }
  }, [canvas, drawingColor, pixelSize]);

  // 선택한 이미지를 캔버스에 로드
  useEffect(() => {
    if (canvas && selectedImage) {
      fabric.Image.fromURL(selectedImage, (img) => {
        img.scaleToWidth(canvas.width);
        img.scaleToHeight(canvas.height);
        img.set({ selectable: false, evented: false });
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      });
    }
  }, [canvas, selectedImage]);

  //이미지 저장
  const saveCanvasAsImage = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
      });
      onSaveImage(dataURL);
    }
  };

  const clearCanvas = (e) => {
    // e.preventDefault();
    // e.stopPropagation();

    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = "transparent";
      canvas.renderAll();
    }
  };

  return (
    <div className="canvas-container">
      <div className="canvas-wrapper">
        <canvas ref={canvasRef} />
      </div>
      <div className="controls">
        <button onClick={() => setDrawingMode(!drawingMode)}>
          {drawingMode ? "선택모드" : "그리기 모드"}
        </button>
        <button onClick={() => clearCanvas()}>다시 그리기</button>
        <button onClick={() => saveCanvasAsImage()}>다운받기</button>
        <div className="color-size-controls" style={{ marginTop: "10px" }}>
          <label style={{ marginRight: "10px" }}>
            색:
            <input
              type="color"
              value={drawingColor}
              onChange={(e) => setDrawingColor(e.target.value)}
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
