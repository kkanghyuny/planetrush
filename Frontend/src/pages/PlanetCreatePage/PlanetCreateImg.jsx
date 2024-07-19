import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Canvas from "../../components/Canvas/Canvas";

function PlanetCreateImg() {
  ///// 라우팅 함수
  const navigate = useNavigate();

  const getNewPlanetnfo = () => {
    navigate("/create-foam");
  };

  // useEffect(() => {
  //   const loadFabric = async () => {
  //     const { fabric } = await import("fabric");
  //     const fabricCanvas = new fabric.Canvas(canvasRef.current, {
  //       isDrawingMode: true,
  //     });
  //     fabricCanvas.freeDrawingBrush.color = color;
  //     fabricCanvas.on("path:created", () => {
  //       const newHistory = [
  //         ...history.slice(0, historyIndex),
  //         fabricCanvas.toJSON(),
  //       ];
  //       setHistory(newHistory);
  //       setHistoryIndex(newHistory.length);
  //     });
  //     setCanvas(fabricCanvas);
  //   };
  //   loadFabric();

  //   return () => {
  //     if (canvas) {
  //       canvas.dispose();
  //     }
  //   };
  // }, []);

  // ///// 그림판 함수
  // const canvasRef = useRef(null);
  // const [canvas, setCanvas] = useState(null);

  // useEffect(() => {
  //   const newCanvas = new fabric.Canvas(canvasRef.current, {
  //     width: 400,
  //     height: 600,
  //   });
  //   setCanvas(newCanvas);
  //   // 언마운트 시 캔버스 정리
  //   return () => {
  //     newCanvas.dispose();
  //   };
  // }, []);

  // //펜 기능
  // const [activeTool, setActiveTool] = useState("select");

  // useEffect(() => {
  //   if (!canvasRef.current || !canvas) return;

  //   switch (activeTool) {
  //     case "pen":
  //       handlePenTool();
  //       break;
  //   }
  // }, [activeTool]);

  // const handlePenTool = () => {
  //   canvas.freeDrawingBrush.width = 10; //두께
  //   canvas.freeDrawingBrush.color = "blue"; // 그리기 선의 색상 설정
  //   canvas.isDrawingMode = true; //그리기모드활성화
  // };

  return (
    <div>
      <div>뒤로가기버튼</div>
      <h3>행성을 생성해주세요</h3>
      <button>메인페이지 생성하기</button>
      <Canvas />
      {/* <canvas
        ref={canvasRef}
        width="400"
        height="800"
        style={{ border: "1px solid #000" }}
      />
      <button
        style={{ width: "48px", height: "48px", border: "1px solid black" }}
        onClick={() => setActiveTool("pen")}
        disabled={activeTool === "pen"}
      >
        펜
      </button> */}
    </div>
  );
}

export default PlanetCreateImg;
