import * as React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FaCaretDown } from 'react-icons/fa';
import { measurements } from '@/utilities';
import type { Product } from '@/types/types';

interface IMeasurementChangeProps {
  product?: Product;
  label: string;
  handleMeasurementChange: (mes: string, product?: Product, ) => void;
  styles?: string;
}

const MeasurementChange: React.FunctionComponent<IMeasurementChangeProps> = ({product, label, handleMeasurementChange, styles}) => {
  return (
      <div>
          <DropdownMenu>
              <DropdownMenuTrigger className='m-auto'>
                  <button className={`text-xs flex items-center justify-between h-4 p-2  text-text decoration-0 bg-background-secondary rounded-lg border-gray-300 border-1 ${styles}`}>
                      {label}
                      <FaCaretDown className='text-text'/>
                  </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                  <DropdownMenuLabel>Measurement</DropdownMenuLabel>
                  {
                      measurements.map((mes) => (
                          <DropdownMenuItem onClick={() => handleMeasurementChange(mes, product)}>{mes}</DropdownMenuItem>
                      ))
                  }
              </DropdownMenuContent>
          </DropdownMenu>
      </div>
  );
};

export default MeasurementChange;
