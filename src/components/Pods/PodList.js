import React from 'react';

import PodItem from './PodItem';

const PodList = ({ pods, onEditPod, onRemovePod }) => (
  <ul className='pod-list'>
    {pods.map(pod => (
      <PodItem
        key={pod.uid}
        pod={pod}
        onEditPod={onEditPod}
        onRemovePod={onRemovePod}
      />
    ))}
  </ul>
);

export default PodList;
