import React from 'react';
import './ExploreContainer.css';
import Identicon from 'react-identicons';

const ProfileIdenticon = ({ size, address }) => {
  return (
    <Identicon size={size} string={address} />
  );
};

export default ProfileIdenticon;
