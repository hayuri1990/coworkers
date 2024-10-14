'use client';
import React from 'react';
import Image from 'next/image';
import UncheckedImage from '@/assets/icons/uncheckedbox.svg';
import CheckedImage from '@/assets/icons/checkedbox.svg';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const Checkbox = ({ checked, onChange }: CheckboxProps) => {
  const handleChange = () => {
    onChange?.(!checked);
  };
  return (
    <div
      className="flex w-6 items-center justify-center"
      onClick={handleChange}
    >
      <label htmlFor="checkbox" className="cursor-pointer">
        <Image
          src={checked ? CheckedImage : UncheckedImage}
          alt="checkbox"
          height={18}
          width={18}
        />
      </label>
    </div>
  );
};

export default Checkbox;
