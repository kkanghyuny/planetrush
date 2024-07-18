function PlanetCreatFoam() {
  return (
    <>
      <div>
        <label>행성 이름</label>
        <input type="text" placeholder="10자 이내로 작성해주세요" />
      </div>
      <div>
        <label>도전할 챌린지</label>
        <input type="text" placeholder="20자 이내로 작성해주세요" />
      </div>
      <div>
        <label>챌린지 유형</label>
        <input type="dropbox" />
      </div>
      <div>
        <label>기간</label>
        <input type="Date" /> 부터
        <input type="Date" /> 까지
      </div>
      <div>
        <label>인원 수</label>
        <button>-</button>
        <input
          type="number"
          id="peopleCount"
          value="5"
          min="2"
          max="10"
          readonly
        />
        <button>+</button>
      </div>
      <div>
        <label>미션 조건</label>
        <input type="text" />
      </div>
      <div>인증 사진 업로드</div>
    </>
  );
}

export default PlanetCreatFoam;
