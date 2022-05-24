import React, { useEffect, useState } from 'react';
import Person from '../components/Person';

const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

const fetchCompleteCollection = async (collection: string, setFamilyMatrix, setAllPeople, setMaxGenerationSize, setTotalGenerations) => {
  const collectionResponse = await fetch(`/api/${collection}`);
  const collectionData = await collectionResponse.json();
  if (collectionData && collectionData.success) {
    setFamilyMatrix(collectionData.familyMatrix);
    setAllPeople(collectionData.allPeople);
    setMaxGenerationSize(collectionData.maxGenerationSize);
    setTotalGenerations(collectionData.totalGenerations);
  } else console.log('Could not fetch collection', collection);
};

const Home = (): React.ReactNode => {
  const [allPeople, setAllPeople] = useState<any>({});
  const [familyMatrix, setFamilyMatrix] = useState<Array<Array<any>>>([]);
  const [familyLoaded, setFamilyLoaded] = useState(false);
  const [maxGenerationSize, setMaxGenerationSize] = useState(0);
  const [totalGenerations, setTotalGenerations] = useState(0);

  useEffect(() => {
    fetchCompleteCollection('people', setFamilyMatrix, setAllPeople, setMaxGenerationSize, setTotalGenerations);
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
              <Person key={j} person={person} familyMatrix={familyMatrix} allPeople={allPeople} i={i} j={j} />
            ))}
          </div>
        );
      })}
    </div>
  ) : (
    <div>
      <img src="/loading.svg" alt="loading" />
    </div>
  );
};

export default Home;
