const prisma = require('../models/prismaClient');
const adjectives = ['Silent', 'Golden', 'Iron', 'Shadow'];
const nouns = ['Abhay', 'Gandhi', 'Phoenix', 'Raven', 'Tiger', 'Wolf', 'Hawk'];

const generateCodename = async () => {
  let codename;
  let isUnique = false;
  
  while (!isUnique) {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    codename = `The ${adj} ${noun}`;
    
    const existing = await prisma.gadget.findUnique({
      where: { name: codename }
    });
    
    if (!existing) isUnique = true;
  }
  
  return codename;
};

module.exports = { generateCodename };