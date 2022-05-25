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

const PersonLogo = ({ person, startTransition, transitioning }) => {
  return transitioning ? (
    <div className="person-logo">
      <div className="logo-img-container">
        <img src={person.photo} alt="" />
      </div>
      {person.firstName}
    </div>
  ) : (
    /* eslint-disable */
    <div className="person-logo" onClick={() => startTransition(person.partnerOf ? person.partnerOf : person.id)}>
      <div className="logo-img-container">
        <img src={person.photo} alt="" />
      </div>
      {person.firstName}
    </div>
  );
};

const PersonContainer = ({ person, startTransition, transitioning }) => {
  return (
    <div className="current-person-container">
      <div className="direct-descendant">
        <div className="img-container">
          <img src={person.photo} alt="" />
        </div>
        {person.firstName}
      </div>
      {person.partner && (
        <div className="current-person-partner">
          <div className="img-container">
            <img src={person.partner.photo} alt="" />
          </div>
          {person.partner.firstName}
        </div>
      )}
    </div>
  );
};

const Home = (): React.ReactNode => {
  const [allPeople, setAllPeople] = useState<any>({});
  const [familyMatrix, setFamilyMatrix] = useState<Array<Array<any>>>([]);
  const [familyLoaded, setFamilyLoaded] = useState(false);
  const [totalGenerations, setTotalGenerations] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPerson, setModalPerson] = useState<any>(null);

  const [transitioning, setTransitioning] = useState(false);
  const [transitionTriggered, setTransitionTriggered] = useState(0);
  const [currentContainer, setCurrentContainer] = useState<boolean>(false);

  const [currentPerson, setCurrentPerson] = useState<any>(null);
  const [nextPerson, setNextPerson] = useState<any>(null);

  const [currentParent, setCurrentParent] = useState<any>(null);
  const [nextParent, setNextParent] = useState<any>(null);

  const [currentSiblings, setCurrentSiblings] = useState<any>(null);
  const [nextSiblings, setNextSiblings] = useState<any>(null);

  const [currentChildren, setCurrentChildren] = useState<any>(null);
  const [nextChildren, setNextChildren] = useState<any>(null);

  const activateModal = (person: any) => {
    setModalPerson(person);
    setModalVisible(true);
  };

  const startTransition = (personId: string) => {
    setTransitioning(true);
    setTransitionTriggered(transitionTriggered + 1);
    const nextPerson = allPeople[personId];
    setNextPerson(nextPerson);
    setNextParent(allPeople[nextPerson.parentId]);
    const nextChildren = [];
    if (nextPerson.partner && nextPerson.partner.children.length > 0) {
      for (const childId of nextPerson.partner.children) {
        nextChildren.push(allPeople[childId]);
      }
    }
    setNextChildren(nextChildren);
    const nextSiblings = [];
    if (nextPerson.parentId && allPeople[nextPerson.parentId].partner.children.length > 1) {
      for (const siblingId of allPeople[nextPerson.parentId].partner.children) {
        if (siblingId !== nextPerson.id) {
          nextSiblings.push(allPeople[siblingId]);
        }
      }
    }
    setNextSiblings(nextSiblings);
  };

  useEffect(() => {
    fetchCompleteCollection('people', setFamilyMatrix, setAllPeople, setTotalGenerations);
  }, []);

  useEffect(() => {
    if (allPeople && allPeople['prithvi.tatia']) {
      setFamilyLoaded(true);
      startTransition('prithvi.tatia');
    }
  }, [allPeople]);

  useEffect(() => {
    if (transitionTriggered == 1) {
      const timer = setTimeout(() => {
        setTransitioning(false);
        setTransitionTriggered(0);
        setCurrentContainer(!currentContainer);
        setCurrentParent(nextParent);
        setCurrentPerson(nextPerson);
        setCurrentChildren(nextChildren);
        setCurrentSiblings(nextSiblings);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [transitionTriggered]);

  return familyLoaded ? (
    <div id="family-guide-container">
      <div className="parents-wrapper">
        <div id="par-con-0" className={`parents-container ${transitioning ? `transitioning ${currentContainer ? 'in' : 'out'}` : `${!currentContainer ? 'show' : 'hide'}`}`}>
          {currentContainer && nextParent ? (
            <>
              <PersonLogo person={nextParent} startTransition={startTransition} transitioning={transitioning} />
              <PersonLogo person={nextParent.partner} startTransition={startTransition} transitioning={transitioning} />
            </>
          ) : (
            currentParent && (
              <>
                <PersonLogo person={currentParent} startTransition={startTransition} transitioning={transitioning} />
                <PersonLogo person={currentParent.partner} startTransition={startTransition} transitioning={transitioning} />
              </>
            )
          )}
        </div>
        <div id="par-con-1" className={`parents-container ${transitioning ? `transitioning ${!currentContainer ? 'in' : 'out'}` : `${currentContainer ? 'show' : 'hide'}`}`}>
          {!currentContainer && nextParent ? (
            <>
              <PersonLogo person={nextParent} startTransition={startTransition} transitioning={transitioning} />
              <PersonLogo person={nextParent.partner} startTransition={startTransition} transitioning={transitioning} />
            </>
          ) : (
            currentParent && (
              <>
                <PersonLogo person={currentParent} startTransition={startTransition} transitioning={transitioning} />
                <PersonLogo person={currentParent.partner} startTransition={startTransition} transitioning={transitioning} />
              </>
            )
          )}
        </div>
      </div>
      <div className="generation-wrapper">
        <div className="person-wrapper">
          <div id="per-con-0" className={`person-container ${transitioning ? `transitioning ${currentContainer ? 'in' : 'out'}` : `${!currentContainer ? 'show' : 'hide'}`}`}>
            {currentContainer && nextPerson ? (
              <>
                <PersonContainer person={nextPerson} startTransition={startTransition} transitioning={transitioning} />
              </>
            ) : (
              currentPerson && (
                <>
                  <PersonContainer person={currentPerson} startTransition={startTransition} transitioning={transitioning} />
                </>
              )
            )}
          </div>
          <div id="per-con-1" className={`person-container ${transitioning ? `transitioning ${!currentContainer ? 'in' : 'out'}` : `${currentContainer ? 'show' : 'hide'}`}`}>
            {!currentContainer && nextParent ? (
              <>
                <PersonContainer person={nextPerson} startTransition={startTransition} transitioning={transitioning} />
              </>
            ) : (
              currentPerson && (
                <>
                  <PersonContainer person={currentPerson} startTransition={startTransition} transitioning={transitioning} />
                </>
              )
            )}
          </div>
        </div>
        <div className="siblings-wrapper">
          <div id="sib-con-0" className={`siblings-container ${transitioning ? `transitioning ${currentContainer ? 'in' : 'out'}` : `${!currentContainer ? 'show' : 'hide'}`}`}>
            {currentContainer && nextSiblings ? (
              <>
                {nextSiblings.map((sib: any, i: number) => (
                  <PersonLogo key={i} person={sib} startTransition={startTransition} transitioning={transitioning} />
                ))}
              </>
            ) : (
              currentSiblings && (
                <>
                  {currentSiblings.map((sib: any, i: number) => (
                    <PersonLogo key={i} person={sib} startTransition={startTransition} transitioning={transitioning} />
                  ))}
                </>
              )
            )}
          </div>
          <div id="sib-con-1" className={`siblings-container ${transitioning ? `transitioning ${!currentContainer ? 'in' : 'out'}` : `${currentContainer ? 'show' : 'hide'}`}`}>
            {!currentContainer && nextChildren ? (
              <>
                {nextSiblings.map((sib: any, i: number) => (
                  <PersonLogo key={i} person={sib} startTransition={startTransition} transitioning={transitioning} />
                ))}
              </>
            ) : (
              currentSiblings && (
                <>
                  {currentSiblings.map((sib: any, i: number) => (
                    <PersonLogo key={i} person={sib} startTransition={startTransition} transitioning={transitioning} />
                  ))}
                </>
              )
            )}
          </div>
        </div>
      </div>
      <div className="children-wrapper">
        <div id="chi-con-0" className={`children-container ${transitioning ? `transitioning ${currentContainer ? 'in' : 'out'}` : `${!currentContainer ? 'show' : 'hide'}`}`}>
          {currentContainer && nextChildren ? (
            <>
              {nextChildren.map((child: any, i: number) => (
                <PersonLogo key={i} person={child} startTransition={startTransition} transitioning={transitioning} />
              ))}
            </>
          ) : (
            currentChildren && (
              <>
                {currentChildren.map((child: any, i: number) => (
                  <PersonLogo key={i} person={child} startTransition={startTransition} transitioning={transitioning} />
                ))}
              </>
            )
          )}
        </div>
        <div id="chi-con-1" className={`children-container ${transitioning ? `transitioning ${!currentContainer ? 'in' : 'out'}` : `${currentContainer ? 'show' : 'hide'}`}`}>
          {!currentContainer && nextChildren ? (
            <>
              {nextChildren.map((child: any, i: number) => (
                <PersonLogo key={i} person={child} startTransition={startTransition} transitioning={transitioning} />
              ))}
            </>
          ) : (
            currentChildren && (
              <>
                {currentChildren.map((child: any, i: number) => (
                  <PersonLogo key={i} person={child} startTransition={startTransition} transitioning={transitioning} />
                ))}
              </>
            )
          )}
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
