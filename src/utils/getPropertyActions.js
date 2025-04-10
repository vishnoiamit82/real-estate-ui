import {
  Eye,
  Mail,
  Share2,
  Edit2,
  Trash,
  RotateCcw,
  Globe,
  Star,
  NotebookText,
} from 'lucide-react';

import UnreadEmailBadge from '../components/UnreadEmailBadge'; // ✅ Import this at the top


export const getPropertyActions = ({
  property,
  source, // 'created', 'saved', or undefined (for community)
  handlers,
}) => {
  const {
    navigate,
    setSelectedPropertyForEmail,
    setSelectedAgent,
    setSelectedPropertyForNotes,
    updateDecisionStatus,
    deleteProperty,
    restoreProperty,
    handleShareProperty,
    handleShareToCommunity,
    handleUnshareFromCommunity,
    handleSaveToMyList,
    handlePursueCommunityProperty,
    deleteSavedProperty,
    currentUser
  } = handlers;

  const actions = [];


  console.log("currentUser in get Property Action", currentUser)



  // === CREATED PROPERTIES ===


  if (source === 'created') {

    actions.push({
      label: 'Notes',
      icon: NotebookText,
      type: 'secondary',
      onClick: () => setSelectedPropertyForNotes(property),
    });

    actions.push({
      label: 'View/Edit',
      icon: Edit2,
      type: 'primary',
      onClick: () => navigate(`/edit-property/${property._id}`),
    });

    actions.push({
      label: (
        <span className="flex items-center gap-2">
          Email Agent
          <UnreadEmailBadge count={handlers.unreadCounts?.[property._id] || 0} />
        </span>
      ),
      icon: Mail,
      type: 'primary',
      onClick: () => {
        setSelectedPropertyForEmail(property);
        setSelectedAgent(property.agentId);
      },
    });



    if (property.isCommunityShared) {
      actions.push({
        label: 'Unshare from Community',
        icon: Globe,
        type: 'secondary',
        onClick: () => handleUnshareFromCommunity(property._id),
      });
    } else {
      actions.push({
        label: 'Share to Community',
        icon: Globe,
        type: 'secondary',
        onClick: () => handleShareToCommunity(property._id),
      });
    }

    if (property.is_deleted) {
      actions.push({
        label: 'Restore',
        icon: RotateCcw,
        type: 'secondary',
        onClick: () => restoreProperty(property._id),
      });
    } else {
      actions.push({
        label: 'Delete',
        icon: Trash,
        type: 'secondary',
        onClick: () => deleteProperty(property._id),
      });
    }
  }

  // === COMMON PRIMARY ACTIONS ===



  // === ACTIONS FOR CREATED or SAVED PROPERTIES ===
  if (source === 'created' || source === 'saved') {
    actions.push({
      label: 'Pursue',
      icon: Star,
      type: 'primary',
      onClick: () =>
        source === 'saved'
          ? handlePursueCommunityProperty(property)
          : updateDecisionStatus(property, 'pursue'),
    });

    actions.push({
      label: 'On Hold',
      icon: Globe,
      type: 'primary',
      onClick: () => updateDecisionStatus(property, 'on_hold'),
    });
  }

  // === COPY LINK for all ===
  actions.push({
    label: 'Copy Link',
    icon: Share2,
    type: 'secondary',
    onClick: () => handleShareProperty(property._id),
  });

  // === COMMUNITY PAGE ONLY (Not saved or created) ===
  // if (!source && property.isCommunityShared && property.sharedBy?._id !== currentUser?.id ) {
    if (property.isCommunityShared && source !== 'created') {
      const isOwner = currentUser && property.createdBy === currentUser._id;
    
      if (isOwner) {
        actions.push({
          label: 'View/Edit',
          icon: Edit2,
          type: 'primary',
          onClick: () => navigate(`/edit-property/${property._id}`),
        });
      } else if (property.shareToken) {
        actions.push({
          label: 'View',
          icon: Eye,
          type: 'primary',
          onClick: () => window.open(`/shared/${property.shareToken}`, '_blank'),
        });
      }
    
      // Optionally: other community-only actions (e.g. message poster) can go here
    

    // actions.push({
    //   label: 'Message Poster',
    //   icon: Mail,
    //   type: 'primary',
    //   onClick: () => {
    //     setSelectedPropertyForEmail(property);
    //     setSelectedAgent({
    //       name: property.sharedBy?.name,
    //       email: property.sharedBy?.email,
    //     });
    //   },
    // });
  }

  // === SAVED PROPERTIES ===
  if (source === 'saved') {

    actions.push({
      label: 'Remove from My List',
      icon: Trash,
      type: 'secondary',
      onClick: () => deleteSavedProperty(property.savedId), // 👈 new handler
    });

    actions.push({
      label: 'Message Poster',
      icon: Mail,
      type: 'primary',
      onClick: () => {
        setSelectedPropertyForEmail(property);
        setSelectedAgent({
          name: property.sharedBy?.name,
          email: property.sharedBy?.email,
        });
      },
    });
  }


  return actions;
};
