import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function TutorSkeleton({ count = 6 }) {
  return (
    <SkeletonTheme baseColor="#f1f5f9" highlightColor="#e2e8f0">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm p-0 flex flex-col"
          >
            {/* PHOTO SKELETON */}
            <div className="h-48 w-full">
              <Skeleton height="100%" borderRadius={0} />
            </div>

            {/* CONTENT SKELETON */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                {/* NAME & RATING */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Skeleton width={140} height={22} />
                  <Skeleton width={50} height={20} borderRadius={8} />
                </div>

                {/* SUBJECT */}
                <Skeleton width={100} height={16} className="mb-4" />

                {/* DETAILS */}
                <div className="space-y-3 my-4">
                  <div className="flex items-center gap-3">
                    <Skeleton circle width={20} height={20} />
                    <Skeleton width={130} height={16} />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton circle width={20} height={20} />
                    <Skeleton width={100} height={16} />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton circle width={20} height={20} />
                    <Skeleton width={150} height={16} />
                  </div>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="mt-5">
                <Skeleton height={46} borderRadius={12} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}
