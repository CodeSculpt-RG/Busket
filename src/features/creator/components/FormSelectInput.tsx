import React from 'react';
import AppSelect from '../../../shared/components/AppSelect';
import SectionLabel from './SectionLabel';

interface FormSelectInputProps {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
}

export default function FormSelectInput({ label, value, placeholder, onPress }: FormSelectInputProps) {
  return (
    <>
      <SectionLabel>{label}</SectionLabel>
      <AppSelect value={value} placeholder={placeholder} onPress={onPress} />
    </>
  );
}
