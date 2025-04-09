import React from 'react';
import PropertyCardList from './PropertyTable';
import PropertyTableView from './PropertyTableView';

const PropertyViewSwitcher = ({
  properties = [],
  viewMode = 'card',
  navigate,
  currentUser,
  setSelectedPropertyForEmail,
  setSelectedAgent,
  setSelectedPropertyForNotes,
  updateDecisionStatus,
  restoreProperty,
  deleteProperty,
  handleShareProperty,
  handleShareToCommunity,
  handleUnshareFromCommunity,
  handlePursueCommunityProperty,
  handleSaveToMyList,
  deleteSavedProperty,
  loading,
  isPublic
}) => {
  const hasProperties = properties && properties.length > 0;

  if (!loading && !hasProperties) {
    return <p className="text-center text-gray-500 py-6">No properties found.</p>;
  }

  return viewMode === 'card' ? (
    <PropertyCardList
      properties={properties}
      navigate={navigate}
      currentUser={currentUser}
      setSelectedPropertyForEmail={setSelectedPropertyForEmail}
      setSelectedAgent={setSelectedAgent}
      setSelectedPropertyForNotes={setSelectedPropertyForNotes}
      updateDecisionStatus={updateDecisionStatus}
      restoreProperty={restoreProperty}
      deleteProperty={deleteProperty}
      handleShareProperty={handleShareProperty}
      handleShareToCommunity={handleShareToCommunity}
      handleUnshareFromCommunity={handleUnshareFromCommunity}
      handlePursueCommunityProperty={handlePursueCommunityProperty}
      handleSaveToMyList={handleSaveToMyList}
      deleteSavedProperty={deleteSavedProperty}
      isPublic={isPublic}
    />
  ) : (
    <PropertyTableView
      properties={properties}
      navigate={navigate}
      currentUser={currentUser}
      updateDecisionStatus={updateDecisionStatus}
    />
  );
};

export default PropertyViewSwitcher;
