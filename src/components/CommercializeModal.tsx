import React from 'react';
import { CommercializationModal } from './CommercializationModal';
import { useAuth } from '../context/AuthContext';
import { useCustomization } from '../context/CustomizationContext';

export const CommercializeModal: React.FC = () => {
  const { isCommercializeModalOpen, setIsCommercializeModalOpen } = useAuth();
  const { setIsBriefingModalOpen } = useCustomization();

  return (
    <CommercializationModal
      isOpen={isCommercializeModalOpen}
      onClose={() => setIsCommercializeModalOpen(false)}
      onOpenBriefing={() => setIsBriefingModalOpen(true)}
    />
  );
};
