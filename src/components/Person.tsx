import React from 'react';

/**
 * Person component
 */
const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

const isDirectDescendant = (person) => {
  return person.parentId !== null;
};
const getSiblingLinks = (person, familyMatrix, gen, loc) => {
  const links = [];
  if (person && person.partner && person.partner.children.length > 1) {
    let f = 0;
    for (let j = 0; j < familyMatrix[gen].length; j++) {
      if (familyMatrix[gen][j] && familyMatrix[gen][j].parentId === person.id) {
        f++;
        links.push(<div className="sibling-link" style={{ width: `${110 + (j - loc - 1) * 200}px` }}></div>);
      }
    }
  }
  return links;
};

interface PersonProps {
  person: any;
  familyMatrix: Array<Array<any>>;
  allPeople: any;
  i: number;
  j: number;
}
export const Person: React.FC<PersonProps> = (props) => {
  const { person, familyMatrix, allPeople, i, j } = props;
  const siblingLinks = getSiblingLinks(person, familyMatrix, i + 1, j);
  return person ? (
    <div id={`person-${i}-${j}`} className={`person ${person.gender}`}>
      {isDirectDescendant(person) && <div className="direct-descendent"></div>}
      {person.partner && <div className="married-link"></div>}
      {person.partner && person.partner.children.length > 0 && <div className="generation-link"></div>}
      {person.partner && person.partner.children.length > 0 && <div className="child-link"></div>}
      {siblingLinks}
      <img src={person.photo} alt={person.firstName} />
      <div className="info-container">
        {capitalize(person.firstName)} {capitalize(person.lastName)}
      </div>
    </div>
  ) : (
    <div id={`person-${i}-${j}`} className="person empty"></div>
  );
};

export default Person;
