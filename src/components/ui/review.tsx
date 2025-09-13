import type { User } from '@supabase/supabase-js';
import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getDisplayName, viewDate } from '@/utilities';
import { Rating } from 'react-simple-star-rating';
import type { ReviewType } from '@/types/types';
import { Button } from './button';
import { Separator } from './separator';
interface IReviewProps {
  review: ReviewType
}

const Review: React.FunctionComponent<IReviewProps> = ({review}) => {
  const createdAtDate = new Date(review.createdAt);
  return (
    <div className='space-y-2'>

      <div className='space-y-1'>
        {/* Avatar and name */}
        <div className='flex gap-2 items-center'>
          <Avatar>
            <AvatarImage src={review.profiles.avatarUrl ?? ""} />
            <AvatarFallback>N</AvatarFallback>
          </Avatar>
          <h1 className=' text-sm'>{review.profiles.fullName}</h1>
        </div>

        {/* Rating and Tags */}
        <div className='flex gap-2 items-center'>
          <Rating
              readonly
              initialValue={review.starCount ?? 0}
              size={20}
              SVGstyle={{ display: 'inline-block' }}
              allowFraction 
              className=''
          />
          <p className='font-semibold text-sm'>{review.tags && review.tags.join(', ')}</p>
        </div>

        {/* Date */}
        <p className='text-muted text-xs'>Reviewed in {viewDate(createdAtDate, ", ").date}</p>
        
        {/* Verified */}
        <p className='text-primary text-xs font-semibold'>Verified Purchase</p>

        {/* Review */}
        <p>{review.reviewDescription}</p>

        <p className='text-muted text-xs'>{review.helpfulCount ?? 0} people found this helpful</p>
      </div>
      
      <div className='flex items-center space-x-2'>

        <Button className='border-1 border-primary p-1 px-2 rounded-md'>
          Helpful
        </Button>

        {/* Separator */}
        <div className='bg-border h-5 w-px'/>

        <Button variant={'link'} className='text-heading'>
          report
        </Button>
      </div>
    </div>
  );
};

export default Review;
