function PlanetDetailRecruiting() {
  //임의 데이터
  const planet = {
    name: "뿌꾸뿌꾸",
    content: "1일 1요가하기",
    categoryName: "BEAUTY",
    startDate: "2024-07-18",
    endDate: "2024-07-25",
    maxParticipants: 10,
    authCond: "요가 매트가 보이게 손가락을 브이해서 찍어주세요",
    isBasic: true,
    defaultPlanetImg: 2,
  };

  return (
    <>
      <div>
        <div>{planet.categoryName}</div>
        <div>{`${planet.startDate} ~ ${planet.endDate}`}</div>
      </div>
      <div>{planet.content}</div>
      <div>{planet.maxParticipants}</div>
      <img alt="행성사진" />
      <div>
        <button> ← </button>
        <div>{planet.name}</div>
        <button> → </button>
      </div>
      <div>
        <button>가입하기</button>
        <div>공유버튼</div>
      </div>
    </>
  );
}

export default PlanetDetailRecruiting;
