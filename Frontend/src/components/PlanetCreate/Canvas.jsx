import React, { useRef, useState, useEffect } from "react";

import * as fabric from "fabric";

import "../../styles/Canvas.css";

//createImg에서 saveImage를 props 받아옴
const Canvas = ({ onSaveImage, onCanvasStateChange }) => {
  //캔버스 컴포넌트 호출
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const initRef = useRef(false);

  //드로잉 모드
  const [drawingMode, setDrawingMode] = useState(true);
  const [drawingColor, setDrawingColor] = useState("#FFFFFF");
  const [pixelSize, setPixelSize] = useState(10);

  //실행취소 구현하기 위한 변수
  const [history, setHistory] = useState([]);

  //Pixel 브러쉬 커스텀
  class PixelBrush extends fabric.BaseBrush {
    constructor(canvas) {
      super(canvas);
      this.pixelSize = pixelSize;
      this.points = [];
      this.currentGroup = null;
    }

    onMouseDown(pointer) {
      this.points = [];
      this.addPoint(pointer);
      this.currentGroup = new fabric.Group([], {
        selectable: false,
        evented: false,
      });
    }

    onMouseMove(pointer) {
      this.addPoint(pointer);
    }

    onMouseUp() {
      this.convertToPixelArt();
      this.canvas.add(this.currentGroup);
      setHistory((prev) => [...prev, this.currentGroup]);
      updateCanvasImage();
    }

    //브러쉬 움직이는 포인트 추가
    addPoint(pointer) {
      const x = Math.floor(pointer.x / this.pixelSize) * this.pixelSize;
      const y = Math.floor(pointer.y / this.pixelSize) * this.pixelSize;
      this.points.push(new fabric.Point(x, y));
      this._render();
    }

    //픽셀로 모양을 바꾸는 메서드
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
        this.currentGroup.add(rect);
      });

      this.currentGroup.setCoords();
      this.canvas.renderAll();
    }

    //해당 그림을 렌더링하기
    _render() {
      const ctx = this.canvas.contextTop;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = this.color;

      this.points.forEach((point) => {
        ctx.fillRect(point.x, point.y, this.pixelSize, this.pixelSize);
      });
    }
  }

  //그리고 제일 처음에 canvas, pixelBrush 마운트해줘
  useEffect(() => {
    const initCanvas = () => {
      if (!initRef.current) {
        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
          isDrawingMode: drawingMode,
          backgroundColor: "transparent",
          width: 250,
          height: 250,
          stopContextMenu: true,
          fireRightClick: true,
          enablePointerEvents: true,
        });

        const pixelBrush = new PixelBrush(fabricCanvas);

        pixelBrush.color = drawingColor;
        pixelBrush.width = pixelSize;

        fabricCanvas.freeDrawingBrush = pixelBrush;
        setCanvas(fabricCanvas);
        initRef.current = true;
      }
    };

    initCanvas();

    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, []);

  //history가 변경될 때마다 캔버스 업데이트
  useEffect(() => {
    if (canvas) {
      canvas.clear();
      history.forEach((group) => {
        canvas.add(group);
      });

      canvas.renderAll();
      updateCanvasImage();
    }
  }, [history]);

  //drawingColor와 pixelSize가 변경될 때마다 브러시 업데이트
  useEffect(() => {
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = drawingColor;
      canvas.freeDrawingBrush.pixelSize = pixelSize;
    }
  }, [drawingColor, pixelSize, canvas]);

  //캔버스에 그림객체 업데이트 확인
  const updateCanvasImage = () => {
    if (canvas) {
      if (canvas.getObjects().length > 0) {
        const dataURL = canvas.toDataURL({
          format: "png",
          quality: 1,
        });

        const file = dataURLtoFile(dataURL, "custom-planet.png");
        onSaveImage(dataURL, file);
      }
    }
  };

  // 파일로 바꾸는 메서드
  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  //실행취소
  const handleUndoClick = () => {
    if (history.length > 0) {
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  //updateCanvasImage 확인하는 메서드
  useEffect(() => {
    if (canvas) {
      const handleCanvasChange = () => {
        const isEmpty = canvas.getObjects().length === 0;
        onCanvasStateChange(isEmpty);
      };

      canvas.on("object:added", handleCanvasChange);
      canvas.on("object:removed", handleCanvasChange);
      canvas.on("object:modified", handleCanvasChange);

      return () => {
        canvas.off("object:added", handleCanvasChange);
        canvas.off("object:removed", handleCanvasChange);
        canvas.off("object:modified", handleCanvasChange);
      };
    }
  }, [canvas, onCanvasStateChange]);

  //다시그리기
  const clearCanvas = () => {
    if (canvas) {
      setHistory([]);
    }
  };

  //그림 저장하기 (다운)
  const saveCanvasAsImage = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
      });

      //이미지 url 만들기
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
        <div className="button-box">
          <p onClick={() => clearCanvas()}>다시 그리기</p>
          <p onClick={() => handleUndoClick()}>실행 취소</p>
        </div>
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
              min="5"
              max="20"
              value={pixelSize}
              onChange={(e) => setPixelSize(parseInt(e.target.value, 10))}
            />
          </label>
        </div>
      </div>
      <p className="download" onClick={() => saveCanvasAsImage()}>
        다운받기
      </p>
    </div>
  );
};

export default Canvas;
