import React, { useState } from 'react';

/**
 * Person component
 */
export const capitalize = (s: string) => {
  return s ? s[0].toUpperCase() + s.slice(1) : 'BUG';
};

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
        links.push(<div key={j} className="sibling-link" style={{ width: `${110 + (j - loc - 1) * 200}px` }}></div>);
      }
    }
  }
  return links;
};

interface PersonProps {
  person: any;
  familyMatrix: Array<Array<any>>;
  activateModal: any;
  i: number;
  j: number;
}
export const Person: React.FC<PersonProps> = (props) => {
  const { person, familyMatrix, activateModal, i, j } = props;
  const siblingLinks = getSiblingLinks(person, familyMatrix, i + 1, j);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const playVideo = (i, j) => {
    setVideoPlaying(true);
    const video: HTMLVideoElement = document.getElementById(`video-${i}-${j}`) as HTMLVideoElement;
    if (video) {
      video.play();
    }
  };

  const stopVideo = (i, j) => {
    const video: HTMLVideoElement = document.getElementById(`video-${i}-${j}`) as HTMLVideoElement;
    if (video) {
      video.currentTime = 0;
      video.pause();
    }
    setVideoPlaying(false);
  };

  return person ? (
    /* eslint-disable */
    <div role="figure" onClick={() => activateModal(person)} id={`person-${i}-${j}`} className={`person ${person.gender}`}>
      {isDirectDescendant(person) && <div className="direct-descendent"></div>}
      {person.partner && <div className="married-link"></div>}
      {person.partner && person.partner.children.length > 0 && <div className="generation-link"></div>}
      {person.partner && person.partner.children.length > 0 && <div className="child-link"></div>}
      {siblingLinks}
      <img src={person.photo} alt={person.firstName} />
      {person.video && person.video.length > 0 && (
        <video onMouseEnter={() => playVideo(i, j)} onMouseLeave={() => stopVideo(i, j)} id={`video-${i}-${j}`} loop preload="none" style={{ opacity: videoPlaying ? 1 : 0 }}>
          <source src={person.video} type="video/mp4" />
        </video>
      )}
      <div className="info-container">
        {capitalize(person.firstName)} {capitalize(person.lastName)}
      </div>
    </div>
  ) : (
    <div id={`person-${i}-${j}`} className="person empty"></div>
  );
};

export default Person;
