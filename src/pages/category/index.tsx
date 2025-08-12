import * as React from 'react';
import { useParams } from 'react-router-dom';

interface ICategoryProps {
}

const Category: React.FunctionComponent<ICategoryProps> = (props) => {
  const {category} = useParams(); 
  return (
    <div>
      hi {category}
    </div>
  );
};

export default Category;
