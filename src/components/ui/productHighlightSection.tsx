import * as React from 'react';
import { useState } from 'react';
interface IProductHighLightProps {
  text: string;
  styles?: string;
}

const ProductHighLight: React.FunctionComponent<IProductHighLightProps> = ({text, styles}) => {
  const [expanded, setExpanded] = useState(false); 
  return (
    <div className='w-full max-w-md'>
      <div className="relative ">
        {/* Text container */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            expanded ? "max-h-none" : "max-h-24 overflow-hidden"
          }`}
        >
          <p className="text-gray-800 leading-relaxed">{text}</p>
        </div>

        {/* Blur overlay when collapsed */}
        {!expanded && (
          <div className="absolute bottom-0 left-0 w-full h-6 
                          bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        )}

      </div>
      <div className='w-full flex justify-center'>
  
        {/* Toggle button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className=" mt-2 text-primary text-sm font-medium hover:underline z-10"
        >
          {expanded ? "See Less" : "See More"}
        </button>
      </div>

    </div>
  );
};

export default ProductHighLight;
