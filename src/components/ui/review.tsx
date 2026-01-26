import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ReviewType } from "@/types/types";
import { viewDate } from "@/utilities";
import * as React from "react";
import { Rating } from "react-simple-star-rating";
import { Button } from "./button";
interface IReviewProps {
  review: ReviewType;
}

const Review: React.FunctionComponent<IReviewProps> = ({ review }) => {
  const createdAtDate = new Date(review.createdAt);
  return (
    <div className="space-y-2 px-2">
      <div className="space-y-1 flex items-start">
        {/* Avatar */}
        <div className="flex gap-2 items-center">
          <Avatar>
            <AvatarImage src={review.profiles.avatarUrl ?? ""} />
            <AvatarFallback>N</AvatarFallback>
          </Avatar>
        </div>

        {/* Rest of Review */}
        <div className="mt-1">
          {/* Name */}
          <h1 className=" text-sm">{review.profiles.fullName}</h1>

          <div className="mb-1">
            {/* Rating and Tags */}
            <div className="flex items-end">
              <Rating
                readonly
                initialValue={review.starCount ?? 0}
                size={20}
                SVGstyle={{ display: "inline-block" }}
                allowFraction
                className=""
                fillColor="oklch(0.56 0.14 35)"
              />
              <p className="text-muted-foreground text-xs">
                ({review.starCount})
              </p>
            </div>

            {/* Date */}
            <p className="text-muted text-xs">
              Reviewed in {viewDate(createdAtDate, ", ").date}
            </p>

            {/* Verified */}
            <p className="text-primary text-xs font-semibold">
              Verified Purchase
            </p>
          </div>

          {/* Review */}
          <p className="text-sm">{review.text}</p>

          <p className="text-muted text-xs">
            {review.likes ?? 0} people found this helpful
          </p>

          <div className="flex items-center space-x-2">
            <Button
              variant="link"
              className="border-primary p-1 rounded-md"
            >
              Helpful
            </Button>

            {/* Separator */}
            <div className="bg-border h-5 w-px" />

            <Button variant={"link"} className="text-heading">
              report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
