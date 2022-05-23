import React, { useEffect, useState } from 'react';

const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

const fetchCompleteCollection = async (collection: string, setFamilyMatrix, setMaxGenerationSize, setTotalGenerations) => {
  const collectionResponse = await fetch(`/api/${collection}`);
  const collectionData = await collectionResponse.json();
  if (collectionData && collectionData.success) {
    setFamilyMatrix(collectionData.familyMatrix);
    setMaxGenerationSize(collectionData.maxGenerationSize);
    setTotalGenerations(collectionData.totalGenerations);
  }
  else console.log('Could not fetch collection', collection);
};

const Home = (): React.ReactNode => {
  const [familyMatrix, setFamilyMatrix] = useState<Array<Array<any>>>([]);
  const [familyLoaded, setFamilyLoaded] = useState(false);
  const [maxGenerationSize, setMaxGenerationSize] = useState(0);
  const [totalGenerations, setTotalGenerations] = useState(0);

  useEffect(() => {
    fetchCompleteCollection('people', setFamilyMatrix, setMaxGenerationSize, setTotalGenerations);
  }, []);

  useEffect(() => {
    if (totalGenerations && totalGenerations > 0) {
      setFamilyLoaded(true);
    }
  }, [totalGenerations]);

  return (familyLoaded) ? (
    <div id="family-tree-container">
      {familyMatrix.map((generation, i) => {
        return (
          <div key={i} id={`generation-${i}`} className='generation'>
            {generation.map((person, j) => {
              return (person) ? (
                <div key={j} id={`person-${i}-${j}`} className={`person ${person.gender}`}>
                  <img src={person.photo} alt={person.firstName} />
                  <div className='info-container'>
                    {capitalize(person.firstName)} {capitalize(person.lastName)}
                  </div>
                </div>
              ) : (
                <div key={j} id={`person-${i}-${j}`} className='person empty'></div>
              )
            })}
          </div>
        )
      })}
    </div>
  ) : (
    <div>
      <img src="/loading.svg" alt="loading" />
    </div>
  );
};

export default Home;
