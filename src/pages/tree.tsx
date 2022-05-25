import React, { useEffect, useState } from 'react';
import Person, { capitalize } from '../components/Person';

const fetchCompleteCollection = async (collection: string, setFamilyMatrix, setAllPeople, setTotalGenerations) => {
  const collectionResponse = await fetch(`/api/${collection}`);
  const collectionData = await collectionResponse.json();
  if (collectionData && collectionData.success) {
    setFamilyMatrix(collectionData.familyMatrix);
    setAllPeople(collectionData.allPeople);
    setTotalGenerations(collectionData.totalGenerations);
  } else console.log('Could not fetch collection', collection);
};

const Home = (): React.ReactNode => {
  const [allPeople, setAllPeople] = useState<any>({});
  const [familyMatrix, setFamilyMatrix] = useState<Array<Array<any>>>([]);
  const [familyLoaded, setFamilyLoaded] = useState(false);
  const [totalGenerations, setTotalGenerations] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPerson, setModalPerson] = useState<any>({});

  const activateModal = (person: any) => {
    setModalPerson(person);
    setModalVisible(true);
  };

  useEffect(() => {
    fetchCompleteCollection('people', setFamilyMatrix, setAllPeople, setTotalGenerations);
  }, []);

  useEffect(() => {
    if (totalGenerations && totalGenerations > 0) {
      setFamilyLoaded(true);
    }
  }, [totalGenerations]);

  return familyLoaded ? (
    <div id="family-tree-container">
      {familyMatrix.map((generation, i) => {
        return (
          <div key={i} id={`generation-${i}`} className="generation">
            {generation.map((person, j) => (
              <Person key={j} person={person} familyMatrix={familyMatrix} activateModal={activateModal} i={i} j={j} />
            ))}
          </div>
        );
      })}
      <div id="modal" className={modalVisible ? 'visible' : 'hidden'}>
        <button className="close" onClick={() => setModalVisible(false)}>
          <img src="/icons/x.svg" alt="" />
        </button>
        <div className="photo-container">
          <img className="photo" src={modalPerson.photo} alt={modalPerson.firstName} />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#fff"
              fillOpacity="1"
              d="M0,32L60,64C120,96,240,160,360,176C480,192,600,160,720,138.7C840,117,960,107,1080,106.7C1200,107,1320,117,1380,122.7L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            />
          </svg>
        </div>
        <div className="info-container">
          <div className="name">
            {capitalize(modalPerson.firstName)} {capitalize(modalPerson.lastName)}
          </div>
          <div className="info">
            <img className="icon" src="/icons/gift.svg" alt="" />
            {modalPerson.dob}
          </div>
          {modalPerson.dod && modalPerson.dod.length > 0 && (
            <div className="info">
              <img width={24} height={24} className="icon" src="/icons/pray.png" alt="" />
              {modalPerson.dod}
            </div>
          )}
          <div className="info">
            <img className="icon" src="/icons/smile.svg" alt="" />
            {capitalize(modalPerson.nickname)}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <img src="/loading.svg" alt="loading" />
    </div>
  );
};

export default Home;
