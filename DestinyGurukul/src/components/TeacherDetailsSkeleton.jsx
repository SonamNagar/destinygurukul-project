import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function TeacherDetailsSkeleton() {
  return (
    <SkeletonTheme baseColor="#f1f5f9" highlightColor="#e2e8f0">
      <div className="min-h-screen bg-background py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* TOP PROFILE CARD */}
          <div className="bg-card border-border border rounded-3xl p-8 border border-border shadow-sm mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Profile Avatar */}
              <Skeleton circle width={140} height={140} />

              {/* Tutor Info */}
              <div className="flex-1 space-y-3 text-center md:text-left w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <Skeleton width={220} height={32} />
                    <Skeleton width={130} height={20} className="mt-2" />
                  </div>
                  <Skeleton width={120} height={36} borderRadius={20} />
                </div>

                <div className="flex flex-wrap gap-4 pt-2 justify-center md:justify-start">
                  <Skeleton width={110} height={24} borderRadius={8} />
                  <Skeleton width={130} height={24} borderRadius={8} />
                  <Skeleton width={100} height={24} borderRadius={8} />
                </div>
              </div>
            </div>
          </div>

          {/* GRID DETAILS & BOOKING CARD */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT DETAILS */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card border-border border rounded-3xl p-8 border border-border shadow-sm space-y-4">
                <Skeleton width={160} height={24} />
                <Skeleton count={4} height={16} />
              </div>

              <div className="bg-card border-border border rounded-3xl p-8 border border-border shadow-sm space-y-4">
                <Skeleton width={180} height={24} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Skeleton height={70} borderRadius={16} />
                  <Skeleton height={70} borderRadius={16} />
                  <Skeleton height={70} borderRadius={16} />
                  <Skeleton height={70} borderRadius={16} />
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div>
              <div className="bg-card border-border border rounded-3xl p-8 border border-border shadow-sm space-y-5">
                <Skeleton width={140} height={24} />
                <Skeleton height={50} borderRadius={12} />
                <Skeleton height={46} borderRadius={12} />
                <Skeleton height={46} borderRadius={12} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}
