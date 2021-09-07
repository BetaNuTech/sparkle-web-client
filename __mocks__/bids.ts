import bidModel from '../common/models/bid';

export const openBid: bidModel = {
  id: 'bid-1',
  attachments: [
    {
      id: 'attach-1',
      createdAt: 1630089989,
      name: 'property-garden.jpg',
      type: 'image/jpeg',
      url: 'https://google.com/images/property-garden.jpg',
      storageRef: 'images/property-garden.jpg',
      size: 59384
    }
  ],
  completeAt: 1625013600,
  costMax: 4000,
  costMin: 3500,
  createdAt: 1622853600,
  job: 'job-1',
  startAt: 1623199200,
  state: 'open',
  updatedAt: 1623026400,
  vendor: 'Rob Playground',
  scope: 'local'
};

export const approvedBid: bidModel = {
  id: 'bid-2',
  attachments: [],
  completeAt: 1623738600,
  costMax: 4400,
  costMin: 3700,
  createdAt: 1623393000,
  job: 'job-1',
  startAt: 1623565800,
  state: 'approved',
  updatedAt: 1623479400,
  vendor: 'Rob Playground',
  scope: 'local'
};

export const rejectedBid: bidModel = {
  id: 'bid-3',
  attachments: [],
  completeAt: 1624170600,
  costMax: 4000,
  costMin: 3000,
  createdAt: 1623825000,
  job: 'job-1',
  startAt: 1623997800,
  state: 'rejected',
  updatedAt: 1623911400,
  vendor: 'Rob Playground',
  scope: 'local'
};

export const incompleteBid: bidModel = {
  id: 'bid-4',
  attachments: [],
  completeAt: 1624271400,
  costMax: 4500,
  costMin: 3300,
  createdAt: 1624084200,
  job: 'job-1',
  startAt: 1624181400,
  state: 'incomplete',
  updatedAt: 1624091400,
  vendor: 'Rob Playground',
  scope: 'local'
};

export const completeBid: bidModel = {
  id: 'bid-5',
  attachments: [],
  completeAt: 1624545000,
  costMax: 4800,
  costMin: 4200,
  createdAt: 1624534200,
  job: 'job-1',
  startAt: 1624289498,
  state: 'complete',
  updatedAt: 1624361400,
  vendor: 'Rob Playground',
  scope: 'local'
};

export default [openBid, approvedBid, rejectedBid, incompleteBid, completeBid];
