import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BlogCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <Skeleton height={192} width="100%" className="dark:bg-gray-700" />
      <div className="p-5">
        <div className="flex flex-wrap gap-3 mb-3">
          <Skeleton width={80} height={16} className="dark:bg-gray-700" />
          <Skeleton width={80} height={16} className="dark:bg-gray-700" />
          <Skeleton width={80} height={16} className="dark:bg-gray-700" />
        </div>
        <Skeleton count={2} height={24} className="mb-2 dark:bg-gray-700" />
        <Skeleton count={3} height={16} className="mb-4 dark:bg-gray-700" />
        <Skeleton width={100} height={20} className="dark:bg-gray-700" />
      </div>
    </div>
  );
};

export default BlogCardSkeleton;
