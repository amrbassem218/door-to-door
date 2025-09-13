import * as React from 'react';
import { FaAngleRight } from 'react-icons/fa';

interface IMenuItemProps {
  name: string;
  route?: () => void;
}

const MenuItem: React.FunctionComponent<IMenuItemProps> = ({name, route}) => {
  return (
    <div className='flex gap-1 items-center justify-between ' onClick={route}>
        <h1 className='text-lg sm:text-xl font-normal'>{name}</h1>
        <div className='flex gap-1 text-sm items-center'>
            <p>View all </p>
            <FaAngleRight className='text-muted ' size={12}/>
        </div>
    </div>
  );
};

export default MenuItem;
