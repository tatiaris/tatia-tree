import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { getAllObjects } from '../prisma';
import { family } from './db';

const collectionName = 'people';
const handler = nextConnect();

const getFamilyMatrix = (family: any) => {
  const familyMatrix: Array<Array<any>> = [];
  const generation = 0;
  const familyStack = [{ person: family['x.tatia'], generation: generation, parentEnd: 0, parentStart: 0 }];

  while (familyStack.length) {
    const { person, generation, parentEnd, parentStart } = familyStack.shift();
    if (person) {
      if (!familyMatrix[generation]) familyMatrix.push([]);
      while (familyMatrix[generation].length < parentStart) familyMatrix[generation].push(null);
      familyMatrix[generation].push(person);
      if (familyMatrix[generation].length > parentEnd) {
        let tempGen = generation;
        while (familyMatrix[tempGen - 1]) {
          familyMatrix[tempGen - 1].splice(parentEnd, 0, null);
          tempGen--;
        }
      }
      if (person.partner) {
        familyMatrix[generation].push(person.partner);
        if (person.partner.children) {
          person.partner.children.forEach((child, i) => {
            familyStack.splice(i, 0, { person: family[child], generation: generation + 1, parentEnd: familyMatrix[generation].length, parentStart: familyMatrix[generation].length - 2 });
          });
        }
      }
    }
  }
  return familyMatrix;
};

const getMaxGenerationSize = (familyMatrix) => {
  let maxGenerationSize = 0;
  familyMatrix.forEach((generation) => {
    if (generation.length > maxGenerationSize) {
      maxGenerationSize = generation.length;
    }
  });
  return maxGenerationSize;
};

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const allPeople = family;
    // const allPeople = await getAllObjects(collectionName);
    const familyMatrix = getFamilyMatrix(allPeople);
    const maxGenerationSize = getMaxGenerationSize(familyMatrix);
    const totalGenerations = familyMatrix.length;
    res.status(200).json({ success: true, familyMatrix, maxGenerationSize, totalGenerations });
  } catch (error) {
    const errorObj = error as Error;
    res.status(500).json({ success: false, message: errorObj.message, family: {} });
  }
});

export default handler;
